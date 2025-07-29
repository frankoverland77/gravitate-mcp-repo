// Visual preview tools for Excalibrr MCP Server

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ComponentInfo } from "../../lib/types.js";
import {
  findComponentByName,
  getAllComponents,
} from "../../lib/componentAnalysis.js";
import {
  generatePreviewHTML,
  saveHTMLPreview,
  createPreviewDirectory,
  PreviewOptions,
  ScreenshotResult,
  LivePreviewResult,
  generateComponentScreenshot,
  generateComponentGallery,
  generateShareablePreview,
  type GalleryOptions,
  type ShareableOptions,
} from "../../lib/visual/index.js";

export function registerVisualPreviewTools(server: McpServer): void {
  // Tool: Generate component screenshot
  server.tool(
    "generate_component_screenshot",
    "Generate a visual screenshot of an Excalibrr component with specific props and styling",
    {
      componentName: z
        .string()
        .describe("The name of the component to screenshot"),
      variant: z
        .enum(["basic", "with-data", "styled", "interactive"])
        .optional()
        .describe("Component variant to preview"),
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Theme for the preview"),
      size: z
        .enum(["mobile", "tablet", "desktop"])
        .optional()
        .describe("Screen size for the preview"),
      width: z.number().optional().describe("Custom width in pixels"),
      height: z.number().optional().describe("Custom height in pixels"),
    },
    async ({
      componentName,
      variant = "basic",
      theme = "light",
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
                text: `Component "${componentName}" not found in the Excalibrr library.`,
              },
            ],
          };
        }

        const options: PreviewOptions = { variant, theme, size, width, height };
        const screenshotResult = await generateComponentScreenshot(
          componentName,
          componentInfo,
          options
        );

        return {
          content: [
            {
              type: "text",
              text: `🖼️ **Screenshot Generated Successfully!**

**Component:** ${componentName}
**Variant:** ${variant}
**Theme:** ${theme}
**Size:** ${size}${width ? ` (${width}x${height}px)` : ""}

**Screenshot saved to:** \`${screenshotResult.imagePath}\`

The screenshot shows the ${componentName} component rendered with the ${variant} variant in ${theme} theme. You can open the image file to view the component preview.

**Generated at:** ${screenshotResult.timestamp}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error generating screenshot: ${error}`,
            },
          ],
        };
      }
    }
  );

  // Tool: Create live interactive preview
  server.tool(
    "create_live_preview",
    "Create a live interactive HTML preview of an Excalibrr component that can be opened in a browser",
    {
      componentName: z
        .string()
        .describe("The name of the component to preview"),
      variant: z
        .enum(["basic", "with-data", "styled", "interactive"])
        .optional()
        .describe("Component variant to preview"),
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Theme for the preview"),
      includeControls: z
        .boolean()
        .optional()
        .describe("Include prop controls for interactive manipulation"),
    },
    async ({
      componentName,
      variant = "interactive",
      theme = "light",
      includeControls = true,
    }) => {
      try {
        const componentInfo = await findComponentByName(componentName);
        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found in the Excalibrr library.`,
              },
            ],
          };
        }

        const options: PreviewOptions = { variant, theme };
        const html = generatePreviewHTML(componentName, componentInfo, options);
        const htmlPath = await saveHTMLPreview(componentName, html, variant);

        // Convert to file:// URL for easy access
        const previewUrl = `file://${htmlPath}`;

        const result: LivePreviewResult = {
          previewUrl,
          htmlPath,
          componentName,
          hasControls: includeControls && variant === "interactive",
          timestamp: new Date().toISOString(),
        };

        return {
          content: [
            {
              type: "text",
              text: `🌐 **Live Preview Created Successfully!**

**Component:** ${componentName}
**Variant:** ${variant}
**Theme:** ${theme}
**Interactive Controls:** ${result.hasControls ? "Yes" : "No"}

**🔗 Preview URL:** \`${previewUrl}\`

**📁 HTML File:** \`${htmlPath}\`

**How to use:**
1. **Copy the preview URL** and paste it into your browser's address bar
2. **Or open the HTML file** directly by double-clicking it
3. **Share with stakeholders** by sending them the HTML file

**Features in this preview:**
- ✅ Live component rendering
- ✅ ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme
- ✅ Responsive design
- ${result.hasControls ? "✅ Interactive prop controls" : "➖ Static preview"}
- ✅ Copy code functionality
- ✅ Real-time updates (for interactive variant)

**Perfect for:** Design reviews, stakeholder presentations, and development reference!

**Generated at:** ${result.timestamp}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error creating live preview: ${error}`,
            },
          ],
        };
      }
    }
  );

  // Tool: Create component gallery
  server.tool(
    "create_component_gallery",
    "Create a visual gallery showcasing multiple Excalibrr components with previews and documentation",
    {
      category: z
        .enum(["data", "forms", "layout", "interactive", "ui", "all"])
        .optional()
        .describe("Filter components by category"),
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Theme for the gallery"),
      includeScreenshots: z
        .boolean()
        .optional()
        .describe("Generate screenshots for each component"),
    },
    async ({
      category = "all",
      theme = "light",
      includeScreenshots = true,
    }) => {
      try {
        const allComponents = await getAllComponents();
        const filteredComponents =
          category === "all"
            ? allComponents
            : allComponents.filter((comp) => comp.category === category);

        if (filteredComponents.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No components found${
                  category !== "all" ? ` in category "${category}"` : ""
                }.`,
              },
            ],
          };
        }

        const galleryResult = await generateComponentGallery(
          filteredComponents,
          { theme, includeScreenshots, category }
        );

        return {
          content: [
            {
              type: "text",
              text: `🖼️ **Component Gallery Created Successfully!**

**Gallery Type:** ${
                category === "all" ? "All Components" : `${category} Components`
              }
**Components Included:** ${filteredComponents.length}
**Theme:** ${theme}
**Screenshots:** ${includeScreenshots ? "Generated" : "Skipped"}

**🔗 Gallery URL:** \`${galleryResult.galleryUrl}\`

**📁 Gallery File:** \`${galleryResult.htmlPath}\`

**Components in this gallery:**
${filteredComponents
  .map(
    (comp) =>
      `• **${comp.name}** (${comp.category}) - ${
        comp.description || "No description"
      }`
  )
  .join("\n")}

**How to use:**
1. **Open the gallery URL** in your browser to explore all components
2. **Share with stakeholders** for design system overview
3. **Use for component selection** during design/development

**Gallery features:**
- ✅ Visual component previews
- ✅ Component documentation
- ✅ Props information
- ✅ Usage examples
- ✅ Category filtering
- ${includeScreenshots ? "✅ Screenshot previews" : "➖ No screenshots"}

**Generated at:** ${galleryResult.timestamp}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error creating component gallery: ${error}`,
            },
          ],
        };
      }
    }
  );

  // Tool: Generate shareable preview link
  server.tool(
    "create_shareable_preview",
    "Create a self-contained HTML file that can be shared with stakeholders via email or file sharing",
    {
      componentName: z
        .string()
        .describe("The name of the component to preview"),
      variant: z
        .enum(["basic", "with-data", "styled", "interactive"])
        .optional()
        .describe("Component variant to preview"),
      theme: z
        .enum(["light", "dark"])
        .optional()
        .describe("Theme for the preview"),
      includeCodeExample: z
        .boolean()
        .optional()
        .describe("Include code examples in the shareable preview"),
    },
    async ({
      componentName,
      variant = "with-data",
      theme = "light",
      includeCodeExample = true,
    }) => {
      try {
        const componentInfo = await findComponentByName(componentName);
        if (!componentInfo) {
          return {
            content: [
              {
                type: "text",
                text: `Component "${componentName}" not found in the Excalibrr library.`,
              },
            ],
          };
        }

        const shareableResult = await generateShareablePreview(
          componentName,
          componentInfo,
          {
            variant,
            theme,
            includeCodeExample,
          }
        );

        return {
          content: [
            {
              type: "text",
              text: `📤 **Shareable Preview Created!**

**Component:** ${componentName}
**Variant:** ${variant}
**Theme:** ${theme}
**Code Examples:** ${includeCodeExample ? "Included" : "Not included"}

**📁 Shareable File:** \`${shareableResult.filePath}\`

**How to share:**
1. **Email attachment:** Send the HTML file directly
2. **File sharing:** Upload to Dropbox, Google Drive, etc.
3. **Slack/Teams:** Share the file in channels
4. **Local presentation:** Open directly in any browser

**What stakeholders will see:**
- ✅ Live component preview
- ✅ Professional presentation layout
- ✅ Component documentation
- ${
                includeCodeExample
                  ? "✅ Code examples for developers"
                  : "➖ No code examples"
              }
- ✅ Responsive design
- ✅ No external dependencies

**Perfect for:** Client presentations, stakeholder reviews, and design approvals!

**File size:** ~${
                shareableResult.fileSize / 1024
              } KB (completely self-contained)`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Error creating shareable preview: ${error}`,
            },
          ],
        };
      }
    }
  );
}
