# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/src ./src

# Fix compilation and admin dashboard
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.medusa/admin ./.medusa/admin

# Create uploads directory
RUN mkdir -p uploads/dealer-docs

EXPOSE 9000
CMD ["npm", "run", "start"]
