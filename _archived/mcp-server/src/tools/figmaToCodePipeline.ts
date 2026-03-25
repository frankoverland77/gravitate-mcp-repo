/**
 * figma_to_code_pipeline - Complete Figma to Excalibrr code workflow
 * 
 * Steps:
 * 1. Fetch Figma design (or use provided design data)
 * 2. Analyze component structure
 * 3. Map to Excalibrr components
 * 4. Generate code
 * 5. Validate against conventions
 * 6. Output review summary
 */

interface FigmaToCodeArgs {
  // Figma source
  figmaUrl?: string
  figmaFileId?: string
  figmaNodeId?: string
  
  // Or provide raw structure
  designStructure?: DesignNode
  
  // Options
  componentName?: string
  outputPath?: string
  includeStyles?: boolean
  generateTypes?: boolean
  validate?: boolean
}

interface DesignNode {
  type: 'FRAME' | 'GROUP' | 'TEXT' | 'RECTANGLE' | 'COMPONENT' | 'INSTANCE' | 'VECTOR'
  name: string
  children?: DesignNode[]
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE'
  characters?: string // for text nodes
  fills?: any[]
  effects?: any[]
  constraints?: any
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number }
  style?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    textAlignHorizontal?: string
    fills?: any[]
  }
}

interface ComponentMapping {
  excalibrrComponent: string
  props: Record<string, any>
  children?: ComponentMapping[]
  warnings?: string[]
}

export async function figmaToCodePipeline(args: FigmaToCodeArgs) {
  const {
    figmaUrl,
    figmaFileId,
    figmaNodeId,
    designStructure,
    componentName = 'GeneratedComponent',
    outputPath,
    includeStyles = true,
    generateTypes = false,
    validate = true,
  } = args

  const steps: string[] = []
  const warnings: string[] = []

  try {
    // Step 1: Get design structure
    steps.push('## Step 1: Analyzing Design Structure')
    
    let design: DesignNode | null = null
    
    if (designStructure) {
      design = designStructure
      steps.push('✅ Using provided design structure')
    } else if (figmaUrl || figmaFileId) {
      steps.push('⚠️ Figma API integration requires FIGMA_ACCESS_TOKEN')
      steps.push('For now, provide `designStructure` directly or use the Figma MCP tools first.')
      
      // Return guidance
      return {
        content: [{
          type: 'text',
          text: `# Figma to Code Pipeline

${steps.join('\n')}

## How to Use

### Option 1: Use Figma MCP Tools First
1. Use \`get_design_context\` from Figma MCP to get design data
2. Pass that data to this pipeline as \`designStructure\`

### Option 2: Provide Structure Manually
\`\`\`json
{
  "designStructure": {
    "type": "FRAME",
    "name": "Card",
    "layoutMode": "VERTICAL",
    "children": [
      { "type": "TEXT", "name": "Title", "characters": "Card Title" },
      { "type": "TEXT", "name": "Description", "characters": "Some description" },
      {
        "type": "FRAME",
        "name": "Actions",
        "layoutMode": "HORIZONTAL",
        "children": [
          { "type": "COMPONENT", "name": "Button", "characters": "Cancel" },
          { "type": "COMPONENT", "name": "Button Primary", "characters": "Save" }
        ]
      }
    ]
  },
  "componentName": "CardComponent"
}
\`\`\`

### Option 3: Describe Your Design
Tell me what you're trying to build and I'll generate the appropriate Excalibrr code:
- "A card with title, description, and action buttons"
- "A form with name, email, and submit button"
- "A data grid with product info and edit/delete actions"
`
        }],
      }
    } else {
      return {
        content: [{
          type: 'text',
          text: `❌ No design input provided.

Please provide one of:
- \`figmaUrl\`: Figma file URL
- \`figmaFileId\` + \`figmaNodeId\`: Figma identifiers
- \`designStructure\`: Design tree structure

Or use the Figma MCP tools (\`get_design_context\`, \`get_screenshot\`) first.`
        }],
        isError: true,
      }
    }

    // Step 2: Map to Excalibrr components
    steps.push('\n## Step 2: Mapping to Excalibrr Components')
    const mapping = mapDesignToExcalibrr(design!, warnings)
    steps.push(`✅ Mapped ${countComponents(mapping)} components`)

    // Step 3: Generate code
    steps.push('\n## Step 3: Generating Code')
    const generatedCode = generateComponentCode(mapping, componentName, includeStyles)
    steps.push(`✅ Generated ${generatedCode.split('\n').length} lines of code`)

    // Step 4: Validate
    let validationReport = ''
    if (validate) {
      steps.push('\n## Step 4: Validating Code')
      const violations = validateGeneratedCode(generatedCode)
      if (violations.length === 0) {
        steps.push('✅ Code passes all convention checks')
      } else {
        steps.push(`⚠️ Found ${violations.length} potential issues:`)
        violations.forEach(v => steps.push(`   - ${v}`))
        validationReport = '\n### Validation Notes\n' + violations.map(v => `- ${v}`).join('\n')
      }
    }

    // Generate warnings section
    let warningsSection = ''
    if (warnings.length > 0) {
      warningsSection = '\n## ⚠️ Conversion Notes\n' + warnings.map(w => `- ${w}`).join('\n')
    }

    // Build final output
    const output = `# 🎨 Figma to Code Conversion

${steps.join('\n')}
${warningsSection}
${validationReport}

## Generated Code

\`\`\`tsx
${generatedCode}
\`\`\`

## Component Structure

\`\`\`
${visualizeMapping(mapping, 0)}
\`\`\`

## Next Steps

1. Copy the code to your project
2. Update imports as needed
3. Add any missing handlers (onClick, onSubmit, etc.)
4. Test in your development environment

${outputPath ? `\n**Note:** Would save to \`${outputPath}\` but file writing disabled in this context.` : ''}
`

    return {
      content: [{ type: 'text', text: output }],
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error in Figma to Code pipeline: ${error}` }],
      isError: true,
    }
  }
}

