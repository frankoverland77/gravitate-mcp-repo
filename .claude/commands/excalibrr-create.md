# Create Excalibrr Component Demo

Create a new Excalibrr component demo using the MCP server tools with the proper workflow.

## MANDATORY WORKFLOW

**ALWAYS follow these steps:**

### Step 1: Call `preflight`
```javascript
preflight({ task: "user's request" })
```

### Step 2: Create the Demo
Use `create_demo` or `create_form_demo` based on request type.

### Step 3: Call `validate_code`
Validate any custom code you generate.

### Step 4: Call `register_demo`
```javascript
register_demo({
  name: "ComponentName",
  title: "Display Title",
  description: "Description",
  category: "grids",  // grids | forms | dashboards
  componentPath: "./pages/demos/ComponentName"
})
```

---

## Demo Types

**Grid**: For data tables, lists, or tabular data
**Form**: For data entry, editing, or configuration
**Dashboard**: For analytics, metrics, or overviews

---

## For Grid Demos

Use `create_demo`:
```javascript
create_demo({ instruction: "Create a [entity] grid" })
```

Then optionally `modify_grid`:
- Add columns: `action: "add_column"`, `config: { field, headerName, type, width }`
- Make editable: `action: "make_editable"`, `config: { field }`
- Add renderer: `action: "add_renderer"`, `config: { field, renderer }`

---

## For Form Demos

Use `create_form_demo`:
```javascript
create_form_demo({
  name: "EntityForm",
  type: "simple",
  title: "Create/Edit Entity",
  fields: [
    { name: "fieldName", label: "Field Label", type: "text", required: true },
    { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    { name: "enabled", label: "Enabled", type: "switch" }
  ],
  actions: [
    { type: "cancel", label: "Cancel" },
    { type: "submit", label: "Save", theme: "success" }
  ]
})
```

Field types: text, email, number, select, date, dateRange, switch, checkbox

---

## Common Mistakes to Avoid

| Mistake | Correct |
|---------|---------|
| `<Vertical style={{ flex: 1 }}>` | `<Vertical flex="1">` |
| `<Horizontal gap={12}>` | `<Horizontal className="gap-12">` |
| `<Modal open={isOpen}>` | `<Modal visible={isOpen}>` |
| `<Drawer open={isOpen}>` | `<Drawer visible={isOpen}>` |
| `<GraviButton theme="success">` | `<GraviButton success>` |
| `<Texto appearance="secondary">` (for gray) | `<Texto appearance="medium">` |

---

## User Request: $ARGUMENTS

Follow the workflow:
1. Call `preflight` with the task
2. Create demo using appropriate tool
3. Validate any custom code
4. Call `register_demo` to add navigation
5. Report the demo URL to user
