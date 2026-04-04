# ── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Accept backend URL as build arg so next build bakes the correct value
ARG MEDUSA_BACKEND_URL=http://localhost:9000
ENV MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN NEXT_DISABLE_SOURCEMAPS=1 NEXT_TELEMETRY_DISABLED=1 npm run build

# ── Production stage ────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/check-env-variables.js ./

EXPOSE 8000
CMD ["npm", "run", "start"]
