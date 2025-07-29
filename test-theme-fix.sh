#!/bin/bash
echo "Building MCP server with theme base fixes..."
npm run build

echo -e "\n\nTesting theme base file generation..."
node test-theme-base-fix.js
