# 🚀 Excalibrr MCP Server Setup Guide

## What This Is

A Model Context Protocol (MCP) server that enables Claude Code to create and manage Excalibrr component demos. user can use natural language to generate forms, grids, and apply themes.

## 🎯 Quick Setup (5 minutes)

### Prerequisites

- Node.js 16 or higher
- Claude Code (part of Claude desktop)
- This repository cloned locally

### Step 1: Build the MCP Server

```bash
# In the repo root
cd mcp-server
npm install
npm run build
```

### Step 2: Configure Claude

The MCP server is already configured in `.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "excalibrr": {
      "command": "node",
      "args": ["./mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

That's it! Claude Code automatically discovers this configuration.

### Step 3: Start the Demo Server

```bash
# In the repo root
yarn dev
```

This starts the demo showcase on `http://localhost:3000`

## ✅ Test It Works

Open Claude Code and try:

- **"Create a product form with name, price, and category fields"**
- **"Make a customer grid with editable columns"**
- **"Change the ProductGrid theme to PE"**
- **"Clean up the test demo I just created"**

You should see the MCP server creating demos automatically!

## 🛠️ Available Tools

The MCP server provides these tools to Claude:

- **`create_form_demo`** - Creates form components with validation
- **`create_demo`** - Creates grids/forms from natural language
- **`change_theme`** - Switches between OSP, PE, BP themes
- **`modify_grid`** - Adds columns and makes grids editable
- **`cleanup_demo`** - Removes demos and cleans up references

## 🎨 What user Can Create

### Forms

- Product management forms
- Customer registration
- Inventory tracking
- User profiles

### Grids

- Data tables with sorting/filtering
- Editable data grids
- Product catalogs
- Customer lists

### Themes

- OSP (default blue)
- PE (Pricing Engine)
- BP (Business Platform)
- 14 total themes available

## 🐛 Troubleshooting

### "No MCP tools available"

1. Check the MCP server built successfully:

   ```bash
   cd mcp-server && npm run build
   ```

2. Restart Claude Code completely

### "Demo not showing in navigation"

The demo was created but navigation wasn't updated. This is expected - demos are created as files but may need manual navigation setup.

### "Theme not applying"

Make sure to specify the exact theme name: `OSP`, `PE`, or `BP` (case-sensitive).

### Quick Health Check

```bash
# Verify build exists
ls mcp-server/build/index.js

# Test the server can start
cd mcp-server && node build/index.js --version
```

## 📁 Project Structure

```
excalibrr-mcp-server/
├── .claude/.mcp.json          # Claude MCP configuration
├── mcp-server/                 # MCP server implementation
│   ├── src/                   # TypeScript source
│   ├── build/                 # Compiled JavaScript
│   └── package.json
├── demo/                      # React demo showcase
│   ├── src/pages/demos/       # Generated demos appear here
│   └── src/pageConfig.tsx     # Navigation configuration
└── docs/                      # Documentation
```

## 💡 Pro Tips

1. **Be Specific**: "Create a product form with name, price, category" vs "create a form"
2. **Use Clear Names**: "ProductForm" is better than "TestForm"
3. **Test Incrementally**: Start simple, then add complexity
4. **Clean Up**: Use cleanup tool to remove test demos

---

**Ready to build demos!** 🎨
