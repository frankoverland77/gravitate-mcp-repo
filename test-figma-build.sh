#!/bin/bash

echo "🔧 Fixed Figma Integration - Testing Build..."

cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Test TypeScript compilation
echo "📝 Testing TypeScript compilation..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript validation passed!"
    
    # Full build
    echo "🏗️  Building project..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 BUILD SUCCESS! Figma integration is ready!"
        echo ""
        echo "📁 New files built:"
        ls -la build/lib/figma/ 2>/dev/null && echo "  ✅ Figma library built" || echo "  ❌ Figma library missing"
        ls -la build/server/tools/figma.js 2>/dev/null && echo "  ✅ Figma tools built" || echo "  ❌ Figma tools missing"
        
        echo ""
        echo "🎯 Next Steps:"
        echo "  1. Get Figma API token: https://figma.com/developers/api#access-tokens"
        echo "  2. Copy .env.example to .env and add your token"
        echo "  3. Test: Ask Claude 'Test my Figma connection'"
        echo ""
        echo "🚀 Your designer can now bridge Figma → Excalibrr through Claude!"
        
    else
        echo "❌ Build failed even after fixes"
    fi
else
    echo "❌ TypeScript validation still has errors"
fi
