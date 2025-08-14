# 🤖 Intelligent Excalibrr MCP Server - Designer Guide

## What's New: Intelligent Mode!

The MCP server is now **intelligent** - it understands what you want to build and does all the steps automatically!

## 🚀 Quick Examples for Cursor

Instead of running multiple tools manually, just tell the server what you want:

### Creating a Complete Feature

**Before (Manual):**

```
1. Run discover_components
2. Run get_component_details for GraviGrid
3. Run generate_grid_component
4. Run generate_form_for_feature
5. Format the output...
```

**Now (Intelligent):**

```
"Create a product management grid in the Admin module with OSP theme"
```

The server automatically:

- ✅ Discovers the right components
- ✅ Generates the complete file structure
- ✅ Creates Grid, Form, and API hooks
- ✅ Applies OSP theme
- ✅ Validates everything
- ✅ Gives you PR-ready code

## 📝 Magic Commands

### 1. Create Smart Grid

The most powerful command - creates everything you need:

```
"Create a user management grid in Admin module with these columns: Name, Email, Role, Status, LastLogin"
```

This generates:

- Complete feature structure
- Grid component with GraviGrid
- Column definitions
- API hooks with React Query
- Create/Edit forms
- Proper TypeScript types
- No Tailwind (uses proper themes!)

### 2. Apply Themes

Make it look like your actual site:

```
"Apply OSP theme to my components"
"Use PE theme for the pricing engine"
"Change theme to BP"
```

### 3. Suggest Components

Not sure what to use? Ask for suggestions:

```
"What components should I use for a trading dashboard?"
"Suggest components for displaying financial data"
"What works well with GraviGrid?"
```

## 🎨 Available Themes

- **OSP** - Default blue theme
- **PE** - Pricing Engine theme
- **BP** - Business Platform theme
- **default** - Fallback theme

## 📁 What Gets Generated

When you create a feature, here's the exact structure:

```
src/modules/[Module]/[Feature]/
├── index.tsx                 # Main component entry
├── components/
│   ├── Grid/
│   │   ├── index.tsx        # Grid using GraviGrid
│   │   └── columnDefs.tsx   # Column configurations
│   ├── Form/
│   │   └── index.tsx        # Create/Edit form
│   └── createConfig.tsx     # Creation configuration
└── api/
    └── use[Feature].tsx     # React Query hooks
```

## 💬 Natural Language Examples

The server understands many ways to ask for things:

### Creating Features

- "Build a contract management grid"
- "I need a grid for managing products"
- "Create an admin panel for users"
- "Make a feature for tracking prices"

### Working with Data

- "Add columns for name, date, status, and amount"
- "Include bulk actions for the grid"
- "Add a form for creating new records"
- "Connect to the PriceEngine/Read API"

### Styling

- "Make it look like our production site"
- "Use the same theme as OSP"
- "Apply our standard blue theme"

## ⚡ Complete Example Workflow

Here's a real example you can try right now:

```
"Create a smart grid for managing contracts in the ContractManagement module with columns: ContractId, Name, Counterparty, StartDate, EndDate, Status, Value. Use OSP theme and connect to ContractManagement/Read API endpoint."
```

The server will:

1. Generate the complete feature structure
2. Create a grid with all specified columns
3. Set up API hooks for ContractManagement/Read
4. Apply OSP theme styling
5. Include create/edit forms
6. Add bulk actions
7. Generate TypeScript types
8. Validate everything
9. Give you PR-ready code

## 🔧 After Generation

Once the server generates your feature:

1. **Check the files** in `frontend/src/modules/[Module]/[Feature]`
2. **Run yarn** to install any dependencies
3. **Add to router:**

   ```tsx
   import { YourFeature } from "@modules/Module/YourFeature";

   // In routes
   <Route path="/module/feature" element={<YourFeature />} />;
   ```

4. **Test with sample data** first
5. **Connect real API** when ready

## ❌ What NOT to Do

- **Don't use Tailwind** - The server uses Gravitate themes
- **Don't use shadcn** - Use Excalibrr components instead
- **Don't create custom styles** - Use theme tokens
- **Don't skip validation** - Check the validation report

## 🆘 Troubleshooting

### "I don't understand that request"

Be more specific:

- ❌ "Make a grid"
- ✅ "Create a user management grid in Admin module"

### "No components found"

The server is looking in Excalibrr. Make sure you're asking for components that exist.

### "Theme not applied correctly"

Specify the theme explicitly:

- ❌ "Create a grid with our theme"
- ✅ "Create a grid with OSP theme"

## 💡 Pro Tips

1. **Always specify the module** - Admin, PricingEngine, ContractManagement, etc.
2. **Include column details** - The more specific, the better the output
3. **Mention the API endpoint** - Helps generate correct hooks
4. **Specify the theme** - OSP, PE, or BP
5. **Use feature names in PascalCase** - ManageUsers, not manage-users

## 🔍 Validation Reports

Every generation includes validation:

```
✅ TypeScript Syntax - No errors
✅ Excalibrr Usage - Uses proper components
✅ No Tailwind - Clean themes only
✅ File Structure - Follows patterns
⚠️ API Hooks - Consider extracting to /api
```

Pay attention to:

- ❌ **Errors** - Must fix before PR
- ⚠️ **Warnings** - Should consider fixing
- ✅ **Passed** - Good to go!

## 📊 Example Grid Columns

Here are column examples that work well:

```javascript
// Text columns
{ field: "name", headerName: "Name" }
{ field: "email", headerName: "Email Address" }

// Date columns
{ field: "createdAt", headerName: "Created", type: "dateColumn" }
{ field: "startDate", headerName: "Start Date", type: "dateColumn" }

// Number columns
{ field: "amount", headerName: "Amount", type: "numericColumn" }
{ field: "quantity", headerName: "Qty", type: "numericColumn", width: 100 }

// Status columns
{ field: "status", headerName: "Status", editable: true }
{ field: "isActive", headerName: "Active", type: "booleanColumn" }

// Actions
{ field: "actions", headerName: "", type: "actionsColumn", width: 80 }
```

## 🎯 Complete Feature Request Template

For best results, structure your request like this:

```
Create a [FeatureName] grid in [Module] module with:
- Columns: [list columns with types]
- Theme: [OSP/PE/BP]
- API: [endpoint path]
- Include: [forms/bulk actions/filters]
```

Example:

```
Create a PriceManagement grid in PricingEngine module with:
- Columns: PriceId (text), ProductName (text), Price (numeric), EffectiveDate (date), Status (select)
- Theme: PE
- API: PricingEngine/Prices/Read
- Include: Create/edit forms and bulk actions
```

## 🚦 Quick Status Check

After generation, verify:

| Check          | Good                         | Bad                    |
| -------------- | ---------------------------- | ---------------------- |
| Uses GraviGrid | ✅ `import { GraviGrid }`    | ❌ Custom grid         |
| Theme applied  | ✅ `theme: 'OSP'`            | ❌ Tailwind classes    |
| API hooks      | ✅ `useQuery`, `useMutation` | ❌ Direct fetch        |
| File structure | ✅ Follows pattern           | ❌ Random organization |
| TypeScript     | ✅ Fully typed               | ❌ `any` types         |

## 🎉 You're Ready!

Start with something simple:

```
"Create a TestFeature grid in Admin module with columns: Id, Name, Description, Status. Use OSP theme."
```

Then try more complex requests as you get comfortable!

---

**Remember:** The server is intelligent now - it knows what you need and handles all the complexity for you. Just describe what you want to build, and it will make it happen following all the Gravitate patterns and best practices!
