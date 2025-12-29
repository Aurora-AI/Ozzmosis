# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /repo

# Copiamos manifests do monorepo para instalar via npm workspaces
COPY package.json package-lock.json ./
COPY apps/butantan-shield/package.json apps/butantan-shield/package.json

RUN npm ci

FROM node:20-alpine AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/butantan-shield apps/butantan-shield

# Build do Shield (gera dist/)
RUN npm -w apps/butantan-shield run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SHIELD_PORT=4001

# Copia apenas o necessário para runtime
COPY --from=build /repo/apps/butantan-shield/dist ./dist
COPY --from=build /repo/apps/butantan-shield/package.json ./package.json

EXPOSE 4001
CMD ["node", "dist/server.js"]
