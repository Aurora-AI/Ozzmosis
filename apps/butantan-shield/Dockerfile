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
WORKDIR /app

ENV NODE_ENV=production
ENV SHIELD_PORT=4001

COPY --from=build /repo/apps/butantan-shield/dist ./dist
COPY --from=build /repo/apps/butantan-shield/package.json ./package.json
COPY --from=deps /repo/node_modules ./node_modules

EXPOSE 4001
CMD ["node", "dist/server.js"]
