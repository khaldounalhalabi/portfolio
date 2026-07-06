# syntax=docker/dockerfile:1

# ----------------------
# Builder stage
# ----------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* .npmrc ./
RUN npm ci --maxsockets=1 --prefer-offline --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# ----------------------
# Production stage
# ----------------------
FROM node:22-slim AS production

WORKDIR /app

# Install Chromium runtime dependencies required by @sparticuz/chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the service
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy built application and dependencies from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

USER appuser

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
