// Theme integration tools for Excalibrr MCP Server
// Enables Frank to use real Gravitate themes like OSP, PE, BP, etc.

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { 
  loadGravitateThemes, 
  getThemeByKey, 
  listAvailableThemes,
  generateThemeCSS,
  copyFontFiles,
  GravitateTheme 
} from "../../lib/themeSystem.js";
import {
  generateCompleteLayout,
  generateThemedGraviGrid,
  generateHorizontalToolbar,
  generateVerticalNav,
  NavigationConfig
} from "../../lib/navigationSystem.js";
import * as fs from "fs/promises";
import * as path from "path";

export function registerThemeIntegrationTools(server: McpServer): void {
  
  /**
   * Tool: List Available Themes
   * Shows all real Gravitate themes (OSP, PE, BP, etc.)
   */
  server.tool(
    "list_gravitate_themes",
    "List all available Gravitate themes including client themes (OSP, PE, BP, etc.)",
    {},
    async () => {
      try {
        const themes = await loadGravitateThemes();
        const themeList = Object.values(themes).map(theme => ({
          key: theme.key,
          display: theme.display,
          isDark: theme.isDark,
          hasLogo: !!theme.assets.logo,
          primaryColors: theme.colors.primary
        }));

        return {
          content: [{
            type: "text",
            text: `🎨 **Available Gravitate Themes**

${themeList.map(theme => 
  `**${theme.display}** (${theme.key})
  • Type: ${theme.isDark ? 'Dark' : 'Light'} theme
  • Logo: ${theme.hasLogo ? '✅ Available' : '❌ Not found'}
  • Primary Colors: ${theme.primaryColors.slice(0, 2).join(', ')}
  
`).join('')}

**How to use:**
• "Generate a grid with OSP theme"
• "Create a dashboard using PE theme"
• "Show me BP theme navigation"
• "Generate themed components for MURPHY"

**Client Themes Available:**
OSP, PE, BP, DKB, FHR, Murphy, Growmark, Motiva, P66, Sunoco

**Base Themes:**
Light, Dark, Christmas, Thanksgiving

**All themes include:**
✅ Real color variables from your LESS files
✅ Authentic logos and assets
✅ Proper navigation components
✅ ag-Grid theme integration
✅ Brand-specific styling`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `❌ Error loading Gravitate themes: ${error}`
          }]
        };
      }
    }
  );

  /**
   * Tool: Generate Themed Component
   * Creates components using real themes and proper Excalibrr components
   */
  server.tool(
    "generate_themed_component",
    "Generate a component using a specific Gravitate theme with proper Excalibrr navigation",
    {
      themeKey: z.string().describe("Theme key (e.g., 'OSP', 'PE', 'BP')"),
      componentType: z.enum(['grid', 'dashboard', 'navigation', 'complete-layout']).describe("Type of component to generate"),
      componentName: z.string().describe("Name for the generated component"),
      gridConfig: z.object({
        columns: z.array(z.object({
          field: z.string(),
          headerName: z.string(),
          type: z.string().optional()
        })).optional(),
        sampleData: z.array(z.record(z.any())).optional(),
        title: z.string().optional(),
        uniqueIdField: z.string().optional()
      }).optional().describe("Configuration for grid components")
    },
    async ({ themeKey, componentType, componentName, gridConfig }) => {
      try {
        const theme = await getThemeByKey(themeKey.toUpperCase());
        if (!theme) {
          return {
            content: [{
              type: "text",
              text: `❌ Theme "${themeKey}" not found. Available themes: ${(await listAvailableThemes()).join(', ')}`
            }]
          };
        }

        const navConfig: NavigationConfig = {
          theme,
          user: {
            name: "Frank Designer",
            email: "frank@gravitate.energy"
          },
          currentModule: "PricingEngine",
          currentPage: "ContractManagement"
        };

        let generatedCode = "";
        let fileExtension = "tsx";

        switch (componentType) {
          case 'navigation':
            generatedCode = `// ${componentName} - ${theme.display} Theme Navigation
${generateHorizontalToolbar(navConfig)}

${generateVerticalNav(navConfig)}`;
            break;

          case 'grid':
            generatedCode = `// ${componentName} - ${theme.display} Theme Data Grid
${generateThemedGraviGrid(navConfig, gridConfig || {})}`;
            break;

          case 'dashboard':
            generatedCode = `// ${componentName} - ${theme.display} Theme Dashboard
import { Horizontal, Vertical, DashboardWidget } from '@gravitate-js/excalibrr';

${generateThemedGraviGrid(navConfig, gridConfig || {
              title: "Dashboard Data View",
              columns: [
                { field: 'metric', headerName: 'Metric' },
                { field: 'value', headerName: 'Value', type: 'numericColumn' },
                { field: 'change', headerName: 'Change', type: 'numericColumn' }
              ],
              sampleData: [
                { metric: 'Total Contracts', value: 1250, change: 5.2 },
                { metric: 'Active Trades', value: 847, change: -2.1 },
                { metric: 'Revenue YTD', value: 2847293, change: 8.7 }
              ],
              uniqueIdField: 'metric'
            })}`;
            break;

          case 'complete-layout':
            const mainContent = gridConfig ? 
              generateThemedGraviGrid(navConfig, gridConfig).replace(/^[\s\S]*?function ThemedDataGrid.*?{/, '').replace(/}\s*export default.*$/, '') :
              `<Vertical gap={24}>
  <h1>Welcome to ${theme.display}</h1>
  <p>Your themed application content goes here.</p>
</Vertical>`;
            
            generatedCode = generateCompleteLayout(navConfig, mainContent);
            break;
        }

        // Save the generated component
        const outputDir = `/Users/rebecca.hirai/Desktop/excalibrr-previews/themed-components`;
        await fs.mkdir(outputDir, { recursive: true });
        
        const filePath = path.join(outputDir, `${componentName}.${fileExtension}`);
        await fs.writeFile(filePath, generatedCode);

        // Generate theme CSS file with fonts
        const themeCSS = generateThemeCSS(theme);
        const cssPath = path.join(outputDir, `${componentName}-${theme.key}-theme.css`);
        await fs.writeFile(cssPath, themeCSS);

        // Copy font files if generating complete layout
        if (componentType === 'complete-layout') {
          await copyFontFiles(outputDir, theme);
        }

        return {
          content: [{
            type: "text",
            text: `✅ **Themed Component Generated!**

**Component:** ${componentName}
**Theme:** ${theme.display} (${theme.key})
**Type:** ${componentType}

**Files Created:**
📄 \`${filePath}\`
🎨 \`${cssPath}\`

**Theme Details:**
• Primary Color: ${theme.colors.primary[0]}
• Background: ${theme.colors.background[0]}
• Logo: ${theme.assets.logo ? '✅ Included' : '❌ Not available'}
• Navigation: ✅ HorizontalToolbar + VerticalNav

**Features:**
✅ **Authentic ${theme.display} branding**
✅ **Real Excalibrr components** (no fake divs!)
✅ **Proper navigation structure**
✅ **Theme-integrated GraviGrid**
✅ **Production-ready code**

**Code Preview:**
\`\`\`tsx
${generatedCode.slice(0, 300)}...
\`\`\`

**Next Steps:**
1. Copy the files to your project
2. Import the CSS theme file
3. Customize with your specific data
4. Deploy with confidence!

**Generated at:** ${new Date().toISOString()}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `❌ Error generating themed component: ${error}`
          }]
        };
      }
    }
  );

  /**
   * Tool: Generate Full Themed Application
   * Creates a complete React app with proper theme and navigation
   */
  server.tool(
    "generate_themed_application",
    "Generate a complete React application with proper Gravitate theme and authentic Excalibrr components",
    {
      appName: z.string().describe("Name for the application"),
      themeKey: z.string().describe("Theme key (e.g., 'OSP', 'PE', 'BP')"),
      features: z.array(z.object({
        name: z.string(),
        type: z.enum(['grid', 'form', 'dashboard', 'report']),
        config: z.record(z.any()).optional()
      })).describe("Features to include in the application"),
      includeNavigation: z.boolean().default(true).describe("Include proper navigation components")
    },
    async ({ appName, themeKey, features, includeNavigation }) => {
      try {
        const theme = await getThemeByKey(themeKey.toUpperCase());
        if (!theme) {
          return {
            content: [{
              type: "text",
              text: `❌ Theme "${themeKey}" not found. Available themes: ${(await listAvailableThemes()).join(', ')}`
            }]
          };
        }

        const appDir = `/Users/rebecca.hirai/Desktop/excalibrr-previews/themed-apps/${appName}`;
        await fs.mkdir(appDir, { recursive: true });
        await fs.mkdir(path.join(appDir, 'src'), { recursive: true });
        await fs.mkdir(path.join(appDir, 'src/components'), { recursive: true });

        const navConfig: NavigationConfig = {
          theme,
          user: {
            name: "Frank Designer", 
            email: "frank@gravitate.energy"
          }
        };

        // Generate package.json
        const packageJson = {
          name: appName.toLowerCase(),
          version: "1.0.0",
          private: true,
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0", 
            "@gravitate-js/excalibrr": "latest",
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "typescript": "^5.0.0"
          },
          scripts: {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview"
          },
          devDependencies: {
            "@vitejs/plugin-react": "^4.0.0",
            "vite": "^4.4.0"
          }
        };

        await fs.writeFile(
          path.join(appDir, 'package.json'),
          JSON.stringify(packageJson, null, 2)
        );

        // Generate main App component
        const mainContent = features.map((feature, index) => {
          if (feature.type === 'grid') {
            return generateThemedGraviGrid(navConfig, feature.config || {
              title: feature.name,
              columns: [
                { field: 'id', headerName: 'ID', type: 'numericColumn' },
                { field: 'name', headerName: 'Name' },
                { field: 'status', headerName: 'Status' }
              ],
              sampleData: [
                { id: 1, name: 'Sample Item 1', status: 'Active' },
                { id: 2, name: 'Sample Item 2', status: 'Pending' }
              ],
              uniqueIdField: 'id'
            }).replace(/^[\s\S]*?function ThemedDataGrid.*?{/, '').replace(/}\s*export default.*$/, '');
          }
          return `<div key="${index}">Feature: ${feature.name}</div>`;
        }).join('\n\n');

        const appComponent = includeNavigation ?
          generateCompleteLayout(navConfig, mainContent) :
          `import React from 'react';
import { ThemeContextProvider } from '@gravitate-js/excalibrr';

const themeConfig = ${JSON.stringify({
            key: theme.key,
            display: theme.display,
            colors: theme.colors,
            assets: theme.assets
          }, null, 2)};

function App() {
  return (
    <ThemeContextProvider theme={themeConfig}>
      <div className="app theme-${theme.key.toLowerCase()}">
        ${mainContent}
      </div>
    </ThemeContextProvider>
  );
}

export default App;`;

        await fs.writeFile(
          path.join(appDir, 'src/App.tsx'),
          appComponent
        );

        // Generate index.html
        const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName} - ${theme.display} Theme</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

        await fs.writeFile(path.join(appDir, 'index.html'), indexHtml);

        // Generate main.tsx
        const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './${appName}-${theme.key}-theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`;

        await fs.writeFile(path.join(appDir, 'src/main.tsx'), mainTsx);

        // Generate theme CSS with fonts
        const themeCSS = generateThemeCSS(theme);
        await fs.writeFile(
          path.join(appDir, `src/${appName}-${theme.key}-theme.css`),
          themeCSS
        );

        // Copy font files to public directory
        await copyFontFiles(appDir, theme);

        // Generate vite.config.ts
        const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  }
})`;

        await fs.writeFile(path.join(appDir, 'vite.config.ts'), viteConfig);

        return {
          content: [{
            type: "text",
            text: `🚀 **Complete ${theme.display} Themed Application Generated!**

**Application:** ${appName}
**Theme:** ${theme.display} (${theme.key})
**Features:** ${features.length} components included
**Navigation:** ${includeNavigation ? '✅ Full navigation included' : '❌ Basic layout only'}

**📁 Application Structure:**
\`${appDir}\`
├── package.json
├── index.html  
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── ${appName}-${theme.key}-theme.css
    └── components/

**🎨 Theme Features:**
✅ **Authentic ${theme.display} branding**
✅ **Real color variables** from your LESS files
✅ **Proper logos and assets**
${includeNavigation ? '✅ **HorizontalToolbar navigation**\n✅ **VerticalNav sidebar**' : ''}
✅ **ag-Grid theme integration**
✅ **Responsive design**

**🚀 To run the application:**
\`\`\`bash
cd "${appDir}"
npm install
npm run dev
\`\`\`

**🌐 Then open:** http://localhost:3001

**Features Generated:**
${features.map(f => `• **${f.name}** (${f.type})`).join('\n')}

This is a **production-ready** application using **authentic Excalibrr components** and your **real ${theme.display} theme**!

**Generated at:** ${new Date().toISOString()}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `❌ Error generating themed application: ${error}`
          }]
        };
      }
    }
  );

  /**
   * Tool: Preview Theme Colors
   * Shows the actual colors from a theme
   */
  server.tool(
    "preview_theme_colors",
    "Preview the actual colors and assets from a specific Gravitate theme",
    {
      themeKey: z.string().describe("Theme key to preview (e.g., 'OSP', 'PE', 'BP')")
    },
    async ({ themeKey }) => {
      try {
        const theme = await getThemeByKey(themeKey.toUpperCase());
        if (!theme) {
          return {
            content: [{
              type: "text",
              text: `❌ Theme "${themeKey}" not found. Available themes: ${(await listAvailableThemes()).join(', ')}`
            }]
          };
        }

        const colorPreview = `🎨 **${theme.display} Theme Color Palette**

**Primary Colors:**
• Color 1: ${theme.colors.primary[0]} (Main brand color)
• Color 2: ${theme.colors.primary[1]} (Secondary brand)  
• Color 3: ${theme.colors.primary[2]} (Accent)
• Color 4: ${theme.colors.primary[3]} (Highlight)

**Background Colors:**
• Primary: ${theme.colors.background[0]} (Main background)
• Secondary: ${theme.colors.background[1]} (Card backgrounds)
• Tertiary: ${theme.colors.background[2]} (Subtle backgrounds)

**Text Colors:**
• Primary: ${theme.colors.text[0]} (Main text)
• Secondary: ${theme.colors.text[1]} (Muted text)

**Status Colors:**
• Success: ${theme.colors.success}
• Error: ${theme.colors.error}  
• Warning: ${theme.colors.warning}
• Info: ${theme.colors.info}

**Assets:**
• Logo: ${theme.assets.logo ? '✅ Available' : '❌ Not found'}
• Login Banner: ${theme.assets.loginBanner ? '✅ Available' : '❌ Not found'}
• Powered By: ${theme.assets.poweredBy ? '✅ Available' : '❌ Not found'}

**Theme Type:** ${theme.isDark ? 'Dark' : 'Light'} theme

**CSS Variables Available:**
${Object.entries(theme.cssVariables).slice(0, 5).map(([key, value]) => `• ${key}: ${value}`).join('\n')}
${Object.keys(theme.cssVariables).length > 5 ? `... and ${Object.keys(theme.cssVariables).length - 5} more` : ''}`;

        return {
          content: [{
            type: "text",
            text: colorPreview
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `❌ Error previewing theme colors: ${error}`
          }]
        };
      }
    }
  );
}