function mapDesignToExcalibrr(node: DesignNode, warnings: string[]): ComponentMapping {
  const mapping: ComponentMapping = {
    excalibrrComponent: 'Vertical',
    props: {},
    children: [],
  }

  // Map based on node type
  switch (node.type) {
    case 'FRAME':
    case 'GROUP':
      if (node.layoutMode === 'HORIZONTAL') {
        mapping.excalibrrComponent = 'Horizontal'
        mapping.props.style = { gap: '12px' }
      } else {
        mapping.excalibrrComponent = 'Vertical'
        mapping.props.style = { gap: '16px' }
      }
      
      // Check for specific patterns by name
      if (/card/i.test(node.name)) {
        mapping.props.className = 'p-3 border-radius-5'
        mapping.props.style = { ...mapping.props.style, backgroundColor: 'var(--theme-bg-elevated)' }
      }
      if (/header/i.test(node.name)) {
        mapping.excalibrrComponent = 'Horizontal'
        mapping.props.justifyContent = 'space-between'
        mapping.props.alignItems = 'center'
      }
      if (/actions|buttons|footer/i.test(node.name)) {
        mapping.excalibrrComponent = 'Horizontal'
        mapping.props.justifyContent = 'flex-end'
        mapping.props.style = { gap: '12px' }
      }
      break

    case 'TEXT':
      mapping.excalibrrComponent = 'Texto'
      mapping.props.children = node.characters || ''
      
      // Infer category from font size or name
      if (node.style?.fontSize) {
        if (node.style.fontSize >= 24) mapping.props.category = 'h1'
        else if (node.style.fontSize >= 20) mapping.props.category = 'h2'
        else if (node.style.fontSize >= 18) mapping.props.category = 'h3'
        else if (node.style.fontSize >= 16) mapping.props.category = 'h4'
        else if (node.style.fontSize >= 14) mapping.props.category = 'p1'
        else mapping.props.category = 'p2'
      } else {
        mapping.props.category = 'p1'
      }
      
      // Infer from name
      if (/title|heading|header/i.test(node.name)) {
        mapping.props.category = 'h3'
        mapping.props.weight = '600'
      }
      if (/label|caption|helper|description|subtitle/i.test(node.name)) {
        mapping.props.category = 'p2'
        mapping.props.appearance = 'medium'
      }
      if (/error/i.test(node.name)) {
        mapping.props.appearance = 'error'
      }
      break

    case 'COMPONENT':
    case 'INSTANCE':
      // Try to identify button patterns
      if (/button/i.test(node.name)) {
        mapping.excalibrrComponent = 'GraviButton'
        mapping.props.buttonText = node.children?.[0]?.characters || node.name.replace(/button/i, '').trim() || 'Button'
        
        if (/primary|main|submit|save/i.test(node.name)) {
          mapping.props.theme1 = true
        }
        if (/danger|delete|remove/i.test(node.name)) {
          mapping.props.danger = true
        }
        if (/success|confirm/i.test(node.name)) {
          mapping.props.success = true
        }
      } else {
        // Generic component - wrap in Vertical
        mapping.excalibrrComponent = 'Vertical'
        warnings.push(`Unknown component "${node.name}" - wrapped in Vertical`)
      }
      break

    case 'RECTANGLE':
      // Could be a divider or background
      if (node.absoluteBoundingBox?.height && node.absoluteBoundingBox.height < 5) {
        mapping.excalibrrComponent = 'div'
        mapping.props.className = 'divider'
        warnings.push('Rectangle detected as divider - consider using <Divider /> from AntD')
      } else {
        mapping.excalibrrComponent = 'Vertical'
        mapping.props.className = 'p-2'
        warnings.push(`Rectangle "${node.name}" converted to Vertical container`)
      }
      break

    default:
      mapping.excalibrrComponent = 'Vertical'
      warnings.push(`Unknown node type "${node.type}" for "${node.name}"`)
  }

  // Process children
  if (node.children && node.children.length > 0) {
    mapping.children = node.children.map(child => mapDesignToExcalibrr(child, warnings))
  }

  return mapping
}

