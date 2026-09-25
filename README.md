# Pablo Sarmiento — Portfolio

Portfolio personal construido con Next.js 16, React 19, Motion (framer-motion) y Three.js.
Incluye un gemelo IA ("Pablo AI") que responde preguntas sobre la trayectoria profesional usando OpenRouter.

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa OPENROUTER_API_KEY
npm run dev
```

Abre http://localhost:3000.

### Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `OPENROUTER_API_KEY` | Sí (solo para el chat) | Clave de https://openrouter.ai/keys |
| `NEXT_PUBLIC_SITE_URL` | Recomendada en producción | URL pública sin barra final, ej. `https://pablo-sarmiento.vercel.app`. Se usa en SEO, sitemap, robots, Open Graph y el `HTTP-Referer` hacia OpenRouter. |

## Despliegue en Vercel

1. **Importa el repo**: entra a [vercel.com/new](https://vercel.com/new), importa `pabloios/My_portfolio_WebSite` (framework detectado: Next.js, sin configuración extra).
2. **Configura las variables de entorno** en *Project Settings → Environment Variables*:
   - `OPENROUTER_API_KEY` → tu clave de OpenRouter.
   - `NEXT_PUBLIC_SITE_URL` → la URL que Vercel te asigne (ej. `https://my-portfolio-website-xxx.vercel.app`), o tu dominio propio.
3. **Despliega**. Cada push a `main` hará deploy automático.

> El chat requiere `OPENROUTER_API_KEY` configurada en Vercel; sin ella el resto del sitio funciona pero la sección "Pablo AI" devolverá error 500.

## Estructura relevante

```
app/
  api/chat/route.ts        # API del chat: rate limit, timeout, streaming
  components/
    motion-primitives.tsx  # FadeIn, Stagger, ScrollWords, MotionLink
    site-nav.tsx           # Nav fijo con vidrio esmerilado
    career-chat.tsx        # Chat con render progresivo (streaming)
    hero-orbit.tsx         # Canvas Three.js del hero
  layout.tsx               # Metadata + JSON-LD (Person)
  page.tsx                 # Contenido de las secciones
  opengraph-image.tsx      # Imagen para compartir (1200x630)
  sitemap.ts / robots.ts   # SEO técnico
```
