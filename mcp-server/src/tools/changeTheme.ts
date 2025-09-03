import { promises as fs } from "fs";
import path from "path";
import { getThemeCSS } from "../utils/gridFontFix.js";

interface ChangeThemeArgs {
  demoName: string;
  theme: "OSP" | "PE" | "BP" | "default";
}

/**
 * Changes the theme of an existing demo
 *
 * This updates:
 * - CSS variables for colors
 * - Font configurations
 * - Theme-specific styling
 */
export async function changeThemeTool(args: ChangeThemeArgs) {
  const { demoName, theme } = args;

  const demoPath = path.join(process.cwd(), "demos", demoName);
  const indexPath = path.join(demoPath, "index.html");

  // Check if demo exists
  try {
    await fs.access(demoPath);
  } catch {
    throw new Error(
      `Demo '${demoName}' not found. Create it first with create_demo.`
    );
  }

  // Read the current HTML file
  let htmlContent = await fs.readFile(indexPath, "utf-8");

  // Get the new theme CSS
  const newThemeCSS = getThemeCSS(theme);

  // Replace the theme CSS in the <style> tag
  const styleRegex = /<style>([\s\S]*?)<\/style>/;
  const styleMatch = htmlContent.match(styleRegex);

  if (!styleMatch) {
    throw new Error("Could not find style tag in demo file");
  }

  // Extract the non-theme parts of the CSS
  const currentCSS = styleMatch[1];
  const nonThemeCSS = currentCSS.replace(
    /\/\* Theme CSS[\s\S]*?\/\* End Theme CSS \*\//,
    ""
  );

  // Create new CSS with updated theme
  const newCSS = `
        ${newThemeCSS}
        
        ${nonThemeCSS}
    `;

  // Replace the CSS
  htmlContent = htmlContent.replace(styleRegex, `<style>${newCSS}</style>`);

  // Update the title to reflect the new theme
  htmlContent = htmlContent.replace(
    /<title>.*?<\/title>/,
    `<title>${demoName} - Excalibrr Demo (${theme})</title>`
  );

  // Update the mock navigation theme reference
  htmlContent = htmlContent.replace(/Gravitate \w+/, `Gravitate ${theme}`);

  // Write the updated content back
  await fs.writeFile(indexPath, htmlContent);

  return {
    content: [
      {
        type: "text",
        text: `✅ Changed ${demoName} theme to ${theme}

🎨 Theme: ${theme}
📁 Location: ./demos/${demoName}

The demo will automatically reload with the new theme if the dev server is running.`,
      },
    ],
  };
}
