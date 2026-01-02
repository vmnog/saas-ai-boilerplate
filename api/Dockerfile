# Use Node.js v20 on Alpine as the base image
FROM node:20-alpine AS base

# Install necessary build tools
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
FROM base AS deps
RUN npm ci

# Production image, copy all the files and run the app
FROM base AS runner

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Switch to non-root user
USER nodejs

# Copy dependencies and source code
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Set environment variables
ENV NODE_ENV production
ENV PORT 8080

# Expose the port the app runs on
EXPOSE 8080

# Start the application using tsx
CMD npm run start