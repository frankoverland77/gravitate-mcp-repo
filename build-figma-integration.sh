#!/bin/bash

# Build and test script for Excalibrr MCP Server with Figma integration

echo "🔧 Building Excalibrr MCP Server with Figma Integration..."

# Navigate to server directory
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Install new dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Show what was built
    echo ""
    echo "📁 Built files:"
    ls -la build/
    
    echo ""
    echo "🎨 Figma Integration Tools Added:"
    echo "  ✅ figma_test_connection"
    echo "  ✅ figma_extract_design_tokens" 
    echo "  ✅ figma_generate_excalibrr_theme"
    echo "  ✅ figma_analyze_component"
    echo "  ✅ figma_get_file_structure"
    
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Copy .env.example to .env"
    echo "  2. Add your FIGMA_API_TOKEN to .env"
    echo "  3. Start the server: npm start"
    echo "  4. Test in Claude: 'Test my Figma connection'"
    
    echo ""
    echo "📚 Read FIGMA_SETUP.md for complete usage guide"
    echo ""
    echo "🎉 Ready to bridge Figma → Excalibrr!"
    
else
    echo "❌ Build failed!"
    echo "Check TypeScript errors above"
fi
