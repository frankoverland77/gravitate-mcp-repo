/**
 * Excalibrr Conventions System
 * 
 * Structured rules and conventions for code validation.
 * Used by validate_code and get_conventions tools.
 */

export interface ConventionRule {
  id: string;
  name: string;
  severity: 'error' | 'warning' | 'info';
  category: 'component' | 'styling' | 'structure' | 'naming' | 'typescript';
  description: string;
  pattern?: RegExp;
  antiPattern?: RegExp;
  fix?: string;
  examples?: {
    bad: string;
    good: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  summary: string;
}

export interface ValidationIssue {
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

/**
 * All Excalibrr conventions as structured rules
 */
export const CONVENTIONS: ConventionRule[] = [
  // ============ COMPONENT RULES ============
  {
    id: 'no-raw-div-flex',
    name: 'No Raw Div Flex',
    severity: 'error',
    category: 'component',
    description: 'Never use <div> with display:flex. Use Horizontal or Vertical components.',
    antiPattern: /<div[^>]*style\s*=\s*\{[^}]*display\s*:\s*['"]?flex/gi,
    fix: 'Replace with <Horizontal> or <Vertical> component',
    examples: {
      bad: `<div style={{ display: 'flex', justifyContent: 'space-between' }}>`,
      good: `<Horizontal justifyContent='space-between'>`
    }
  },
  {
    id: 'no-raw-text-elements',
    name: 'No Raw Text Elements',
    severity: 'error',
    category: 'component',
    description: 'Never use raw HTML text elements (<p>, <h1>-<h6>, <span> for text). Use Texto component.',
    antiPattern: /<(p|h[1-6]|span)\s*[^>]*>(?!.*<\/\1>.*<Texto)/gi,
    fix: 'Replace with <Texto category="...">',
    examples: {
      bad: `<h1>Title</h1>\n<p>Description</p>`,
      good: `<Texto category='h1'>Title</Texto>\n<Texto category='p1'>Description</Texto>`
    }
  },
  {
    id: 'no-raw-button',
    name: 'No Raw Button Elements',
    severity: 'error',
    category: 'component',
    description: 'Never use raw <button> elements. Use GraviButton component.',
    antiPattern: /<button\s/gi,
    fix: 'Replace with <GraviButton buttonText="...">',
    examples: {
      bad: `<button onClick={handleClick}>Save</button>`,
      good: `<GraviButton buttonText='Save' onClick={handleClick} />`
    }
  },
  {
    id: 'texto-secondary-not-gray',
    name: 'Texto Secondary is Blue',
    severity: 'error',
    category: 'component',
    description: 'appearance="secondary" on Texto is BLUE, not gray. Use appearance="medium" for gray text.',
    antiPattern: /<Texto[^>]*appearance\s*=\s*['"]secondary['"]/gi,
    fix: 'Change appearance="secondary" to appearance="medium" if you want gray text',
    examples: {
      bad: `<Texto appearance='secondary'>Gray label</Texto>`,
      good: `<Texto appearance='medium'>Gray label</Texto>`
    }
  },
  {
    id: 'gravi-button-no-theme-string',
    name: 'GraviButton Theme Props',
    severity: 'error',
    category: 'component',
    description: 'GraviButton uses boolean theme props (theme1, success, danger), not a theme string.',
    antiPattern: /<GraviButton[^>]*theme\s*=\s*['"]/gi,
    fix: 'Use boolean props: theme1, success, danger, warning',
    examples: {
      bad: `<GraviButton theme='success' buttonText='Save' />`,
      good: `<GraviButton success buttonText='Save' />`
    }
  },

  {
    id: 'modal-drawer-open-not-visible',
    name: 'Modal/Drawer Use open Prop',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 Modal and Drawer use "open" prop, not "visible".',
    antiPattern: /<(Modal|Drawer)[^>]*\svisible\s*=/gi,
    fix: 'Change visible={...} to open={...}',
    examples: {
      bad: `<Modal visible={isOpen}>\n<Drawer visible={isOpen}>`,
      good: `<Modal open={isOpen}>\n<Drawer open={isOpen}>`
    }
  },
  {
    id: 'no-destroy-on-close',
    name: 'Use destroyOnHidden Not destroyOnClose',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 renamed destroyOnClose to destroyOnHidden.',
    antiPattern: /destroyOnClose/gi,
    fix: 'Change destroyOnClose to destroyOnHidden',
    examples: {
      bad: `<Modal destroyOnClose>`,
      good: `<Modal destroyOnHidden>`
    }
  },
  {
    id: 'no-on-visible-change',
    name: 'Use onOpenChange Not onVisibleChange',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 renamed onVisibleChange to onOpenChange.',
    antiPattern: /onVisibleChange/gi,
    fix: 'Change onVisibleChange to onOpenChange',
    examples: {
      bad: `<Popover onVisibleChange={handler}>`,
      good: `<Popover onOpenChange={handler}>`
    }
  },
  {
    id: 'no-tabs-tabpane-children',
    name: 'Tabs Use items Prop',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 Tabs uses items prop instead of Tabs.TabPane children.',
    antiPattern: /Tabs\.TabPane|<TabPane/gi,
    fix: 'Use <Tabs items={[{ key, label, children }]} /> instead of Tabs.TabPane children',
    examples: {
      bad: `<Tabs><Tabs.TabPane tab="Tab 1" key="1">Content</Tabs.TabPane></Tabs>`,
      good: `<Tabs items={[{ key: '1', label: 'Tab 1', children: <div>Content</div> }]} />`
    }
  },
  {
    id: 'no-menu-item-children',
    name: 'Menu Use items Prop',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 Menu uses items prop instead of Menu.Item children.',
    antiPattern: /Menu\.Item|Menu\.SubMenu|<MenuItem/gi,
    fix: 'Use <Menu items={[{ key, label }]} /> instead of Menu.Item children',
    examples: {
      bad: `<Menu><Menu.Item key="1">Option</Menu.Item></Menu>`,
      good: `<Menu items={[{ key: '1', label: 'Option' }]} />`
    }
  },
  {
    id: 'no-select-option-children',
    name: 'Select Use options Prop',
    severity: 'error',
    category: 'component',
    description: 'AntD v5 Select uses options prop instead of Select.Option children.',
    antiPattern: /Select\.Option|<Option/gi,
    fix: 'Use <Select options={[{ value, label }]} /> instead of Select.Option children',
    examples: {
      bad: `<Select><Select.Option value="a">A</Select.Option></Select>`,
      good: `<Select options={[{ value: 'a', label: 'A' }]} />`
    }
  },
  {
    id: 'no-appearance-outline',
    name: 'GraviButton Use outlined Not outline',
    severity: 'error',
    category: 'component',
    description: 'Excalibrr v5 renamed appearance="outline" to appearance="outlined".',
    antiPattern: /appearance\s*=\s*['"]outline['"]/gi,
    fix: 'Change appearance="outline" to appearance="outlined"',
    examples: {
      bad: `<GraviButton appearance='outline'>`,
      good: `<GraviButton appearance='outlined'>`
    }
  },
  {
    id: 'gravigrid-agpropoverrides',
    name: 'GraviGrid Requires agPropOverrides',
    severity: 'warning',
    category: 'component',
    description: 'GraviGrid should always include agPropOverrides={{}} prop.',
    pattern: /<GraviGrid[^>]*agPropOverrides/gi,
    antiPattern: /<GraviGrid(?![^>]*agPropOverrides)[^>]*>/gi,
    fix: 'Add agPropOverrides={{}} to GraviGrid',
    examples: {
      bad: `<GraviGrid columnDefs={cols} rowData={data} />`,
      good: `<GraviGrid columnDefs={cols} rowData={data} agPropOverrides={{}} />`
    }
  },
  
  // ============ STYLING RULES ============
  {
    id: 'use-flex-prop-not-style',
    name: 'Use flex Prop Instead of Style',
    severity: 'error',
    category: 'styling',
    description: 'Vertical/Horizontal have a flex prop. Use flex="1" instead of style={{ flex: 1 }}.',
    antiPattern: /<(Vertical|Horizontal)[^>]*style\s*=\s*\{[^}]*flex\s*:/gi,
    fix: 'Use <Vertical flex="1"> instead of <Vertical style={{ flex: 1 }}>',
    examples: {
      bad: `<Vertical style={{ flex: 1 }}>\n<Horizontal style={{ flex: '1 0 auto' }}>`,
      good: `<Vertical flex="1">\n<Horizontal flex="1 0 auto">`
    }
  },
  {
    id: 'prefer-gap-prop',
    name: 'Prefer gap Prop on Horizontal/Vertical',
    severity: 'warning',
    category: 'styling',
    description: 'Horizontal/Vertical have a gap prop in v5. Use gap={12} instead of style={{ gap }} or className.',
    antiPattern: /<(Horizontal|Vertical)[^>]*style\s*=\s*\{[^}]*gap\s*:/gi,
    fix: 'Use <Horizontal gap={12}> instead of style={{ gap: "12px" }}',
    examples: {
      bad: `<Horizontal style={{ gap: '12px' }}>`,
      good: `<Horizontal gap={12}>`
    }
  },
  {
    id: 'prefer-component-props-for-alignment',
    name: 'Prefer Component Props for Alignment',
    severity: 'warning',
    category: 'styling',
    description: 'Use Horizontal/Vertical props for justifyContent/alignItems instead of inline styles.',
    antiPattern: /<(Horizontal|Vertical)[^>]*style\s*=\s*\{[^}]*(justifyContent|alignItems)/gi,
    fix: 'Move justifyContent/alignItems to component props',
    examples: {
      bad: `<Horizontal style={{ justifyContent: 'space-between' }}>`,
      good: `<Horizontal justifyContent='space-between'>`
    }
  },
  {
    id: 'use-gap-prop-not-class',
    name: 'Use gap Prop Instead of Utility Class',
    severity: 'info',
    category: 'styling',
    description: 'Horizontal/Vertical now support a gap prop directly. Prefer gap={12} over className="gap-12".',
    fix: 'Use <Horizontal gap={12}> instead of className="gap-12"',
    examples: {
      bad: `<Horizontal className="gap-12">\n<Vertical className="gap-8">`,
      good: `<Horizontal gap={12}>\n<Vertical gap={8}>`
    }
  },
  {
    id: 'prefer-utility-classes',
    name: 'Prefer Utility Classes',
    severity: 'info',
    category: 'styling',
    description: 'Use utility classes (mb-2, p-3, gap-16) instead of inline styles for common spacing.',
    antiPattern: /style\s*=\s*\{\s*\{\s*(marginBottom|marginTop|padding|gap)\s*:/gi,
    fix: 'Use className="mb-2", "p-3", "gap-16" etc.',
    examples: {
      bad: `style={{ marginBottom: '16px', padding: '24px' }}`,
      good: `className='mb-2 p-3'`
    }
  },
  {
    id: 'no-hardcoded-colors',
    name: 'No Hardcoded Colors',
    severity: 'warning',
    category: 'styling',
    description: 'Use theme CSS variables instead of hardcoded colors.',
    antiPattern: /style\s*=\s*\{[^}]*(color|backgroundColor)\s*:\s*['"]#[0-9a-fA-F]/gi,
    fix: 'Use var(--theme-...) CSS variables',
    examples: {
      bad: `style={{ color: '#333', backgroundColor: '#f5f5f5' }}`,
      good: `style={{ color: 'var(--theme-color-2)', backgroundColor: 'var(--theme-bg-elevated)' }}`
    }
  },
  {
    id: 'no-bem-naming',
    name: 'No BEM CSS Naming',
    severity: 'warning',
    category: 'naming',
    description: 'Use kebab-case for CSS classes. No BEM double underscores (__) or dashes (--).',
    antiPattern: /className\s*=\s*['"][^'"]*(__|\-\-)[^'"]*['"]/gi,
    fix: 'Use single-dash kebab-case: .component-element-modifier',
    examples: {
      bad: `className='card__header--active'`,
      good: `className='card-header-active'`
    }
  },
  
  // ============ STRUCTURE RULES ============
  {
    id: 'named-exports',
    name: 'Use Named Exports',
    severity: 'warning',
    category: 'structure',
    description: 'Use named function exports, not default exports or arrow function components.',
    antiPattern: /export\s+default\s+function|const\s+\w+\s*=\s*\([^)]*\)\s*=>/gi,
    pattern: /export\s+function\s+\w+/gi,
    fix: 'Use: export function ComponentName() { }',
    examples: {
      bad: `export default function MyComponent() { }\nconst MyComponent = () => { }`,
      good: `export function MyComponent() { }`
    }
  },
  {
    id: 'no-lazy-imports',
    name: 'No Lazy Imports',
    severity: 'error',
    category: 'structure',
    description: 'Do not use React.lazy() for component imports. Use direct imports.',
    antiPattern: /React\.lazy\s*\(/gi,
    fix: 'Use direct named imports',
    examples: {
      bad: `component: React.lazy(() => import('./ProductForm'))`,
      good: `import { ProductForm } from './ProductForm'\n// ...\ncomponent: ProductForm`
    }
  },
  {
    id: 'correct-path-aliases',
    name: 'Correct Path Aliases',
    severity: 'error',
    category: 'structure',
    description: 'Path aliases must not have a slash after @. Use @components/, @pages/, etc. (NOT @/components/).',
    antiPattern: /from\s+['"]@\/(components|pages|utils|api|styles|assets)\//gi,
    fix: 'Remove the slash after @. Use @components/ instead of @/components/',
    examples: {
      bad: `import { Component } from '@/components/shared/Grid'`,
      good: `import { Component } from '@components/shared/Grid'`
    }
  },

  // ============ TYPESCRIPT RULES ============
  {
    id: 'resolve-ts-errors',
    name: 'Resolve TypeScript Errors',
    severity: 'error',
    category: 'typescript',
    description: 'All TypeScript errors must be resolved (except GraviGrid sideBar prop).',
    fix: 'Fix TypeScript errors. Ignore sideBar prop errors on GraviGrid.',
    examples: {
      bad: `// Property 'xyz' does not exist on type...`,
      good: `// No TypeScript errors`
    }
  }
];

/**
 * Get all conventions grouped by category
 */
export function getConventionsByCategory(): Record<string, ConventionRule[]> {
  const grouped: Record<string, ConventionRule[]> = {};
  
  for (const rule of CONVENTIONS) {
    if (!grouped[rule.category]) {
      grouped[rule.category] = [];
    }
    grouped[rule.category].push(rule);
  }
  
  return grouped;
}

/**
 * Get conventions formatted for display
 */
export function formatConventionsForDisplay(): string {
  const grouped = getConventionsByCategory();
  let output = '# Excalibrr Conventions\n\n';
  
  const categoryOrder = ['component', 'styling', 'structure', 'naming', 'typescript'];
  const categoryTitles: Record<string, string> = {
    component: '🧩 Component Rules',
    styling: '🎨 Styling Rules',
    structure: '📁 Structure Rules',
    naming: '📝 Naming Rules',
    typescript: '📘 TypeScript Rules'
  };
  
  for (const category of categoryOrder) {
    const rules = grouped[category];
    if (!rules) continue;
    
    output += `## ${categoryTitles[category] || category}\n\n`;
    
    for (const rule of rules) {
      const severityIcon = rule.severity === 'error' ? '❌' : rule.severity === 'warning' ? '⚠️' : 'ℹ️';
      output += `### ${severityIcon} ${rule.name}\n`;
      output += `${rule.description}\n\n`;
      
      if (rule.examples) {
        output += `**Bad:**\n\`\`\`tsx\n${rule.examples.bad}\n\`\`\`\n\n`;
        output += `**Good:**\n\`\`\`tsx\n${rule.examples.good}\n\`\`\`\n\n`;
      }
      
      if (rule.fix) {
        output += `**Fix:** ${rule.fix}\n\n`;
      }
      
      output += '---\n\n';
    }
  }
  
  return output;
}

/**
 * Strip string literals from code to avoid false positives in pattern matching.
 * Replaces content inside strings with placeholder text.
 * Note: Placeholder must NOT contain patterns that trigger rules (e.g., no __ for BEM)
 */
function stripStringLiterals(code: string): string {
  // Replace template literals (backticks) - handle nested ${} expressions
  let result = code;
  
  // Simple approach: replace quoted strings with empty placeholders
  // This prevents false positives from strings containing HTML-like content
  // Using 'STRLIT' as placeholder - safe chars that won't trigger any rules
  result = result.replace(/`[^`]*`/g, '"STRLIT"');  // Template literals
  result = result.replace(/'[^'\n]*'/g, '"STRLIT"');  // Single quotes
  result = result.replace(/"[^"\n]*"/g, '"STRLIT"');  // Double quotes (but not the placeholders)
  
  return result;
}

/**
 * Validate code against conventions
 */
export function validateCode(code: string, filename?: string): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const info: ValidationIssue[] = [];
  
  const lines = code.split('\n');
  
  // Strip string literals to avoid false positives
  const codeForPatternMatching = stripStringLiterals(code);
  
  for (const rule of CONVENTIONS) {
    // Check anti-patterns (things that should NOT be in the code)
    if (rule.antiPattern) {
      // Use stripped code for pattern matching to avoid false positives in strings
      const matches = codeForPatternMatching.match(rule.antiPattern);
      if (matches) {
        for (const match of matches) {
          // Find line number - try original code first, fall back to stripped code
          let lineNum = 1;
          let charCount = 0;
          let matchIndex = code.indexOf(match);
          const searchCode = matchIndex >= 0 ? code : codeForPatternMatching;
          if (matchIndex < 0) {
            matchIndex = codeForPatternMatching.indexOf(match);
          }
          
          for (let i = 0; i < lines.length; i++) {
            charCount += lines[i].length + 1; // +1 for newline
            if (charCount > matchIndex) {
              lineNum = i + 1;
              break;
            }
          }
          
          const issue: ValidationIssue = {
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: rule.description,
            line: lineNum,
            suggestion: rule.fix
          };
          
          if (rule.severity === 'error') {
            errors.push(issue);
          } else if (rule.severity === 'warning') {
            warnings.push(issue);
          } else {
            info.push(issue);
          }
        }
      }
    }
    
    // Check required patterns (things that SHOULD be in the code)
    if (rule.pattern && rule.id === 'named-exports' && filename?.endsWith('.tsx')) {
      // Only check for named exports in component files
      if (!rule.pattern.test(codeForPatternMatching) && codeForPatternMatching.includes('function')) {
        // No named exports found
        warnings.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: 'warning',
          message: rule.description,
          suggestion: rule.fix
        });
      }
    }
  }
  
  // Generate summary
  const valid = errors.length === 0;
  let summary = '';
  
  if (valid && warnings.length === 0 && info.length === 0) {
    summary = '✅ Code passes all convention checks!';
  } else {
    const parts = [];
    if (errors.length > 0) parts.push(`${errors.length} error(s)`);
    if (warnings.length > 0) parts.push(`${warnings.length} warning(s)`);
    if (info.length > 0) parts.push(`${info.length} suggestion(s)`);
    summary = `${valid ? '⚠️' : '❌'} Found ${parts.join(', ')}`;
  }
  
  return {
    valid,
    errors,
    warnings,
    info,
    summary
  };
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result: ValidationResult): string {
  let output = `# Validation Result\n\n${result.summary}\n\n`;
  
  if (result.errors.length > 0) {
    output += '## ❌ Errors (Must Fix)\n\n';
    for (const issue of result.errors) {
      output += `### ${issue.ruleName}`;
      if (issue.line) output += ` (line ${issue.line})`;
      output += '\n';
      output += `${issue.message}\n`;
      if (issue.suggestion) output += `**Fix:** ${issue.suggestion}\n`;
      output += '\n';
    }
  }
  
  if (result.warnings.length > 0) {
    output += '## ⚠️ Warnings (Should Fix)\n\n';
    for (const issue of result.warnings) {
      output += `### ${issue.ruleName}`;
      if (issue.line) output += ` (line ${issue.line})`;
      output += '\n';
      output += `${issue.message}\n`;
      if (issue.suggestion) output += `**Fix:** ${issue.suggestion}\n`;
      output += '\n';
    }
  }
  
  if (result.info.length > 0) {
    output += '## ℹ️ Suggestions\n\n';
    for (const issue of result.info) {
      output += `### ${issue.ruleName}`;
      if (issue.line) output += ` (line ${issue.line})`;
      output += '\n';
      output += `${issue.message}\n`;
      if (issue.suggestion) output += `**Fix:** ${issue.suggestion}\n`;
      output += '\n';
    }
  }
  
  return output;
}
