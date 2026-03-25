import { promises as fs } from "fs";
import { 
  validateGridDemo, 
  addReactHook, 
  findReturnStatement, 
  createToolResponse, 
  handleToolError 
} from "../utils/demoUtils.js";

interface ChangeThemeArgs {
  demoName: string;
  theme: "OSP" | "PE" | "BP" | "default";
}

/**
 * Changes the theme of an existing demo
 *
 * This follows the same pattern as the ControlPanel component:
 * - Sets localStorage.setItem("TYPE_OF_THEME", theme) 
 * - Lets the ThemeContextProvider handle theme application
 */
export async function changeThemeTool(args: ChangeThemeArgs) {
  const { demoName, theme } = args;

  try {
    const { path: demoPath, content: tsxContent } = await validateGridDemo(demoName);
    
    // Add theme script to the demo
    const updatedContent = await addThemeScriptToDemo(tsxContent, theme);
    
    // Write the updated content back
    await fs.writeFile(demoPath, updatedContent);
    
    return createToolResponse(
      `Changed ${demoName} theme to ${theme}`,
      demoName,
      `🎨 Theme: ${theme}\n\nThe demo will now automatically use the ${theme} theme when viewed. This follows the same pattern as the main app's theme system using localStorage.`
    );

  } catch (error) {
    return handleToolError(`Change ${demoName} theme to ${theme}`, error);
  }
}

/**
 * Add theme-setting script to a demo
 * This follows the same pattern as the ControlPanel: set localStorage
 */
async function addThemeScriptToDemo(
  tsxContent: string, 
  theme: "OSP" | "PE" | "BP" | "default"
): Promise<string> {
  let updatedContent = tsxContent;
  
  // Check if theme script already exists
  const hasThemeScript = tsxContent.includes('/* MCP Theme Script */');
  
  if (hasThemeScript) {
    // Replace existing theme script - just update the theme value in useEffect
    updatedContent = updatedContent.replace(
      /localStorage\.setItem\("TYPE_OF_THEME", "[^"]+"\)/,
      `localStorage.setItem("TYPE_OF_THEME", "${theme}")`
    );
  } else {
    // Add useEffect import if not present
    updatedContent = addReactHook(updatedContent, 'useEffect');
    
    // Add useEffect to set theme on component mount
    const { index: returnInsertPoint } = findReturnStatement(updatedContent);
    updatedContent = 
      updatedContent.substring(0, returnInsertPoint) + 
      `  /* MCP Theme Script */\n  // Set ${theme} theme for this demo (follows ControlPanel pattern)\n  useEffect(() => {\n    if (typeof localStorage !== 'undefined') {\n      localStorage.setItem("TYPE_OF_THEME", "${theme}");\n    }\n  }, []);\n  /* End MCP Theme Script */\n\n` +
      updatedContent.substring(returnInsertPoint);
  }
  
  return updatedContent;
}