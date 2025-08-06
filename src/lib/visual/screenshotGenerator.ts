// Screenshot generation using Puppeteer for component previews
import * as puppeteer from "puppeteer";
import * as fs from "fs/promises";
import * as path from "path";
import { ComponentInfo } from "../types.js";
import {
  generatePreviewHTML,
  createPreviewDirectory,
  PreviewOptions,
  ScreenshotResult,
} from "./previewHelpers.js";

/**
 * Viewport configurations for different screen sizes
 */
const VIEWPORT_CONFIGS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
} as const;

/**
 * Generate a screenshot of a component using Puppeteer
 */
export async function generateComponentScreenshot(
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

  let browser: puppeteer.Browser | null = null;

  try {
    // Launch Puppeteer and take screenshot
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set viewport based on size
    const viewport = getViewportConfig(size, options.width, options.height);
    await page.setViewport(viewport);
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

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

    // Save screenshot
    const screenshotFilename = `${componentName}-${variant}-${theme}-${Date.now()}.png`;
    const screenshotPath = path.join(
      previewDir,
      "screenshots",
      screenshotFilename
    );
    await fs.writeFile(screenshotPath, screenshotBuffer);

    return {
      imagePath: screenshotPath,
      componentName,
      variant,
      theme,
      timestamp: new Date().toISOString(),
    };
  } finally {
    // Clean up resources
    if (browser) {
      await browser.close();
    }

    // Clean up temp file
    try {
      await fs.unlink(tempHtmlPath);
    } catch (error) {
      // Ignore cleanup errors
      console.warn(
        `Warning: Could not cleanup temp file ${tempHtmlPath}:`,
        error
      );
    }
  }
}

/**
 * Get viewport configuration based on size and custom dimensions
 */
function getViewportConfig(
  size: keyof typeof VIEWPORT_CONFIGS | "desktop",
  customWidth?: number,
  customHeight?: number
): { width: number; height: number } {
  const baseViewport = VIEWPORT_CONFIGS[size] || VIEWPORT_CONFIGS.desktop;

  return {
    width: customWidth || baseViewport.width,
    height: customHeight || baseViewport.height,
  };
}

/**
 * Batch screenshot generation for multiple variants/themes
 */
export async function generateBatchScreenshots(
  componentName: string,
  componentInfo: ComponentInfo,
  configs: Array<{ variant: string; theme: string; size?: string }>
): Promise<ScreenshotResult[]> {
  const results: ScreenshotResult[] = [];

  for (const config of configs) {
    try {
      const result = await generateComponentScreenshot(
        componentName,
        componentInfo,
        {
          variant: config.variant as any,
          theme: config.theme as any,
          size: (config.size as any) || "desktop",
        }
      );
      results.push(result);
    } catch (error) {
      console.error(
        `Failed to generate screenshot for ${componentName} (${config.variant}/${config.theme}):`,
        error
      );
    }
  }

  return results;
}
