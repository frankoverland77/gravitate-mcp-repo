#!/bin/bash

# Setup script for Cursor AI MCP configuration

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_SERVER_PATH="$SCRIPT_DIR/mcp-server/build/index.js"
CURSOR_CONFIG="$HOME/.cursor/mcp.json"

echo "Setting up Excalibrr MCP Server for Cursor AI..."
echo ""
echo "MCP Server Path: $MCP_SERVER_PATH"
echo "Cursor Config: $CURSOR_CONFIG"
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

# Create Cursor config directory if it doesn't exist
mkdir -p "$(dirname "$CURSOR_CONFIG")"

# Check if config already exists
if [ -f "$CURSOR_CONFIG" ]; then
  echo "⚠️  Cursor MCP config already exists."
  echo "Creating backup at: ${CURSOR_CONFIG}.backup"
  cp "$CURSOR_CONFIG" "${CURSOR_CONFIG}.backup"

  # Try to merge with existing config
  echo ""
  echo "Attempting to merge with existing configuration..."

  # Check if jq is available for JSON manipulation
  if command -v jq &> /dev/null; then
    # Add our server to existing config
    jq --arg path "$MCP_SERVER_PATH" --arg scriptdir "$SCRIPT_DIR" \
      '.mcpServers.excalibrr = {
        "command": "node",
        "args": [$path],
        "env": {
          "USAGE_EXAMPLES_PATH": $scriptdir
        }
      }' "$CURSOR_CONFIG" > "${CURSOR_CONFIG}.tmp" && mv "${CURSOR_CONFIG}.tmp" "$CURSOR_CONFIG"

    echo "✅ Merged with existing configuration!"
  else
    echo "⚠️  'jq' not found. Please manually add the Excalibrr server to your existing config."
    echo "See the configuration below."
  fi
else
  # Create new config
  cat > "$CURSOR_CONFIG" << EOF
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
  echo "✅ Configuration created successfully!"
fi

echo ""
echo "Next steps:"
echo "1. Restart Cursor completely (Cmd+Q then reopen)"
echo "2. Go to Settings → Cursor Settings → Features"
echo "3. Enable 'Model Context Protocol' if not already enabled"
echo "4. Open Cursor Composer (Cmd+Shift+I or Cmd+I)"
echo "5. Try: 'List all available Excalibrr components'"
echo ""
echo "The MCP server provides:"
echo "  - Component registry (list, search, get details)"
echo "  - Demo generation (create grids, forms, dashboards)"
echo "  - Theme switching and more!"
echo ""
echo "Configuration file: $CURSOR_CONFIG"
