/**
 * Review Component Tool
 * 
 * Provides a detailed review of a component with:
 * - Convention violations
 * - Best practice suggestions
 * - Pattern recommendations
 * - Improvement opportunities
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateCode, ValidationResult } from '../utils/conventions.js';

export interface ReviewComponentRequest {
  /** Code to review */
  code?: string;
  /** Path to file to review */
  filePath?: string;
  /** Focus area for review */
  focus?: 'all' | 'styling' | 'components' | 'structure' | 'accessibility';
}

export interface ReviewComponentResponse {
  content: Array<{ type: string; text: string }>;
}

interface PatternCheck {
  name: string;
  description: string;
  check: (code: string) => { found: boolean; details?: string; suggestion?: string };
}

/**
 * Best practice pattern checks
 */
const PATTERN_CHECKS: PatternCheck[] = [
  {
    name: 'Loading State Handling',
    description: 'Components fetching data should handle loading states',
    check: (code) => {
      const hasQuery = /useQuery|useMutation|isLoading|loading/i.test(code);
      const hasLoadingUI = /loading\s*[?&|]|isLoading|<Spin|<Loading|Skeleton/i.test(code);
      
      if (hasQuery && !hasLoadingUI) {
        return {
          found: true,
          details: 'Component uses queries but may not show loading state',
          suggestion: 'Add loading prop to GraviGrid or conditional loading UI'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Error Handling',
    description: 'API calls should have error handling',
    check: (code) => {
      const hasApiCall = /useQuery|useMutation|api\.|fetch\(|axios/i.test(code);
      const hasErrorHandling = /onError|catch|isError|error\s*[?&|]|NotificationMessage.*Error/i.test(code);
      
      if (hasApiCall && !hasErrorHandling) {
        return {
          found: true,
          details: 'API calls detected without visible error handling',
          suggestion: 'Add onError callback with NotificationMessage for user feedback'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Form Submission Pattern',
    description: 'Forms should use proper submission pattern',
    check: (code) => {
      const hasForm = /<Form|useForm/i.test(code);
      const hasProperSubmit = /form\.submit\(\)|onFinish|handleSubmit/i.test(code);
      
      if (hasForm && !hasProperSubmit) {
        return {
          found: true,
          details: 'Form detected but submission handler may be missing',
          suggestion: 'Use Form onFinish prop or GraviButton onClick={() => form.submit()}'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Memoization for Grid Column Defs',
    description: 'Grid column definitions should be memoized',
    check: (code) => {
      const hasGrid = /<GraviGrid/i.test(code);
      const hasColumnDefs = /columnDefs/i.test(code);
      const hasMemoizedCols = /useMemo\s*\(\s*\(\)\s*=>\s*.*columnDefs|const\s+columnDefs\s*=\s*useMemo/i.test(code);
      
      if (hasGrid && hasColumnDefs && !hasMemoizedCols) {
        return {
          found: true,
          details: 'Column definitions may cause unnecessary re-renders',
          suggestion: 'Wrap columnDefs in useMemo: const columnDefs = useMemo(() => [...], [dependencies])'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Control Bar Props Memoization',
    description: 'GraviGrid controlBarProps should be memoized',
    check: (code) => {
      const hasControlBar = /controlBarProps\s*=\s*\{/i.test(code);
      const hasMemoizedControlBar = /useMemo\s*\(\s*\(\)\s*=>\s*\(\s*\{.*controlBarProps|controlBarProps\s*=\s*useMemo/i.test(code);
      const isInlineObject = /controlBarProps\s*=\s*\{\s*\{/i.test(code);
      
      if (hasControlBar && isInlineObject && !hasMemoizedControlBar) {
        return {
          found: true,
          details: 'Inline controlBarProps object may cause re-renders',
          suggestion: 'Extract controlBarProps to useMemo: const controlBarProps = useMemo(() => ({...}), [])'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Proper Import Structure',
    description: 'Imports should follow the recommended order',
    check: (code) => {
      const lines = code.split('\n');
      const importLines = lines.filter(l => l.trim().startsWith('import'));
      
      let hasExcalibrr = false;
      let hasAntd = false;
      let excalibrrIndex = -1;
      let antdIndex = -1;
      
      importLines.forEach((line, index) => {
        if (/@gravitate-js\/excalibrr/i.test(line)) {
          hasExcalibrr = true;
          excalibrrIndex = index;
        }
        if (/from\s+['"]antd['"]/i.test(line)) {
          hasAntd = true;
          antdIndex = index;
        }
      });
      
      if (hasExcalibrr && hasAntd && antdIndex < excalibrrIndex) {
        return {
          found: true,
          details: 'Excalibrr imports should come before AntD imports',
          suggestion: 'Order: React → Excalibrr → AntD → Local imports'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Named Export Pattern',
    description: 'Components should use named exports',
    check: (code) => {
      const hasDefaultExport = /export\s+default\s+function/i.test(code);
      
      if (hasDefaultExport) {
        return {
          found: true,
          details: 'Using default export instead of named export',
          suggestion: 'Change to: export function ComponentName() { }'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'GraviGrid Storage Key',
    description: 'GraviGrid should have a unique storageKey',
    check: (code) => {
      const hasGrid = /<GraviGrid/i.test(code);
      const hasStorageKey = /storageKey\s*=/i.test(code);
      
      if (hasGrid && !hasStorageKey) {
        return {
          found: true,
          details: 'GraviGrid missing storageKey for column state persistence',
          suggestion: 'Add storageKey="UniqueGridName" for column preferences persistence'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Typography Consistency',
    description: 'Text should use Texto component consistently',
    check: (code) => {
      // Check for mixed usage
      const hasTexto = /<Texto/i.test(code);
      const hasRawText = /<(p|h[1-6]|span)\s*[^>]*>/i.test(code);
      
      if (hasTexto && hasRawText) {
        return {
          found: true,
          details: 'Mixed usage of Texto and raw HTML text elements',
          suggestion: 'Convert all text elements to Texto for consistency'
        };
      }
      return { found: false };
    }
  },
  {
    name: 'Utility Class Usage',
    description: 'Common spacing should use utility classes',
    check: (code) => {
      // Count inline spacing vs utility classes
      const inlineSpacing = (code.match(/style\s*=\s*\{[^}]*(margin|padding|gap)\s*:/gi) || []).length;
      const utilityClasses = (code.match(/className\s*=\s*['"][^'"]*(?:m[tblrxy]?-|p-|gap-)/gi) || []).length;
      
      if (inlineSpacing > 3 && utilityClasses < inlineSpacing) {
        return {
          found: true,
          details: `Found ${inlineSpacing} inline spacing styles, consider using utility classes`,
          suggestion: 'Use mb-2, p-3, gap-16 etc. for common spacing patterns'
        };
      }
      return { found: false };
    }
  }
];

/**
 * Get the demo directory path
 */
function getDemoPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'demo'),
    path.join(process.cwd(), '..', 'demo'),
    path.join(__dirname, '..', '..', '..', 'demo'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  
  return path.join(process.cwd(), 'demo');
}

/**
 * Review component tool implementation
 */
export async function reviewComponentTool(args: ReviewComponentRequest): Promise<ReviewComponentResponse> {
  const { code, filePath, focus = 'all' } = args;
  
  let codeToReview = code;
  let filename = 'inline code';
  
  // Load file if path provided
  if (filePath && !code) {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getDemoPath(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{ type: 'text', text: `File not found: ${fullPath}` }]
      };
    }
    
    codeToReview = fs.readFileSync(fullPath, 'utf-8');
    filename = path.basename(fullPath);
  }
  
  if (!codeToReview) {
    return {
      content: [{
        type: 'text',
        text: `# Review Component Tool

Provides detailed code review with convention checks and best practice suggestions.

## Usage
- Provide \`code\` parameter with code to review
- Or provide \`filePath\` parameter with path to file

## Options
- \`focus\`: 'all' | 'styling' | 'components' | 'structure' | 'accessibility'`
      }]
    };
  }
  
  try {
    // Run convention validation
    const validationResult = validateCode(codeToReview, filename);
    
    // Run pattern checks
    const patternIssues: Array<{ name: string; details: string; suggestion?: string }> = [];
    
    for (const check of PATTERN_CHECKS) {
      const result = check.check(codeToReview);
      if (result.found) {
        patternIssues.push({
          name: check.name,
          details: result.details || check.description,
          suggestion: result.suggestion
        });
      }
    }
    
    // Build review output
    let output = `# Component Review: ${filename}\n\n`;
    
    // Summary
    const totalIssues = validationResult.errors.length + validationResult.warnings.length + patternIssues.length;
    
    if (totalIssues === 0) {
      output += '## ✅ Excellent!\n\n';
      output += 'This component follows Excalibrr conventions and best practices.\n\n';
    } else {
      output += '## Summary\n\n';
      output += `- **Convention Errors:** ${validationResult.errors.length}\n`;
      output += `- **Convention Warnings:** ${validationResult.warnings.length}\n`;
      output += `- **Best Practice Issues:** ${patternIssues.length}\n\n`;
    }
    
    // Convention Issues
    if (validationResult.errors.length > 0 || validationResult.warnings.length > 0) {
      output += '## Convention Issues\n\n';
      
      if (validationResult.errors.length > 0) {
        output += '### ❌ Errors (Must Fix)\n\n';
        for (const error of validationResult.errors) {
          output += `**${error.ruleName}**`;
          if (error.line) output += ` (line ${error.line})`;
          output += `\n${error.message}\n`;
          if (error.suggestion) output += `→ ${error.suggestion}\n`;
          output += '\n';
        }
      }
      
      if (validationResult.warnings.length > 0) {
        output += '### ⚠️ Warnings\n\n';
        for (const warning of validationResult.warnings) {
          output += `**${warning.ruleName}**`;
          if (warning.line) output += ` (line ${warning.line})`;
          output += `\n${warning.message}\n`;
          if (warning.suggestion) output += `→ ${warning.suggestion}\n`;
          output += '\n';
        }
      }
    }
    
    // Best Practice Issues
    if (patternIssues.length > 0) {
      output += '## Best Practice Suggestions\n\n';
      
      for (const issue of patternIssues) {
        output += `### 💡 ${issue.name}\n`;
        output += `${issue.details}\n`;
        if (issue.suggestion) output += `→ ${issue.suggestion}\n`;
        output += '\n';
      }
    }
    
    // Component Stats
    output += '## Component Analysis\n\n';
    
    const stats = {
      lines: codeToReview.split('\n').length,
      hasExcalibrrImport: /@gravitate-js\/excalibrr/i.test(codeToReview),
      usesTexto: /<Texto/i.test(codeToReview),
      usesHorizontalVertical: /<(Horizontal|Vertical)/i.test(codeToReview),
      usesGraviButton: /<GraviButton/i.test(codeToReview),
      usesGraviGrid: /<GraviGrid/i.test(codeToReview),
      usesForm: /<Form/i.test(codeToReview),
      usesModal: /<Modal/i.test(codeToReview),
      hasUtilityClasses: /className\s*=\s*['"][^'"]*(?:m[tblrxy]?-|p-|gap-)/i.test(codeToReview),
    };
    
    output += `- **Lines of code:** ${stats.lines}\n`;
    output += `- **Uses Excalibrr:** ${stats.hasExcalibrrImport ? '✅' : '❌'}\n`;
    output += `- **Components used:** `;
    
    const components = [];
    if (stats.usesTexto) components.push('Texto');
    if (stats.usesHorizontalVertical) components.push('Horizontal/Vertical');
    if (stats.usesGraviButton) components.push('GraviButton');
    if (stats.usesGraviGrid) components.push('GraviGrid');
    if (stats.usesForm) components.push('Form');
    if (stats.usesModal) components.push('Modal');
    
    output += components.length > 0 ? components.join(', ') : 'None detected';
    output += '\n';
    output += `- **Uses utility classes:** ${stats.hasUtilityClasses ? '✅' : '❌'}\n`;
    
    return {
      content: [{ type: 'text', text: output }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error reviewing component: ${errorMessage}` }]
    };
  }
}
