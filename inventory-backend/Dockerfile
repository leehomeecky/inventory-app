# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build app and prune dev dependencies
RUN npm run build
RUN npm prune --production --legacy-peer-deps

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy built app and production node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose backend port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
