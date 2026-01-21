FROM node:20-slim AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY libs/trustware/package.json libs/trustware/package.json
COPY apps/chronos-backoffice/package.json apps/chronos-backoffice/package.json

RUN npm ci

FROM node:20-slim AS build
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY libs/trustware libs/trustware
COPY apps/chronos-backoffice apps/chronos-backoffice

RUN npm -w apps/chronos-backoffice run build

FROM node:20-slim AS runner
WORKDIR /repo

ENV NODE_ENV=production
ENV PORT=3000

# nonroot runtime
RUN groupadd -g 10001 app && useradd -u 10001 -g 10001 -m -s /usr/sbin/nologin app \
  && mkdir -p /repo \
  && chown -R 10001:10001 /repo

COPY --from=deps --chown=10001:10001 /repo/node_modules ./node_modules
COPY --from=deps --chown=10001:10001 /repo/apps/chronos-backoffice/node_modules ./apps/chronos-backoffice/node_modules
COPY --from=build --chown=10001:10001 /repo/package.json ./package.json
COPY --from=build --chown=10001:10001 /repo/libs/trustware ./libs/trustware
COPY --from=build --chown=10001:10001 /repo/apps/chronos-backoffice ./apps/chronos-backoffice

USER 10001:10001
EXPOSE 3000
# Run Node directly so PID1 receives SIGTERM/SIGINT reliably.
CMD ["node", "node_modules/next/dist/bin/next", "start", "apps/chronos-backoffice", "-p", "3000", "-H", "0.0.0.0"]
