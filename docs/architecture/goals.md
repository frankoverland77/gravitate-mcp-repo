## 🎯 Detailed Plan for New Excalibrr MCP Server

### **Phase 1: Architecture & Setup** (Day 1 Morning)

#### 1.1 **Directory Structure**

```
excalibrr-design-system/                 # Parent workspace
├── shared/
│   ├── package.json                     # All dependencies here
│   ├── node_modules/                    # ONE installation
│   ├── vite.config.base.js             # Shared Vite config
│   └── setup.sh                        # One-time setup script
│
├── demos/                               # Lightweight shells live here
│   └── .gitkeep
│
├── mcp-server/                         # The new MCP server
│   ├── package.json
│   ├── tsconfig.json
│   ├── build/
│   └── src/
│       ├── index.ts                    # MCP entry point
│       ├── config/
│       │   ├── dependencies.ts         # Dependency versions
│       │   ├── paths.ts                # Path configurations
│       │   └── themes.ts               # Theme definitions
│       ├── knowledge/                  # Critical - from old server
│       │   ├── examples/               # Copy from old
│       │   ├── patterns/               # Copy from old
│       │   └── antipatterns.ts        # What NOT to do
│       ├── tools/                      # MCP tool implementations
│       │   ├── createDemo.ts          # Create lightweight shell
│       │   ├── modifyComponent.ts     # Iterate on components
│       │   ├── manageServer.ts        # Start/stop dev servers
│       │   └── switchTheme.ts         # Change themes
│       ├── templates/                  # Code templates
│       │   ├── shell.ts               # Lightweight demo template
│       │   ├── grid.ts                # Grid component template
│       │   ├── form.ts                # Form template
│       │   └── mockNav.ts             # Simple nav that looks real
│       └── utils/
│           ├── fileOps.ts             # File operations
│           ├── astModifier.ts         # Safe code modifications
│           └── portManager.ts         # Manage dev server ports
│
└── claude-code-config/                 # Claude Code setup
    ├── .claude/
    │   └── config.yaml                 # MCP server config
    └── README.md                       # Setup instructions for user
```

#### 1.2 **Shared Dependencies Package**

```json
{
  "name": "excalibrr-shared-deps",
  "version": "1.0.0",
  "dependencies": {
    "@gravitate-js/excalibrr": "4.0.34-osp", // CRITICAL: Specific version
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ag-grid-community": "^30.2.1",
    "ag-grid-enterprise": "^30.2.1",
    "ag-grid-react": "^30.2.1",
    "@tanstack/react-query": "^4.10.3",
    "antd": "4.20",
    "react-router-dom": "6.16.0"
    // ... rest from your list
  }
}
```

---

### **Phase 2: Core MCP Tools** (Day 1 Afternoon)

#### 2.1 **Tool: Create Demo**

```typescript
// Purpose: Create a lightweight shell demo
interface CreateDemoParams {
  name: string;           // "FlowerInventory"
  type: 'grid' | 'form' | 'dashboard' | 'blank';
  theme?: 'OSP' | 'PE' | 'BP';  // Default: PE
}

// What it does:
1. Creates demos/FlowerInventory/ directory
2. Generates minimal files:
   - index.html (points to shared node_modules)
   - src/App.tsx (imports real Excalibrr)
   - src/Demo.tsx (the actual component)
   - vite.config.js (extends shared config)
3. NO package.json (uses parent)
4. NO node_modules (uses parent)
```

#### 2.2 **Tool: Modify Component**

```typescript
// Purpose: Iterate on existing demos
interface ModifyComponentParams {
  demo: string;           // "FlowerInventory"
  action: 'add_column' | 'edit_column' | 'add_button' |
          'add_cell_renderer' | 'change_props';
  target?: string;        // Component or file to modify
  changes: any;           // Specific changes
}

// What it does:
1. Reads existing file using AST
2. Makes surgical changes
3. Writes back
4. Triggers HMR via Vite
```

#### 2.3 **Tool: Manage Server**

```typescript
// Purpose: Start/stop dev servers (no terminal for user)
interface ManageServerParams {
  demo: string;
  action: 'start' | 'stop' | 'restart' | 'status';
}

// What it does:
1. Starts Vite dev server for demo
2. Manages ports (3001, 3002, etc.)
3. Returns localhost URL
4. Tracks running servers
```

