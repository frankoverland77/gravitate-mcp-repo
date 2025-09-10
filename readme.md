# Excalibrr Workspace

**Monorepo for Excalibrr MCP Server and Demo Project**

This workspace enables user to generate production-quality Excalibrr demos using natural language in Claude Code.

## 🚀 Quick Start

```bash
# One-time setup
./setup.sh

# Start developing
yarn dev                    # Start demo project
claude --chat             # In Cursor terminal
# Say: "Create a product grid with editing"
```

## 📂 Structure

```
excalibrr-workspace/
├── mcp-server/            # MCP server with tools
│   ├── src/
│   │   ├── tools/         # Demo generation tools
│   │   ├── knowledge/     # Production patterns
│   │   └── templates/     # Code templates
│   └── package.json
│
├── demo/                  # Demo project (user works here)
│   ├── src/
│   │   ├── components/shared/  # Theme system from production
│   │   └── pages/demos/        # Generated demos
│   ├── vite.config.js     # Production Vite config
│   └── package.json       # Production dependencies
│
└── docs/                  # Rules and conventions
    ├── rules/             # .mdc rule files
    └── development/       # Coding conventions
```

## 🎯 For user

**Your workflow:**
1. Open Cursor: `code .`
2. Start demo: `yarn dev` 
3. Terminal: `claude --chat`
4. Create demos: *"Create inventory grid with inline editing"*

**The MCP server will:**
- Generate real Excalibrr components
- Use production patterns and themes
- Apply your coding rules automatically
- Create working demos instantly

## 🛠 Commands

```bash
# Workspace commands
yarn setup              # One-time setup
yarn dev                # Start demo project  
yarn build:mcp          # Build MCP server

# Demo project commands (in demo/)
yarn dev                # Start dev server
yarn dev:clean          # Kill existing + start fresh
yarn dev:check          # Check server status
yarn stop               # Stop dev server
```

## 📋 Rules Integration

The MCP server automatically applies rules from `docs/rules/`:
- ✅ Use Excalibrr components (no HTML elements)
- ✅ Apply theme variables (no hardcoded colors)
- ✅ Follow production patterns
- ✅ Generate realistic mock data

## 🎨 Themes

Supports all production themes:
- **OSP** - Blue theme
- **PE** - Teal/Green theme  
- **BP** - Green theme
- Plus 10+ others from production

## 🔧 Development

```bash
# MCP server development
cd mcp-server
yarn dev                # Watch mode

# Add new tools in mcp-server/src/tools/
# Add new templates in mcp-server/src/templates/
# Add new knowledge in mcp-server/src/knowledge/
```