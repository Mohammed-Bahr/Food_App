# Use Node.js LTS version as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Add libc6-compat for compatibility with some packages
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development image
FROM base AS dev
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# Build stage (if you need to compile TypeScript or build assets)
FROM base AS builder
WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application (uncomment if using TypeScript)
# RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressuser

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY --chown=expressuser:nodejs . .

# If you have a build step, copy built files instead
# COPY --from=builder --chown=expressuser:nodejs /app/dist ./dist

# Switch to non-root user
USER expressuser

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
