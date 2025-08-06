// Component gallery generation for visual previews
import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "../types.js";
import { createPreviewDirectory } from "./previewHelpers.js";

export interface GalleryOptions {
  theme: string;
  includeScreenshots: boolean;
  category: string;
}

export interface GalleryResult {
  galleryUrl: string;
  htmlPath: string;
  timestamp: string;
}

/**
 * Generate a component gallery HTML page
 */
export async function generateComponentGallery(
  components: ComponentInfo[],
  options: GalleryOptions
): Promise<GalleryResult> {
  const { theme, category } = options;
  const galleryHtml = generateGalleryHTML(components, theme, category);

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
 * Generate the HTML content for the component gallery
 */
function generateGalleryHTML(
  components: ComponentInfo[],
  theme: string,
  category: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Excalibrr Component Gallery - ${category}</title>
    <style>
        ${generateGalleryCSS(theme)}
    </style>
</head>
<body>
    <div class="gallery-container">
        <div class="gallery-header">
            <h1 class="gallery-title">Excalibrr Component Gallery</h1>
            <p class="gallery-subtitle">
                ${
                  category === "all"
                    ? "Complete Component Library"
                    : `${
                        category.charAt(0).toUpperCase() + category.slice(1)
                      } Components`
                }
            </p>
        </div>
        
        <div class="components-grid">
            ${generateComponentCards(components)}
        </div>
        
        <div class="stats-bar">
            ${generateStatsBar(components)}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generate CSS styles for the gallery
 */
function generateGalleryCSS(theme: string): string {
  const isDark = theme === "dark";

  return `
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: ${isDark ? "#0d1117" : "#ffffff"};
            color: ${isDark ? "#f0f6fc" : "#24292f"};
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
            border-bottom: 1px solid ${isDark ? "#30363d" : "#d0d7de"};
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
            background-color: ${isDark ? "#161b22" : "#f6f8fa"};
            border: 1px solid ${isDark ? "#30363d" : "#d0d7de"};
            border-radius: 12px;
            padding: 24px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .component-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px ${
              isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
            };
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
            background-color: ${isDark ? "#0d1117" : "#ffffff"};
            border: 1px solid ${isDark ? "#21262d" : "#d0d7de"};
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
            background-color: ${isDark ? "#161b22" : "#f6f8fa"};
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
        }`;
}

/**
 * Generate component cards HTML
 */
function generateComponentCards(components: ComponentInfo[]): string {
  return components
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
                        <strong>Props:</strong> ${
                          Object.keys(comp.props || {}).length
                        } properties
                    </div>
                </div>
            `
    )
    .join("");
}

/**
 * Generate statistics bar HTML
 */
function generateStatsBar(components: ComponentInfo[]): string {
  const totalProps = components.reduce(
    (total, comp) => total + Object.keys(comp.props || {}).length,
    0
  );
  const categoryCount = new Set(components.map((c) => c.category)).size;

  return `
            <div class="stat">
                <span class="stat-number">${components.length}</span>
                <span class="stat-label">Components</span>
            </div>
            <div class="stat">
                <span class="stat-number">${categoryCount}</span>
                <span class="stat-label">Categories</span>
            </div>
            <div class="stat">
                <span class="stat-number">${totalProps}</span>
                <span class="stat-label">Total Props</span>
            </div>`;
}
