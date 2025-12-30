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

RUN npm -w libs/aurora-conductor run build || true
RUN npm -w apps/aurora-conductor-service run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV CONDUCTOR_PORT=4101

COPY --from=build /repo/apps/aurora-conductor-service/dist ./dist
COPY --from=build /repo/apps/aurora-conductor-service/package.json ./package.json
COPY --from=deps /repo/node_modules ./node_modules

EXPOSE 4101
CMD ["node", "dist/server.js"]
