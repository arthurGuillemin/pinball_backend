# Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production
FROM node:22-alpine AS production
WORKDIR /app

RUN apk upgrade --no-cache

COPY package*.json ./

RUN npm pkg delete scripts.prepare
RUN npm ci --omit=dev

COPY --from=builder /app/src ./src

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]