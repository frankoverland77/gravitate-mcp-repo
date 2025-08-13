#!/bin/bash

# Build script with font fix integration
echo "🔧 Building Excalibrr MCP Server with Font Fix..."

# Clean previous build
rm -rf build

# Compile TypeScript
echo "📦 Compiling TypeScript..."
npx tsc

# Verify the font fix module was compiled
if [ -f "build/lib/gridFontFix.js" ]; then
  echo "✅ Font fix module compiled successfully"
else
  echo "❌ Font fix module failed to compile"
  exit 1
fi

# Verify navigation system update
if grep -q "gridFontFix" build/lib/navigationSystem.js; then
  echo "✅ Navigation system integrated with font fix"
else
  echo "⚠️  Navigation system may not have font fix integrated"
fi

echo "✅ Build complete with font fixes!"
echo ""
echo "🎯 To test the font fix:"
echo "1. Generate a new themed grid component"
echo "2. Check that Lato font is applied to headers and cells"
echo "3. Verify uppercase headers with proper weight"
echo ""
echo "📝 Font validation: The generated components now include:"
echo "   - Automatic font loading via useEffect"
echo "   - CSS variables for ag-Grid font family"
echo "   - Inline styles for critical font application"
echo "   - Post-render font validation"
