#!/bin/bash

echo "🚀 Setting up Excalibrr Workspace..."

# 1. Install all dependencies
echo "📦 Installing workspace dependencies..."
yarn install

# 2. Build MCP server
echo "🔨 Building MCP server..."
cd mcp-server && yarn build && cd ..

# 3. Configure Claude Code MCP
echo "⚙️ Configuring Claude Code..."
mkdir -p ~/.claude

cat > ~/.claude/claude_desktop_config.json << EOF
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["$(pwd)/mcp-server/build/index.js"]
    }
  }
}
EOF

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Start demo: yarn dev"
echo "  2. In Cursor: claude --chat"
echo "  3. Say: 'Create a product grid'"
echo ""
echo "📂 Project structure:"
echo "  • mcp-server/    - MCP server with tools"
echo "  • demo/          - Demo project (Frank works here)"
echo "  • docs/          - Rules and guides"