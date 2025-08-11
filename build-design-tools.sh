#!/bin/bash

echo "🔧 Building Excalibrr MCP Server with new Design Iteration tools..."

cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 New tools available:"
    echo "   - create_design_session"
    echo "   - update_live_design" 
    echo "   - get_design_suggestions"
    echo "   - export_production_code"
    echo ""
    echo "🎯 Ready for Frank's real-time design experience!"
else
    echo "❌ Build failed!"
    echo "Check TypeScript errors above."
    exit 1
fi
