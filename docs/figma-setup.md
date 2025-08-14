# 🎨 Figma Integration Setup Guide

## Overview

Your Excalibrr MCP server now has **Figma integration**! This lets you extract design tokens, analyze components, and generate Excalibrr code directly from Figma designs.

## 🔧 Setup Steps

### 1. Get Your Figma API Token

1. Go to [Figma Developer Settings](https://www.figma.com/developers/api#access-tokens)
2. Click "Create new token"
3. Give it a descriptive name (e.g., "Excalibrr MCP Server")
4. Copy the token (keep it secret!)

### 2. Add Token to Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Figma token
FIGMA_API_TOKEN=your_actual_token_here
```

### 3. Install Dependencies & Build

```bash
npm install
npm run build
```

### 4. Test the Connection

```bash
# Start the server and test
npm start
```

## 🎯 New Figma Tools Available

### **figma_test_connection**

Test if your Figma API token works

```
"Test my Figma connection"
```

### **figma_extract_design_tokens** ⭐

Extract colors, typography, spacing, and effects from any Figma file

```
"Extract design tokens from this Figma file: https://figma.com/file/ABC123/My-Design-System"
```

### **figma_generate_excalibrr_theme** 🎨

Generate a complete Excalibrr theme from Figma design tokens

```
"Generate an Excalibrr theme from this Figma file: https://figma.com/file/ABC123/My-Design-System"
```

### **figma_analyze_component** 🔍

Analyze a specific Figma component and get Excalibrr mapping suggestions

```
"Analyze this Figma component: https://figma.com/file/ABC123/My-Design?node-id=1-234"
```

### **figma_get_file_structure** 📁

Get the complete structure of a Figma file

```
"Show me the structure of this Figma file: https://figma.com/file/ABC123/My-Design-System"
```

## 🚀 Designer Workflow Examples

### Extract Your Design System

```
"Extract design tokens from our main design system file: [figma-url]"
```

This will give you:

- All colors used consistently across designs
- Typography styles (fonts, sizes, weights)
- Spacing patterns (gaps, margins, padding)
- Effects (shadows, blurs)

### Generate Matching Excalibrr Theme

```
"Generate an Excalibrr theme called 'ProductTheme' from this Figma file: [figma-url]"
```

This creates a TypeScript theme file you can use directly in your Excalibrr components.

### Analyze Specific Components

```
"Analyze this button component and suggest Excalibrr implementation: [figma-url-with-node-id]"
```

This will:

- Suggest which Excalibrr component to use
- Generate starter code
- Identify props and styling needs

### Get File Overview

```
"Show me what's in this Figma file: [figma-url]"
```

Perfect for understanding large design files and finding specific components.

## 💡 Pro Tips

1. **Use Figma URLs directly** - Just copy/paste from your browser
2. **Node-specific URLs** - Right-click any Figma element → "Copy link" for component analysis
3. **Save generated themes** - Use the `outputPath` parameter to save files locally
4. **Iterate quickly** - Extract tokens → Generate theme → Test in Excalibrr → Refine

## 🔗 Figma URL Formats Supported

- File URLs: `https://figma.com/file/ABC123/Design-System`
- Component URLs: `https://figma.com/file/ABC123/Design-System?node-id=1-234`
- File keys: `ABC123` (just the key part)

## ⚡ What's Next?

This is Phase 1! Coming soon:

- Layout analysis (auto-generate Horizontal/Vertical layouts)
- Real-time component preview in Figma
- Bidirectional sync between Figma and Excalibrr
- Advanced component mapping with AI analysis

## 🆘 Troubleshooting

**"Invalid Figma API token"**

- Make sure you copied the full token
- Check that it's set in your `.env` file
- Verify the token hasn't expired

**"Node not found"**

- Make sure the Figma URL includes `node-id` parameter
- Try right-clicking the element in Figma and "Copy link"

**"File not accessible"**

- Ensure you have access to the Figma file
- File might be private - ask for edit/view permissions

## 🎉 Ready to Use!

Your designer can now work seamlessly between Figma and Excalibrr through Claude. The design-to-code gap just got a lot smaller! 🚀
