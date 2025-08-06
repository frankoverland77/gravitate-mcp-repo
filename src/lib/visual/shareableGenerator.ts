// Shareable preview generation for stakeholder reviews
import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "../types.js";
import {
  generatePreviewHTML,
  createPreviewDirectory,
} from "./previewHelpers.js";

export interface ShareableOptions {
  variant: string;
  theme: string;
  includeCodeExample: boolean;
}

export interface ShareableResult {
  filePath: string;
  fileSize: number;
  timestamp: string;
}

/**
 * Generate a completely self-contained shareable preview HTML file
 */
export async function generateShareablePreview(
  componentName: string,
  componentInfo: ComponentInfo,
  options: ShareableOptions
): Promise<ShareableResult> {
  const { variant, theme, includeCodeExample } = options;

  // Generate base HTML
  const baseHtml = generatePreviewHTML(componentName, componentInfo, {
    variant: variant as "basic" | "with-data" | "styled" | "interactive",
    theme: theme as "light" | "dark",
  });

  // Create enhanced HTML with better title and self-contained assets
  const shareableHtml = enhanceForSharing(baseHtml, componentName, options);

  // Save to file
  const previewDir = await createPreviewDirectory();
  const filename = `${componentName}-shareable-${Date.now()}.html`;
  const filePath = path.join(previewDir, "html", filename);

  await fs.writeFile(filePath, shareableHtml, "utf8");
  const fileStats = await fs.stat(filePath);

  return {
    filePath,
    fileSize: fileStats.size,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Enhance HTML for sharing with better presentation and self-contained assets
 */
function enhanceForSharing(
  html: string,
  componentName: string,
  options: ShareableOptions
): string {
  const { variant, theme, includeCodeExample } = options;

  // Enhance the title
  let enhancedHtml = html.replace(
    "<title>",
    `<title>📋 ${componentName} Preview - Excalibrr Design System | `
  );

  // Add professional styling for stakeholder presentation
  const professionalStyles = generateProfessionalStyles(theme);
  enhancedHtml = enhancedHtml.replace(
    "</head>",
    `${professionalStyles}</head>`
  );

  // Add component metadata section
  const metadataSection = generateMetadataSection(
    componentName,
    variant,
    theme
  );
  enhancedHtml = enhancedHtml.replace("<body>", `<body>${metadataSection}`);

  // Add code example if requested
  if (includeCodeExample) {
    const codeSection = generateCodeExampleSection(componentName, variant);
    enhancedHtml = enhancedHtml.replace("</body>", `${codeSection}</body>`);
  }

  // Add sharing footer
  const footerSection = generateSharingFooter();
  enhancedHtml = enhancedHtml.replace("</body>", `${footerSection}</body>`);

  return enhancedHtml;
}

/**
 * Generate professional styles for stakeholder presentations
 */
function generateProfessionalStyles(theme: string): string {
  const isDark = theme === "dark";

  return `
    <style>
      .shareable-header {
        background: linear-gradient(135deg, #0969da, #1f883d);
        color: white;
        padding: 20px;
        margin: -20px -20px 30px -20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
      }
      
      .shareable-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      
      .shareable-subtitle {
        margin: 8px 0 0 0;
        opacity: 0.9;
        font-size: 16px;
      }
      
      .metadata-section {
        background-color: ${isDark ? "#161b22" : "#f6f8fa"};
        border: 1px solid ${isDark ? "#30363d" : "#d0d7de"};
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }
      
      .metadata-item {
        text-align: center;
      }
      
      .metadata-label {
        font-size: 12px;
        text-transform: uppercase;
        color: ${isDark ? "#7d8590" : "#656d76"};
        margin-bottom: 4px;
      }
      
      .metadata-value {
        font-weight: 600;
        color: #0969da;
      }
      
      .code-section {
        margin-top: 40px;
        padding: 24px;
        background-color: ${isDark ? "#0d1117" : "#f6f8fa"};
        border-radius: 8px;
        border: 1px solid ${isDark ? "#21262d" : "#d0d7de"};
      }
      
      .code-title {
        margin: 0 0 16px 0;
        font-size: 18px;
        font-weight: 600;
        color: ${isDark ? "#f0f6fc" : "#24292f"};
      }
      
      .code-block {
        background-color: ${isDark ? "#161b22" : "#ffffff"};
        border: 1px solid ${isDark ? "#30363d" : "#d0d7de"};
        border-radius: 6px;
        padding: 16px;
        font-family: 'SFMono-Regular', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        font-size: 14px;
        line-height: 1.45;
        overflow-x: auto;
      }
      
      .sharing-footer {
        margin-top: 40px;
        padding: 20px;
        text-align: center;
        border-top: 1px solid ${isDark ? "#30363d" : "#d0d7de"};
        color: ${isDark ? "#7d8590" : "#656d76"};
        font-size: 14px;
      }
      
      .sharing-footer strong {
        color: #0969da;
      }
    </style>`;
}

/**
 * Generate metadata section for component information
 */
function generateMetadataSection(
  componentName: string,
  variant: string,
  theme: string
): string {
  return `
    <div class="shareable-header">
      <h1 class="shareable-title">${componentName} Component Preview</h1>
      <p class="shareable-subtitle">Excalibrr Design System</p>
    </div>
    
    <div class="metadata-section">
      <div class="metadata-item">
        <div class="metadata-label">Component</div>
        <div class="metadata-value">${componentName}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Variant</div>
        <div class="metadata-value">${variant}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Theme</div>
        <div class="metadata-value">${theme}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Generated</div>
        <div class="metadata-value">${new Date().toLocaleDateString()}</div>
      </div>
    </div>`;
}

/**
 * Generate code example section
 */
function generateCodeExampleSection(
  componentName: string,
  variant: string
): string {
  const exampleCode = generateExampleCode(componentName, variant);

  return `
    <div class="code-section">
      <h3 class="code-title">📝 Code Example</h3>
      <div class="code-block">${exampleCode}</div>
    </div>`;
}

/**
 * Generate example code for the component
 */
function generateExampleCode(componentName: string, variant: string): string {
  // This is a simplified example - in a real implementation,
  // you might want to use the actual component generation logic
  return `&lt;${componentName}
  variant="${variant}"
  // Add your props here
&gt;
  {/* Your content */}
&lt;/${componentName}&gt;`;
}

/**
 * Generate sharing footer
 */
function generateSharingFooter(): string {
  return `
    <div class="sharing-footer">
      <p><strong>Perfect for:</strong> Client presentations, stakeholder reviews, and design approvals!</p>
      <p>Generated by <strong>Excalibrr MCP Server</strong> - Self-contained preview with no external dependencies</p>
    </div>`;
}
