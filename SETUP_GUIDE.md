# 🚀 Complete Setup Guide - Excalibrr MCP Server

## 🎯 For Your Designer (Fresh Mac Setup)

### What This Does

This gives your designer an AI assistant (Claude Desktop) that knows your entire Excalibrr component library. They can ask Claude to generate grids, forms, dashboards, and complete React projects using your components.

### Prerequisites (5 minutes)

1. **Docker Desktop**

   - Download: https://www.docker.com/products/docker-desktop/
   - Install and start it (Docker whale icon should appear in menu bar)
   - **Important**: Docker must be running before proceeding

2. **Claude Desktop**

   - Download: https://claude.ai/download
   - Install the app

3. **Git and Terminal**
   - Git should already be installed on Mac
   - Use Terminal app (or iTerm2)

### Step 1: Get the Code (2 minutes)

```bash
# Open Terminal and navigate to where you want the project
cd ~/repos  # or wherever you keep code

# Clone BOTH repositories
git clone [YOUR_EXCALIBRR_MCP_SERVER_REPO_URL] excalibrr-mcp-server
git clone [YOUR_EXCALIBRR_LIBRARY_REPO_URL] excalibrr

# Navigate to the MCP server
cd excalibrr-mcp-server
```

**Directory structure should look like:**

```
~/repos/
  ├── excalibrr/              # The component library
  └── excalibrr-mcp-server/   # This MCP server
```

### Step 2: Build and Setup (3 minutes)

```bash
# Make scripts executable
chmod +x *.sh

# Build the Docker image (includes Excalibrr library)
./build-docker.sh

# Setup for Claude Desktop (creates the container)
./start-excalibrr-stdio.sh
```

The build script will automatically find your Excalibrr library in common locations.

### Step 3: Configure Claude Desktop (1 minute)

The setup script will show you exactly what to add to Claude Desktop.

**Copy this config into** `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "excalibrr": {
      "command": "docker",
      "args": ["exec", "-i", "excalibrr-mcp-stdio", "node", "build/index.js"]
    }
  }
}
```

**To edit this file:**

```bash
# Open in default editor
open "~/Library/Application Support/Claude/claude_desktop_config.json"

# Or edit with nano
nano "~/Library/Application Support/Claude/claude_desktop_config.json"
```

### Step 4: Start Using It! (0 minutes)

1. **Restart Claude Desktop completely** (Quit and reopen)
2. Wait about 30 seconds for the connection to establish
3. You should see a hammer icon (🔨) in Claude Desktop indicating MCP tools are available

---

## 🔧 For You (Troubleshooting Your Current Setup)

Your setup looks mostly correct! Here's what to check:

### Quick Diagnosis

```bash
# Check if Docker is running
docker ps | grep excalibrr

# Check if the image exists
docker images | grep excalibrr

# Check your Claude config
cat "~/Library/Application Support/Claude/claude_desktop_config.json"
```

### Most Likely Issues

#### 1. Claude Desktop Needs Full Restart

- **Quit Claude Desktop completely** (Cmd+Q, not just close window)
- Wait 10 seconds
- Reopen Claude Desktop
- Wait 30 seconds for MCP connection

#### 2. Container Name Mismatch

Your container might have a slightly different name. Check with:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

If the container name is different from `excalibrr-mcp-stdio`, update your Claude config.

#### 3. MCP Server Not Responding

Test the server manually:

```bash
# This should show MCP server output
docker exec -i excalibrr-mcp-stdio node build/index.js
```

### Quick Fix Commands

```bash
# Rebuild everything from scratch
./build-docker.sh && ./start-excalibrr-stdio.sh

# Or restart just the container
docker stop excalibrr-mcp-stdio
docker rm excalibrr-mcp-stdio
./start-excalibrr-stdio.sh
```

---

## ✅ Test That It's Working

In Claude Desktop, try these exact phrases:

- **"Show me available Excalibrr components"**
- **"What components are in the Excalibrr library?"**
- **"Create a GraviGrid for displaying customer data"**

You should see:

- 🔨 Hammer icon in Claude Desktop
- Claude using tools to search your components
- Detailed responses about your Excalibrr library

---

## 🎯 What Your Designer Can Ask For

### Component Discovery

- "What layout components are available?"
- "Show me all data grid components"
- "Find components for forms"

### Code Generation

- "Create a GraviGrid for energy contracts with columns for ID, counterparty, start date, end date, and value"
- "Build a customer information form"
- "Generate a dashboard with three widget sections"

### Visual Previews

- "Show me what a GraviGrid looks like"
- "Create a preview of the Horizontal layout component"
- "Generate screenshots of available components"

### Complete Projects

- "Create a working React app with a contracts management interface"
- "Build a customer dashboard using Excalibrr components"
- "Generate a complete feature for my Gravitate project"

---

## 🐛 Common Issues & Solutions

### "Docker command not found"

- Install Docker Desktop and ensure it's running
- Restart Terminal after Docker installation

### "Container not found"

```bash
./start-excalibrr-stdio.sh
```

### "No tools available in Claude"

1. Check JSON syntax at jsonlint.com
2. Ensure container name matches: `excalibrr-mcp-stdio`
3. **Fully restart Claude Desktop** (most common fix)
4. Wait 30 seconds after restart

### "Excalibrr library not found"

- Ensure both `excalibrr` and `excalibrr-mcp-server` are cloned
- Check the directory structure matches the example above
- The build script auto-detects common locations

### "Permission denied"

```bash
chmod +x *.sh
```

### Performance Issues

- Docker Desktop should have at least 4GB RAM allocated
- Close other heavy applications while building

---

## 🔄 Updating After Changes

When you update the Excalibrr library or MCP server:

```bash
# Full rebuild (recommended)
./build-docker.sh && ./start-excalibrr-stdio.sh

# Quick restart (if only MCP server changed)
docker restart excalibrr-mcp-stdio
```

---

## 🆘 Still Having Issues?

1. **Check Docker logs:**

   ```bash
   docker logs excalibrr-mcp-stdio
   ```

2. **Test manual connection:**

   ```bash
   docker run --rm -it excalibrr-mcp node build/index.js
   ```

3. **Verify Claude Desktop logs:**

   - Open Claude Desktop
   - Go to Settings → Advanced → View Logs

4. **Complete reset:**
   ```bash
   docker stop excalibrr-mcp-stdio
   docker rm excalibrr-mcp-stdio
   docker rmi excalibrr-mcp
   ./build-docker.sh && ./start-excalibrr-stdio.sh
   ```

---

**🎉 Once working, your designer will have a powerful AI assistant that knows your entire component library!**
