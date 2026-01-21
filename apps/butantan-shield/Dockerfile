# syntax=docker/dockerfile:1

FROM node:20-slim AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/butantan-shield/package.json apps/butantan-shield/package.json

RUN npm ci

FROM node:20-slim AS build
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/butantan-shield apps/butantan-shield

RUN npm -w apps/butantan-shield run build

FROM node:20-slim AS runner
WORKDIR /repo

ENV NODE_ENV=production
ENV SHIELD_PORT=4001
ENV NO_COLOR=1
ENV FORCE_COLOR=0

# nonroot runtime
RUN groupadd -g 10001 app && useradd -u 10001 -g 10001 -m -s /usr/sbin/nologin app \
  && mkdir -p /repo \
  && chown -R 10001:10001 /repo

COPY --from=deps --chown=10001:10001 /repo/node_modules ./node_modules
COPY --from=deps --chown=10001:10001 /repo/apps/butantan-shield/node_modules ./apps/butantan-shield/node_modules

COPY --from=build --chown=10001:10001 /repo/package.json ./package.json
COPY --from=build --chown=10001:10001 /repo/apps/butantan-shield/dist ./apps/butantan-shield/dist
COPY --from=build --chown=10001:10001 /repo/apps/butantan-shield/package.json ./apps/butantan-shield/package.json

USER 10001:10001
EXPOSE 4001
# Run Node directly so PID1 receives SIGTERM/SIGINT reliably.
CMD ["node", "apps/butantan-shield/dist/server.js"]
