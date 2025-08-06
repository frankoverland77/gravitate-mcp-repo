#!/bin/bash

# Test script to verify the new file generation setup

echo "🧪 Testing File Generation Setup"
echo "================================"

echo "📁 Current directory structure:"
echo "   $(pwd)"
echo "   ├── excalibrr-mcp-server/   (you are here)"
echo "   └── excalibrr/              (sibling directory)"

echo ""
echo "🐳 Docker Configuration Test:"

# Check if docker-compose has the right volumes
if grep -q "../:/app/repos" docker-compose.yml; then
    echo "✅ Parent directory mounted as /app/repos"
else
    echo "❌ Parent directory mount missing"
fi

if grep -q "OUTPUT_DIR=/app/repos" docker-compose.yml; then
    echo "✅ OUTPUT_DIR set to /app/repos"
else
    echo "❌ OUTPUT_DIR not configured correctly"
fi

echo ""
echo "🎯 Expected Behavior:"
echo "   When you generate a 'ContractManagement' project:"
echo "   📁 ~/repos/"
echo "   ├── ContractManagementDemo/     ← New project appears here"
echo "   ├── excalibrr/"
echo "   └── excalibrr-mcp-server/"

echo ""
echo "🚀 Ready to test! Try:"
echo "   1. Build and start: ./build-docker.sh && ./start-excalibrr.sh"
echo "   2. In Claude: 'Generate a grid for managing contracts'"
echo "   3. Check for new folder: ls ../"
