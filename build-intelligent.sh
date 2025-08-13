#!/bin/bash

# Build and test the intelligent MCP server

echo "🔨 Building Excalibrr MCP Server - Intelligent Mode"
echo "=================================================="

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build TypeScript
echo "🔧 Compiling TypeScript..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Run the test
echo "🧪 Running intelligent mode test..."
echo "=================================================="
node test-orchestration.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Intelligent MCP Server is ready!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Restart Claude Desktop or Cursor"
    echo "2. Try: 'Create a product grid in Admin module with OSP theme'"
    echo "3. Check INTELLIGENT_MODE_GUIDE.md for more examples"
else
    echo "❌ Tests failed. Please check the errors above."
    exit 1
fi
