# Tutorial para principiantes: Proyecto de Portfolio Frontend

Este archivo describe paso a paso lo que se ha hecho en el proyecto, cómo funciona, qué tecnologías se usaron y cómo mejorar la aplicación. Está pensado para alguien con poco o ningún conocimiento previo en desarrollo frontend.

## 1. ¿Qué es este proyecto?

Este proyecto es un portafolio personal construido con Next.js y React. Está diseñado para mostrar el perfil profesional de Pablo José Sarmiento Moreno y tiene una sección de chat donde un asistente de IA responde preguntas sobre su experiencia.

El sitio incluye:
- Página principal con información personal, experiencia y capacidades.
- Un chat interactivo que pregunta a una API de OpenRouter.
- Estilos globales para lograr una presentación moderna y responsiva.

## 2. Tecnologías implementadas

El proyecto usa las siguientes tecnologías:

- **Next.js 16**: framework React para páginas y rutas con renderizado del lado del servidor.
- **React 19**: biblioteca para construir interfaces de usuario.
- **TypeScript 5**: añade tipos y ayuda a detectar errores antes de ejecutar el código.
- **CSS global**: estilos en `app/globals.css` con variables y diseño responsivo.
- **API Route de Next.js**: `app/api/chat/route.ts` actúa como servidor que envía peticiones a OpenRouter.
- **OpenRouter**: servicio de IA usado para generar respuestas de chat.
- **Variables de entorno**: `.env` con `OPENROUTER_API_KEY` para mantener la clave en privado.

## 3. Estructura principal del proyecto

El proyecto tiene esta estructura básica:

- `package.json` - configuración de dependencias y comandos.
- `next.config.mjs` - configuración de Next.js (si existe, usualmente predeterminada).
- `.env` - variables de entorno privadas.
- `app/layout.tsx` - estructura raíz HTML y metadatos.
- `app/page.tsx` - contenido principal de la página del portfolio.
- `app/components/career-chat.tsx` - componente de chat interactivo con IA.
- `app/api/chat/route.ts` - ruta de servidor que contacta a OpenRouter.
- `app/globals.css` - estilos globales y layout.
- `public/assets/` - imágenes y recursos estáticos.
- `public/docs/` - archivos descargables como el CV.

## 4. Cómo ejecutar el proyecto localmente

### 4.1 Instalar dependencias

En la carpeta raíz del proyecto, ejecuta:

```bash
npm install
```

### 4.2 Crear el archivo de entorno

Crea un archivo llamado `.env` con esta línea:

```env
OPENROUTER_API_KEY=tu_api_key_de_openrouter
```

> Importante: nunca subas este archivo a un repositorio público.

### 4.3 Iniciar el servidor de desarrollo

```bash
npm run dev
```

Luego abre en el navegador:

```
http://localhost:3000
```

### 4.4 Construir para producción

```bash
npm run build
npm run start
```

## 5. Revisión detallada de código

A continuación se analiza cada archivo importantemente, con ejemplos y explicaciones sencillas.

### 5.1 `package.json`

Este archivo define los paquetes que usa el proyecto y los comandos disponibles.

- `dependencies`: bibliotecas necesarias para ejecutar la app.
- `devDependencies`: herramientas de desarrollo como TypeScript.
- `scripts`: comandos para el desarrollador.

Ejemplo clave:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

Esto significa:
- `npm run dev` inicia el modo de desarrollo.
- `npm run build` genera la versión lista para producción.
- `npm run start` sirve la versión compilada.

### 5.2 `app/layout.tsx`

Este archivo define la estructura HTML global que comparte toda la aplicación.

