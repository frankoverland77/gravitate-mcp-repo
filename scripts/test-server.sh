#!/bin/bash

# Excalibrr MCP Server Test Script
# This script tests the basic functionality of your MCP server

echo "🚀 Testing Excalibrr MCP Server..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Build directory not found. Running npm run build..."
    npm run build
fi

# Check if the built server exists
if [ ! -f "build/index.js" ]; then
    echo "❌ Server build not found at build/index.js"
    exit 1
fi

echo "✅ Server build found"

# Test 1: Check if server starts
echo
echo "🧪 Test 1: Server startup..."
timeout 3s node build/index.js > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server starts successfully"
    kill $SERVER_PID > /dev/null 2>&1
else
    echo "❌ Server failed to start"
    exit 1
fi

# Test 2: Test tools list
echo
echo "🧪 Test 2: Testing tools list..."
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node build/index.js | grep -q "discover_components"
if [ $? -eq 0 ]; then
    echo "✅ Tools list working - found discover_components"
else
    echo "❌ Tools list failed"
    exit 1
fi

# Test 3: Test component discovery
echo
echo "🧪 Test 3: Testing component discovery..."
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "discover_components", "arguments": {}}}' | node build/index.js | grep -q "Found.*components"
if [ $? -eq 0 ]; then
    echo "✅ Component discovery working"
else
    echo "❌ Component discovery failed"
    exit 1
fi

# Test 4: Test component details
echo
echo "🧪 Test 4: Testing component details..."
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get_component_details", "arguments": {"componentName": "Horizontal"}}}' | node build/index.js | grep -q "Props"
if [ $? -eq 0 ]; then
    echo "✅ Component details working"
else
    echo "❌ Component details failed"
    exit 1
fi

echo
echo "🎉 All tests passed! Your Excalibrr MCP Server is ready to use."
echo
echo "Next steps:"
echo "1. Configure Claude Desktop with the provided config"
echo "2. Restart Claude Desktop"
echo "3. Ask Claude: 'What components are available in Excalibrr?'"
echo