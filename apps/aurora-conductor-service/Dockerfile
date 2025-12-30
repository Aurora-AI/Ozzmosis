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

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/aurora-conductor-service/node_modules ./apps/aurora-conductor-service/node_modules

COPY --from=build /repo/package.json ./package.json
COPY --from=build /repo/libs/aurora-conductor ./libs/aurora-conductor
COPY --from=build /repo/apps/aurora-conductor-service/dist ./apps/aurora-conductor-service/dist
COPY --from=build /repo/apps/aurora-conductor-service/package.json ./apps/aurora-conductor-service/package.json

EXPOSE 4101
CMD ["npm", "-w", "apps/aurora-conductor-service", "run", "start"]
