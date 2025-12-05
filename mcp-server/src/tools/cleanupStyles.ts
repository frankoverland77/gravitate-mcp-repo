import { promises as fs } from "fs";
import path from "path";
import { DEMO_SRC } from "../utils/paths.js";

interface CleanupStylesArgs {
  filePath?: string;
  pattern?: string;
}

interface StyleReplacement {
  pattern: RegExp;
  replacement: (match: string, ...groups: any[]) => string;
  description: string;
}

/**
 * Tool for automatically cleaning up inline styles and replacing them with utility classes
 * Follows the prefer-utility-css-classes.mdc rule
 */
export async function cleanupStylesTool(args: CleanupStylesArgs) {
  const { filePath, pattern = "**/*.{tsx,jsx}" } = args;

  try {
    let filesToProcess: string[] = [];

    if (filePath) {
      // Process single file - if absolute path, use as-is; otherwise resolve from DEMO_SRC
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(DEMO_SRC, filePath);
      filesToProcess = [absolutePath];
    } else {
      // Process files matching pattern in demo/src directory
      const demoSrcPath = DEMO_SRC;

      // Use fs.readdir recursively to find files instead of glob
      const findFiles = async (dir: string, pattern: RegExp): Promise<string[]> => {
        const files: string[] = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...await findFiles(fullPath, pattern));
          } else if (pattern.test(entry.name)) {
            files.push(fullPath);
          }
        }
        return files;
      };

      const filePattern = /\.(tsx|jsx)$/;
      filesToProcess = await findFiles(demoSrcPath, filePattern);
    }

    const results = [];
    let totalReplacements = 0;

    for (const file of filesToProcess) {
      const result = await processFile(file);
      if (result.replacementCount > 0) {
        results.push(result);
        totalReplacements += result.replacementCount;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `🎨 Style Cleanup Complete!

📊 **Summary:**
- Files processed: ${filesToProcess.length}
- Files modified: ${results.length}
- Total replacements: ${totalReplacements}

${results.length > 0 ? `
📝 **Modified Files:**
${results.map(r => `  • ${path.relative(DEMO_SRC, r.filePath)}: ${r.replacementCount} changes`).join('\n')}

🔧 **Changes Made:**
${results.flatMap(r => r.changes.map(change => `  • ${change}`)).join('\n')}
` : '✨ No style improvements needed - code is already clean!'}

💡 **Tip:** Run this tool after writing new components to ensure consistent styling.`
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error cleaning up styles: ${error instanceof Error ? error.message : String(error)}`
        }
      ]
    };
  }
}

async function processFile(filePath: string) {
  const content = await fs.readFile(filePath, 'utf-8');
  const originalContent = content;

  const replacements: StyleReplacement[] = [
    // Margin and padding replacements
    {
      pattern: /style=\{\{\s*marginBottom:\s*["']4px["']\s*\}\}/g,
      replacement: () => 'className="mb-1"',
      description: 'marginBottom: "4px" → className="mb-1"'
    },
    {
      pattern: /style=\{\{\s*marginBottom:\s*["']8px["']\s*\}\}/g,
      replacement: () => 'className="mb-1"',
      description: 'marginBottom: "8px" → className="mb-1"'
    },
    {
      pattern: /style=\{\{\s*marginBottom:\s*["']12px["']\s*\}\}/g,
      replacement: () => 'className="mb-2"',
      description: 'marginBottom: "12px" → className="mb-2"'
    },
    {
      pattern: /style=\{\{\s*marginBottom:\s*["']16px["']\s*\}\}/g,
      replacement: () => 'className="mb-2"',
      description: 'marginBottom: "16px" → className="mb-2"'
    },
    {
      pattern: /style=\{\{\s*marginBottom:\s*["']32px["']\s*\}\}/g,
      replacement: () => 'className="mb-4"',
      description: 'marginBottom: "32px" → className="mb-4"'
    },
    {
      pattern: /style=\{\{\s*marginTop:\s*["']4px["']\s*\}\}/g,
      replacement: () => 'className="mt-1"',
      description: 'marginTop: "4px" → className="mt-1"'
    },
    {
      pattern: /style=\{\{\s*marginTop:\s*["']8px["']\s*\}\}/g,
      replacement: () => 'className="mt-1"',
      description: 'marginTop: "8px" → className="mt-1"'
    },
    {
      pattern: /style=\{\{\s*marginLeft:\s*["']16px["']\s*\}\}/g,
      replacement: () => 'className="ml-2"',
      description: 'marginLeft: "16px" → className="ml-2"'
    },
    {
      pattern: /style=\{\{\s*padding:\s*["']16px["']\s*\}\}/g,
      replacement: () => 'className="p-2"',
      description: 'padding: "16px" → className="p-2"'
    },
    {
      pattern: /style=\{\{\s*padding:\s*["']20px["']\s*\}\}/g,
      replacement: () => 'className="p-3"',
      description: 'padding: "20px" → className="p-3"'
    },
    {
      pattern: /style=\{\{\s*padding:\s*["']24px["']\s*\}\}/g,
      replacement: () => 'className="p-3"',
      description: 'padding: "24px" → className="p-3"'
    },

    // Border radius replacements
    {
      pattern: /style=\{\{\s*borderRadius:\s*["'](5|6|8)px["']\s*\}\}/g,
      replacement: () => 'className="border-radius-5"',
      description: 'borderRadius: "Xpx" → className="border-radius-5"'
    },

    // Text alignment
    {
      pattern: /style=\{\{\s*textAlign:\s*["']center["']\s*\}\}/g,
      replacement: () => 'className="text-center"',
      description: 'textAlign: "center" → className="text-center"'
    },

    // Combined style and className - merge className additions
    {
      pattern: /className=["']([^"']*?)["']\s+style=\{\{([^}]*?)marginBottom:\s*["']4px["'][^}]*?\}\}/g,
      replacement: (match, existingClasses, remainingStyles) => {
        const newClasses = existingClasses + (existingClasses ? ' ' : '') + 'mb-1';
        const cleanStyles = remainingStyles.replace(/marginBottom:\s*["']4px["']\s*,?\s*/, '').replace(/^,\s*|,\s*$/, '').trim();
        return cleanStyles ? `className="${newClasses}" style={{${cleanStyles}}}` : `className="${newClasses}"`;
      },
      description: 'Merged marginBottom into className'
    },
    {
      pattern: /className=["']([^"']*?)["']\s+style=\{\{([^}]*?)marginBottom:\s*["']16px["'][^}]*?\}\}/g,
      replacement: (match, existingClasses, remainingStyles) => {
        const newClasses = existingClasses + (existingClasses ? ' ' : '') + 'mb-2';
        const cleanStyles = remainingStyles.replace(/marginBottom:\s*["']16px["']\s*,?\s*/, '').replace(/^,\s*|,\s*$/, '').trim();
        return cleanStyles ? `className="${newClasses}" style={{${cleanStyles}}}` : `className="${newClasses}"`;
      },
      description: 'Merged marginBottom into className'
    },
    {
      pattern: /className=["']([^"']*?)["']\s+style=\{\{([^}]*?)marginBottom:\s*["']32px["'][^}]*?\}\}/g,
      replacement: (match, existingClasses, remainingStyles) => {
        const newClasses = existingClasses + (existingClasses ? ' ' : '') + 'mb-4';
        const cleanStyles = remainingStyles.replace(/marginBottom:\s*["']32px["']\s*,?\s*/, '').replace(/^,\s*|,\s*$/, '').trim();
        return cleanStyles ? `className="${newClasses}" style={{${cleanStyles}}}` : `className="${newClasses}"`;
      },
      description: 'Merged marginBottom into className'
    }
  ];

  let modifiedContent = content;
  const changes: string[] = [];

  for (const replacement of replacements) {
    const beforeCount = modifiedContent.length;
    modifiedContent = modifiedContent.replace(replacement.pattern, (...args) => {
      changes.push(replacement.description);
      return replacement.replacement(...args);
    });

    // If content changed, continue to next replacement
    if (modifiedContent.length !== beforeCount) {
      continue;
    }
  }

  const replacementCount = changes.length;

  if (replacementCount > 0) {
    await fs.writeFile(filePath, modifiedContent);
  }

  return {
    filePath,
    replacementCount,
    changes,
    wasModified: modifiedContent !== originalContent
  };
}