function countComponents(mapping: ComponentMapping): number {
  let count = 1
  if (mapping.children) {
    for (const child of mapping.children) {
      count += countComponents(child)
    }
  }
  return count
}

function generateComponentCode(mapping: ComponentMapping, componentName: string, includeStyles: boolean): string {
  const imports = new Set<string>()
  
  // Collect all imports needed
  collectImports(mapping, imports)
  
  // Build import statement
  const excalibrrImports = Array.from(imports).filter(i => 
    ['GraviButton', 'GraviGrid', 'Horizontal', 'Vertical', 'Texto'].includes(i)
  )
  const antdImports = Array.from(imports).filter(i => 
    ['Form', 'Input', 'Select', 'Modal', 'Divider'].includes(i)
  )

  let importSection = `import React from 'react'\n`
  if (excalibrrImports.length > 0) {
    importSection += `import { ${excalibrrImports.join(', ')} } from '@gravitate-js/excalibrr'\n`
  }
  if (antdImports.length > 0) {
    importSection += `import { ${antdImports.join(', ')} } from 'antd'\n`
  }

  // Generate JSX
  const jsx = generateJSX(mapping, 1)

  return `${importSection}
export function ${componentName}() {
  return (
${jsx}
  )
}
`
}

function collectImports(mapping: ComponentMapping, imports: Set<string>) {
  if (mapping.excalibrrComponent !== 'div') {
    imports.add(mapping.excalibrrComponent)
  }
  if (mapping.children) {
    for (const child of mapping.children) {
      collectImports(child, imports)
    }
  }
}

function generateJSX(mapping: ComponentMapping, indent: number): string {
  const spaces = '  '.repeat(indent)
  const comp = mapping.excalibrrComponent
  const props = mapping.props
  
  // Build props string
  let propsStr = ''
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue
    if (key === 'style' && typeof value === 'object') {
      propsStr += ` style={${JSON.stringify(value)}}`
    } else if (typeof value === 'boolean' && value === true) {
      propsStr += ` ${key}`
    } else if (typeof value === 'string') {
      propsStr += ` ${key}='${value}'`
    } else {
      propsStr += ` ${key}={${JSON.stringify(value)}}`
    }
  }

  // Handle text content for Texto
  if (comp === 'Texto' && props.children) {
    return `${spaces}<${comp}${propsStr}>${props.children}</${comp}>`
  }

  // Handle self-closing components
  if (!mapping.children || mapping.children.length === 0) {
    if (comp === 'GraviButton') {
      return `${spaces}<${comp}${propsStr} />`
    }
    return `${spaces}<${comp}${propsStr} />`
  }

  // Handle components with children
  const childrenJSX = mapping.children
    .map(child => generateJSX(child, indent + 1))
    .join('\n')

  return `${spaces}<${comp}${propsStr}>
${childrenJSX}
${spaces}</${comp}>`
}

function visualizeMapping(mapping: ComponentMapping, depth: number): string {
  const indent = '  '.repeat(depth)
  let result = `${indent}<${mapping.excalibrrComponent}>`
  
  if (mapping.children && mapping.children.length > 0) {
    result += '\n'
    for (const child of mapping.children) {
      result += visualizeMapping(child, depth + 1) + '\n'
    }
    result += `${indent}</${mapping.excalibrrComponent}>`
  } else if (mapping.props.children) {
    result += `${mapping.props.children}</${mapping.excalibrrComponent}>`
  } else {
    result = `${indent}<${mapping.excalibrrComponent} />`
  }
  
  return result
}

function validateGeneratedCode(code: string): string[] {
  const violations: string[] = []
  
  // Check for raw HTML
  if (/<div\s/.test(code) && !/className=['"]divider['"]/.test(code)) {
    violations.push('Contains raw <div> - consider using Horizontal/Vertical')
  }
  
  // Check for hardcoded colors
  if (/#[0-9a-f]{3,6}/i.test(code)) {
    violations.push('Contains hardcoded colors - use theme variables')
  }
  
  // Check for appearance="secondary"
  if (/appearance=['"]secondary['"]/i.test(code)) {
    violations.push('Uses appearance="secondary" (BLUE) - use "medium" for gray')
  }
  
  return violations
}
