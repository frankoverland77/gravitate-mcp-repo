#!/bin/bash

echo "🔧 Building Excalibrr MCP Server with flat dependency versions..."
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Build the server
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 **Key Update: FLAT DEPENDENCY VERSIONS**"
    echo "• Removed all ^ and ~ version prefixes"
    echo "• Using exact versions: react: \"18.2.0\" instead of \"^18.2.0\""
    echo "• Added cleanVersion() function to strip prefixes from gravitate project"
    echo "• This should resolve the npm ERESOLVE dependency conflicts"
    echo ""
    echo "📋 What the server now does:"
    echo "1. Reads your gravitate project's package.json"
    echo "2. Strips version prefixes (^, ~, >=, etc.) to get exact versions"
    echo "3. Generates package.json with flat versions + npm overrides"
    echo "4. Forces @nivo/core to use your React version via overrides"
    echo ""
    echo "🚀 Ready to test! Try generating a new grid project."
    echo "The generated package.json should now install cleanly without conflicts."
else
    echo "❌ Build failed"
    exit 1
fi
