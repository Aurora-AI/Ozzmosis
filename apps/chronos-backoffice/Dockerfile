FROM node:20-slim

WORKDIR /app

COPY apps/chronos-backoffice/package.json ./package.json
RUN npm install

COPY apps/chronos-backoffice/ ./

EXPOSE 3000
CMD ["npm", "run", "dev"]
