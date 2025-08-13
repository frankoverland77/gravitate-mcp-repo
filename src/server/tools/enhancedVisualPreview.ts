// Enhanced visual preview tool with authentic Gravitate styling
// src/server/tools/enhancedVisualPreview.ts

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ComponentInfo } from "../../lib/types.js";
import { findComponentByName } from "../../lib/componentAnalysis.js";
import { 
  generateAuthenticPreviewHTML, 
  AuthenticPreviewOptions,
  saveHTMLPreview,
  createPreviewDirectory 
} from "../../lib/visual/authenticPreviewHelpers.js";
import { listAvailableThemes } from "../../lib/themeSystem.js";

export function registerEnhancedVisualPreviewTools(server: McpServer): void {
  
  // Tool: Generate authentic Gravitate-style preview
  server.tool(
    "generate_authentic_preview",
    "Generate a visual preview with authentic Gravitate styling and theming that matches your production application",
    {
      componentName: z
        .string()
        .describe("The name of the component to preview"),
      variant: z
        .enum(["basic", "with-data", "styled", "interactive"])
        .optional()
        .default("with-data")
        .describe("Component variant to preview"),
      themeKey: z
        .enum(["OSP", "PE", "BP", "DKB", "FHR", "MURPHY", "GROWMARK", "MOTIVA", "P66", "SUNOCO", "LIGHT_MODE", "DARK_MODE"])
        .optional()
        .default("PE")
        .describe("Gravitate theme to use for styling"),
      size: z
        .enum(["mobile", "tablet", "desktop"])
        .optional()
        .default("desktop")
        .describe("Screen size for the preview"),
      width: z.number().optional().describe("Custom width in pixels"),
      height: z.number().optional().describe("Custom height in pixels"),
    },
    async ({
      componentName,
      variant = "with-data",
      themeKey = "PE",
      size = "desktop",
      width,
      height,
    }) => {
      try {
        const componentInfo = await findComponentByName(componentName);
        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Component "${componentName}" not found in the Excalibrr library.

**Available components include:** GraviGrid, Horizontal, Vertical, Modal, Select, GraviButton, etc.

Try using the \`discover_components\` tool to see all available components.`,
              },
            ],
          };
        }

        const options: AuthenticPreviewOptions = { 
          variant, 
          themeKey, 
          size, 
          width, 
          height 
        };
        
        const html = await generateAuthenticPreviewHTML(
          componentName, 
          componentInfo, 
          options
        );
        
        const htmlPath = await saveHTMLPreview(
          componentName, 
          html, 
          `${variant}-${themeKey}`
        );

        // Convert to file:// URL for easy access
        const previewUrl = `file://${htmlPath}`;

        return {
          content: [
            {
              type: "text",
              text: `🎨 **Authentic ${themeKey} Preview Generated Successfully!**

**Component:** ${componentName}
**Variant:** ${variant}
**Theme:** ${themeKey} (${themeKey === 'OSP' ? 'OSP Energy' : themeKey === 'PE' ? 'Pricing Engine' : themeKey === 'BP' ? 'BP Energy' : themeKey})
**Size:** ${size}${width ? ` (${width}x${height}px)` : ""}

**🔗 Preview URL:** \`${previewUrl}\`

**📁 HTML File:** \`${htmlPath}\`

**✨ What's New in This Preview:**
- 🎯 **Authentic Gravitate Styling** - Matches your production application
- 🎨 **Real ${themeKey} Theme** - Uses actual colors and fonts from your theme system
- 📏 **Professional Grid Layout** - Proper ag-Grid styling with correct fonts
- 🔤 **Lato Font Integration** - Matches your production typography
- 🌓 **Proper Color Variables** - Uses your actual CSS variables
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🎛️ **Interactive Controls** - ${variant === 'interactive' ? 'Live prop manipulation' : 'Static preview'}

**🎯 Key Improvements Over Mock Previews:**
- Uses your actual Gravitate color palette
- Professional sidebar navigation
- Authentic grid styling with proper borders and spacing
- Real production-like layout and typography
- Proper status indicators and formatting

**Perfect for:**
- 👥 Design reviews with stakeholders  
- 📊 Component documentation
- 🎨 Design system demonstrations
- 💼 Client presentations

**How to use:**
1. **Copy the preview URL** and paste it into your browser
2. **Or double-click the HTML file** to open it directly
3. **Share the HTML file** with team members or stakeholders
4. **Use for design reviews** - it looks just like your production app!

**Generated at:** ${new Date().toLocaleString()}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Error generating authentic preview:** ${error}

This might be due to:
- Theme not found (try: OSP, PE, BP, etc.)
- Component analysis issues
- File system permissions

Try using a different theme or check the component name.`,
            },
          ],
        };
      }
    }
  );

  // Tool: List available Gravitate themes
  server.tool(
    "list_gravitate_themes",
    "List all available Gravitate themes including client themes (OSP, PE, BP, etc.)",
    {},
    async () => {
      try {
        const themes = await listAvailableThemes();
        
        // Group themes by type
        const clientThemes = themes.filter(theme => 
          ['OSP', 'PE', 'BP', 'DKB', 'FHR', 'MURPHY', 'GROWMARK', 'MOTIVA', 'P66', 'SUNOCO'].includes(theme)
        );
        
        const systemThemes = themes.filter(theme => 
          ['LIGHT_MODE', 'DARK_MODE'].includes(theme)
        );
        
        const seasonalThemes = themes.filter(theme => 
          ['CHRISTMAS', 'THANKSGIVING'].includes(theme)
        );

        return {
          content: [
            {
              type: "text",
              text: `🎨 **Available Gravitate Themes**

**🏢 Client Themes:**
${clientThemes.map(theme => {
  const descriptions = {
          'OSP': 'OSP Energy - Dark green/teal theme',
          'PE': 'Pricing Engine - Blue/professional theme',
          'BP': 'BP Energy - BP branded colors',
          'DKB': 'DKB - Custom client theme',
          'FHR': 'FHR - Custom client theme',
          'MURPHY': 'Murphy - Custom client theme',
          'GROWMARK': 'Growmark - Custom client theme',
          'MOTIVA': 'Motiva - Custom client theme',
          'P66': 'Phillips 66 - Custom client theme',
          'SUNOCO': 'Sunoco - Custom client theme'
        } as const;
        return `• **${theme}** - ${descriptions[theme as keyof typeof descriptions] || 'Custom client theme'}`;
}).join('\n')}

**⚙️ System Themes:**
${systemThemes.map(theme => 
  `• **${theme}** - ${theme === 'LIGHT_MODE' ? 'Standard light theme' : 'Standard dark theme'}`
).join('\n')}

**🎄 Seasonal Themes:**
${seasonalThemes.map(theme => 
  `• **${theme}** - ${theme.toLowerCase().charAt(0).toUpperCase() + theme.toLowerCase().slice(1)} themed styling`
).join('\n')}

**💡 Usage Examples:**
- \`generate_authentic_preview\` with \`themeKey: "OSP"\` for OSP Energy styling
- \`generate_authentic_preview\` with \`themeKey: "PE"\` for Pricing Engine styling  
- \`generate_authentic_preview\` with \`themeKey: "BP"\` for BP Energy styling

**🎯 Most Popular Themes:**
- **PE** - Clean, professional blue theme (default)
- **OSP** - Energy industry green/teal theme
- **BP** - BP corporate branding

Each theme includes authentic colors, fonts, and styling that matches your production applications!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error loading themes: ${error}

Available themes: OSP, PE, BP, DKB, FHR, MURPHY, GROWMARK, MOTIVA, P66, SUNOCO, LIGHT_MODE, DARK_MODE`,
            },
          ],
        };
      }
    }
  );

  // Tool: Generate themed component comparison
  server.tool(
    "compare_component_themes",
    "Generate side-by-side comparison of a component across multiple Gravitate themes",
    {
      componentName: z
        .string()
        .describe("The name of the component to compare"),
      themes: z
        .array(z.string())
        .optional()
        .default(["PE", "OSP", "BP"])
        .describe("Array of theme keys to compare"),
      variant: z
        .enum(["basic", "with-data", "styled", "interactive"])
        .optional()
        .default("with-data")
        .describe("Component variant to use for all themes"),
    },
    async ({
      componentName,
      themes = ["PE", "OSP", "BP"],
      variant = "with-data",
    }) => {
      try {
        const componentInfo = await findComponentByName(componentName);
        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Component "${componentName}" not found.`,
              },
            ],
          };
        }

        const previews = [];
        
        for (const themeKey of themes) {
          try {
            const html = await generateAuthenticPreviewHTML(
              componentName,
              componentInfo,
              { variant: variant as "basic" | "with-data" | "styled" | "interactive", themeKey, size: "desktop" }
            );
            
            const htmlPath = await saveHTMLPreview(
              componentName,
              html,
              `comparison-${variant}-${themeKey}`
            );
            
            previews.push({
              theme: themeKey,
              url: `file://${htmlPath}`,
              path: htmlPath
            });
          } catch (error) {
            console.error(`Error generating preview for theme ${themeKey}:`, error);
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `🎨 **Theme Comparison Generated: ${componentName}**

**Variant:** ${variant}
**Themes Compared:** ${themes.join(', ')}

**📱 Generated Previews:**
${previews.map(p => 
  `• **${p.theme} Theme:** \`${p.url}\``
).join('\n')}

