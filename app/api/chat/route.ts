import { NextRequest, NextResponse } from "next/server";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "openai/gpt-oss-120b";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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

  const messages = rawMessages.filter(isValidMessage).slice(-8);

  if (!messages.some((message) => message.role === "user")) {
    return NextResponse.json({ error: "Escribe una pregunta para Pablo AI." }, { status: 400 });
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
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
        temperature: 0.45
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        typeof data?.error?.message === "string"
          ? data.error.message
          : "OpenRouter no pudo procesar la respuesta.";

      return NextResponse.json({ error: message }, { status: response.status });
    }

    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "OpenRouter respondió sin contenido." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: content.trim() });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con OpenRouter." },
      { status: 502 }
    );
  }
}
