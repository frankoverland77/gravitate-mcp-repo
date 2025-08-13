#!/bin/bash

# Quick TypeScript compilation test
echo "🔨 Testing TypeScript compilation..."

cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Clean build directory
rm -rf build/

# Try to compile
echo "Running TypeScript compiler..."
npx tsc --noEmit --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful - no errors!"
    echo ""
    echo "Now building the project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Full build successful!"
        echo ""
        echo "🎉 Enhanced Visual Preview System is ready!"
        echo ""
        echo "🛠️ New tools available:"
        echo "• generate_authentic_preview"
        echo "• list_gravitate_themes"
        echo "• compare_component_themes"
        echo "• generate_component_showcase"
        echo ""
        echo "🚀 Ready to test in Claude Desktop!"
    else
        echo "❌ Build failed after TypeScript check passed"
    fi
else
    echo "❌ TypeScript compilation failed"
    echo "Please check the errors above"
fi
