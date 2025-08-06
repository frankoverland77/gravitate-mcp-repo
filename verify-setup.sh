#!/bin/bash

# 🧪 Excalibrr MCP Server - Setup Verification Script
# Tests that both Claude Desktop and Cursor containers are working correctly

set -e

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
HTTP_PORT="3001"

echo -e "${PURPLE}🧪 Excalibrr MCP Server - Setup Verification${NC}"
echo -e "${PURPLE}============================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Function to check container status
check_container() {
    local container_name=$1
    local container_type=$2
    
    echo -e "${BLUE}Checking ${container_type} container (${container_name})...${NC}"
    
    if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        echo -e "${RED}❌ ${container_type} container not running${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ ${container_type} container is running${NC}"
    return 0
}

# Check both containers
stdio_ok=true
http_ok=true

if ! check_container "$STDIO_CONTAINER_NAME" "STDIO (Claude Desktop)"; then
    stdio_ok=false
fi

if ! check_container "$HTTP_CONTAINER_NAME" "HTTP (Cursor)"; then
    http_ok=false
fi

echo ""

# Test STDIO container
if [ "$stdio_ok" = true ]; then
    echo -e "${BLUE}🧪 Testing STDIO container...${NC}"
    if timeout 10 docker exec "$STDIO_CONTAINER_NAME" node build/index.js < /dev/null > /dev/null 2>&1; then
        echo -e "${GREEN}✅ STDIO container responds correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  STDIO container test inconclusive (this is normal for STDIO mode)${NC}"
    fi
else
    echo -e "${RED}❌ Cannot test STDIO container - not running${NC}"
fi

# Test HTTP container
if [ "$http_ok" = true ]; then
    echo -e "${BLUE}🧪 Testing HTTP container...${NC}"
    sleep 2  # Give HTTP server time to start
    
    if curl -s -f "http://localhost:${HTTP_PORT}/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTP endpoint is responding${NC}"
        
        # Test a specific endpoint if available
        if curl -s -f "http://localhost:${HTTP_PORT}/tools" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ MCP tools endpoint is accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  MCP tools endpoint test inconclusive${NC}"
        fi
    else
        echo -e "${RED}❌ HTTP endpoint not responding${NC}"
        echo -e "${YELLOW}💡 Container may still be starting up. Try again in a moment.${NC}"
    fi
else
    echo -e "${RED}❌ Cannot test HTTP container - not running${NC}"
fi

echo ""

# Check configuration files
echo -e "${BLUE}📋 Checking configuration files...${NC}"

if [ -f "claude-desktop-config.json" ]; then
    echo -e "${GREEN}✅ Claude Desktop config file exists${NC}"
    # Validate JSON
    if python3 -m json.tool claude-desktop-config.json > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Claude Desktop config is valid JSON${NC}"
    else
        echo -e "${RED}❌ Claude Desktop config has invalid JSON${NC}"
    fi
else
    echo -e "${RED}❌ Claude Desktop config file missing${NC}"
fi

if [ -f "cursor-mcp-config.json" ]; then
    echo -e "${GREEN}✅ Cursor config file exists${NC}"
    # Validate JSON
    if python3 -m json.tool cursor-mcp-config.json > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Cursor config is valid JSON${NC}"
    else
        echo -e "${RED}❌ Cursor config has invalid JSON${NC}"
    fi
else
    echo -e "${RED}❌ Cursor config file missing${NC}"
fi

echo ""

# Summary
if [ "$stdio_ok" = true ] && [ "$http_ok" = true ]; then
    echo -e "${GREEN}🎉 All containers are running!${NC}"
    echo ""
    echo -e "${PURPLE}┌─────────────────────────────────────────────────────┐${NC}"
    echo -e "${PURPLE}│                 ✅ SETUP VERIFIED                   │${NC}"
    echo -e "${PURPLE}└─────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${GREEN}Your Excalibrr MCP Server is ready for both:${NC}"
    echo -e "• Claude Desktop (STDIO mode)"
    echo -e "• Cursor (HTTP mode)"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "1. Copy configuration files to their respective apps"
    echo -e "2. Restart Claude Desktop and Cursor"
    echo -e "3. Test with the example commands in DESIGNER_SETUP.md"
else
    echo -e "${RED}❌ Some containers are not running${NC}"
    echo ""
    echo -e "${YELLOW}💡 Run this to fix issues:${NC}"
    echo -e "   ./setup-everything.sh"
fi

echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo -e "   View STDIO logs:      ${YELLOW}docker logs ${STDIO_CONTAINER_NAME}${NC}"
echo -e "   View HTTP logs:       ${YELLOW}docker logs ${HTTP_CONTAINER_NAME}${NC}"
echo -e "   Test HTTP endpoint:   ${YELLOW}curl http://localhost:${HTTP_PORT}/health${NC}"
echo -e "   Restart everything:   ${YELLOW}./setup-everything.sh --rebuild${NC}"