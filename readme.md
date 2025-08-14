# Excalibrr MCP Server

An MCP (Model Context Protocol) server that enables AI assistants to discover, explore, and understand components in your Excalibrr design system library.

## 🚀 Quick Start

### 🐳 Docker Setup (Recommended for Designers)

**Super simple setup that works with both Claude Desktop and Cursor:**

```bash
# Clone and setup everything
git clone <your-repo-url>
cd excalibrr-mcp-server
./setup-everything.sh
```

This creates Docker containers for:

- **Claude Desktop** (STDIO mode)
- **Cursor** (HTTP mode)

See [DESIGNER_SETUP.md](DESIGNER_SETUP.md) for the complete step-by-step guide.

### ⚡ Alternative Docker Setup

Using docker-compose:

```bash
./setup-with-compose.sh
```

### 🔧 Alternative: Local Development Setup

For developers who prefer to run without Docker:

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Test it works
npm test

# Configure Claude Desktop manually (see DESIGNER_SETUP.md for path setup)
```

## 🎯 What It Does

This MCP server gives AI assistants (like Claude) the ability to:

- **📋 Discover Components**: Find all 112+ components in your Excalibrr library
- **🔍 Search Components**: Search by name, category, or functionality
- **📖 Get Detailed Info**: View props, descriptions, and real usage examples
- **🎨 Understand Design Patterns**: See how components are used in your actual codebase

## 🛠️ Available Tools

### `discover_components`

Lists all available components with categories and descriptions.

**Example**: _"What components are available in Excalibrr?"_

### `get_component_details`

Gets detailed information about a specific component including props and usage examples.

**Example**: _"Show me details about the GraviGrid component"_

### `search_components`

Search for components by name, functionality, or category.

**Example**: _"Find all layout components"_

## 📂 Repository Structure

```
excalibrr-mcp-server/
├── src/
│   └── index.ts                          # Main server code
├── docs/                                 # Documentation
│   ├── SETUP.md                         # Detailed setup guide
│   ├── DESIGNER_PROMPTS.md              # Example questions
│   └── claude-desktop-config.example.json # Config template
├── scripts/                              # Utility scripts
│   ├── install.sh                       # Smart installer
│   └── test-server.sh                   # Test script
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Build Commands

```bash
npm run build        # Build the server
npm run dev          # Build and watch for changes
npm run clean        # Clean build files
```

### Testing

```bash
npm test             # Run functionality tests
npm start            # Start server manually
```

### Scripts

```bash
npm run setup        # Full installation and setup
npm run install:claude # Just configure Claude Desktop
```

## 🎨 For Designers

Once installed, you can ask Claude questions like:

- _"What layout components do we have?"_
- _"How do I use the Horizontal component?"_
- _"Show me all grid-related components"_
- _"Generate code for a data table with filters"_

See `docs/DESIGNER_PROMPTS.md` for 50+ example questions.

## 📋 Component Categories

Components are automatically categorized as:

- **📊 data**: Grid components, data display (`GraviGrid`, `ConfigurableGridViews`)
- **📝 forms**: Form-related components (`DynamicFilterForm`, `LoginForm`)
- **📐 layout**: Layout and positioning (`Horizontal`, `Vertical`, `PageToolbar`)
- **🖱️ interactive**: Interactive components with state (`RangePicker`, `BulkChangeDrawer`)
- **🎨 ui**: General UI components (`LoadingAnimation`, `BigButton`, `DeltaTag`)

## ⚙️ Configuration

The server uses environment variables:

- `EXCALIBRR_PATH`: Path to your Excalibrr library
- `USAGE_EXAMPLES_PATH`: Path to your main project for usage examples

These are set automatically during installation.

## 🔍 Troubleshooting

### Server won't start

```bash
# Check Node.js version
node --version  # Should be 16+

# Rebuild
npm run clean && npm run build

# Test manually
npm test
```

### Claude Desktop can't find server

1. Check the config file path (see `docs/SETUP.md`)
2. Verify file paths in the config are correct
3. Restart Claude Desktop completely

### No components found

1. Verify `EXCALIBRR_PATH` points to your Excalibrr library
2. Check that the directory contains `.tsx` or `.ts` files
3. Ensure the server has read permissions

## 📚 Documentation

- **[Setup Guide](docs/designer-setup.md)**: Complete installation instructions
- **[Production Guide](docs/production-guide.md)**: Advanced development workflows
- **[Form Generation Guide](docs/form-generation-guide.md)**: Form creation tools and patterns
- **[Intelligent Mode Guide](docs/intelligent-mode-guide.md)**: Natural language usage examples
- **[Figma Integration](docs/figma-setup.md)**: Design token extraction and component mapping
- **[Designer Prompts](docs/designer-prompts.md)**: Example questions and use cases
- **[Config Template](docs/claude-desktop-config.example.json)**: Configuration reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the Gravitate team by Rebecca Page**
