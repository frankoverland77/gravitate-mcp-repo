#!/bin/bash

echo "🔧 Building Enhanced Excalibrr MCP Server with Real Theme Integration..."

cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Build TypeScript
echo "🔨 Building TypeScript..."
if npm run build; then
    echo "✅ Build successful!"
    echo ""
    echo "🎨 New Theme Integration Features:"
    echo "   • list_gravitate_themes - Show all real client themes"
    echo "   • generate_themed_component - Use authentic themes"
    echo "   • generate_themed_application - Complete themed apps"
    echo "   • preview_theme_colors - See actual brand colors"
    echo ""
    echo "🚀 Frank can now say:"
    echo '   "Create a grid with OSP theme"'
    echo '   "Generate a dashboard using PE theme"'
    echo '   "Show me all available client themes"'
    echo '   "Make a complete app with BP branding"'
    echo ""
    echo "✅ Using REAL Excalibrr components:"
    echo "   • HorizontalToolbar (no fake nav bars!)"
    echo "   • VerticalNav (proper sidebar)"
    echo "   • GraviGrid (themed data grids)"
    echo "   • PageWrapper (authentic layouts)"
    echo ""
    echo "✅ Using REAL Gravitate themes:"
    echo "   • Actual LESS color variables"
    echo "   • Authentic client logos"
    echo "   • Real brand backgrounds"
    echo "   • Proper asset integration"
    echo ""
    echo "🎯 Ready for Frank's authentic design experience!"
else
    echo "❌ Build failed!"
    echo "Check TypeScript errors above."
    exit 1
fi
