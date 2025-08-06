#!/bin/bash

# Excalibrr MCP Server - HTTP Mode for Cursor
# Runs the server as an HTTP endpoint

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="excalibrr-mcp-http"
IMAGE_NAME="excalibrr-mcp"
HTTP_PORT="3001"

echo -e "${BLUE}🚀 Excalibrr MCP Server - HTTP Mode for Cursor${NC}"
echo -e "${BLUE}=============================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Stop existing HTTP container if running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🔄 Stopping existing HTTP container...${NC}"
    docker stop ${CONTAINER_NAME} > /dev/null 2>&1
fi

# Remove existing HTTP container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🔄 Removing existing HTTP container...${NC}"
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

# Start the container in HTTP mode
echo -e "${BLUE}🐳 Starting Excalibrr MCP Server in HTTP mode...${NC}"

docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${HTTP_PORT}:3000 \
    -v "$(pwd)/generated:/app/generated" \
    -v "$(pwd)/screenshots:/app/screenshots" \
    -v "$(pwd)/previews:/app/previews" \
    -e MCP_TRANSPORT=http \
    -e PORT=3000 \
    ${IMAGE_NAME}:latest

echo -e "${GREEN}✅ Container started successfully!${NC}"
echo ""
echo -e "${GREEN}🎉 Ready for Cursor!${NC}"
echo ""
echo -e "${BLUE}📋 Cursor MCP Configuration:${NC}"
echo -e "${YELLOW}Add this to your Cursor MCP settings:${NC}"
echo ""
echo -e "${GREEN}{"
echo -e '  "mcpServers": {'
echo -e '    "excalibrr": {'
echo -e '      "url": "http://localhost:'${HTTP_PORT}'"'
echo -e '    }'
echo -e '  }'
echo -e "}${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "   🌐 Test HTTP endpoint: ${YELLOW}curl http://localhost:${HTTP_PORT}/health${NC}"
echo -e "   📊 View logs: ${YELLOW}docker logs ${CONTAINER_NAME}${NC}"
echo -e "   🔄 Restart: ${YELLOW}docker restart ${CONTAINER_NAME}${NC}"
echo -e "   🗑️  Stop: ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
echo ""
echo -e "${GREEN}🎯 Server running at http://localhost:${HTTP_PORT}${NC}"