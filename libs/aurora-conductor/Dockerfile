# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY libs/aurora-conductor/package.json libs/aurora-conductor/package.json
RUN npm ci

FROM node:20-alpine AS runner
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY libs/aurora-conductor libs/aurora-conductor

# Não é daemon: é runner utilitário.
# O comando final é definido no compose.