#### 2.4 **Tool: Switch Theme**

```typescript
// Purpose: Change theme without regenerating
interface SwitchThemeParams {
  demo: string;
  theme: 'OSP' | 'PE' | 'BP';
}

// What it does:
1. Updates CSS imports
2. Changes theme context
3. Hot reloads
```

---

### **Phase 3: Knowledge Base Migration** (Day 1 Evening)

#### 3.1 **Extract from Old Server**

```
Old Server → New Server
├── examples/components/GraviGrid/* → knowledge/examples/grid/
├── examples/patterns/*             → knowledge/patterns/
├── projectComponentScanner.ts      → Simplify & move to knowledge/scanner.ts
├── gridFontFix.ts                 → Extract CSS to knowledge/styles/fonts.ts
└── Theme definitions               → config/themes.ts
```

#### 3.2 **Create Anti-Patterns Database**

```typescript
// knowledge/antipatterns.ts
export const NEVER_DO = {
  tailwind: {
    wrong: `<div className="flex gap-4">`,
    right: `<Horizontal gap={16}>`,
    reason: "Always use Excalibrr layout components",
  },
  mockComponents: {
    wrong: `const GraviGrid = () => <div>Mock Grid</div>`,
    right: `import { GraviGrid } from '@gravitate-js/excalibrr'`,
    reason: "Always import real components",
  },
  wrongVersion: {
    wrong: `"@gravitate-js/excalibrr": "latest"`,
    right: `"@gravitate-js/excalibrr": "4.0.34-osp"`,
    reason: "Must use specific version",
  },
};
```

---

### **Phase 4: Template System** (Day 2 Morning)

#### 4.1 **Lightweight Shell Template**

```typescript
// templates/shell.ts
export function generateShell(name: string, theme: string) {
  return {
    "index.html": `<!DOCTYPE html>
<html>
  <head>
    <title>${name} Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    "vite.config.js": `import { defineConfig } from 'vite';
import baseConfig from '../../shared/vite.config.base';

export default defineConfig({
  ...baseConfig,
  root: __dirname,
  server: {
    port: ${getNextPort()}
  }
});`,

    "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@gravitate-js/excalibrr/dist/index.css';
import './theme-${theme.toLowerCase()}.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

    "src/App.tsx": `import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Demo } from './Demo';
import { MockNav } from './MockNav';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-wrapper">
        <MockNav theme="${theme}" />
        <div className="content">
          <Demo />
        </div>
      </div>
    </QueryClientProvider>
  );
}`,
  };
}
```

#### 4.2 **Mock Navigation (Looks Real, Simple)**

```typescript
// templates/mockNav.ts
export function generateMockNav(theme: string) {
  return `import React from 'react';

export function MockNav({ theme }: { theme: string }) {
  return (
    <div className="mock-nav" data-theme={theme}>
      <div className="nav-sidebar">
        <div className="nav-logo" />
        <div className="nav-items">
          <div className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </div>
        </div>
      </div>
      <style jsx>{\`
        .mock-nav[data-theme="PE"] .nav-sidebar {
          background: linear-gradient(#0a504e 0%, #0c5a58 100%);
        }
        .mock-nav[data-theme="OSP"] .nav-sidebar {
          background: #0F1121;
        }
        .mock-nav[data-theme="BP"] .nav-sidebar {
          background: #007f00;
        }
        /* Rest of styling to match production */
      \`}</style>
    </div>
  );
}`;
}
```

---

### **Phase 5: AST-Based Modifications** (Day 2 Afternoon)

#### 5.1 **Safe File Modification**

```typescript
// utils/astModifier.ts
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

export class ASTModifier {
  // Add column to existing grid
  addColumnToGrid(filePath: string, column: ColumnDef) {
    const ast = this.parseFile(filePath);

    traverse(ast, {
      ArrayExpression(path) {
        if (this.isColumnDefsArray(path)) {
          path.node.elements.push(this.createColumnAST(column));
        }
      },
    });

    return this.generateCode(ast);
  }

  // Change component props
  updateComponentProps(filePath: string, props: any) {
    // Similar AST manipulation
  }
}
```

---

### **Phase 6: Testing & Validation** (Day 2 Evening)

#### 6.1 **Test Scenarios**

```typescript
// user's typical workflows to test:

