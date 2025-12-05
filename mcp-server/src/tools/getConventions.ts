/**
 * Get Conventions Tool
 * 
 * Returns all Excalibrr conventions in a structured format.
 * Useful for Claude to reference before generating code.
 */

import { 
  CONVENTIONS,
  getConventionsByCategory,
  formatConventionsForDisplay,
  ConventionRule
} from '../utils/conventions.js';

export interface GetConventionsRequest {
  /** Filter by category */
  category?: 'component' | 'styling' | 'structure' | 'naming' | 'typescript';
  /** Filter by severity */
  severity?: 'error' | 'warning' | 'info';
  /** Return raw JSON instead of formatted markdown */
  raw?: boolean;
  /** Get specific rule by ID */
  ruleId?: string;
  /** Get condensed summary for system context */
  summary?: boolean;
}

export interface GetConventionsResponse {
  content: Array<{ type: string; text: string }>;
}

/**
 * Generate condensed summary for system context
 */
function getCondensedSummary(): string {
  return `# Excalibrr Quick Reference

## MUST USE Components (Never Raw HTML)
- Layout: \`<Horizontal>\`, \`<Vertical>\` (not \`<div style={{display:'flex'}}>\`)
- Text: \`<Texto category="h1|p1|p2|label">\` (not \`<p>\`, \`<h1>\`, \`<span>\`)
- Buttons: \`<GraviButton buttonText="..." success|theme1|danger>\` (not \`<button>\`)
- Inputs: AntD \`<Input>\`, \`<Select>\` (not \`<input>\`, \`<select>\`)

## Critical Gotchas
- \`appearance="secondary"\` on Texto = **BLUE** (use \`"medium"\` for gray)
- \`<GraviButton success>\` not \`<GraviButton theme="success">\`
- No \`htmlType\` on GraviButton - use \`onClick={() => form.submit()}\`
- \`<Modal visible={...}>\` not \`<Modal open={...}>\`
- No \`gap\` prop on Horizontal/Vertical - use \`style={{ gap: '12px' }}\`

## Styling Priority
1. Component props: \`<Horizontal justifyContent="space-between">\`
2. Utility classes: \`className="p-3 mb-2 gap-16"\`
3. Inline styles (last resort): Theme vars only \`var(--theme-...)\`

## Spacing Utils
mb-1, mb-2, mb-4 | mt-1 | ml-2 | p-2, p-3 | gap-8, gap-10, gap-12, gap-16 | border-radius-5

## Typography Patterns
\`\`\`tsx
// Section header
<Texto category='h6' appearance='medium' weight='600' style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>

// Field label  
<Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>

// Field value
<Texto category='p1' weight='600'>

// Helper text
<Texto category='p2' appearance='medium'>
\`\`\`

## Code Style
- Named exports: \`export function ComponentName() {}\`
- No React.lazy imports
- No BEM naming (\`__\`, \`--\`)
- kebab-case CSS classes
`;
}

/**
 * Get conventions tool implementation
 */
export async function getConventionsTool(args: GetConventionsRequest): Promise<GetConventionsResponse> {
  const { category, severity, raw = false, ruleId, summary = false } = args;
  
  try {
    // Return condensed summary
    if (summary) {
      return {
        content: [{ type: 'text', text: getCondensedSummary() }]
      };
    }
    
    // Get specific rule by ID
    if (ruleId) {
      const rule = CONVENTIONS.find(r => r.id === ruleId);
      
      if (!rule) {
        return {
          content: [{ 
            type: 'text', 
            text: `Rule not found: ${ruleId}\n\nAvailable rule IDs:\n${CONVENTIONS.map(r => `- ${r.id}`).join('\n')}` 
          }]
        };
      }
      
      if (raw) {
        return {
          content: [{ type: 'text', text: JSON.stringify(rule, null, 2) }]
        };
      }
      
      let output = `# ${rule.name}\n\n`;
      output += `**ID:** ${rule.id}\n`;
      output += `**Severity:** ${rule.severity}\n`;
      output += `**Category:** ${rule.category}\n\n`;
      output += `${rule.description}\n\n`;
      
      if (rule.examples) {
        output += `## Bad Example\n\`\`\`tsx\n${rule.examples.bad}\n\`\`\`\n\n`;
        output += `## Good Example\n\`\`\`tsx\n${rule.examples.good}\n\`\`\`\n\n`;
      }
      
      if (rule.fix) {
        output += `## How to Fix\n${rule.fix}\n`;
      }
      
      return {
        content: [{ type: 'text', text: output }]
      };
    }
    
    // Filter conventions
    let filteredRules: ConventionRule[] = [...CONVENTIONS];
    
    if (category) {
      filteredRules = filteredRules.filter(r => r.category === category);
    }
    
    if (severity) {
      filteredRules = filteredRules.filter(r => r.severity === severity);
    }
    
    // Return raw JSON
    if (raw) {
      return {
        content: [{ type: 'text', text: JSON.stringify(filteredRules, null, 2) }]
      };
    }
    
    // Return formatted markdown
    if (category || severity) {
      // Custom filtered output
      let output = `# Excalibrr Conventions`;
      
      if (category) output += ` (${category})`;
      if (severity) output += ` [${severity}]`;
      output += `\n\n`;
      
      for (const rule of filteredRules) {
        const severityIcon = rule.severity === 'error' ? '❌' : rule.severity === 'warning' ? '⚠️' : 'ℹ️';
        output += `## ${severityIcon} ${rule.name}\n`;
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
      
      return {
        content: [{ type: 'text', text: output }]
      };
    }
    
    // Return full formatted conventions
    return {
      content: [{ type: 'text', text: formatConventionsForDisplay() }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error getting conventions: ${errorMessage}` }]
    };
  }
}
