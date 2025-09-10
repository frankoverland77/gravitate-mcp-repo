# 🎨 Figma Integration

## What This Is

Basic Figma integration tools that allow importing components and listing Figma file contents for demo creation.

## 🔧 Setup

### 1. Get Your Figma API Token

1. Go to [Figma Developer Settings](https://www.figma.com/developers/api#access-tokens)
2. Click "Create new token"
3. Give it a name (e.g., "Excalibrr MCP Server")
4. Copy the token

### 2. Add Token to Environment

```bash
# Add to mcp-server/.env
FIGMA_API_TOKEN=your_actual_token_here
```

## 🛠️ Available Tools

### `import_from_figma`

Import a component or design from Figma and convert to React/Excalibrr code.

**Usage:**

- "Import this Figma component: https://figma.com/file/ABC123/Design?node-id=1-234"
- "Convert this Figma design to Excalibrr code: [figma-url]"

### `list_figma_components`

List all available components in a Figma file.

**Usage:**

- "Show me all components in this Figma file: https://figma.com/file/ABC123/Design-System"
- "List the components available in [figma-url]"

## 📝 user's Workflow

### 1. Explore a Figma File

```
"Show me what components are in this Figma file: https://figma.com/file/ABC123/Our-Design-System"
```

### 2. Import Specific Components

```
"Import this button component and create an Excalibrr demo: https://figma.com/file/ABC123/Design-System?node-id=1-234"
```

## 🔗 Supported URL Formats

- **File URLs**: `https://figma.com/file/ABC123/Design-System`
- **Component URLs**: `https://figma.com/file/ABC123/Design?node-id=1-234`
- **File IDs**: `ABC123` (just the key part)

## 💡 Tips

1. **Copy URLs directly** from your Figma browser tab
2. **Use node-specific URLs** by right-clicking elements in Figma → "Copy link"
3. **Start with listing** components to understand the file structure
4. **Import specific components** rather than entire files for better results

## 🐛 Troubleshooting

### "Invalid Figma API token"

- Check the token is correctly set in `mcp-server/.env`
- Verify the token hasn't expired

### "File not accessible"

- Ensure you have view access to the Figma file
- Try with a public file to test your setup

### "Component not found"

- Make sure the URL includes the `node-id` parameter
- Try copying the link directly from Figma

## ⚠️ Current Limitations

- Basic component import only
- No design token extraction
- No theme generation
- Limited layout analysis

The Figma integration is functional but basic - perfect for importing individual components into demos.
