/**
 * Genera el avatar de Pablo a partir de su foto real usando un modelo de
 * imagen vía OpenRouter (image-in → image-out), en 5 direcciones de mirada
 * para que el componente web pueda "seguir" al cursor con los ojos.
 *
 * Uso: node --env-file=.env scripts/generate-avatar.mjs
 * Resultado: public/assets/pablo-avatar-{center,left,right,up,down}.png
 * (usa pablo-avatar.png previo como referencia de consistencia si existe)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const MODEL = process.env.AVATAR_MODEL ?? "google/gemini-2.5-flash-image";
const PHOTO = "public/assets/pablo-profile.jpg";
const REFERENCE = "public/assets/pablo-avatar.png";
const OUTPUT_DIR = "public/assets";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error("Falta OPENROUTER_API_KEY (ejecuta con --env-file=.env).");
  process.exit(1);
}

const photoBase64 = readFileSync(PHOTO).toString("base64");
const hasReference = existsSync(REFERENCE);
const referenceBase64 = hasReference ? readFileSync(REFERENCE).toString("base64") : null;

const stylePrompt = `Genera un avatar profesional estilo ilustración vectorial moderna (flat design con sombreado suave) de la persona de la foto, manteniendo un parecido claro y reconocible: misma estructura facial, peinado corto oscuro, bigote fino, tono de piel y expresión amable.

Requisitos estrictos:
- Retrato de hombros hacia arriba, centrado, mirando al frente.
- Fondo: gradiente oscuro azul-noche (#202a38 a #0e1119) con un halo cian sutil arriba.
- Paleta: cabello #423d40, piel #88675e, camisa azul grisáceo #798bab.
- Iluminación suave desde arriba a la izquierda, sin texto ni marcos.
- Cuadrado 1:1, estilo limpio tipo avatar de producto Apple, sin bordes.`;

const looks = [
  {
    name: "center",
    extra: "La persona mira directamente a la cámara: ojos centrados, cabeza recta."
  },
  {
    name: "left",
    extra: "La persona mira hacia su derecha (la izquierda del espectador): pupilas y algo del rostro girados hacia ese lado, hombros quietos."
  },
  {
    name: "right",
    extra: "La persona mira hacia su izquierda (la derecha del espectador): pupilas y algo del rostro girados hacia ese lado, hombros quietos."
  },
  {
    name: "up",
    extra: "La persona mira ligeramente hacia arriba: pupilas arriba y barbilla apenas levantada, hombros quietos."
  },
  {
    name: "down",
    extra: "La persona mira ligeramente hacia abajo: pupilas abajo y barbilla apenas bajada, hombros quietos."
  }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

for (const look of looks) {
  const output = `${OUTPUT_DIR}/pablo-avatar-${look.name}.png`;

  if (existsSync(output)) {
    console.log(`${look.name}: ya existe, se omite.`);
    continue;
  }

  const content = [
    { type: "text", text: `${stylePrompt}\n\n${look.extra}` },
    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${photoBase64}` } }
  ];

  if (hasReference) {
    content.push({
      type: "text",
      text: `La segunda imagen es una versión previa aprobada de este avatar. Mantén exactamente el mismo estilo, paleta, encuadre, fondo y características para que la serie sea consistente; cambia únicamente la dirección de la mirada según lo indicado.`
    });
    content.push({
      type: "image_url",
      image_url: { url: `data:image/png;base64,${referenceBase64}` }
    });
  }

  process.stdout.write(`Generando ${look.name}... `);

  let data = null;
  let response = null;
  let saved = false;

  // Hasta 3 intentos: los 402 de presupuesto en vuelo se resuelven esperando.
  for (let attempt = 1; attempt <= 3 && !saved; attempt += 1) {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Pablo Sarmiento Portfolio"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
        max_tokens: 2048
      })
    });

    data = await response.json();

    if (!response.ok) {
      console.error(`\n  intento ${attempt} (${response.status}):`, JSON.stringify(data?.error ?? data).slice(0, 200));

      if (response.status === 402) {
        await sleep(25_000);
        process.stdout.write(`  reintentando... `);
        continue;
      }

      break;
    }

    const choice = data?.choices?.[0]?.message;
    const images = choice?.images ?? [];
    const first = images[0]?.image_url?.url ?? images[0]?.url;

    if (first) {
      const base64 = first.replace(/^data:image\/\w+;base64,/, "");
      writeFileSync(output, Buffer.from(base64, "base64"));
      console.log(`✓ ${Math.round(base64.length * 0.75 / 1024)} KB`);
      saved = true;
    } else {
      console.error("\n  sin imagen en la respuesta:", String(choice?.content ?? "").slice(0, 200));
      break;
    }
  }

  if (!saved) {
    console.error(`  ✗ ${look.name} quedó pendiente; vuelve a ejecutar el script.`);
  }

  await sleep(12_000);
}

console.log("\nSerie completa en public/assets/pablo-avatar-{center,left,right,up,down}.png");
