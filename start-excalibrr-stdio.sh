#!/bin/bash

# Excalibrr MCP Server - STDIO Mode Setup
# For direct Claude Desktop integration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="excalibrr-mcp-stdio"
IMAGE_NAME="excalibrr-mcp"

echo -e "${BLUE}🚀 Excalibrr MCP Server - STDIO Mode${NC}"
echo -e "${BLUE}====================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if container already exists and remove it (STDIO containers should be ephemeral)
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🔄 Removing existing container...${NC}"
    docker stop ${CONTAINER_NAME} > /dev/null 2>&1 || true
    docker rm ${CONTAINER_NAME} > /dev/null 2>&1
fi

# Check if image exists
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:latest$"; then
    echo -e "${YELLOW}⚠️  Docker image not found. Building it now...${NC}"
    if [ -f "./build-docker.sh" ]; then
        chmod +x build-docker.sh
        ./build-docker.sh
    else
        echo -e "${RED}❌ build-docker.sh not found${NC}"
        exit 1
    fi
fi

# Create and start the container for STDIO mode
echo -e "${BLUE}🐳 Creating and starting Excalibrr MCP Server container...${NC}"

docker run -d \
    --name ${CONTAINER_NAME} \
    -v "$(pwd)/generated:/app/generated" \
    -v "$(pwd)/screenshots:/app/screenshots" \
    -v "$(pwd)/previews:/app/previews" \
    -e MCP_TRANSPORT=stdio \
    ${IMAGE_NAME}:latest \
    tail -f /dev/null

echo -e "${GREEN}✅ Container created successfully!${NC}"
echo ""
echo -e "${GREEN}🎉 Ready for Claude Desktop!${NC}"
echo ""
echo -e "${BLUE}📋 Claude Desktop Configuration:${NC}"
echo -e "${YELLOW}Add this to your ~/Library/Application\ Support/Claude/claude_desktop_config.json:${NC}"
echo ""
echo -e "${GREEN}{"
echo -e '  "mcpServers": {'
echo -e '    "excalibrr": {'
echo -e '      "command": "docker",'
echo -e '      "args": ["exec", "-i", "'${CONTAINER_NAME}'", "node", "build/index.js"]'
echo -e '    }'
echo -e '  }'
echo -e "}${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   📊 Test manually: ${YELLOW}docker run --rm -it ${IMAGE_NAME} node build/index.js${NC}"
echo -e "   🔄 Rebuild: ${YELLOW}./build-docker.sh && ./start-excalibrr-stdio.sh${NC}"
echo -e "   🗑️  Remove: ${YELLOW}docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}${NC}"
echo ""
echo -e "${GREEN}🎯 Container ready! Claude Desktop will start it automatically when needed.${NC}"
