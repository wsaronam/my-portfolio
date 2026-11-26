# Portfolio

[![CI](https://github.com/wsaronam/my-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/wsaronam/my-portfolio/actions/workflows/ci.yml)

My software engineering and cybersecurity portfolio, with a blog for write-ups that I publish from
my own admin panel.

**Live site:** https://my-portfolio-five-henna-52.vercel.app

A full-stack TypeScript monorepo: a React frontend, a Fastify REST API and PostgreSQL. It's built
the way I'd build a production service: tested, linted, scanned in CI, and secure by default.

## Highlights

- **Blog with a private admin area:** log in, write posts in Markdown with a live preview, save
  drafts, publish now or schedule for later.
- **Security-first design:** Argon2id password hashing, hashed server-side sessions in
  `__Host-` HttpOnly/Secure/SameSite=Strict cookies, CSRF origin checks, login rate limiting,
  strict Content Security Policy (A+ on securityheaders.com), verified TLS to the database, and
  safe Markdown rendering. Details in [SECURITY.md](./SECURITY.md).
- **One source of truth for data shapes:** zod schemas in a shared package validate requests on
  the API and API responses in the browser.
- **Tested:** unit tests for both apps, plus API integration tests against a real PostgreSQL
  database (a separate, guarded test database).
- **CI/CD:** every push runs lint, type-checks, builds, all tests, a dependency audit and a secret
  scan. The API deploys only after CI passes; database migrations run automatically on deploy.

## Architecture

```
browser ──► Vercel (React app on a CDN, security headers, CSP)
               │  /api/* is forwarded, so the site and API share one origin (no CORS needed)
               ▼
            Render (Fastify API) ──TLS, certificate verified──► Neon (PostgreSQL)
```

| Part | Technology |
|---|---|
| Frontend (`apps/web`) | React 19, TypeScript, Vite, React Router (loaders/actions), CSS Modules, zod |
| API (`apps/api`) | Node.js, Fastify 5, TypeScript, Drizzle ORM, zod, pino, @fastify/helmet |
| Shared (`packages/shared`) | zod schemas and types used by both apps |
| Database | PostgreSQL 18 (Docker locally, Neon in production) |
| Tooling | npm workspaces, Vitest, ESLint (type-aware), GitHub Actions, Dependabot, gitleaks |

## Running it locally

Requirements: **Node.js 24** (see `.nvmrc`) and **Docker** (for PostgreSQL).

```bash
npm install                     # also builds packages/shared

# Environment files (copy the examples, then fill in your own values)
cp .env.example .env                        # Postgres user/password/db for Docker
cp apps/api/.env.example apps/api/.env      # API settings, DATABASE_URL, TEST_DATABASE_URL
cp apps/web/.env.example apps/web/.env.local  # only needed if the API isn't on port 3000

npm run db:up                   # start PostgreSQL in Docker
npm run db:migrate              # create the tables
npm run db:seed                 # optional: example blog posts (refuses to run in production)
npm run admin:create -- you@example.com   # prints a one-time admin password

npm run dev:api                 # API on http://127.0.0.1:3000
npm run dev:web                 # site on http://localhost:5173 (admin at /admin/login)
```

On Windows PowerShell, use `Copy-Item` instead of `cp`.

## Scripts (run from the repo root)

| Command | What it does |
|---|---|
| `npm run dev:web` / `dev:api` | Start the frontend / API with hot reload |
| `npm run dev:shared` | Rebuild the shared package on every change |
| `npm run db:up` / `db:down` | Start / stop the local PostgreSQL container |
| `npm run db:generate` | Create a migration from schema changes |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Insert example posts (development only) |
| `npm run db:check` | Diagnose the database connection |
| `npm run admin:create -- <email>` | Create an admin, or reset their password |
| `npm test` | Unit tests for all packages (no database needed) |
| `npm run test:int` | API integration tests (needs `db:up`) |
| `npm run lint` / `lint:fix` | ESLint across the whole repo |

## Project structure

```
apps/
  web/                React app
    src/features/     one folder per feature (blog, projects, admin, auth)
    vercel.json       production routing and security headers
  api/                Fastify API
    src/features/     posts (public), auth, admin-posts
    src/http/         origin check, error handler, client IP
    drizzle/          SQL migrations
    test/             integration tests
packages/
  shared/             zod schemas shared by both apps
render.yaml           API hosting configuration (Render Blueprint)
eslint.config.mjs     one lint config for the whole repo
```

Code is grouped **by feature**, so everything about one feature lives in one folder.

## Deployment

- **API:** Render, from `render.yaml`. It deploys after CI passes, runs migrations, then starts
  the server; Render only switches traffic once `/health` responds.
- **Frontend:** Vercel, with Root Directory `apps/web`. `vercel.json` forwards `/api/*` to the API
  and sets the CSP and other security headers.
- **Secrets** (database URL, site origin) are set in the hosting dashboards, never in the repo.

## Security

See [SECURITY.md](./SECURITY.md) for the security design and how to report a vulnerability.
