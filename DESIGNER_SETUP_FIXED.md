# 🚀 Designer Setup Guide - Fixed Version

## Prerequisites
1. Both repositories should be in the same parent folder:
```
your-projects/
├── excalibrr/                    # The Excalibrr library repo
└── excalibrr-mcp-server/        # This MCP server repo
```

## Quick Setup (3 minutes)

### Step 1: Build & Start
```bash
cd excalibrr-mcp-server
chmod +x *.sh
./build-docker.sh
./start-excalibrr.sh
```

### Step 2: Configure Claude Desktop
Add this to your Claude Desktop config:
```json
{
  "mcpServers": {
    "excalibrr-mcp-server": {
      "command": "docker",
      "args": [
        "exec", "-i", "excalibrr-mcp-stdio", 
        "node", "/app/mcp-server/build/index.js"
      ]
    }
  }
}
```

### Step 3: Test
Restart Claude Desktop and try:
- "Generate a grid for managing contracts"
- "Show me examples of the GraviGrid component"
- "Create a dashboard with filtering"

## What's Fixed
✅ **Path Independence**: No more hardcoded `/Users/rebecca.hirai/` paths
✅ **Sibling Directory Support**: Works with `../excalibrr` mounting
✅ **Docker Volumes**: Properly mounts the Excalibrr library
✅ **Cross-Platform**: Works on any machine with same folder structure

## Expected Output
When working correctly, you should get:
- ✅ **GraviGrid components** (not generic HTML)
- ✅ **Horizontal/Vertical layouts** (not divs)
- ✅ **Proper TypeScript** with Excalibrr imports
- ✅ **Working React projects** you can run with `yarn dev`

## Troubleshooting

### "No components found" or generating HTML divs instead of Excalibrr components:
```bash
# Check if Excalibrr is mounted correctly
docker exec excalibrr-mcp-stdio ls -la /app/excalibrr

# Should show the Excalibrr library files, not empty directory
```

### Still getting generic HTML instead of GraviGrid:
```bash
# Rebuild with latest fixes
./build-docker.sh
docker-compose down
docker-compose up -d
```

### Path issues:
Ensure your folder structure is:
```
parent-folder/
├── excalibrr/           ← Must be here
└── excalibrr-mcp-server/ ← Run commands from here
```

## What to Expect
The MCP server will now generate **proper Excalibrr code** like:
```tsx
import { GraviGrid } from '@gravitate-js/excalibrr'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'

// Not generic HTML divs!
```

🎯 **If you're still getting div/HTML output instead of Excalibrr components, the paths aren't working correctly.**
