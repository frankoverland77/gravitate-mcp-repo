import fs from "fs";
import path from "path";

export interface CleanupDemoParams {
  name: string;
  force?: boolean; // Skip confirmation
}

const DEMO_DIR = path.join(process.cwd(), "demo", "src", "pages", "demos");

export async function cleanupDemo(params: CleanupDemoParams): Promise<string> {
  const { name, force = false } = params;
  
  if (!name) {
    throw new Error("Demo name is required");
  }
  
  const demoPath = path.join(DEMO_DIR, name);
  const removedItems: string[] = [];
  
  // 1. Remove demo directory if it exists
  if (fs.existsSync(demoPath)) {
    fs.rmSync(demoPath, { recursive: true, force: true });
    removedItems.push(`📁 Removed directory: ${name}/`);
  }
  
  // 2. Clean up pageConfig.tsx
  const pageConfigPath = path.join(process.cwd(), "demo", "src", "pageConfig.tsx");
  if (fs.existsSync(pageConfigPath)) {
    let pageConfig = fs.readFileSync(pageConfigPath, "utf8");
    const originalLength = pageConfig.length;
    
    // Remove import statement - handle various import patterns
    const importPatterns = [
      `import { ${name} } from "./pages/demos/${name}/${name}";`,
      `import { ${name} } from "./pages/demos/${name}";`,
      `import { ${name}Demo } from "./pages/demos/${name}";`,
      `import { ${name}Demo } from "./pages/demos/${name}/index";`,
    ];
    
    for (const pattern of importPatterns) {
      if (pageConfig.includes(pattern)) {
        pageConfig = pageConfig.replace(pattern + '\n', '');
        pageConfig = pageConfig.replace(pattern, '');
      }
    }
    
    // Remove from config object - handle both standalone and nested in routes
    // First, try to remove as a top-level entry
    const topLevelRegex = new RegExp(`  ${name}: \\{[^}]*\\},?\\n?`, 'gs');
    pageConfig = pageConfig.replace(topLevelRegex, '');
    
    // Then try to remove from routes arrays
    const routeEntryRegex = new RegExp(`\\{[^}]*key: "${name}"[^}]*\\},?\\n?`, 'gs');
    pageConfig = pageConfig.replace(routeEntryRegex, '');
    
    // Clean up any references in JSX elements
    const elementPatterns = [
      `element: <${name} />`,
      `element: <${name}Demo />`,
    ];
    
    for (const pattern of elementPatterns) {
      // This handles cases where the component is referenced in nested routes
      if (pageConfig.includes(pattern)) {
        // Find and remove the entire route object containing this element
        const routeObjRegex = new RegExp(`\\{[^{}]*${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^{}]*\\},?`, 'gs');
        pageConfig = pageConfig.replace(routeObjRegex, '');
      }
    }
    
    // Clean up empty sections (like Forms: with empty routes)
    pageConfig = pageConfig.replace(/,?\s*\w+:\s*\[\s*\]\s*\}?/g, '');
    
    // Clean up trailing commas and extra newlines
    pageConfig = pageConfig.replace(/,(\s*[}\]])/g, '$1');
    pageConfig = pageConfig.replace(/\n\n+/g, '\n\n');
    
    // Clean up any malformed sections
    pageConfig = pageConfig.replace(/,?\s*\w+:\s*\n\s*\]\s*\}/g, '');
    
    if (pageConfig.length !== originalLength) {
      fs.writeFileSync(pageConfigPath, pageConfig);
      removedItems.push(`📝 Cleaned pageConfig.tsx`);
    }
  }
  
  // 3. Clean up AuthenticatedRoute.jsx
  const authRoutePath = path.join(process.cwd(), "demo", "src", "_Main", "AuthenticatedRoute.jsx");
  if (fs.existsSync(authRoutePath)) {
    let authRoute = fs.readFileSync(authRoutePath, "utf8");
    const originalLength = authRoute.length;
    
    // Remove scope entry - handle with or without trailing comma
    const scopePatterns = [
      `    ${name}: true,\n`,
      `    ${name}: true\n`,
      `    ${name}: true,`,
      `    ${name}: true`,
    ];
    
    for (const pattern of scopePatterns) {
      if (authRoute.includes(pattern)) {
        authRoute = authRoute.replace(pattern, '');
      }
    }
    
    // Also check for variations like FormName + "Form" suffix
    const suffixPatterns = [
      `    ${name}Form: true,\n`,
      `    ${name}Form: true\n`,
      `    ${name}Form: true,`,
      `    ${name}Form: true`,
    ];
    
    for (const pattern of suffixPatterns) {
      if (authRoute.includes(pattern)) {
        authRoute = authRoute.replace(pattern, '');
      }
    }
    
    if (authRoute.length !== originalLength) {
      fs.writeFileSync(authRoutePath, authRoute);
      removedItems.push(`🔑 Removed scope from AuthenticatedRoute.jsx`);
    }
  }
  
  // 4. Clean up any orphaned files in demos directory
  const orphanedFiles = [
    path.join(process.cwd(), "demo", "src", "pages", "demos", `${name}.tsx`),
    path.join(process.cwd(), "demo", "src", "pages", "demos", `${name}.data.ts`),
  ];
  
  for (const file of orphanedFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      removedItems.push(`🗑️  Removed orphaned file: ${path.basename(file)}`);
    }
  }
  
  if (removedItems.length === 0) {
    return `⚠️  No demo found with name: ${name}`;
  }
  
  return `✅ Successfully cleaned up demo: ${name}

${removedItems.join('\n')}

🧹 Cleanup complete! All traces removed.`;
}