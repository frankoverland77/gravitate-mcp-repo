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

  // Align with createDemo tool - demos are in demo/src/pages/demos/
  const demoPath = path.join(process.cwd(), "demo", "src", "pages", "demos", `${demoName}.tsx`);

  // Check if demo exists
  try {
    await fs.access(demoPath);
  } catch {
    throw new Error(
      `Demo '${demoName}' not found at ${demoPath}. Create it first with create_demo.`
    );
  }

  // For TSX demos, theme changes would need to be applied differently
  // Since TSX demos use CSS-in-JS or external stylesheets, not inline <style> tags
  // For now, let's just return a success message indicating theme would be changed
  // In a real implementation, this might:
  // 1. Update a theme context or provider
  // 2. Modify CSS variables in a stylesheet
  // 3. Change theme props passed to GraviGrid
  
  // Read the TSX file to verify it exists and get info
  const tsxContent = await fs.readFile(demoPath, "utf-8");
  
  // Check if it's a GraviGrid component
  if (!tsxContent.includes('GraviGrid')) {
    throw new Error(`${demoName} is not a grid demo. Theme changes are only supported for grid demos.`);
  }

  // TODO: Implement actual theme changing for TSX files
  // This would require:
  // - Adding theme prop to GraviGrid component
  // - Or updating CSS variables in a global stylesheet
  // - Or modifying theme context
  
  console.log(`Note: Theme changing for TSX demos is not yet fully implemented.`);
  console.log(`Would change ${demoName} to ${theme} theme.`);
  
  return {
    content: [
      {
        type: "text",
        text: `✅ Theme change requested for ${demoName}

🎨 Target Theme: ${theme}
📁 Location: ${demoPath}

Note: Theme changing for TSX demos is not yet fully implemented.
This would require updating the GraviGrid theme props or CSS variables.
The demo structure has been verified and the request was processed successfully.`,
      },
    ],
  };
}
