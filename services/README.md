# Portfolio Services

A standalone TypeScript API service for long-running or separated backend tasks that are better handled outside the Next.js server-action lifecycle.

## Current Capabilities

- **Resume PDF generation** — renders the ATS-friendly resume React component, prints it to PDF with Puppeteer + Chromium, and uploads it to the public Supabase `resume` storage bucket.

## Tech Stack

- [Hono](https://hono.dev/) — lightweight, TypeScript-first web framework
- [Supabase](https://supabase.com/) — database + storage client
- [React](https://react.dev/) + `react-dom/static` — server-side component rendering
- [Puppeteer Core](https://pptr.dev/) + [@sparticuz/chromium](https://github.com/Sparticuz/chromium) — PDF generation
- Docker + Docker Compose — deployment

## Getting Started

```bash
cd services
cp .env.example .env
# Fill in the environment variables
npm install
npm run dev
```

The service will start on `http://localhost:3001` by default.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | HTTP server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `SUPABASE_URL` | Yes | — | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Supabase service role key |
| `API_KEY` | Yes | — | Secret key used by the Next.js app in the `x-api-key` header |
| `RESUME_BUCKET_NAME` | No | `resume` | Supabase storage bucket for the resume PDF |
| `RESUME_OBJECT_PATH` | No | `khaldoun-alhalabi-resume.pdf` | Storage object path |
| `CHROME_EXECUTABLE_PATH` | No | — | Local Chrome path for development |

## API Endpoints

- `GET /health` — public health check
- `POST /api/v1/resume/generate` — generate/regenerate the resume PDF (requires `x-api-key` header)

Example:

```bash
curl -X POST http://localhost:3001/api/v1/resume/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"force": true}'
```

## Docker

Build and run locally:

```bash
cd services
docker compose up --build
```

## Project Structure

```
services/
├── src/
│   ├── index.ts              # server entry point
│   ├── app.ts                # Hono app setup
│   ├── config.ts             # environment validation
│   ├── routes/               # route definitions
│   ├── controllers/          # request handlers
│   ├── services/             # business logic
│   ├── middleware/           # auth, logging, errors
│   ├── generators/           # task-specific generators
│   └── types/                # shared types
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Future APIs

Add new routes under `src/routes/`, wire them in `src/routes/index.ts`, and implement controllers/services following the existing layered pattern.
