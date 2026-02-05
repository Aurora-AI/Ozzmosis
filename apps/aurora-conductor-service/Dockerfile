# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY libs/aurora-conductor/package.json libs/aurora-conductor/package.json
COPY apps/aurora-conductor-service/package.json apps/aurora-conductor-service/package.json

RUN npm ci

FROM node:20-alpine AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY libs/aurora-conductor libs/aurora-conductor
COPY apps/aurora-conductor-service apps/aurora-conductor-service
COPY --from=deps /repo/libs/aurora-conductor/node_modules ./libs/aurora-conductor/node_modules
COPY --from=deps /repo/apps/aurora-conductor-service/node_modules ./apps/aurora-conductor-service/node_modules

RUN npm -w libs/aurora-conductor run build || true
RUN npm -w apps/aurora-conductor-service run build

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
ENV CONDUCTOR_PORT=4101
ENV NO_COLOR=1
ENV FORCE_COLOR=0

# nonroot runtime
RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app app \
  && mkdir -p /data/artifacts /repo \
  && chown -R 10001:10001 /data /repo

COPY --from=deps --chown=10001:10001 /repo/node_modules ./node_modules
COPY --from=deps --chown=10001:10001 /repo/apps/aurora-conductor-service/node_modules ./apps/aurora-conductor-service/node_modules

COPY --from=build --chown=10001:10001 /repo/package.json ./package.json
COPY --from=build --chown=10001:10001 /repo/libs/aurora-conductor ./libs/aurora-conductor
COPY --from=build --chown=10001:10001 /repo/apps/aurora-conductor-service/dist ./apps/aurora-conductor-service/dist
COPY --from=build --chown=10001:10001 /repo/apps/aurora-conductor-service/package.json ./apps/aurora-conductor-service/package.json

USER 10001:10001
EXPOSE 4101
# Run Node directly so PID1 receives SIGTERM/SIGINT reliably.
CMD ["node", "apps/aurora-conductor-service/dist/server.js"]
