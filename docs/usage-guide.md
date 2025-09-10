# Designer's Excalibrr MCP Server Guide

This guide helps you work effectively with the MCP server and provides guidance when you encounter limitations.

## Quick Start

The server has these main capabilities:
- **create_demo** - Create new component demos (grids, forms, dashboards)
- **modify_grid** - Add/change columns, make grids editable
- **change_theme** - Switch between OSP, PE, BP themes
- **run_dev_server** - Start/stop development servers
- **create_form_demo** - Create form demos with validation
- **cleanup_demo** - Remove old demos cleanly
- **import_from_figma** - Convert Figma designs to components
- **help** - Get guidance when stuck

## Common Usage Patterns

### Creating Things
```
"create a product grid"
"make a customer form" 
"build a dashboard demo"
"create a grid with product data"
```

### Modifying Existing Demos
```
"add a price column to ProductGrid"
"make the quantity column editable"
"add a date picker to CustomerForm"
"change ProductGrid to use OSP theme"
```

### Development Workflow
```
"start the server for ProductGrid"
"run CustomerForm on port 3001" 
"stop all servers"
"cleanup the old InventoryGrid demo"
```

## When Things Don't Work As Expected

### If I Don't Understand Your Request

I'll ask clarifying questions like:
- "Are you trying to create something new or modify existing?"
- "Which demo are you referring to?"
- "Do you mean [suggestion] or [alternative]?"

**What to do**: Answer the questions or try rephrasing your request using different words.

### If I Can't Do Something You Asked

I'll suggest alternatives:
- Break your request into smaller pieces I can handle
- Use existing tools in a different way
- Check if similar functionality already exists

**What to do**: Try the suggested alternatives or ask me to help find workarounds.

### If You Get Errors

Common issues and fixes:
- **Demo not found**: Check the exact name with `ls demo/src/pages/demos`
- **Server won't start**: Try cleanup_demo first, then recreate
- **Theme not applying**: Stop server, change theme, restart server
- **Column not adding**: Check if field name already exists

## Advanced Patterns

### Multi-Step Workflows
```
1. "create a product inventory grid"
2. "add editable quantity and price columns"
3. "switch to OSP theme" 
4. "start the server"
```

### Working with Forms
```
1. "create a customer management form"
2. "add validation to email field"
3. "add a submit and cancel button"
4. "test it on port 3002"
```

### Figma Integration
```
1. "list components in [figma-url]"
2. "import the ProductCard component"
3. "create a demo using the imported component"
```

## Troubleshooting

### "I don't know how to do that"
This means your request doesn't match any known patterns. Try:
1. Use the `help` tool with your request
2. Break down complex requests into simpler parts
3. Ask if there's a similar feature available
4. Check existing demos for patterns you can adapt

### Server Issues
- **Port conflicts**: Specify a different port or cleanup old demos
- **Build errors**: Check that all required fields are provided
- **Theme not loading**: Restart the development server

### Component Issues  
- **Component not found**: Check spelling and available components
- **Styling problems**: Try switching themes or check CSS conflicts
- **Data not showing**: Verify field names match data structure

## Getting Help

### Use the Help Tool
```
"help with creating forms"
"help - I want to make an editable data table"
"help me understand what went wrong"
```

### Provide Context
When asking for help, include:
- What you were trying to accomplish
- What you tried that didn't work
- Any error messages you received
- Which demos/tools you were using

### Fallback Options
If I truly can't help with something:
1. Check the existing demo code for patterns
2. Look at the component documentation
3. Try building it step-by-step with available tools
4. Consider if a simpler approach would work

## Best Practices

### Naming Conventions
- Use PascalCase for demo names: "ProductGrid", "CustomerForm"
- Be descriptive: "InventoryManagement" not "Test"
- Avoid special characters and spaces

### Development Workflow
1. Create demo
2. Test basic functionality
3. Add/modify features incrementally  
4. Test after each change
5. Apply theming last
6. Clean up old versions

### When Experimenting
- Create small test demos first
- Use cleanup_demo to remove failed experiments
- Keep demo names organized and descriptive
- Test changes before building on them

Remember: I'm designed to help you succeed. When I can't do exactly what you ask, I'll always try to find a way to help you accomplish your goal!