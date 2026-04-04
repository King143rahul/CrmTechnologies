# ── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy source & config
COPY . .

# Single Medusa build (compiles server + admin dashboard)
RUN npx medusa build

# ── Production stage ────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built output and runtime deps
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

# Copy admin dashboard to the public path Medusa serves from
COPY --from=builder /app/.medusa/server/public/admin ./public/admin

# Create uploads directory
RUN mkdir -p uploads/dealer-docs

# Copy entrypoint (runs migrations, then starts server)
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["./docker-entrypoint.sh"]
