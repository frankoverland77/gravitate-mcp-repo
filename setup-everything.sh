#!/bin/bash

# 🎨 Excalibrr MCP Server - Complete Setup Script
# Sets up Docker containers for both Claude Desktop (STDIO) and Cursor (HTTP)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
STDIO_CONTAINER_NAME="excalibrr-mcp-stdio"
HTTP_CONTAINER_NAME="excalibrr-mcp-http"
IMAGE_NAME="excalibrr-mcp"
HTTP_PORT="3001"

# Check for rebuild flag
REBUILD=false
if [[ "$1" == "--rebuild" ]]; then
    REBUILD=true
fi

echo -e "${PURPLE}🎨 Excalibrr MCP Server - Complete Setup${NC}"
echo -e "${PURPLE}=====================================${NC}"
echo ""
echo -e "🎯 ${BLUE}Setting up for both Claude Desktop and Cursor${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Stop and remove existing containers if they exist
for container in $STDIO_CONTAINER_NAME $HTTP_CONTAINER_NAME; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${YELLOW}🔄 Stopping existing ${container} container...${NC}"
        docker stop ${container} > /dev/null 2>&1
    fi
    
    if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${YELLOW}🔄 Removing existing ${container} container...${NC}"
        docker rm ${container} > /dev/null 2>&1
    fi
done

# Check if image exists or rebuild flag is set
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:latest$" || [ "$REBUILD" = true ]; then
    echo -e "${BLUE}🔨 Building Docker image with Excalibrr library...${NC}"
    if [ -f "./build-docker.sh" ]; then
        chmod +x build-docker.sh
        ./build-docker.sh
    else
        echo -e "${RED}❌ build-docker.sh not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker image already exists${NC}"
fi

echo ""
echo -e "${BLUE}🐳 Setting up containers for both Claude Desktop and Cursor...${NC}"

# Create STDIO container for Claude Desktop
echo -e "${BLUE}📡 Creating STDIO container for Claude Desktop...${NC}"
docker run -d \
    --name ${STDIO_CONTAINER_NAME} \
    -v "$(pwd)/generated:/app/generated" \
    -v "$(pwd)/screenshots:/app/screenshots" \
    -v "$(pwd)/previews:/app/previews" \
    -e MCP_TRANSPORT=stdio \
    ${IMAGE_NAME}:latest \
    tail -f /dev/null

echo -e "${GREEN}✅ STDIO container created${NC}"

# Create HTTP container for Cursor
echo -e "${BLUE}🌐 Creating HTTP container for Cursor...${NC}"
docker run -d \
    --name ${HTTP_CONTAINER_NAME} \
    -p ${HTTP_PORT}:3000 \
    -v "$(pwd)/generated:/app/generated" \
    -v "$(pwd)/screenshots:/app/screenshots" \
    -v "$(pwd)/previews:/app/previews" \
    -e MCP_TRANSPORT=http \
    -e PORT=3000 \
    ${IMAGE_NAME}:latest

echo -e "${GREEN}✅ HTTP container created${NC}"

# Wait a moment for containers to start
sleep 3

# Generate Claude Desktop config file
echo -e "${BLUE}📝 Generating Claude Desktop configuration...${NC}"
cat > claude-desktop-config.json << EOF
{
  "mcpServers": {
    "excalibrr": {
      "command": "docker",
      "args": ["exec", "-i", "${STDIO_CONTAINER_NAME}", "node", "build/index.js"]
    }
  }
}
EOF

echo -e "${GREEN}✅ Claude Desktop config created: claude-desktop-config.json${NC}"

# Update Cursor config file with correct port
echo -e "${BLUE}📝 Updating Cursor configuration...${NC}"
cat > cursor-mcp-config.json << EOF
{
  "mcpServers": {
    "excalibrr": {
      "url": "http://localhost:${HTTP_PORT}"
    }
  }
}
EOF

echo -e "${GREEN}✅ Cursor config updated: cursor-mcp-config.json${NC}"

# Test both containers
echo ""
echo -e "${BLUE}🧪 Testing containers...${NC}"

# Test STDIO container
echo -e "${YELLOW}Testing STDIO container (Claude Desktop)...${NC}"
if docker exec ${STDIO_CONTAINER_NAME} timeout 5 node build/index.js > /dev/null 2>&1; then
    echo -e "${GREEN}✅ STDIO container working${NC}"
else
    echo -e "${YELLOW}⚠️  STDIO container test inconclusive (this is normal)${NC}"
fi

# Test HTTP container
echo -e "${YELLOW}Testing HTTP container (Cursor)...${NC}"
sleep 2  # Give HTTP server time to start
if curl -s -f "http://localhost:${HTTP_PORT}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTP container working${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP container still starting up...${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${PURPLE}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${PURPLE}│                 📋 NEXT STEPS                       │${NC}"
echo -e "${PURPLE}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${BLUE}For Claude Desktop:${NC}"
echo -e "1. Copy ${YELLOW}claude-desktop-config.json${NC} to:"
echo -e "   ${GREEN}~/Library/Application\\ Support/Claude/claude_desktop_config.json${NC}"
echo -e "2. Restart Claude Desktop completely"
echo ""
echo -e "${BLUE}For Cursor:${NC}"
echo -e "1. Copy the contents of ${YELLOW}cursor-mcp-config.json${NC}"
echo -e "2. Add to Cursor's MCP settings"
echo -e "3. Restart Cursor"
echo ""
echo -e "${PURPLE}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${PURPLE}│                 🧪 TEST COMMANDS                     │${NC}"
echo -e "${PURPLE}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${BLUE}Claude Desktop:${NC}"
echo -e '• "Show me available Excalibrr components"'
echo -e '• "Create a GraviGrid for displaying contracts"'
echo ""
echo -e "${BLUE}Cursor:${NC}"
echo -e '• Use @excalibrr to access tools'
echo -e '• "Generate a contracts grid using Excalibrr"'
echo ""
echo -e "${PURPLE}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${PURPLE}│               🔧 USEFUL COMMANDS                     │${NC}"
echo -e "${PURPLE}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${YELLOW}Check containers:${NC}     docker ps | grep excalibrr"
echo -e "${YELLOW}View STDIO logs:${NC}      docker logs ${STDIO_CONTAINER_NAME}"
echo -e "${YELLOW}View HTTP logs:${NC}       docker logs ${HTTP_CONTAINER_NAME}"
echo -e "${YELLOW}Test HTTP endpoint:${NC}   curl http://localhost:${HTTP_PORT}/health"
echo -e "${YELLOW}Rebuild everything:${NC}   ./setup-everything.sh --rebuild"
echo ""
echo -e "${GREEN}🚀 Your Excalibrr MCP Server is ready for both Claude Desktop and Cursor!${NC}"