# Excalibrr MCP Server Setup Guide

This guide will help you set up the Excalibrr MCP Server for use with Claude Desktop, making it easy for designers to discover and use components from your Excalibrr library.

## Prerequisites

- Node.js 16 or higher
- Claude Desktop app installed
- Access to your Excalibrr and main project repositories

## Installation Steps

### 1. Install the MCP Server

```bash
# Navigate to your excalibrr-mcp-server directory
cd excalibrr-mcp-server

# Install dependencies (if not already done)
npm install

# Build the server
npm run build

# Test that it works
node build/index.js
# You should see: "Excalibrr MCP Server running on stdio"
# Press Ctrl+C to exit
```

### 2. Configure Claude Desktop

#### On macOS:

Open or create the Claude Desktop configuration file:

```bash
# Open the config file in your default editor
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### On Windows:

Open or create:

```
%APPDATA%\Claude\claude_desktop_config.json
```

#### Add the MCP Server Configuration:

Replace the contents with the configuration from the Claude Desktop config file (making sure the paths match your system).

**Important**: Update the paths in the configuration to match your actual system paths:

- Replace `/Users/rebecca.hirai/repos/excalibrr-mcp-server/build/index.js` with your actual path
- Replace `/Users/rebecca.hirai/repos/excalibrr` with your actual Excalibrr library path
- Replace `/Users/rebecca.hirai/repos/Gravitate.Dotnet.Next/frontend/src` with your actual usage examples path

### 3. Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

### 4. Test the Integration

Once Claude Desktop restarts, you should be able to ask questions like:

- **"What components are available in the Excalibrr library?"**
- **"Show me details about the GraviGrid component"**
- **"Search for layout components"**
- **"How do I use the Horizontal component?"**

## Available Tools

Your designer now has access to these powerful tools:

### 🔍 `discover_components`

Lists all available components in your Excalibrr library with categories and descriptions.

**Example questions:**

- "What components are available?"
- "Show me all the components with their categories"
- "List components and include usage examples"

### 📖 `get_component_details`

Gets detailed information about a specific component including props and real usage examples.

**Example questions:**

- "Show me details about the GraviGrid component"
- "What are the props for the Horizontal layout component?"
- "How do I use the DeltaTag component?"

### 🔍 `search_components`

Search for components by name, functionality, or category.

**Example questions:**

- "Find all grid-related components"
- "Show me layout components"
- "Search for form components"
- "Find components related to authentication"

## Categories

Components are automatically categorized as:

- **data**: Grid components, data display (`GraviGrid`, `ConfigurableGridViews`)
- **forms**: Form-related components (`DynamicFilterForm`, `LoginForm`)
- **layout**: Layout and positioning (`Horizontal`, `Vertical`, `PageToolbar`)
- **interactive**: Interactive components with state (`RangePicker`, `BulkChangeDrawer`)
- **ui**: General UI components (`LoadingAnimation`, `BigButton`, `DeltaTag`)

## Troubleshooting

### Server Not Starting

- Check that Node.js is installed: `node --version`
- Verify the build completed: `ls build/index.js`
- Test manually: `node build/index.js`

### Claude Desktop Not Finding Server

- Check the config file path is correct
- Verify the server path in the config matches your actual file location
- Restart Claude Desktop completely
- Check Claude Desktop logs (available in app settings)

### No Components Found

- Verify the `EXCALIBRR_PATH` points to your actual Excalibrr library
- Check that the path contains TypeScript/TSX files
- Ensure the server has read permissions on the directories

### Environment Variables

You can also set these as system environment variables instead of in the config:

```bash
export EXCALIBRR_PATH="/path/to/your/excalibrr"
export USAGE_EXAMPLES_PATH="/path/to/your/main/project/frontend/src"
```

## Next Steps

Once this is working, you can enhance the server with:

- Component code generation
- Design pattern suggestions
- Enhanced documentation
- Integration with your design workflow

## Support

If you encounter issues:

1. Check the paths in your configuration
2. Test the server manually with `node build/index.js`
3. Check Claude Desktop logs
4. Verify file permissions on your repositories
