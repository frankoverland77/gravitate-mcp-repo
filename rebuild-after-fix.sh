#!/bin/bash
echo "Rebuilding MCP server with syntax fix..."
cd /Users/rebecca.hirai/repos/excalibrr-mcp-server
npm run build

echo -e "\n\nTesting theme generation after fix..."
node test-theme-base-fix.js

echo -e "\n\nDone! The syntax error in core.less has been fixed."
echo "The extra closing brace '}' has been removed from the input[type='number'] style."