```tsx
export const metadata: Metadata = {
  title: "Pablo José Sarmiento Moreno | Cybersecurity & Agentic Engineering",
  description: "Portfolio profesional..."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

Explicación para novatos:
- `metadata` ayuda a definir el título y descripción que ve Google y los navegadores.
- `RootLayout` envuelve todas las páginas con un `<html>` y `<body>`.
- `children` es donde se inserta el contenido de cada página.

### 5.3 `app/page.tsx`

Este archivo crea la página principal del portafolio.

Puntos clave:
- Usa arrays para organizar información: `capabilities`, `experience`, `education`, `focusAreas`.
- Importa `CareerChat` para mostrar el chat.
- El contenido está dividido en secciones como hero, about, foco y trayectoria.

Ejemplo de uso de datos:

```tsx
const focusAreas = [
  {
    title: "Security Operations",
    text: "Monitoreo de amenazas..."
  },
  ...
];

{focusAreas.map((area) => (
  <article className="focusItem" key={area.title}>
    <h3>{area.title}</h3>
    <p>{area.text}</p>
  </article>
))}
```

¿Qué hace esto?
- `focusAreas.map(...)` recorre cada elemento del array.
- Crea un componente `<article>` para cada área.
- `key={area.title}` ayuda a React a identificar cada elemento.

También muestra cómo se crea navegación interna con enlaces a secciones:

```tsx
<a href="#trayectoria">Trayectoria</a>
```

### 5.4 `app/components/career-chat.tsx`

Este componente es el corazón del chat interactivo. Tiene un `"use client"` porque usa estado en el navegador.

Funciones clave:
- `useState` mantiene el texto del usuario y los mensajes.
- `useRef` permite enfocar el campo de entrada después de enviar una pregunta.
- `useMemo` calcula si se puede enviar el formulario.
- `submitQuestion` envía la pregunta a la ruta `/api/chat`.

Fragmento importante:

```tsx
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    role: "assistant",
    content: "Soy el gemelo digital profesional de Pablo..."
  }
]);

async function submitQuestion(question: string) {
  const trimmed = question.trim();
  const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
  setMessages(nextMessages);
  setInput("");
  setIsLoading(true);

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: nextMessages.slice(-8) })
  });

  const data = await response.json();
  setMessages((current) => [...current, { role: "assistant", content: data.message }]);
}
```

¿Qué ocurre?
- El usuario escribe una pregunta.
- Se agrega un mensaje de usuario al historial.
- Se llama a `/api/chat` con los últimos 8 mensajes.
- Se muestra la respuesta del asistente.

### 5.5 `app/api/chat/route.ts`

Esta ruta se ejecuta en el servidor y enlaza el chat con la API de OpenRouter.

Pasos importantes:
1. `process.env.OPENROUTER_API_KEY` lee la clave privada.
2. Valida que la solicitud tenga mensajes.
3. Construye un prompt de sistema con información profesional de Pablo.
4. Llama a `https://openrouter.ai/api/v1/chat/completions`.
5. Devuelve el texto generado.

Ejemplo de parte de la ruta:

```ts
const systemPrompt = `
Eres "Pablo AI", el gemelo digital profesional de Pablo José Sarmiento Moreno.
...`;

const careerContext = `
Pablo José Sarmiento Moreno es un profesional de TI ubicado en Machala, Ecuador.
...`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY no está configurada en el servidor." }, { status: 500 });
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
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
  ...
}
```

¿Por qué es importante?
- La API route protege la clave secreta en el servidor.
- El cliente no llama directamente a OpenRouter.
- Se fuerza el uso del contexto para que el asistente responda solo sobre Pablo.

### 5.6 `app/globals.css`

Este archivo define los estilos globales de la página.

Características principales:
- Variables CSS (`:root`) para colores, sombras y tamaños.
- Estilos base para `body`, `a`, `img`, `main`.
- Diseño de la sección hero y componentes.
- Estilos de la tarjeta de perfil y el chat.
- Media queries para dispositivos más pequeños.

Ejemplo de variables:

```css
:root {
  --bg: oklch(1 0 0);
  --ink: oklch(0.16 0.018 250);
  --primary: oklch(0.4 0.11 250);
  --radius: 8px;
  --max: 1180px;
}
```

Ejemplo de diseño responsivo:

```css
@media (max-width: 900px) {
  .heroGrid,
  .about,
  .split,
  .credentials,
  .learning,
  .chatSection,
  .closing {
    grid-template-columns: 1fr;
  }
}
```

