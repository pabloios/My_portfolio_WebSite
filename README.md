# Pablo Jose Sarmiento Moreno Portfolio

Professional portfolio built with Next.js for cybersecurity, SOC analyst, automation, and agentic engineering opportunities.

## Local Development

Create a `.env` file with:

```bash
OPENROUTER_API_KEY=your_openrouter_key
```

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Content Sources

The site content is based on `Profile.pdf` and `Pablo_Sarmiento_CV_ES.pdf`.

## AI Career Chat

The digital-twin chat uses OpenRouter with the `openai/gpt-oss-120b` model through the server-side `/api/chat` route.