// Workflow 1: Create Grid
1. "Create an inventory grid with 5 columns"
2. "Add a sparkline to column 3"
3. "Make column 2 editable"
4. "Change to OSP theme"

// Workflow 2: Iterate on Form
1. "Create a product entry form"
2. "Add a date picker field"
3. "Add validation to price field"
4. "Add a submit button"

// Workflow 3: Theme Testing
1. "Show me this in PE theme"
2. "Switch to BP theme"
3. "Back to OSP"
```

#### 6.2 **Validation Checklist**

- [ ] Demos use shared node_modules (no duplication)
- [ ] Real Excalibrr components imported correctly
- [ ] Fonts display as Lato
- [ ] Themes switch properly
- [ ] Hot reload works on modifications
- [ ] No Tailwind classes generated
- [ ] Server starts/stops from Claude Code
- [ ] File modifications preserve syntax

---

### **Phase 7: user's Setup** (Day 3 Morning)

#### 7.1 **One-Time Setup Script**

```bash
#!/bin/bash
# setup.sh

echo "🚀 Setting up Excalibrr Design System..."

# 1. Install shared dependencies
cd shared
yarn install
cd ..

# 2. Build MCP server
cd mcp-server
npm run build
cd ..

# 3. Configure Claude Code
cat > ~/.claude/config.yaml << EOF
mcp_servers:
  excalibrr:
    command: "node"
    args: ["$(pwd)/mcp-server/build/index.js"]
    env:
      EXCALIBRR_WORKSPACE: "$(pwd)"
EOF

echo "✅ Setup complete!"
echo "📝 To use:"
echo "  1. Open Cursor"
echo "  2. In terminal: claude --chat"
echo "  3. Say: Create a product grid"
```

#### 7.2 **user's Workflow Documentation**

```markdown
# user's Excalibrr Designer Workflow

## Starting a New Design

1. Open Cursor
2. Terminal: `claude --chat`
3. "Create a [type] demo called [name]"

## Common Commands

- "Create a product grid with 5 columns"
- "Add editing to the price column"
- "Add a create button with modal"
- "Change to OSP theme"
- "Add a sparkline renderer to sales column"

## No Need To:

- Run yarn/npm commands (Claude does it)
- Switch windows (stay in Cursor)
- Know React (just describe what you want)
```

---

### **Phase 8: Implementation Timeline**

| Day           | Phase               | Deliverable         | Testing            |
| ------------- | ------------------- | ------------------- | ------------------ |
| **Day 1 AM**  | Architecture        | Workspace structure | Verify paths work  |
| **Day 1 PM**  | Core Tools          | 4 MCP tools         | Manual tool tests  |
| **Day 1 Eve** | Knowledge Migration | Examples moved      | Verify imports     |
| **Day 2 AM**  | Templates           | Shell generator     | Generate test demo |
| **Day 2 PM**  | AST Mods            | File modification   | Test iterations    |
| **Day 2 Eve** | Integration         | Full workflow       | End-to-end test    |
| **Day 3 AM**  | user Setup          | Setup script        | user tests it      |

---

### **Success Metrics**

1. **Speed**: Demo creation < 5 seconds (no yarn install)
2. **Size**: Each demo < 1MB (no node_modules)
3. **Accuracy**: 100% real Excalibrr components
4. **Iteration**: Modifications apply in < 1 second
5. **Appearance**: Matches production exactly
6. **Simplicity**: user never uses terminal directly

---

### **Risk Mitigation**

| Risk                       | Mitigation                      |
| -------------------------- | ------------------------------- |
| Shared node_modules breaks | Fallback to standalone mode     |
| AST modifications fail     | Keep backup, use string replace |
| Port conflicts             | Dynamic port allocation         |
| Theme doesn't apply        | Inline critical styles          |
| user's machine differs     | Docker as Plan B                |

---

## **Next Step: Start Phase 1?**

This plan gives us:

- ✅ Lightweight shells (no 500MB duplicates)
- ✅ Real Excalibrr components only
- ✅ Fast iteration with AST
- ✅ Simple for user
- ✅ Keeps valuable knowledge

**Ready to begin Phase 1: Architecture & Setup?**
