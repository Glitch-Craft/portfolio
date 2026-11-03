# Glitch Craft® Portfolio

Monorepo for the Glitch Craft agency site: a **Next.js** front end and a **NestJS** API, sharing
typed contracts, managed with **bun workspaces** and **Turborepo**.

The web app is a port of the original Figma Make (Vite + React) export. It keeps the same markup
and visual design, with the contact form now backed by a real API instead of a `mailto:` draft.

## Stack

| Area     | Choice                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------ |
| Web      | Next.js 16 (App Router, Server Actions), React 19, Tailwind CSS 4                                |
| API      | NestJS 12 (ESM), Drizzle ORM, PostgreSQL 18, Zod validation, OpenAPI docs with Scalar            |
| Shared   | `@glitch-craft/contracts`: Zod schemas and types used by both apps                               |
| Tooling  | bun 1.2 (package manager, workspaces, catalogs), Turborepo 2, TypeScript 6, ESLint 9, Prettier 3 |
| Testing  | Vitest 5, Testing Library, Supertest                                                             |
| Delivery | Docker (multi-stage, `turbo prune`), Docker Compose, GitHub Actions                              |

## Repository layout

```
.
├── apps/
│   ├── web/                    Next.js site (port 4710)
│   │   └── src/
│   │       ├── app/            routes, root layout, metadata, robots/sitemap, globals.css
│   │       ├── components/     layout (header, footer) and page sections
│   │       ├── features/contact/  intake form, Server Action, mailto fallback
│   │       ├── config/ content/   site config, navigation, capability copy
│   │       ├── lib/            fonts, env parsing, server-side API client
│   │       ├── styles/         design-system CSS partials (order-sensitive)
│   │       └── assets/fonts/   self-hosted WOFF2 fonts + OFL licenses
│   └── api/                    NestJS API (port 4711)
│       ├── src/
│       │   ├── config/         environment validation
│       │   ├── common/         Zod validation pipe, OpenAPI helpers
│       │   ├── database/       Drizzle schema, module, runtime migrator
│       │   ├── contact/        POST /api/v1/contact
│       │   └── health/         GET /api/health/{live,ready}
│       ├── drizzle/            generated SQL migrations (commit these)
│       └── test/               e2e specs
├── packages/
│   ├── contracts/              shared Zod schemas, types and API routes
│   ├── eslint-config/          shared flat configs: base, next, nest
│   └── typescript-config/      shared tsconfig presets
├── compose.yaml                Postgres, plus the full stack under the `app` profile
└── turbo.json                  task pipeline
```

## Prerequisites

