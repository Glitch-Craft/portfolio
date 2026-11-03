# Agent notes

Bun (package manager) + Turborepo monorepo. Apps, builds and tests run on Node.js. See README.md for setup and architecture.

## Layout

- `apps/web`: Next.js 16 App Router site. Entry points: `src/app/layout.tsx` and `src/app/page.tsx`.
- `apps/api`: NestJS 12 API (native ESM), Drizzle ORM + PostgreSQL.
- `packages/contracts`: Zod schemas and types shared by web and API. Compiled to `dist/`.
- `packages/eslint-config`, `packages/typescript-config`: shared tooling presets.

## Commands (run from the repo root)

- `bun run dev`, `bun run build`, `bun run lint`, `bun run typecheck`, `bun run test`,
  `bun run test:e2e`. Never plain `bun test`: that is bun's own test runner, not the Vitest suites.
- `bun run format` before committing. CI runs `bun run format:check`.
- Scope to one package with `--filter`, e.g. `bun run turbo run test --filter=@glitch-craft/web`.
- `bun run db:up` then `bun run db:migrate` before running the API against a real database.

## Rules

- Use bun (`bun install`, `bun add`), never npm, pnpm or yarn. Add shared dependency versions to
  `workspaces.catalog` in the root `package.json` and reference them with `"catalog:"`.
- New dependency install scripts are blocked unless bun trusts them. Check `bun pm untrusted` and
  only add a package to `trustedDependencies` after reviewing its script.
- Change request/response shapes in `packages/contracts` first, then update both apps.
- API source is ESM with `nodenext` resolution: relative imports end in `.js`. Types used in
  decorated constructor or handler signatures must be imported with `import type` or `type`.
- Web: keep components as Server Components unless they need state or browser APIs. Read
  server-only settings through `src/lib/server-env.ts` and call the API through
  `src/lib/api-client.ts`, never from the browser.
- Link to home page sections with `SectionLink` (`src/components/section-link.tsx`), not
  `next/link`: native fragment navigation keeps the CSS smooth scrolling.
- Web styles are plain CSS partials in `src/styles/`, imported in order by `src/app/globals.css`.
  Rules often tie on specificity, so a partial's position in that list matters. Put new media
  queries after the base rule they override, inside the file that owns it.
- Database schema lives in `apps/api/src/database/schema.ts`. After editing it, run
  `bun run db:generate` and commit the generated SQL in `apps/api/drizzle/`.
- Never commit `.env` files. Document new variables in the matching `.env.example`, validate them
  in the app's env module, and list runtime variables in `turbo.json#globalPassThroughEnv`.