Esto hace que la página cambie de varias columnas a una sola columna en pantallas estrechas.

## 6. Conceptos clave para un novato

### 6.1 ¿Qué es un componente?

Un componente es un bloque de código que representa una parte de la interfaz.
- `app/page.tsx` es un componente de página.
- `CareerChat` es un componente que maneja el chat.

### 6.2 ¿Qué es JSX?

JSX es una mezcla de HTML dentro de JavaScript.

```tsx
<h1>Seguridad operativa con IA y criterio empresarial.</h1>
```

Se ve como HTML, pero es código JavaScript que React entiende.

### 6.3 ¿Qué es `useState`?

`useState` guarda información que cambia en el componente.

```tsx
const [input, setInput] = useState("");
```

`input` contiene el texto actual.
`setInput` actualiza ese texto.

### 6.4 ¿Qué es `fetch`?

`fetch` permite al navegador pedir datos al servidor.

```ts
const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ messages: nextMessages.slice(-8) })
});
```

Aquí el navegador envía la pregunta al servidor y recibe una respuesta.

### 6.5 ¿Qué es una ruta API?

Es un archivo en `app/api/` que se ejecuta en el servidor.
En este proyecto, `app/api/chat/route.ts` procesa las preguntas y devuelve una respuesta de IA.

## 7. Ejemplos de partes importantes del código

### 7.1 Mostrar lista de experiencia

```tsx
{experience.map((item) => (
  <article className="timelineItem" key={`${item.company}-${item.period}`}>
    <time>{item.period}</time>
    <div>
      <h3>{item.role}</h3>
      <p className="company">{item.company} · {item.place}</p>
      <p>{item.detail}</p>
    </div>
  </article>
))}
```

Esto convierte cada elemento del array `experience` en un bloque visual.

### 7.2 Validación en el servidor

```ts
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
```

Esta función evita que datos inválidos rompan el chat.

### 7.3 Estilo del botón principal

```css
.button.primary {
  color: white;
  background: var(--primary);
  box-shadow: 0 18px 42px oklch(0.35 0.11 250 / 0.28);
}
```

Esto define un botón con fondo de color primario y sombra.

## 8. Cinco sugerencias para mejorar el proyecto

1. **Separar estilos en módulos CSS o usar CSS-in-JS**
   - El archivo `globals.css` crece mucho. Puedes usar CSS Modules (`.module.css`) o una librería como Tailwind o styled-components para mantener estilos por componente.

2. **Agregar una sección de proyectos o portafolio real**
   - Ahora el sitio muestra experiencia y capacidades. Sería muy valioso añadir proyectos concretos con enlaces, capturas y resultados.

3. **Mejorar la accesibilidad**
   - Añade `aria-labels` más descriptivos, control de foco en el chat y contraste de colores para personas con visión reducida.

4. **Manejar mejor los errores y estados de carga**
   - En el chat, muestra mensajes claros cuando hay error de red o cuando la API retorna problemas. También podrías deshabilitar el input durante la carga.

5. **Hacer el contenido dinámico desde un JSON o CMS**
   - En lugar de tener todo el texto fijo en `app/page.tsx`, puedes cargar los datos de experiencia, educación y habilidades desde un archivo JSON o un CMS ligero. Esto facilita actualizar el contenido sin tocar el código.

## 9. Consejos finales

- Mantén tu clave `OPENROUTER_API_KEY` fuera de Git. Añade `.env` a `.gitignore`.
- Usa `npm run dev` para ver cambios en tiempo real.
- Si quieres aprender más, revisa la documentación oficial de Next.js y React.
- Practica modificando el texto y los estilos para entender cómo cambia la página.

---

Este tutorial describe en detalle qué archivos existen, cómo trabajan juntos y cómo mejorar el proyecto. Si quieres, puedo crear también una versión en inglés o un tutorial paso a paso con capturas de pantalla y ejemplos prácticos adicionales.