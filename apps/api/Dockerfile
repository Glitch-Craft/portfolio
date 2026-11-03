# syntax=docker/dockerfile:1
# Build from the repository root:
#   docker build -f apps/api/Dockerfile -t glitch-craft-api .

ARG NODE_VERSION=24-alpine
ARG BUN_VERSION=1.2.21

FROM oven/bun:${BUN_VERSION}-alpine AS bun

# Node.js runs the build and the server; bun is only the package manager.
FROM node:${NODE_VERSION} AS base
ARG TURBO_VERSION=2.11.10
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN npm install --global --no-fund --no-audit turbo@${TURBO_VERSION}
ENV HUSKY=0 \
    TURBO_TELEMETRY_DISABLED=1
WORKDIR /repo

# Keep only the API and the workspace packages it depends on.
FROM base AS pruner
COPY . .
RUN turbo prune @glitch-craft/api --docker

FROM base AS builder
# Install first, from manifests only, so dependency layers stay cached.
COPY --from=pruner /repo/out/json/ .
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
RUN turbo run build --filter=@glitch-craft/api
# Swap in production dependencies of the API only. No dependency install scripts
# are needed at runtime, so skip them.
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    rm -rf node_modules && \
    bun install --frozen-lockfile --production --ignore-scripts --filter @glitch-craft/api

FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production \
    PORT=4711
WORKDIR /app
# Same layout as the workspace, so node_modules/@glitch-craft/* symlinks resolve.
COPY --from=builder --chown=node:node /repo/node_modules ./node_modules
COPY --from=builder --chown=node:node /repo/packages/contracts/package.json ./packages/contracts/
COPY --from=builder --chown=node:node /repo/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder --chown=node:node /repo/apps/api/package.json ./apps/api/
COPY --from=builder --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /repo/apps/api/drizzle ./apps/api/drizzle
WORKDIR /app/apps/api
USER node
EXPOSE 4711
CMD ["node", "--enable-source-maps", "dist/main.js"]
