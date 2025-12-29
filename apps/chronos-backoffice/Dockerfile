# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/chronos-backoffice/package.json apps/chronos-backoffice/package.json
COPY libs/aurora-chronos/package.json libs/aurora-chronos/package.json

RUN npm ci

FROM node:20-alpine AS build
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./

# workspace sources necessárias
COPY apps/chronos-backoffice apps/chronos-backoffice
COPY libs/aurora-chronos libs/aurora-chronos

# Build do lib Chronos (se houver build)
# Se não existir script build, este step não quebra porque usamos `|| true`.
RUN npm -w libs/aurora-chronos run build || true

# Build do Next
RUN npm -w apps/chronos-backoffice run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copiamos o standalone do Next (recomendado quando configurado)
# Se o projeto não estiver em standalone, ainda funciona copiando .next e node_modules.
COPY --from=build /repo/apps/chronos-backoffice/.next ./.next
COPY --from=build /repo/apps/chronos-backoffice/public ./public
COPY --from=build /repo/apps/chronos-backoffice/package.json ./package.json

# Dependências runtime do monorepo (node_modules inteiro)
COPY --from=deps /repo/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
