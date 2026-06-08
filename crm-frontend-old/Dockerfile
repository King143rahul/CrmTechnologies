# ── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Accept backend URL as build arg
ARG MEDUSA_BACKEND_URL=http://localhost:9000
ENV VITE_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV PORT=8000
ENV HOST=0.0.0.0

COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ── Production stage ────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV PORT=8000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Copy built application and runtime dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/runner.js ./runner.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 8000
CMD ["node", "runner.js"]
