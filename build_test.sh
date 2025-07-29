#!/bin/bash
set -e
echo "🔨 Building Excalibrr MCP Server..."
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server
npm run build
echo "✅ Build complete!"
