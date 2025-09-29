#!/bin/bash

# Setup script for Claude Desktop configuration

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_SERVER_PATH="$SCRIPT_DIR/mcp-server/build/index.js"
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

echo "Setting up Excalibrr MCP Server for Claude Desktop..."
echo ""
echo "MCP Server Path: $MCP_SERVER_PATH"
echo "Claude Config: $CLAUDE_CONFIG"
echo ""

# Check if MCP server is built
if [ ! -f "$MCP_SERVER_PATH" ]; then
  echo "❌ MCP server not built. Building now..."
  cd mcp-server && yarn build
  if [ $? -ne 0 ]; then
    echo "Failed to build MCP server"
    exit 1
  fi
  cd ..
fi

# Create Claude config directory if it doesn't exist
mkdir -p "$(dirname "$CLAUDE_CONFIG")"

# Check if config already exists
if [ -f "$CLAUDE_CONFIG" ]; then
  echo "⚠️  Claude Desktop config already exists."
  echo "Creating backup at: ${CLAUDE_CONFIG}.backup"
  cp "$CLAUDE_CONFIG" "${CLAUDE_CONFIG}.backup"
fi

# Create the config
cat > "$CLAUDE_CONFIG" << EOF
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {
        "USAGE_EXAMPLES_PATH": "$SCRIPT_DIR"
      }
    }
  }
}
EOF

echo ""
echo "✅ Configuration created successfully!"
echo ""
echo "Next steps:"
echo "1. Restart Claude Desktop completely"
echo "2. Open a new conversation"
echo "3. Try: 'List all available components'"
echo ""
echo "The MCP server provides:"
echo "  - Component registry (list, search, get details)"
echo "  - Demo generation (create grids, forms, dashboards)"
echo "  - Theme switching and more!"