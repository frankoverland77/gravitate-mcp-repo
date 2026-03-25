/**
 * Convert to Excalibrr Tool
 * 
 * Transforms raw HTML/CSS patterns into proper Excalibrr components.
 * Useful for cleaning up code that doesn't follow conventions.
 */

export interface ConvertToExcalibrRequest {
  /** Code to convert */
  code: string;
  /** Just show what would change without converting */
  dryRun?: boolean;
}

export interface ConvertToExcalibrResponse {
  content: Array<{ type: string; text: string }>;
}

interface Conversion {
  pattern: RegExp;
  description: string;
  convert: (match: string, ...groups: string[]) => string;
}

/**
 * Conversion rules for transforming raw HTML to Excalibrr
 */
const CONVERSIONS: Conversion[] = [
  // Flex divs to Horizontal
  {
    pattern: /<div([^>]*?)style\s*=\s*\{\s*\{([^}]*display\s*:\s*['"]?flex['"]?[^}]*)\}\s*\}([^>]*)>/gi,
    description: 'Convert flex div to Horizontal/Vertical',
    convert: (match, before, styleContent, after) => {
      const isColumn = /flexDirection\s*:\s*['"]?column/i.test(styleContent);
      const component = isColumn ? 'Vertical' : 'Horizontal';
      
      // Extract alignment props
      let props = '';
      
      const justifyMatch = styleContent.match(/justifyContent\s*:\s*['"]?([^'",}]+)/i);
      if (justifyMatch) {
        props += ` justifyContent='${justifyMatch[1].trim()}'`;
      }
      
      const alignMatch = styleContent.match(/alignItems\s*:\s*['"]?([^'",}]+)/i);
      if (alignMatch) {
        props += ` alignItems='${alignMatch[1].trim()}'`;
      }
      
      // Handle gap
      const gapMatch = styleContent.match(/gap\s*:\s*['"]?(\d+)(?:px)?['"]?/i);
      if (gapMatch) {
        props += ` style={{ gap: '${gapMatch[1]}px' }}`;
      }
      
      // Keep other style properties
      let remainingStyle = styleContent
        .replace(/display\s*:\s*['"]?flex['"]?\s*,?\s*/gi, '')
        .replace(/flexDirection\s*:\s*['"]?column['"]?\s*,?\s*/gi, '')
        .replace(/justifyContent\s*:\s*['"]?[^'",}]+['"]?\s*,?\s*/gi, '')
        .replace(/alignItems\s*:\s*['"]?[^'",}]+['"]?\s*,?\s*/gi, '')
        .replace(/gap\s*:\s*['"]?\d+(?:px)?['"]?\s*,?\s*/gi, '')
        .trim()
        .replace(/^,\s*|,\s*$/g, '');
      
      if (remainingStyle && !props.includes('style=')) {
        props += ` style={{ ${remainingStyle} }}`;
      } else if (remainingStyle && props.includes('style=')) {
        // Merge with existing gap style
        props = props.replace(/style=\{\{([^}]+)\}\}/, `style={{ $1, ${remainingStyle} }}`);
      }
      
      return `<${component}${before}${props}${after}>`;
    }
  },
  
  // Close flex divs
  {
    pattern: /<\/div>\s*(?=\s*(?:\/\/|\/\*|$|\n\s*<(?!div)))/gi,
    description: 'Close tag (may need manual review)',
    convert: (match) => match // Keep as is, user needs to review
  },
  
  // Raw text elements to Texto
  {
    pattern: /<h1([^>]*)>([^<]+)<\/h1>/gi,
    description: 'Convert h1 to Texto',
    convert: (match, attrs, content) => `<Texto category='h1'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<h2([^>]*)>([^<]+)<\/h2>/gi,
    description: 'Convert h2 to Texto',
    convert: (match, attrs, content) => `<Texto category='h2'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<h3([^>]*)>([^<]+)<\/h3>/gi,
    description: 'Convert h3 to Texto',
    convert: (match, attrs, content) => `<Texto category='h3'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<h4([^>]*)>([^<]+)<\/h4>/gi,
    description: 'Convert h4 to Texto',
    convert: (match, attrs, content) => `<Texto category='h4'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<h5([^>]*)>([^<]+)<\/h5>/gi,
    description: 'Convert h5 to Texto',
    convert: (match, attrs, content) => `<Texto category='h5'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<h6([^>]*)>([^<]+)<\/h6>/gi,
    description: 'Convert h6 to Texto',
    convert: (match, attrs, content) => `<Texto category='h6'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<p([^>]*)>([^<]+)<\/p>/gi,
    description: 'Convert p to Texto',
    convert: (match, attrs, content) => `<Texto category='p1'${convertAttrs(attrs)}>${content}</Texto>`
  },
  {
    pattern: /<span([^>]*)>([^<]+)<\/span>/gi,
    description: 'Convert span to Texto',
    convert: (match, attrs, content) => `<Texto category='p2'${convertAttrs(attrs)}>${content}</Texto>`
  },
  
  // Raw button to GraviButton
  {
    pattern: /<button([^>]*)>([^<]+)<\/button>/gi,
    description: 'Convert button to GraviButton',
    convert: (match, attrs, content) => {
      let props = ` buttonText='${content.trim()}'`;
      
      // Extract onClick
      const onClickMatch = attrs.match(/onClick\s*=\s*\{([^}]+)\}/i);
      if (onClickMatch) {
        props += ` onClick={${onClickMatch[1]}}`;
      }
      
      // Check for type="submit"
      if (/type\s*=\s*['"]submit['"]/i.test(attrs)) {
        props += ` success onClick={() => form.submit()}`;
      }
      
      // Check for className
      const classMatch = attrs.match(/className\s*=\s*['"]([^'"]+)['"]/i);
      if (classMatch) {
        // Try to infer theme from class
        if (/primary|success|green/i.test(classMatch[1])) {
          props += ' success';
        } else if (/danger|delete|red/i.test(classMatch[1])) {
          props += ' danger';
        }
      }
      
      return `<GraviButton${props} />`;
    }
  },
  
  // Fix Modal visible to open (antd v5)
  {
    pattern: /<Modal([^>]*)\svisible\s*=\s*\{([^}]+)\}/gi,
    description: 'Fix Modal visible to open',
    convert: (match, before, value) => `<Modal${before} open={${value}}`
  },
  
  // Fix GraviButton theme string to boolean
  {
    pattern: /<GraviButton([^>]*)\stheme\s*=\s*['"](\w+)['"]/gi,
    description: 'Fix GraviButton theme prop',
    convert: (match, before, theme) => {
      const booleanProp = theme.toLowerCase() === 'success' ? 'success' 
        : theme.toLowerCase() === 'danger' ? 'danger'
        : theme.toLowerCase() === 'warning' ? 'warning'
        : 'theme1';
      return `<GraviButton${before} ${booleanProp}`;
    }
  },
  
  // Fix GraviButton htmlType
  {
    pattern: /<GraviButton([^>]*)\shtmlType\s*=\s*['"]submit['"]/gi,
    description: 'Fix GraviButton htmlType',
    convert: (match, before) => `<GraviButton${before} success onClick={() => form.submit()}`
  },
  
  // Fix Texto appearance="secondary" to "medium" (with warning)
  {
    pattern: /<Texto([^>]*)\sappearance\s*=\s*['"]secondary['"]/gi,
    description: 'Fix Texto secondary appearance (if meant for gray)',
    convert: (match, before) => {
      // Add a comment warning
      return `<Texto${before} appearance='medium' /* Changed from secondary (blue) to medium (gray) - verify intent */`;
    }
  },
  
  // Convert inline alignment styles on Horizontal/Vertical to props
  {
    pattern: /<(Horizontal|Vertical)([^>]*)\sstyle\s*=\s*\{\s*\{([^}]*(?:justifyContent|alignItems)[^}]*)\}\s*\}/gi,
    description: 'Convert inline alignment to props',
    convert: (match, component, beforeStyle, styleContent) => {
      let props = '';
      let remainingStyle = styleContent;
      
      const justifyMatch = styleContent.match(/justifyContent\s*:\s*['"]?([^'",}]+)/i);
      if (justifyMatch) {
        props += ` justifyContent='${justifyMatch[1].trim()}'`;
        remainingStyle = remainingStyle.replace(/justifyContent\s*:\s*['"]?[^'",}]+['"]?\s*,?\s*/gi, '');
      }
      
      const alignMatch = styleContent.match(/alignItems\s*:\s*['"]?([^'",}]+)/i);
      if (alignMatch) {
        props += ` alignItems='${alignMatch[1].trim()}'`;
        remainingStyle = remainingStyle.replace(/alignItems\s*:\s*['"]?[^'",}]+['"]?\s*,?\s*/gi, '');
      }
      
      remainingStyle = remainingStyle.trim().replace(/^,\s*|,\s*$/g, '');
      
      if (remainingStyle) {
        props += ` style={{ ${remainingStyle} }}`;
      }
      
      return `<${component}${beforeStyle}${props}`;
    }
  }
];

/**
 * Convert HTML attributes to Texto-compatible props
 */
function convertAttrs(attrs: string): string {
  let props = '';
  
  // Extract className
  const classMatch = attrs.match(/className\s*=\s*['"]([^'"]+)['"]/i);
  if (classMatch) {
    props += ` className='${classMatch[1]}'`;
  }
  
  // Extract style
  const styleMatch = attrs.match(/style\s*=\s*\{([^}]+)\}/i);
  if (styleMatch) {
    props += ` style={${styleMatch[1]}}`;
  }
  
  return props;
}

/**
 * Convert to Excalibrr tool implementation
 */
export async function convertToExcalibrTool(args: ConvertToExcalibrRequest): Promise<ConvertToExcalibrResponse> {
  const { code, dryRun = false } = args;
  
  if (!code) {
    return {
      content: [{
        type: 'text',
        text: `# Convert to Excalibrr Tool

Transforms raw HTML/CSS patterns into proper Excalibrr components.

## Usage
Provide \`code\` parameter with the code to convert.

## What it converts:
- \`<div style={{display:'flex'}}>\` → \`<Horizontal>\` / \`<Vertical>\`
- \`<h1>\`, \`<p>\`, \`<span>\` → \`<Texto>\`
- \`<button>\` → \`<GraviButton>\`
- \`<Modal visible={...}>\` → \`<Modal open={...}>\`
- \`<GraviButton theme="success">\` → \`<GraviButton success>\`
- \`<GraviButton htmlType="submit">\` → \`<GraviButton success onClick={() => form.submit()}>\`
- Inline alignment styles → Component props

## Options
- \`dryRun: true\` - Show what would change without converting`
      }]
    };
  }
  
  try {
    let converted = code;
    const changes: string[] = [];
    
    for (const conversion of CONVERSIONS) {
      const matches = code.match(conversion.pattern);
      if (matches) {
        changes.push(`- ${conversion.description}: ${matches.length} occurrence(s)`);
        
        if (!dryRun) {
          converted = converted.replace(conversion.pattern, conversion.convert);
        }
      }
    }
    
    if (changes.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '✅ No conversions needed - code already follows Excalibrr conventions!'
        }]
      };
    }
    
    if (dryRun) {
      let output = `# Conversion Preview (Dry Run)\n\n`;
      output += `## Changes that would be made:\n${changes.join('\n')}\n\n`;
      output += `Run again without \`dryRun: true\` to apply conversions.`;
      
      return {
        content: [{ type: 'text', text: output }]
      };
    }
    
    // Add required imports comment if they're missing
    const needsImports: string[] = [];
    
    if (/<Horizontal/i.test(converted) && !/import.*Horizontal.*from.*excalibrr/i.test(converted)) {
      needsImports.push('Horizontal');
    }
    if (/<Vertical/i.test(converted) && !/import.*Vertical.*from.*excalibrr/i.test(converted)) {
      needsImports.push('Vertical');
    }
    if (/<Texto/i.test(converted) && !/import.*Texto.*from.*excalibrr/i.test(converted)) {
      needsImports.push('Texto');
    }
    if (/<GraviButton/i.test(converted) && !/import.*GraviButton.*from.*excalibrr/i.test(converted)) {
      needsImports.push('GraviButton');
    }
    
    let output = `# Converted Code\n\n`;
    output += `## Changes made:\n${changes.join('\n')}\n\n`;
    
    if (needsImports.length > 0) {
      output += `## ⚠️ Add these imports:\n\`\`\`tsx\nimport { ${needsImports.join(', ')} } from '@gravitate-js/excalibrr'\n\`\`\`\n\n`;
    }
    
    output += `## Converted code:\n\`\`\`tsx\n${converted}\n\`\`\`\n\n`;
    output += `⚠️ **Review the converted code carefully** - some conversions may need manual adjustments.`;
    
    return {
      content: [{ type: 'text', text: output }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error converting code: ${errorMessage}` }]
    };
  }
}
