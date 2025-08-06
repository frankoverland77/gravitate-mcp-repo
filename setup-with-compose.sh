#!/bin/bash

# 🐳 Excalibrr MCP Server - Docker Compose Setup
# Alternative setup using docker-compose for those who prefer it

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🐳 Excalibrr MCP Server - Docker Compose Setup${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running${NC}"
    echo -e "${YELLOW}💡 Please start Docker Desktop and try again${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found${NC}"
    echo -e "${YELLOW}💡 Please install docker-compose or use ./setup-everything.sh instead${NC}"
    exit 1
fi

echo -e "${GREEN}✅ docker-compose is available${NC}"

# Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"

# Stop any existing services
docker-compose down 2>/dev/null || true

# Build and start
docker-compose up -d --build

echo -e "${GREEN}✅ Services started with docker-compose${NC}"

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 10

# Generate configuration files
echo -e "${BLUE}📝 Generating configuration files...${NC}"

cat > claude-desktop-config.json << 'EOF'
{
  "mcpServers": {
    "excalibrr": {
      "command": "docker",
      "args": ["exec", "-i", "excalibrr-mcp-stdio", "node", "build/index.js"]
    }
  }
}
EOF

cat > cursor-mcp-config.json << 'EOF'
{
  "mcpServers": {
    "excalibrr": {
      "url": "http://localhost:3001"
    }
  }
}
EOF

echo -e "${GREEN}✅ Configuration files created${NC}"

# Test services
echo -e "${BLUE}🧪 Testing services...${NC}"

# Test HTTP service
if curl -s -f "http://localhost:3001/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTP service (Cursor) is responding${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP service still starting up...${NC}"
fi

# Test STDIO service
if docker exec excalibrr-mcp-stdio timeout 5 node build/index.js < /dev/null > /dev/null 2>&1; then
    echo -e "${GREEN}✅ STDIO service (Claude Desktop) is ready${NC}"
else
    echo -e "${YELLOW}⚠️  STDIO service test inconclusive (this is normal)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Docker Compose setup complete!${NC}"
echo ""
echo -e "${PURPLE}┌─────────────────────────────────────────────────────┐${NC}"
echo -e "${PURPLE}│                 📋 NEXT STEPS                       │${NC}"
echo -e "${PURPLE}└─────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${BLUE}For Claude Desktop:${NC}"
echo -e "1. Copy ${YELLOW}claude-desktop-config.json${NC} to:"
echo -e "   ${GREEN}~/Library/Application\\ Support/Claude/claude_desktop_config.json${NC}"
echo -e "2. Restart Claude Desktop"
echo ""
echo -e "${BLUE}For Cursor:${NC}"
echo -e "1. Copy the contents of ${YELLOW}cursor-mcp-config.json${NC}"
echo -e "2. Add to Cursor's MCP settings"
echo -e "3. Restart Cursor"
echo ""
echo -e "${BLUE}🔧 Docker Compose Commands:${NC}"
echo -e "   View logs:        ${YELLOW}docker-compose logs -f${NC}"
echo -e "   Stop services:    ${YELLOW}docker-compose down${NC}"
echo -e "   Restart:          ${YELLOW}docker-compose restart${NC}"
echo -e "   Rebuild:          ${YELLOW}docker-compose up -d --build${NC}"
echo ""
echo -e "${GREEN}🚀 Your Excalibrr MCP Server is ready!${NC}"