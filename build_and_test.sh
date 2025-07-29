#!/bin/bash

echo "Building Excalibrr MCP Server..."
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Build the server
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready to test the updated server with dependency version matching"
    echo ""
    echo "The server now:"
    echo "• Reads exact dependency versions from your gravitate project"
    echo "• Includes npm overrides to handle React 18 + @nivo/core compatibility"
    echo "• Adds all necessary Excalibrr dependencies (@ant-design/icons, antd, etc.)"
    echo "• Matches your exact project structure and versions"
    echo ""
    echo "Next steps:"
    echo "1. Try generating a new grid project with the updated server"
    echo "2. The generated package.json should now work with 'npm install'"
else
    echo "❌ Build failed"
    exit 1
fi
