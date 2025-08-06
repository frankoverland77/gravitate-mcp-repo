#!/bin/bash

# Excalibrr MCP Server - Complete Setup Script
# One-command setup for designers and developers

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="excalibrr-mcp-server"
IMAGE_NAME="excalibrr-mcp"
PORT="3000"

echo -e "${BLUE}🚀 Excalibrr MCP Server - Setup${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}⚠️  Container '${CONTAINER_NAME}' already exists${NC}"
    
    # Check if it's running
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${GREEN}✅ Server is already running!${NC}"
        echo -e "${BLUE}🔗 Access at: http://localhost:${PORT}${NC}"
        echo -e "${BLUE}🏥 Health check: http://localhost:${PORT}/health${NC}"
        echo ""
        echo -e "${YELLOW}To restart: docker restart ${CONTAINER_NAME}${NC}"
        echo -e "${YELLOW}To stop: docker stop ${CONTAINER_NAME}${NC}"
        echo -e "${YELLOW}To remove: docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}${NC}"
        exit 0
    else
        echo -e "${YELLOW}🔄 Starting existing container...${NC}"
        docker start ${CONTAINER_NAME}
        echo -e "${GREEN}✅ Server started!${NC}"
        echo -e "${BLUE}🔗 Access at: http://localhost:${PORT}${NC}"
        exit 0
    fi
fi

# Check if image exists
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^${IMAGE_NAME}:latest$"; then
    echo -e "${YELLOW}⚠️  Docker image not found. You need to build it first.${NC}"
    echo -e "${BLUE}💡 Run the following commands:${NC}"
    echo -e "   ${YELLOW}chmod +x build-docker.sh${NC}"
    echo -e "   ${YELLOW}./build-docker.sh${NC}"
    echo -e "   ${YELLOW}./start-excalibrr.sh${NC}"
    exit 1
fi

# Create necessary directories for volumes
echo -e "${BLUE}📁 Creating volume directories...${NC}"
mkdir -p ./generated ./screenshots ./previews

# Start the container
echo -e "${BLUE}🐳 Starting Excalibrr MCP Server...${NC}"

docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:3000 \
    -v "$(pwd)/generated:/app/generated" \
    -v "$(pwd)/screenshots:/app/screenshots" \
    -v "$(pwd)/previews:/app/previews" \
    --restart unless-stopped \
    ${IMAGE_NAME}:latest

# Wait for container to be ready
echo -e "${BLUE}⏳ Waiting for server to start...${NC}"
sleep 5

# Health check
for i in {1..12}; do
    if curl -s http://localhost:${PORT}/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Server is healthy and ready!${NC}"
        break
    else
        if [ $i -eq 12 ]; then
            echo -e "${RED}❌ Server failed to start properly${NC}"
            echo -e "${YELLOW}💡 Check logs with: docker logs ${CONTAINER_NAME}${NC}"
            exit 1
        fi
        echo -e "${YELLOW}⏳ Still waiting... (${i}/12)${NC}"
        sleep 5
    fi
done

echo ""
echo -e "${GREEN}🎉 Excalibrr MCP Server is running!${NC}"
echo ""
echo -e "${BLUE}📋 Server Information:${NC}"
echo -e "   🌐 URL: http://localhost:${PORT}"
echo -e "   🏥 Health: http://localhost:${PORT}/health"  
echo -e "   🤖 MCP Endpoint: http://localhost:${PORT}/mcp"
echo -e "   📦 Container: ${CONTAINER_NAME}"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo -e "   📊 View logs: ${YELLOW}docker logs ${CONTAINER_NAME} -f${NC}"
echo -e "   🔄 Restart: ${YELLOW}docker restart ${CONTAINER_NAME}${NC}"
echo -e "   ⏹️  Stop: ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
echo -e "   🗑️  Remove: ${YELLOW}docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}${NC}"
echo ""
echo -e "${BLUE}🔗 Claude Desktop Configuration:${NC}"
echo -e "${YELLOW}Add this to your claude_desktop_config.json:${NC}"
echo ""
echo -e "${GREEN}{"
echo -e '  "mcpServers": {'
echo -e '    "excalibrr": {'
echo -e '      "command": "curl",'
echo -e '      "args": ['
echo -e '        "-X", "POST",'
echo -e '        "-H", "Content-Type: application/json",'
echo -e '        "-d", "@-",'
echo -e "        \"http://localhost:${PORT}/mcp\""
echo -e '      ]'
echo -e '    }'
echo -e '  }'
echo -e "}${NC}"
echo ""
echo -e "${GREEN}🎯 Ready for AI-powered Excalibrr assistance!${NC}"

# Test health endpoint and show result
echo ""
echo -e "${BLUE}🔍 Quick Health Check:${NC}"
curl -s http://localhost:${PORT}/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:${PORT}/health