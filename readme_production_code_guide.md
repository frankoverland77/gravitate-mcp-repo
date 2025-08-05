# Excalibrr MCP Server - Production Development Guide

## Overview

The Excalibrr MCP Server has been enhanced to support both design workflows and production development. It now includes tools for generating code within your existing Gravitate projects, following your established patterns and conventions.

## Tool Categories

### 1. Discovery Tools

Tools for exploring and understanding the Excalibrr component library.

- **`discover_components`** - Find all available components
- **`get_component_details`** - Get detailed info about a specific component
- **`search_components`** - Search by name, category, or functionality
- **`find_component_relationships`** - Find related components

### 2. Code Generation Tools

Tools for generating boilerplate code and complete projects.

- **`generate_component_code`** - Generate code snippets for components
- **`generate_grid_component`** - Create complete React projects with grids

### 3. Visual Preview Tools

Tools for creating visual representations of components.

- **`generate_component_screenshot`** - Create static screenshots
- **`create_live_preview`** - Generate interactive HTML previews
- **`create_component_gallery`** - Build visual component galleries
- **`create_shareable_preview`** - Create self-contained preview files

### 4. Production Code Generation Tools (NEW)

Tools for generating code within existing production projects.

- **`generate_feature_in_module`** - Create new features in existing modules
- **`analyze_module_structure`** - Understand existing module patterns

## Production Development Workflow

### Step 1: Analyze Existing Module Structure

Before creating a new feature, understand the patterns in your target module:

```
Use the analyze_module_structure tool to understand the Admin module structure
```

This will show you:

- Existing features in the module
- Common patterns (API folders, components, styles)
- Naming conventions

### Step 2: Generate Feature in Module

Create a new grid feature following your project conventions:

```
Generate a PriceAudit feature in the Admin module with these columns:
- auditId (number, primary key)
- timestamp (dateColumn)
- userName (string)
- action (string)
- oldValue (string)
- newValue (string)
- status (string, max width 100)

API endpoint: PriceEngine/Audit
```

The tool will:

1. Create the complete folder structure
2. Generate TypeScript types based on your columns
3. Create TanStack Query hooks for API calls
4. Build AG-Grid column definitions
5. Create the grid component with Excalibrr
6. Add action menus and standard patterns

### Step 3: Integrate into Navigation

After generation, you'll need to:

1. **Update pageConfig.tsx**:

```typescript
{
  path: 'price-audit',
  element: lazy(() => import('@modules/Admin/PriceAudit/page')),
  name: 'Price Audit',
  icon: <AuditOutlined />,
}
```

2. **Add to module navigation** if needed

3. **Test the API endpoints** to ensure they match your backend

## Example Commands

### For Designers

**Create a complete demo project:**

```
Generate a complete React project for a CustomerContracts grid with columns:
- contractId (number)
- customerName (string)
- contractDate (date)
- status (string)
- totalValue (number)
Include 10 sample rows of data
```

**Generate visual previews:**

```
Create a live preview of the GraviGrid component with interactive controls
```

### For Developers

**Add a feature to existing project:**

```
Generate a LoadingNumbers feature in the Admin module at /Users/myname/repos/Gravitate.Dotnet.Next/frontend with columns:
- loadingNumber (string, primary key)
- terminal (string)
- supplier (string)
- product (string)
- quantity (number)
- status (string)
API endpoint: Admin/LoadingNumbers
```

**Analyze before building:**

```
Analyze the PricingEngine module structure in /Users/myname/repos/Gravitate.Dotnet.Next/frontend
```

## Best Practices

### 1. Follow Naming Conventions

- **Features**: PascalCase (e.g., `PriceAudit`)
- **Hooks**: `use` prefix (e.g., `usePriceAudit`)
- **API endpoints**: Match your backend patterns

### 2. Column Definition Tips

- Always specify a `uniqueIdField` for row identification
- Use AG-Grid column types when known (`numericColumn`, `dateColumn`)
- Include `maxWidth` for columns that should have size limits
- The tool will add standard columns (expand, id, actions) automatically

### 3. Module Organization

- Keep related features in the same module
- Use existing modules when appropriate
- Create new modules for distinct business domains

### 4. API Integration

The generated code expects RESTful endpoints:

- `GET /endpoint/List` - Get all records
- `POST /endpoint/Create` - Create new record
- `PUT /endpoint/Update/{id}` - Update record
- `DELETE /endpoint/Delete/{id}` - Delete record

Adjust the generated hooks if your API differs.

### 5. Post-Generation Steps

1. Review generated TypeScript types
2. Customize the action menu for your use case
3. Add any business logic to the grid component
4. Include error handling specific to your feature
5. Add loading states and empty states as needed

## Common Patterns

### Grid with Master-Detail

```
Generate a ContractDetails feature with master-detail view...
```

### Grid with Custom Actions

The generated `actionMenu.tsx` can be customized:

```typescript
<Menu.Item key="approve" onClick={() => handleApprove(data)}>
  Approve
</Menu.Item>
```

### Grid with Filters

Add to the generated grid component:

```typescript
<Horizontal gap={2} padding={2}>
  <DateRangePicker onChange={setDateRange} />
  <Select options={statusOptions} onChange={setStatus} />
</Horizontal>
```

## Troubleshooting

### "Module not found" errors

- Ensure the project root path is correct
- Check that the module name matches exactly

### API errors

- Verify endpoint paths match your backend
- Check authentication is handled by `useApi`
- Look for CORS issues in development

### Type errors

- The tool infers types from field names
- Manually adjust in `types.schema.ts` if needed
- Add explicit types to column definitions

## Future Enhancements

The MCP server will continue to evolve with:

- Form generation tools
- Dashboard creation tools
- Data visualization components
- Migration tools for existing code
- Test file generation
- Storybook integration

## Getting Help

1. Use `discover_components` to explore available components
2. Use `get_component_details` for component documentation
3. Check generated code comments for guidance
4. Follow existing patterns in your codebase
