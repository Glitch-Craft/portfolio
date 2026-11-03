# syntax=docker/dockerfile:1
# Build from the repository root:
#   docker build -f apps/web/Dockerfile -t glitch-craft-web .

ARG NODE_VERSION=24-alpine
ARG BUN_VERSION=1.2.21

FROM oven/bun:${BUN_VERSION}-alpine AS bun

# Node.js runs the build and the server; bun is only the package manager.
FROM node:${NODE_VERSION} AS base
ARG TURBO_VERSION=2.11.10
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN npm install --global --no-fund --no-audit turbo@${TURBO_VERSION}
ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1
WORKDIR /repo

# Keep only the web app and the workspace packages it depends on.
FROM base AS pruner
COPY . .
RUN turbo prune @glitch-craft/web --docker

FROM base AS builder
# Install first, from manifests only, so dependency layers stay cached.
COPY --from=pruner /repo/out/json/ .
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
ARG NEXT_PUBLIC_SITE_URL=http://localhost:4710
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_OUTPUT=standalone
RUN turbo run build --filter=@glitch-craft/web

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=4710
COPY --from=builder --chown=node:node /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 4710
CMD ["node", "apps/web/server.js"]
