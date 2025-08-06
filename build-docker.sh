#!/bin/bash

# Excalibrr MCP Server - Docker Build Script  
# Builds the MCP server without copying Excalibrr (uses volume mounts)

set -e  # Exit on any error

# 🔒 VERSION CONTROL
EXCALIBRR_VERSION="v4.0.34-osp"    
MCP_VERSION="1.0.0"                
EXAMPLES_VERSION="built-in"        

# Build metadata
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VCS_REF=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m' 
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🐳 Building Excalibrr MCP Server (Volume Mount Version)${NC}"
echo -e "${BLUE}======================================================${NC}"
echo ""
echo -e "📦 ${YELLOW}Excalibrr Library:${NC} ${EXCALIBRR_VERSION} (mounted at runtime)"
echo -e "🤖 ${YELLOW}MCP Server:${NC}        ${MCP_VERSION}"
echo -e "🏗️  ${YELLOW}Build Date:${NC}        ${BUILD_DATE}"
echo ""

# Validate that Excalibrr exists as sibling directory
if [ ! -d "../excalibrr" ]; then
    echo -e "${RED}❌ ERROR: ../excalibrr directory not found${NC}"
    echo -e "${YELLOW}💡 Required folder structure:${NC}"
    echo -e "   parent-folder/"
    echo -e "   ├── excalibrr/                    ← Must exist here"
    echo -e "   └── excalibrr-mcp-server/         ← You are here"
    echo ""
    echo -e "${YELLOW}🔧 To fix: Clone excalibrr repo as a sibling directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found Excalibrr at ../excalibrr${NC}"

# Create required directories
echo -e "${BLUE}📁 Creating required directories...${NC}"
mkdir -p generated screenshots previews
echo -e "${GREEN}✅ Directories created${NC}"

# Create .env file for docker-compose
cat > .env << EOF
EXCALIBRR_VERSION=${EXCALIBRR_VERSION}
BUILD_DATE=${BUILD_DATE} 
VCS_REF=${VCS_REF}
EOF

echo -e "${BLUE}🔨 Building MCP server Docker image...${NC}"

# Build the Docker image (no Excalibrr copying required)
docker build \
  --build-arg EXCALIBRR_VERSION=${EXCALIBRR_VERSION} \
  --build-arg BUILD_DATE=${BUILD_DATE} \
  --build-arg VCS_REF=${VCS_REF} \
  -t excalibrr-mcp:${MCP_VERSION} \
  -t excalibrr-mcp:latest \
  .

echo ""
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo -e "   ${YELLOW}1. Start server:${NC}    ./start-excalibrr.sh"
echo -e "   ${YELLOW}2. Test in Claude:${NC}   'Generate a grid component'"
echo -e "   ${YELLOW}3. Check logs:${NC}       docker-compose logs -f"
echo ""
echo -e "${BLUE}📋 What's included:${NC}"
echo -e "   • MCP server with proper Excalibrr component generation"
echo -e "   • Volume mount to ../excalibrr (live library access)"
echo -e "   • All paths fixed for cross-platform compatibility"
echo -e "   • Ready for any developer's machine"
echo ""
echo -e "${GREEN}🎯 Ready to test!${NC}"
