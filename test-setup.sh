#!/bin/bash

# Quick test of the Docker setup and scripts

echo "🧪 Testing Excalibrr MCP Server Setup"
echo "====================================="
echo ""

cd /Users/rebecca.hirai/repos/excalibrr-mcp-server

# Check if Docker is running
echo "1. Checking Docker..."
if docker info > /dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running"
    exit 1
fi

# Check for existing containers
echo ""
echo "2. Checking for existing containers..."
if docker ps -a --format '{{.Names}}' | grep -q "excalibrr-mcp-server"; then
    echo "⚠️  Existing container found:"
    docker ps -a --filter "name=excalibrr-mcp-server" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "✅ No existing containers"
fi

# Check for existing images
echo ""
echo "3. Checking for existing images..."
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "excalibrr-mcp:latest"; then
    echo "✅ Docker image found: excalibrr-mcp:latest"
else
    echo "⚠️  No Docker image found - will need to build"
fi

# Check script permissions
echo ""
echo "4. Checking script permissions..."
for script in *.sh; do
    if [[ -x "$script" ]]; then
        echo "✅ $script (executable)"
    else
        echo "⚠️  $script (not executable)"
        chmod +x "$script"
        echo "   → Fixed: $script is now executable"
    fi
done

echo ""
echo "5. Available management commands:"
echo "   ./start-excalibrr.sh        - Start server (normal)"
echo "   ./start-excalibrr.sh --force - Force clean restart"
echo "   ./manage-excalibrr.sh status - Check status"
echo "   ./cleanup-excalibrr.sh      - Complete cleanup"
echo ""

echo "✅ Setup validation complete!"
echo ""
echo "Next steps:"
echo "1. If no image exists: ./build-docker.sh"
echo "2. Start the server: ./start-excalibrr.sh"
echo "3. Or force clean start: ./start-excalibrr.sh --force"
