#!/bin/bash

# Excalibrr MCP Server Installation Script
# This script sets up the MCP server and configures Claude Desktop

set -e  # Exit on any error

echo "🚀 Installing Excalibrr MCP Server..."
echo

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Install dependencies
echo
echo "📦 Installing dependencies..."
npm install

# Build the server
echo
echo "🔨 Building server..."
npm run build

# Test the server
echo
echo "🧪 Testing server..."
if [ -f "build/index.js" ]; then
    echo "✅ Server built successfully"
else
    echo "❌ Server build failed"
    exit 1
fi

# Quick functionality test
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | timeout 5s node build/index.js | grep -q "discover_components"
if [ $? -eq 0 ]; then
    echo "✅ Server functionality test passed"
else
    echo "❌ Server functionality test failed"
    exit 1
fi

# Configure Claude Desktop
echo
echo "⚙️  Configuring Claude Desktop..."

# Get current directory
CURRENT_DIR=$(pwd)
SERVER_PATH="$CURRENT_DIR/build/index.js"

# Detect OS and set config paths
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    OS_NAME="macOS"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_DIR="$APPDATA/Claude"
    OS_NAME="Windows"
else
    echo "⚠️  Unsupported OS. You'll need to configure Claude Desktop manually."
    echo "   See docs/SETUP.md for manual configuration instructions."
    exit 0
fi

CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
echo "📱 Detected $OS_NAME"
echo "📁 Config will be saved to: $CONFIG_FILE"

# Prompt for repository paths
echo
echo "🗂️  Repository Configuration"
echo "   Please provide the paths to your repositories."
echo "   You can use relative paths from your home directory (~/repos/...)"
echo "   or absolute paths (/full/path/to/repo)"
echo

# Function to expand and validate path
validate_path() {
    local input_path="$1"
    local description="$2"
    
    # Expand ~ to home directory
    expanded_path="${input_path/#\~/$HOME}"
    
    if [ -d "$expanded_path" ]; then
        echo "$expanded_path"
        return 0
    else
        echo "⚠️  Warning: $description path does not exist: $expanded_path" >&2
        return 1
    fi
}

# Get Excalibrr library path
while true; do
    read -p "📂 Excalibrr library path (e.g., ~/repos/excalibrr): " EXCALIBRR_INPUT
    if [ -n "$EXCALIBRR_INPUT" ]; then
        if EXCALIBRR_PATH=$(validate_path "$EXCALIBRR_INPUT" "Excalibrr library"); then
            break
        else
            read -p "   Continue with this path anyway? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                EXCALIBRR_PATH="${EXCALIBRR_INPUT/#\~/$HOME}"
                break
            fi
        fi
    else
        echo "   Path is required. Please enter the path to your Excalibrr library."
    fi
done

# Get usage examples path
while true; do
    read -p "📂 Main project frontend path (e.g., ~/repos/project/frontend/src): " USAGE_INPUT
    if [ -n "$USAGE_INPUT" ]; then
        if USAGE_PATH=$(validate_path "$USAGE_INPUT" "Usage examples"); then
            break
        else
            read -p "   Continue with this path anyway? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                USAGE_PATH="${USAGE_INPUT/#\~/$HOME}"
                break
            fi
        fi
    else
        echo "   Path is required. Please enter the path to your main project frontend."
    fi
done

# Create config directory
mkdir -p "$CONFIG_DIR"

# Check if config file already exists
if [ -f "$CONFIG_FILE" ]; then
    echo
    echo "⚠️  Claude Desktop config already exists."
    read -p "   Do you want to backup and replace it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
        echo "✅ Backed up existing config"
    else
        echo "ℹ️  You can manually add the Excalibrr server to your existing config:"
        echo "   See docs/claude-desktop-config.example.json for the configuration"
        exit 0
    fi
fi

# Generate configuration
cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["$SERVER_PATH"],
      "env": {
        "EXCALIBRR_PATH": "$EXCALIBRR_PATH",
        "USAGE_EXAMPLES_PATH": "$USAGE_PATH"
      }
    }
  }
}
EOF

echo
echo "✅ Claude Desktop configured successfully!"
echo
echo "📋 Configuration summary:"
echo "   Server path: $SERVER_PATH"
echo "   Excalibrr library: $EXCALIBRR_PATH"
echo "   Usage examples: $USAGE_PATH"
echo "   Config file: $CONFIG_FILE"

echo
echo "🎉 Installation complete!"
echo
echo "🔄 Next steps:"
echo "1. Close Claude Desktop completely (quit the app)"
echo "2. Restart Claude Desktop"
echo "3. Test by asking: 'What components are available in Excalibrr?'"
echo
echo "📚 For more help:"
echo "   • See docs/SETUP.md for detailed instructions"
echo "   • See docs/DESIGNER_PROMPTS.md for example questions"
echo "   • Run 'npm test' to verify the server is working"
echo