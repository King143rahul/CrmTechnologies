# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN NEXT_DISABLE_SOURCEMAPS=1 NEXT_TELEMETRY_DISABLED=1 npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# ADD THIS LINE TO FIX THE FRONTEND MODULE ERROR
COPY --from=builder /app/check-env-variables.js ./

EXPOSE 8000
CMD ["npm", "run", "start"]
