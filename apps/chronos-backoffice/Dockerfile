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

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/chronos-backoffice/node_modules ./apps/chronos-backoffice/node_modules
COPY --from=build /repo/package.json ./package.json
COPY --from=build /repo/libs/trustware ./libs/trustware
COPY --from=build /repo/apps/chronos-backoffice ./apps/chronos-backoffice

EXPOSE 3000
CMD ["npm", "-w", "apps/chronos-backoffice", "run", "start"]
