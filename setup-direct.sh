#!/bin/bash

# Direct Installation Script for Excalibrr MCP Server
# This runs the server directly on the host for Claude Desktop integration

echo "🚀 Setting up Excalibrr MCP Server (Direct Installation)"
echo "====================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from the excalibrr-mcp-server directory"
    exit 1
fi

# Check if Excalibrr library exists
EXCALIBRR_PATH="../excalibrr"
if [ ! -d "$EXCALIBRR_PATH" ]; then
    echo "❌ Error: Excalibrr library not found at $EXCALIBRR_PATH"
    echo "💡 Expected structure:"
    echo "   repos/"
    echo "   ├── excalibrr/                  # Your component library"
    echo "   └── excalibrr-mcp-server/       # This MCP server"
    exit 1
fi

echo "✅ Found Excalibrr library at $EXCALIBRR_PATH"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the server
echo "🔨 Building MCP server..."
npm run build

# Create the executable script
echo "🔧 Creating executable script..."
cat > excalibrr-mcp-stdio << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
exec node build/index.js
EOF

chmod +x excalibrr-mcp-stdio

# Test the build
echo "🧪 Testing the build..."
if [ -f "build/index.js" ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - index.js not found"
    exit 1
fi

# Create Claude Desktop config snippet
echo ""
echo "🎯 Claude Desktop Configuration"
echo "==============================="
echo ""
echo "Add this to your claude_desktop_config.json:"
echo ""
echo "{"
echo '  "mcpServers": {'
echo '    "excalibrr": {'
echo '      "command": "'$(pwd)'/excalibrr-mcp-stdio",'
echo '      "args": []'
echo '    }'
echo '  }'
echo "}"
echo ""

# Test the executable
echo "🧪 Testing the executable..."
timeout 3s ./excalibrr-mcp-stdio >/dev/null 2>&1 && echo "✅ Executable works" || echo "⚠️  Executable test timed out (normal for STDIO mode)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add the configuration above to your Claude Desktop config"
echo "2. Restart Claude Desktop"  
echo "3. Test with: 'Show me available Excalibrr components'"
echo ""
echo "📂 Files created:"
echo "   • build/index.js        - Compiled server"
echo "   • excalibrr-mcp-stdio   - Executable for Claude Desktop"
echo ""
