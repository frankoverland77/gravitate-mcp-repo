#!/bin/bash

# Debug script to test file generation
echo "🔍 Debug: Testing File Generation"
echo "=================================="

echo "📍 Current location: $(pwd)"
echo "📂 Parent directory contents:"
ls -la ../

echo ""
echo "🐳 Docker container status:"
docker ps | grep excalibrr || echo "No excalibrr containers running"

echo ""
echo "🧪 Testing file creation manually..."

# Test 1: Can we create a file in parent directory?
echo "Test content" > ../test-generation.txt
if [ -f "../test-generation.txt" ]; then
    echo "✅ Can create files in parent directory"
    rm ../test-generation.txt
else
    echo "❌ Cannot create files in parent directory"
fi

# Test 2: If Docker is running, test inside container
if docker ps | grep -q excalibrr-mcp-stdio; then
    echo ""
    echo "🐳 Testing Docker container file access:"
    
    echo "Container environment:"
    docker exec excalibrr-mcp-stdio env | grep -E "(OUTPUT_DIR|NODE_ENV|PWD)"
    
    echo ""
    echo "Container /app/repos directory:"
    docker exec excalibrr-mcp-stdio ls -la /app/repos/ 2>/dev/null || echo "❌ /app/repos not accessible"
    
    echo ""
    echo "Testing file creation in container:"
    docker exec excalibrr-mcp-stdio touch /app/repos/docker-test.txt 2>/dev/null
    
    if [ -f "../docker-test.txt" ]; then
        echo "✅ Docker can create files that appear on host"
        rm ../docker-test.txt
    else
        echo "❌ Docker files don't appear on host"
    fi
else
    echo "❌ No Docker container running to test"
fi

echo ""
echo "🎯 Recommendations:"
echo "If ❌ issues found above, the problem is with Docker volume mounting"
echo "If ✅ tests pass, the problem is in the MCP server logic"