**📁 Files Created:**
${previews.map(p => 
  `• ${p.theme}: \`${p.path}\``
).join('\n')}

**🎯 How to Use:**
1. **Open each preview URL** in separate browser tabs
2. **Compare side-by-side** to see theme differences
3. **Share with stakeholders** to choose preferred styling
4. **Use for design decisions** across different client themes

**🎨 What You'll See:**
- Different color schemes for each theme
- Consistent component behavior across themes
- Professional styling that matches production apps
- Real fonts and spacing from your design system

Perfect for client presentations and design system documentation!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating theme comparison: ${error}`,
            },
          ],
        };
      }
    }
  );
  
  // Tool: Generate component showcase with multiple variants
  server.tool(
    "generate_component_showcase",
    "Create a comprehensive showcase of a component with all variants in one view",
    {
      componentName: z
        .string()
        .describe("The name of the component to showcase"),
      themeKey: z
        .enum(["OSP", "PE", "BP", "DKB", "FHR", "MURPHY", "GROWMARK", "MOTIVA", "P66", "SUNOCO", "LIGHT_MODE", "DARK_MODE"])
        .optional()
        .default("PE")
        .describe("Gravitate theme to use for the showcase"),
    },
    async ({ componentName, themeKey = "PE" }) => {
      try {
        const componentInfo = await findComponentByName(componentName);
        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `❌ Component "${componentName}" not found.`,
              },
            ],
          };
        }

        const variants = ["basic", "with-data", "styled", "interactive"];
        const showcases = [];
        
        for (const variant of variants) {
          try {
            const html = await generateAuthenticPreviewHTML(
              componentName,
              componentInfo,
              { variant: variant as "basic" | "with-data" | "styled" | "interactive", themeKey, size: "desktop" }
            );
            
            const htmlPath = await saveHTMLPreview(
              componentName,
              html,
              `showcase-${variant}-${themeKey}`
            );
            
            showcases.push({
              variant,
              url: `file://${htmlPath}`,
              path: htmlPath
            });
          } catch (error) {
            console.error(`Error generating showcase for variant ${variant}:`, error);
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `🎭 **Component Showcase Generated: ${componentName}**

**Theme:** ${themeKey}
**All Variants Included:** ${variants.join(', ')}

**🎯 Showcase Previews:**
${showcases.map(s => 
  `• **${s.variant} Variant:** \`${s.url}\``
).join('\n')}

**📁 Generated Files:**
${showcases.map(s => 
  `• ${s.variant}: \`${s.path}\``
).join('\n')}

**🎨 What Each Variant Shows:**
- **Basic:** Simple component with minimal props
- **With Data:** Component populated with realistic sample data  
- **Styled:** Component with additional styling and visual enhancements
- **Interactive:** Component with live controls and interactivity

**💼 Perfect For:**
- Component documentation
- Design system showcases
- Developer onboarding
- Client demonstrations
- Design reviews

**🚀 Next Steps:**
1. Open each variant to see different use cases
2. Share with team members for feedback
3. Use as reference for implementation
4. Include in design system documentation

All previews use authentic ${themeKey} theme styling that matches your production application!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating component showcase: ${error}`,
            },
          ],
        };
      }
    }
  );
}