- **Node.js 22.12 or newer.** `.nvmrc` pins 24 (current LTS); run `nvm use` if you use nvm.
- **bun 1.2.21 or newer** as the package manager ([bun.sh](https://bun.sh)). The version the
  project is tested with is pinned in `package.json#packageManager`. Bun only installs packages
  and runs scripts; the apps, builds and tests run on Node.js.
- **Docker** for the local Postgres database.

## Getting started

```bash
bun install

# Local environment files (the defaults match compose.yaml)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

bun run db:up        # start Postgres in Docker and wait until it is healthy
bun run db:migrate   # apply the SQL migrations
bun run dev          # web, API and contracts in watch mode
```

| URL                                    | What                                   |
| -------------------------------------- | -------------------------------------- |
| http://localhost:4710                  | Website                                |
| http://localhost:4711/api/docs         | API reference, Scalar (non-production) |
| http://localhost:4711/api/health/ready | Readiness check                        |

## Scripts

Run from the repository root. Turborepo runs each task in dependency order and caches the results.

| Command                     | Does                                                      |
| --------------------------- | --------------------------------------------------------- |
| `bun run dev`               | Start every app in watch mode                             |
| `bun run build`             | Production build of all packages                          |
| `bun run lint`              | ESLint across the workspace                               |
| `bun run typecheck`         | TypeScript checks across the workspace                    |
| `bun run test`              | Unit and component tests                                  |
| `bun run test:e2e`          | API end-to-end tests (no database needed)                 |
| `bun run format`            | Format with Prettier (`format:check` in CI)               |
| `bun run db:up` / `db:down` | Start / stop the Postgres container                       |
| `bun run db:generate`       | Create a migration from `apps/api/src/database/schema.ts` |
| `bun run db:migrate`        | Apply pending migrations                                  |
| `bun run db:studio`         | Open Drizzle Studio                                       |

Always use `bun run test`: plain `bun test` starts bun's built-in test runner instead of the
project's Vitest suites.

To target one package, filter it, for example `bun run --filter @glitch-craft/web dev` or
`bun run turbo run test --filter=@glitch-craft/api`.

## How the contact form works

```
Browser ──form post──▶ Next.js Server Action ──JSON──▶ NestJS API ──▶ PostgreSQL
                      (validate, honeypot)         (validate, rate limit,
                                                    store contact_submissions)
```

1. The form posts to a Server Action, so it also works without JavaScript.
2. The action validates the brief with `contactSubmissionSchema` from
   `@glitch-craft/contracts`, drops honeypot submissions, and calls the API from the server, so the
   API address is never exposed to the browser. It forwards the visitor's `X-Forwarded-For`.
3. The API validates the payload again with the same schema, limits each client to 5 briefs per
   10 minutes, and stores the brief.
4. If the API is unreachable or rate-limits the visitor, the form offers a pre-filled email draft,
   which was the original site's only behaviour.

## API

| Method | Path                | Description                                                                                   |
| ------ | ------------------- | --------------------------------------------------------------------------------------------- |
| POST   | `/api/v1/contact`   | Submit a brief. 201 with `{ id, receivedAt }`, 400 with field `issues`, 429 when rate-limited |
| GET    | `/api/health/live`  | Liveness: the process is up                                                                   |
| GET    | `/api/health/ready` | Readiness: the database answers (503 if not)                                                  |

Every route is rate-limited to 120 requests per minute per client by default.

Outside production, an interactive API reference built with [Scalar](https://scalar.com) is
served at `/api/docs`, and the raw OpenAPI spec at `/api/docs/openapi.json`. `@nestjs/swagger`
generates the spec from the controllers and the shared Zod schemas.

## Environment variables

**`apps/web`**

| Variable               | Default                 | Notes                                                                  |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:4710` | Canonical URL for metadata, robots.txt, sitemap. Inlined at build time |
| `API_URL`              | `http://localhost:4711` | API origin. Server-side only                                           |

**`apps/api`** (validated at startup by `src/config/env.ts`)

| Variable       | Default                            | Notes                                                        |
| -------------- | ---------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL` | none (required)                    | `postgres://` connection string                              |
| `PORT`         | `4711`                             |                                                              |
| `HOST`         | `0.0.0.0`                          |                                                              |
| `NODE_ENV`     | `development`                      | `production` switches to JSON logs and disables the API docs |
| `CORS_ORIGINS` | `http://localhost:4710`            | Comma-separated                                              |
| `TRUST_PROXY`  | `loopback, linklocal, uniquelocal` | Express `trust proxy`: true/false, a hop count, or subnets   |

Rate limiting relies on the client IP. In production, run the site behind a proxy or CDN that sets
`X-Forwarded-For`, and set `TRUST_PROXY` to match your network.

## Deploying the website to Vercel

The web app deploys on its own; the API is optional.

1. Import the GitHub repository in Vercel and set **Root Directory** to `apps/web`. Vercel detects
   Next.js, Turborepo and bun, and runs `turbo run build`, which builds `@glitch-craft/contracts`
   first. Leave the build and install commands at their defaults.
2. Environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL`: optional. Without it the site uses the project's production domain.
   - `API_URL`: leave unset until the API is deployed. Without it the contact form prepares an
     email draft, like the original design. Set it later and redeploy to switch the form to the API.
3. Add your domain under Project → Settings → Domains and create the DNS records Vercel shows at
   your registrar.

## Docker

Both apps have multi-stage Dockerfiles that use `turbo prune`, so each image only contains the
packages it needs. Build them from the repository root:

```bash
docker build -f apps/web/Dockerfile -t glitch-craft-web .
docker build -f apps/api/Dockerfile -t glitch-craft-api .
```

To run the whole stack (Postgres, migrations, API, web) in containers:

```bash
docker compose --profile app up --build
```

The API image applies migrations with `node dist/database/migrate.js`, so drizzle-kit is not
needed in production.

## Conventions

- **Dependency versions** shared by several packages live in `workspaces.catalog` in the root
  `package.json`. Reference them with `"catalog:"`.
- **Dependency install scripts are opt-in.** Bun runs install scripts only for packages on its
  built-in trusted list. `bun pm untrusted` lists the ones it blocked. Review a script before
  adding its package to `trustedDependencies` in the root `package.json`. Scarf telemetry
  (pulled in by @nestjs/swagger's bundled Swagger UI) is switched off with `scarfSettings`.
- **In-page links use `SectionLink`**, a plain anchor to `/#section`. It keeps native smooth
  scrolling, which `next/link` turns off during navigation. Use `next/link` for links between
  routes.
- **Contracts first.** Request and response shapes belong in `packages/contracts`, so the web app
  and the API cannot drift apart. The package is compiled; Turborepo builds it before its
  dependents.
- **The API is native ESM.** Relative imports need a `.js` extension (`./contact.service.js`).
- **CSS order matters.** `apps/web/src/app/globals.css` imports the partials in cascade order. Many
  rules tie on specificity, so keep shared primitives before section files and put each media
  query after the base rule it overrides.
- **Database changes:** edit `schema.ts`, run `bun run db:generate`, review and commit the SQL in
  `apps/api/drizzle/`, then run `bun run db:migrate`.
- **Git hooks:** Husky runs Prettier on staged files before each commit. Lint, type checks and
  tests run in CI (`.github/workflows/ci.yml`).

## Changes from the Figma Make export

- Ported from Vite to the Next.js App Router. Only the header menu and the contact form ship
  client-side JavaScript; every other component is a Server Component.
- Split the 673-line `App.tsx` into components, and moved copy into `config/` and `content/`.
- Split the stylesheet into ordered partials, keeping the same rules and values. Brand colours and
  font families now come from design tokens.
- Fonts are self-hosted with `next/font` and converted from TTF to WOFF2. DM Sans 600 and 700 were
  dropped because the design never renders them. Font payload: 816 KB down to 272 KB.
- A pixel comparison against the original build at 390, 900, 1280 and 1600 px gave identical page
  heights and differences only in the changed form disclaimer and single-glyph anti-aliasing.
- The contact form submits to the API, with field errors, pending and rate-limit states, and an
  email draft as a fallback.
- Added metadata, `robots.txt`, `sitemap.xml`, security headers, a branded 404 page and a
  favicon made from the brand mark (the export shipped Figma's default icon).
- Dropped the Figma Make tooling (`.figma/`, `vite.config.ts`, `.mise.toml`) and the Git LFS rules,
  which aren't needed for under 300 KB of fonts.
