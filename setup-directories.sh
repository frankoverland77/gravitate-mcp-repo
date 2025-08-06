#!/bin/bash

# Quick setup script to create all required directories

echo "📁 Creating required directories for Excalibrr MCP Server..."

# Create all required directories
mkdir -p generated screenshots previews build

echo "✅ Created directories:"
echo "   • ./generated/    - Generated React projects"
echo "   • ./screenshots/  - Component screenshots" 
echo "   • ./previews/     - Live component previews"
echo "   • ./build/        - TypeScript build output"

echo ""
echo "🎯 Directories ready! You can now:"
echo "   • Run ./build-docker.sh to build the server"
echo "   • Projects will be generated in ./generated/"
echo "   • No more 'folder doesn't exist' errors"

echo ""
echo "✅ Setup complete!"
