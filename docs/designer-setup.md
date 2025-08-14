# 🎨 Excalibrr MCP Server - Complete Docker Setup

## What This Does

This gives you an AI assistant that knows your Excalibrr component library. You can ask Claude Desktop or Cursor to generate grids, forms, dashboards, and complete React projects using your components.

## 🚀 Super Simple Setup (3-5 minutes first time, 30 seconds after)

### Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Claude Desktop installed
- ✅ Cursor installed

### Step 1: Get the Code and Setup

```bash
# Clone the repository (replace with actual repo URL)
git clone [your-repo-url] excalibrr-mcp-server
cd excalibrr-mcp-server

# One command to rule them all! 🪄
./setup-everything.sh
```

That's it! The script will:

- Build the Docker image with Excalibrr library
- Set up containers for both Claude Desktop (STDIO) and Cursor (HTTP)
- Generate configuration files for both apps
- Show you exactly what to copy where

### Step 2: Copy Configurations

The setup script creates ready-to-use config files:

**For Claude Desktop:**

1. View the generated config:

   ```bash
   cat claude-desktop-config.json
   ```

2. Copy the contents to: `~/Library/Application Support/Claude/claude_desktop_config.json`

   **How to get there:**

   - Open Finder
   - Press `Cmd + Shift + G`
   - Type: `~/Library/Application Support/Claude/`
   - Create or edit `claude_desktop_config.json`
   - Paste the contents and save

**For Cursor:**

1. View the generated config:

   ```bash
   cat cursor-mcp-config.json
   ```

2. In Cursor:
   - Open Settings (Cmd + ,)
   - Search for "MCP"
   - Add the server configuration
   - Save settings

### Step 3: Restart Both Apps

- Close and reopen Claude Desktop completely
- Restart Cursor

### Step 4: Verify Setup (Optional)

```bash
# Quick verification that everything is working
./verify-setup.sh
```

This will check:

- ✅ Both containers are running
- ✅ HTTP endpoint is responding
- ✅ Configuration files are valid
- ✅ Everything is ready to go

## ✅ Test It Works

### In Claude Desktop:

- **"Show me available Excalibrr components"**
- **"Create a GraviGrid for displaying customer contracts"**
- **"Generate a dashboard with multiple data widgets"**

### In Cursor:

- Use `@excalibrr` to access the tools
- **"Generate a contracts grid using Excalibrr components"**
- **"Show me the component library"**

You should see both apps using the Excalibrr tools!

## 📋 Configuration Files (Copy-Paste Ready)

If you need to copy the configs manually, here are the exact contents:

### Claude Desktop Config

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

### Cursor Config

```json
{
  "mcpServers": {
    "excalibrr": {
      "url": "http://localhost:3001"
    }
  }
}
```

## 🎯 What You Can Ask For

### Generate Components

- "Create a data grid for energy contracts with columns for ID, counterparty, start date, end date, and value"
- "Build a form for editing customer information"
- "Generate a dashboard layout with three sections"

### Visual Previews

- "Show me what a GraviGrid looks like"
- "Create a screenshot of a Horizontal layout"
- "Generate a component gallery"

### Complete Projects

- "Create a working React app with a contracts grid"
- "Build a customer management interface"
- "Generate a full feature for my Gravitate project"

## 🐛 Troubleshooting

### "Docker command not found"

Make sure Docker Desktop is installed and running.

### "Container not found" or "No tools available"

Run the setup again:

```bash
./setup-everything.sh
```

### "No tools available in Claude Desktop"

1. Check your JSON config syntax at [jsonlint.com](https://jsonlint.com)
2. Make sure the container name matches: `excalibrr-mcp-stdio`
3. Restart Claude Desktop completely

### "No tools available in Cursor"

1. Check that the HTTP container is running: `docker ps | grep excalibrr-mcp-http`
2. Test the HTTP endpoint: `curl http://localhost:3001/health`
3. Restart Cursor

### Quick Health Check

```bash
# Check both containers are running
docker ps | grep excalibrr

# Test STDIO container (for Claude Desktop)
docker exec excalibrr-mcp-stdio node build/index.js

# Test HTTP container (for Cursor)
curl http://localhost:3001/health
```

## 🔧 Advanced Commands

### Rebuild Everything After Changes

```bash
./setup-everything.sh --rebuild
```

### View Logs

```bash
# Claude Desktop container (STDIO)
docker logs excalibrr-mcp-stdio

# Cursor container (HTTP)
docker logs excalibrr-mcp-http
```

### Clean Restart

```bash
# Stop and remove all containers
docker stop excalibrr-mcp-stdio excalibrr-mcp-http
docker rm excalibrr-mcp-stdio excalibrr-mcp-http

# Start fresh
./setup-everything.sh
```

---

## 🔧 Alternative: Local Development Setup (No Docker)

If you prefer to run without Docker:

### Prerequisites

- Node.js 16 or higher
- Claude Desktop installed

### Steps

```bash
# Install and build
npm install
npm run build

# Test it works
npm test
```

### Claude Desktop Config (Local)

```json
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["/absolute/path/to/excalibrr-mcp-server/build/index.js"],
      "env": {
        "EXCALIBRR_PATH": "/absolute/path/to/excalibrr",
        "USAGE_EXAMPLES_PATH": "/absolute/path/to/your-main-project"
      }
    }
  }
}
```

**Important:** Use absolute paths and update them to match your system!

---

🎯 **Choose your preferred setup:** Docker (recommended for simplicity) or local development (for more control).
