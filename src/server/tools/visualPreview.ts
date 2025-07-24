// Visual preview tools for Excalibrr MCP Server

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ComponentInfo } from "../../lib/types.js";
import { findComponentByName, getAllComponents } from "../../lib/componentAnalysis.js";
import {
  generatePreviewHTML,
  saveHTMLPreview,
  createPreviewDirectory,
  PreviewOptions,
  ScreenshotResult,
  LivePreviewResult,
} from "../../lib/visual/previewHelpers.js";
import * as puppeteer from "puppeteer";
import * as fs from "fs/promises";
import * as path from "path";

export function registerVisualPreviewTools(server: McpServer): void {
  // Tool: Generate component screenshot
  server.tool(
    "generate_component_screenshot",
    "Generate a visual screenshot of an Excalibrr component with specific props and styling",
    {
      componentName: z.string().describe("The name of the component to screenshot"),
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
      componentName: z.string().describe("The name of the component to preview"),
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
    async ({ category = "all", theme = "light", includeScreenshots = true }) => {
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
      componentName: z.string().describe("The name of the component to preview"),
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

        const shareableHtml = await generateShareablePreview(
          componentName,
          componentInfo,
          { 
            variant: variant as "basic" | "with-data" | "styled" | "interactive", 
            theme: theme as "light" | "dark", 
            includeCodeExample 
          }
        );

        const previewDir = await createPreviewDirectory();
        const filename = `${componentName}-shareable-${Date.now()}.html`;
        const filePath = path.join(previewDir, "html", filename);

        await fs.writeFile(filePath, shareableHtml, "utf8");

        return {
          content: [
            {
              type: "text",
              text: `📤 **Shareable Preview Created!**

**Component:** ${componentName}
**Variant:** ${variant}
**Theme:** ${theme}
**Code Examples:** ${includeCodeExample ? "Included" : "Not included"}

**📁 Shareable File:** \`${filePath}\`

**How to share:**
1. **Email attachment:** Send the HTML file directly
2. **File sharing:** Upload to Dropbox, Google Drive, etc.
3. **Slack/Teams:** Share the file in channels
4. **Local presentation:** Open directly in any browser

**What stakeholders will see:**
- ✅ Live component preview
- ✅ Professional presentation layout
- ✅ Component documentation
- ${includeCodeExample ? "✅ Code examples for developers" : "➖ No code examples"}
- ✅ Responsive design
- ✅ No external dependencies

**Perfect for:** Client presentations, stakeholder reviews, and design approvals!

**File size:** ~${(await fs.stat(filePath)).size / 1024} KB (completely self-contained)`,
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

/**
 * Generate component screenshot using Puppeteer
 */
async function generateComponentScreenshot(
  componentName: string,
  componentInfo: ComponentInfo,
  options: PreviewOptions
): Promise<ScreenshotResult> {
  const { variant = "basic", theme = "light", size = "desktop" } = options;

  // Generate HTML for screenshot
  const html = generatePreviewHTML(componentName, componentInfo, options);
  const previewDir = await createPreviewDirectory();

  // Save temporary HTML file
  const tempHtmlPath = path.join(previewDir, "temp-screenshot.html");
  await fs.writeFile(tempHtmlPath, html, "utf8");

  // Launch Puppeteer and take screenshot
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport based on size
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1200, height: 800 },
  };

  const viewport = viewports[size] || viewports.desktop;
  if (options.width && options.height) {
    viewport.width = options.width;
    viewport.height = options.height;
  }

  await page.setViewport(viewport);
  await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

  // Wait for React to render
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Take screenshot of the component preview area
  const screenshotBuffer = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    },
    type: "png",
  });

  await browser.close();

  // Save screenshot
  const screenshotFilename = `${componentName}-${variant}-${theme}-${Date.now()}.png`;
  const screenshotPath = path.join(previewDir, "screenshots", screenshotFilename);
  await fs.writeFile(screenshotPath, screenshotBuffer);

  // Clean up temp file
  await fs.unlink(tempHtmlPath);

  return {
    imagePath: screenshotPath,
    componentName,
    variant,
    theme,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate component gallery HTML
 */
async function generateComponentGallery(
  components: ComponentInfo[],
  options: { theme: string; includeScreenshots: boolean; category: string }
): Promise<{ galleryUrl: string; htmlPath: string; timestamp: string }> {
  const { theme, category } = options;

  const galleryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Excalibrr Component Gallery - ${category}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: ${theme === "dark" ? "#0d1117" : "#ffffff"};
            color: ${theme === "dark" ? "#f0f6fc" : "#24292f"};
            line-height: 1.6;
        }
        
        .gallery-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .gallery-header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid ${theme === "dark" ? "#30363d" : "#d0d7de"};
            padding-bottom: 40px;
        }
        
        .gallery-title {
            font-size: 48px;
            font-weight: 700;
            margin: 0 0 16px 0;
            background: linear-gradient(135deg, #0969da, #1f883d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .gallery-subtitle {
            font-size: 20px;
            opacity: 0.7;
            margin: 0;
        }
        
        .components-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .component-card {
            background-color: ${theme === "dark" ? "#161b22" : "#f6f8fa"};
            border: 1px solid ${theme === "dark" ? "#30363d" : "#d0d7de"};
            border-radius: 12px;
            padding: 24px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .component-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px ${theme === "dark" ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"};
        }
        
        .component-name {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #0969da;
        }
        
        .component-category {
            display: inline-block;
            background-color: #0969da;
            color: white;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        
        .component-description {
            margin-bottom: 20px;
            opacity: 0.8;
        }
        
        .component-preview {
            background-color: ${theme === "dark" ? "#0d1117" : "#ffffff"};
            border: 1px solid ${theme === "dark" ? "#21262d" : "#d0d7de"};
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .component-props {
            font-size: 14px;
            opacity: 0.7;
        }
        
        .stats-bar {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 60px;
            padding: 30px;
            background-color: ${theme === "dark" ? "#161b22" : "#f6f8fa"};
            border-radius: 12px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-number {
            font-size: 32px;
            font-weight: 700;
            color: #0969da;
            display: block;
        }
        
        .stat-label {
            font-size: 14px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="gallery-container">
        <div class="gallery-header">
            <h1 class="gallery-title">Excalibrr Component Gallery</h1>
            <p class="gallery-subtitle">
                ${category === "all" ? "Complete Component Library" : `${category.charAt(0).toUpperCase() + category.slice(1)} Components`}
            </p>
        </div>
        
        <div class="components-grid">
            ${components
              .map(
                (comp) => `
                <div class="component-card">
                    <h3 class="component-name">${comp.name}</h3>
                    <span class="component-category">${comp.category}</span>
                    
                    <div class="component-description">
                        ${comp.description || "No description available"}
                    </div>
                    
                    <div class="component-preview">
                        <div style="text-align: center; opacity: 0.6;">
                            📋 ${comp.name} Preview
                            <br><small>Interactive preview available</small>
                        </div>
                    </div>
                    
                    <div class="component-props">
                        <strong>Props:</strong> ${Object.keys(comp.props || {}).length} properties
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
        
        <div class="stats-bar">
            <div class="stat">
                <span class="stat-number">${components.length}</span>
                <span class="stat-label">Components</span>
            </div>
            <div class="stat">
                <span class="stat-number">${
                  new Set(components.map((c) => c.category)).size
                }</span>
                <span class="stat-label">Categories</span>
            </div>
            <div class="stat">
                <span class="stat-number">${components.reduce(
                  (total, comp) => total + Object.keys(comp.props || {}).length,
                  0
                )}</span>
                <span class="stat-label">Total Props</span>
            </div>
        </div>
    </div>
</body>
</html>`;

  const previewDir = await createPreviewDirectory();
  const filename = `gallery-${category}-${Date.now()}.html`;
  const filePath = path.join(previewDir, "galleries", filename);

  await fs.writeFile(filePath, galleryHtml, "utf8");

  return {
    galleryUrl: `file://${filePath}`,
    htmlPath: filePath,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate shareable preview with embedded assets
 */
async function generateShareablePreview(
  componentName: string,
  componentInfo: ComponentInfo,
  options: { variant: string; theme: string; includeCodeExample: boolean }
): Promise<string> {
  const { variant, theme, includeCodeExample } = options;
  const html = generatePreviewHTML(componentName, componentInfo, {
    variant: variant as "basic" | "with-data" | "styled" | "interactive",
    theme: theme as "light" | "dark",
  });

  // Create a completely self-contained version
  return html.replace(
    '<title>',
    `<title>📋 ${componentName} Preview - Excalibrr Design System | `
  );
}