import { NextRequest, NextResponse } from "next/server";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "openai/gpt-oss-120b";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_MESSAGES_PER_CONVERSATION = 8;

const careerContext = `
Pablo José Sarmiento Moreno es un profesional de TI ubicado en Machala, Ecuador.
Roles objetivo: Cybersecurity Analyst Junior, SOC Analyst Junior, Agentic Engineer Junior y Programador Junior.
Contacto público: pablo521@hotmail.com. GitHub: https://github.com/pabloios. LinkedIn: https://linkedin.com/in/pablo-jos%C3%A9-sarmiento-moreno-7041b0119.

Resumen profesional:
Profesional de Tecnologías de la Información especializado en ciberseguridad y operaciones de seguridad (SOC). Experiencia en monitoreo de amenazas, SIEM, análisis de logs, respuesta inicial a incidentes, automatización de procesos mediante scripting, identificación de indicadores de compromiso (IOC), análisis de datos y optimización de procesos. Cuenta con base operativa en logística, inventario, coordinación y sistemas digitales empresariales.

Experiencia:
- Alfanet S.A., Desarrollo de Automatizaciones, Santo Domingo, Ecuador, 2026 - Actual. Automatización de procesos en CRM, validaciones de datos de entrada e investigación para implementar herramientas de QA en Jira.
- Empresa de Importación y Distribución, Operations Manager, Melbourne, 2023 - 2025. Gestión de operaciones, supervisión de sistemas digitales, análisis de datos operativos, logística internacional y optimización de procesos.
- UTest, Software Tester, remoto, 2019 - 2021. Diseño y ejecución de casos de prueba funcionales, documentación de incidencias, colaboración con desarrolladores y monitoreo de ambientes de prueba.
- Repcontver S.A., Asistente de Operaciones en Logística Internacional, Guayaquil, 2016 - 2018. Coordinación de envíos, control de inventarios en tránsito, comunicación con proveedores y transportistas, documentación aduanera y mejora de tiempos de entrega.
- Experiencia adicional en farmacia familiar y almacén: atención al cliente, inventario, POS, embalaje, envíos y coordinación logística.

Habilidades:
Respuesta ante incidentes, gestión de información y eventos de seguridad, SIEM, SQL, análisis de logs, correlación de eventos, identificación de anomalías, networking TCP/IP DNS HTTP, threat detection, Windows, Linux, macOS, Python básico, Bash básico, cloud security, agentic engineering, vibe coding, QA funcional, documentación y automatización de procesos CRM.

Formación y certificaciones:
Ingeniería Informática / Tecnologías de la Información, Universidad Internacional de La Rioja. Advanced Diploma in Cybersecurity, Laneway Education. Google Cybersecurity Professional Certificate. Foundations of Cybersecurity. Play It Safe: Manage Security Risks. Sound the Alarm: Detection and Response. Ingeniería en Telemática, ESPOL. Desarrollo iOS y SwiftUI.

Idiomas:
Español nativo, inglés C1 avanzado, alemán B1 intermedio.
`;

const systemPrompt = `
Eres "Pablo AI", el gemelo digital profesional de Pablo José Sarmiento Moreno.
Responde en español claro, profesional y directo, como si ayudaras a un reclutador o líder técnico a entender la carrera de Pablo.
Usa solo el contexto profesional proporcionado. Puedes sintetizar, conectar experiencias y explicar encaje para roles, pero no inventes empleadores, fechas, certificaciones, logros cuantificados o datos personales que no estén en el contexto.
Si preguntan algo fuera de la carrera, habilidades, experiencia, educación, proyectos, GitHub, CV o disponibilidad profesional de Pablo, responde brevemente que solo puedes ayudar con información profesional de Pablo.
No afirmes ser Pablo real; eres su gemelo digital profesional.
Mantén respuestas de 2 a 5 párrafos cortos, o bullets si la pregunta pide comparación o resumen.
`;

// ---------------------------------------------------------------------------
// Rate limiting en memoria (por instancia). Suficiente para un portfolio:
// 8 preguntas por minuto y por IP protege el crédito de OpenRouter.
// ---------------------------------------------------------------------------
type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Limpieza perezosa cuando el mapa crece demasiado.
  if (rateBuckets.size > 500) {
    for (const [key, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) {
        rateBuckets.delete(key);
      }
    }
  }

  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000)
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function isValidMessage(message: unknown): message is IncomingMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Partial<IncomingMessage>;

  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= 1200
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY no está configurada en el servidor." },
      { status: 500 }
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Demasiadas preguntas seguidas. Inténtalo de nuevo en ${limit.retryAfterSeconds} segundos.`
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) }
      }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const rawMessages = (payload as { messages?: unknown }).messages;

  if (!Array.isArray(rawMessages)) {
    return NextResponse.json({ error: "La conversación es requerida." }, { status: 400 });
  }

  const messages = rawMessages.filter(isValidMessage).slice(-MAX_MESSAGES_PER_CONVERSATION);

  if (!messages.some((message) => message.role === "user")) {
    return NextResponse.json({ error: "Escribe una pregunta para Pablo AI." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const siteOrigin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      request.headers.get("origin") ??
      "http://localhost:3000";

    const upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteOrigin,
        "X-Title": "Pablo Sarmiento Portfolio"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "system", content: careerContext },
          ...messages
        ],
        max_completion_tokens: 520,
        temperature: 0.45,
        stream: true
      }),
      signal: controller.signal
    });

    if (!upstream.ok || !upstream.body) {
      const data = (await upstream.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;

      const message =
        typeof data?.error?.message === "string"
          ? data.error.message
          : "OpenRouter no pudo procesar la respuesta.";

      clearTimeout(timeout);
      return NextResponse.json({ error: message }, { status: upstream.ok ? 502 : upstream.status });
    }

    // Traduce el SSE de OpenRouter a un stream de texto plano.
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const upstreamBody = upstream.body;
    let buffer = "";

    const textStream = new ReadableStream<Uint8Array>({
      async start(streamController) {
        const reader = upstreamBody.getReader();

        try {
          for (;;) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();

              if (!trimmed.startsWith("data:")) {
                continue;
              }

              const data = trimmed.slice(5).trim();

              if (!data || data === "[DONE]") {
                continue;
              }

              try {
                const parsed = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const delta = parsed.choices?.[0]?.delta?.content;

                if (typeof delta === "string" && delta) {
                  streamController.enqueue(encoder.encode(delta));
                }
              } catch {
                // Fragmento incompleto o inválido: se ignora.
              }
            }
          }
        } finally {
          clearTimeout(timeout);
          reader.releaseLock();
          streamController.close();
        }
      },
      cancel() {
        clearTimeout(timeout);
        void upstreamBody.cancel().catch(() => undefined);
      }
    });

    return new Response(textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (caughtError) {
    clearTimeout(timeout);

    const aborted = caughtError instanceof Error && caughtError.name === "AbortError";

    return NextResponse.json(
      {
        error: aborted
          ? "La respuesta tardó demasiado. Inténtalo de nuevo."
          : "No se pudo conectar con OpenRouter."
      },
      { status: aborted ? 504 : 502 }
    );
  }
}
