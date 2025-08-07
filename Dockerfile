# Excalibrr MCP Server - Simple Build (Excalibrr Only)
FROM node:18.17.0-alpine

# Install dependencies
RUN apk add --no-cache git python3 make g++ chromium yarn

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Build arguments
ARG EXCALIBRR_VERSION=v4.0.34-osp
ARG BUILD_DATE
ARG VCS_REF

# Labels
LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      maintainer="Gravitate Team" \
      description="Excalibrr MCP Server with component library"

# Excalibrr library will be mounted as a volume at runtime
RUN mkdir -p /app/excalibrr

# Copy MCP server source
COPY package*.json /app/mcp-server/
COPY tsconfig.json /app/mcp-server/
COPY src/ /app/mcp-server/src/

# Excalibrr will be mounted at runtime, so skip build step
RUN echo "📦 Excalibrr library will be mounted at runtime from ../excalibrr"

# Build MCP server
WORKDIR /app/mcp-server
RUN echo "🔨 Building MCP server..." && \
    npm ci && \
    npm run build && \
    echo "✅ MCP server built successfully" && \
    echo "🧽 Cleaning up dev dependencies..." && \
    npm ci --only=production && \
    npm cache clean --force

# Create directories for generated content
RUN mkdir -p /app/screenshots /app/previews /app/generated

# Set environment variables
ENV EXCALIBRR_PATH=/app/excalibrr
ENV USAGE_EXAMPLES_PATH=/app/mcp-server/examples
ENV NODE_ENV=production
# Default to STDIO for MCP (set MCP_TRANSPORT=http for HTTP mode)
ENV PORT=3000

# Security: non-root user
RUN addgroup -g 1001 -S excalibrr && \
    adduser -S excalibrr -u 1001 -G excalibrr && \
    chown -R excalibrr:excalibrr /app

USER excalibrr

EXPOSE 3000

# Health check disabled for STDIO mode (enable for HTTP with MCP_TRANSPORT=http)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "build/index.js"]