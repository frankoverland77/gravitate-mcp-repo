/**
 * Validate Code Tool
 * 
 * Validates TSX/JSX code against Excalibrr conventions.
 * Returns detailed feedback on violations with suggestions for fixes.
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  validateCode, 
  formatValidationResult,
  ValidationResult 
} from '../utils/conventions.js';

export interface ValidateCodeRequest {
  /** Code string to validate */
  code?: string;
  /** Path to file to validate */
  filePath?: string;
  /** Validate all files in directory */
  directory?: string;
  /** File pattern for directory validation */
  pattern?: string;
  /** Return raw JSON result instead of formatted */
  raw?: boolean;
}

export interface ValidateCodeResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

/**
 * Get the demo directory path
 */
function getDemoPath(): string {
  // Try to find the demo directory
  const possiblePaths = [
    path.join(process.cwd(), 'demo'),
    path.join(process.cwd(), '..', 'demo'),
    path.join(__dirname, '..', '..', '..', 'demo'),
    path.join(__dirname, '..', '..', 'demo'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return path.join(process.cwd(), 'demo');
}

/**
 * Recursively find files matching pattern
 */
function findFiles(dir: string, pattern: RegExp, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and hidden directories
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        findFiles(fullPath, pattern, files);
      }
    } else if (pattern.test(entry.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Validate code tool implementation
 */
export async function validateCodeTool(args: ValidateCodeRequest): Promise<ValidateCodeResponse> {
  const { code, filePath, directory, pattern = '\\.(tsx|jsx)$', raw = false } = args;
  
  try {
    // Validate code string
    if (code) {
      const result = validateCode(code);
      const output = raw
        ? JSON.stringify(result, null, 2)
        : formatValidationResult(result);

      return {
        content: [{ type: 'text', text: output }],
        isError: !result.valid
      };
    }
    
    // Validate single file
    if (filePath) {
      const fullPath = path.isAbsolute(filePath) 
        ? filePath 
        : path.join(getDemoPath(), filePath);
      
      if (!fs.existsSync(fullPath)) {
        return {
          content: [{ type: 'text', text: `File not found: ${fullPath}` }],
          isError: true
        };
      }
      
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const result = validateCode(fileContent, fullPath);
      const output = raw
        ? JSON.stringify(result, null, 2)
        : `# Validation: ${path.basename(fullPath)}\n\n${formatValidationResult(result)}`;

      return {
        content: [{ type: 'text', text: output }],
        isError: !result.valid
      };
    }
    
    // Validate directory
    if (directory) {
      const fullDir = path.isAbsolute(directory) 
        ? directory 
        : path.join(getDemoPath(), directory);
      
      if (!fs.existsSync(fullDir)) {
        return {
          content: [{ type: 'text', text: `Directory not found: ${fullDir}` }],
          isError: true
        };
      }
      
      const patternRegex = new RegExp(pattern);
      const files = findFiles(fullDir, patternRegex);
      
      if (files.length === 0) {
        return {
          content: [{ type: 'text', text: `No files matching pattern found in: ${fullDir}` }],
          isError: true
        };
      }
      
      const results: Array<{ file: string; result: ValidationResult }> = [];
      let totalErrors = 0;
      let totalWarnings = 0;
      
      for (const file of files) {
        const fileContent = fs.readFileSync(file, 'utf-8');
        const result = validateCode(fileContent, file);
        results.push({ file, result });
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
      }
      
      // Format output
      let output = `# Validation Report\n\n`;
      output += `**Files scanned:** ${files.length}\n`;
      output += `**Total errors:** ${totalErrors}\n`;
      output += `**Total warnings:** ${totalWarnings}\n\n`;
      
      if (totalErrors === 0 && totalWarnings === 0) {
        output += '✅ All files pass convention checks!\n';
      } else {
        output += '---\n\n';

        // Show files with issues
        for (const { file, result } of results) {
          if (result.errors.length > 0 || result.warnings.length > 0) {
            const relativePath = path.relative(getDemoPath(), file);
            output += `## 📄 ${relativePath}\n\n`;
            output += formatValidationResult(result);
            output += '\n---\n\n';
          }
        }
      }

      return {
        content: [{ type: 'text', text: output }],
        isError: totalErrors > 0
      };
    }
    
    // No input provided - validate demo/src by default
    const demoSrc = path.join(getDemoPath(), 'src');
    
    if (!fs.existsSync(demoSrc)) {
      return {
        content: [{ 
          type: 'text', 
          text: `# Validate Code Tool\n\nUsage:\n- Provide \`code\` parameter with code string to validate\n- Provide \`filePath\` parameter with path to file\n- Provide \`directory\` parameter to validate all files\n- Or call with no parameters to validate demo/src directory\n\nDemo directory not found at: ${demoSrc}` 
        }]
      };
    }
    
    // Recursively validate demo/src
    const patternRegex = /\.(tsx|jsx)$/;
    const files = findFiles(demoSrc, patternRegex);
    
    const results: Array<{ file: string; result: ValidationResult }> = [];
    let totalErrors = 0;
    let totalWarnings = 0;
    
    for (const file of files) {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const result = validateCode(fileContent, file);
      results.push({ file, result });
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
    
    // Format output
    let output = `# Convention Validation Report\n\n`;
    output += `**Directory:** demo/src\n`;
    output += `**Files scanned:** ${files.length}\n`;
    output += `**Total errors:** ${totalErrors}\n`;
    output += `**Total warnings:** ${totalWarnings}\n\n`;
    
    if (totalErrors === 0 && totalWarnings === 0) {
      output += '✅ All files pass convention checks!\n';
    } else {
      output += '---\n\n';
      
      // Show files with issues, errors first
      const filesWithErrors = results.filter(r => r.result.errors.length > 0);
      const filesWithWarningsOnly = results.filter(r => r.result.errors.length === 0 && r.result.warnings.length > 0);
      
      if (filesWithErrors.length > 0) {
        output += `## ❌ Files with Errors (${filesWithErrors.length})\n\n`;
        for (const { file, result } of filesWithErrors) {
          const relativePath = path.relative(getDemoPath(), file);
          output += `### 📄 ${relativePath}\n\n`;
          output += formatValidationResult(result);
          output += '\n';
        }
      }
      
      if (filesWithWarningsOnly.length > 0) {
        output += `## ⚠️ Files with Warnings Only (${filesWithWarningsOnly.length})\n\n`;
        for (const { file, result } of filesWithWarningsOnly) {
          const relativePath = path.relative(getDemoPath(), file);
          output += `### 📄 ${relativePath}\n\n`;
          output += formatValidationResult(result);
          output += '\n';
        }
      }
    }

    return {
      content: [{ type: 'text', text: output }],
      isError: totalErrors > 0
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error validating code: ${errorMessage}` }],
      isError: true
    };
  }
}
