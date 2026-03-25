/**
 * design_review_workflow - Multi-step design review process
 * 
 * Steps:
 * 1. Analyze code for convention violations
 * 2. Check component usage patterns
 * 3. Review styling consistency
 * 4. Generate actionable fix suggestions
 * 5. Optionally auto-apply fixes
 */

import * as fs from 'fs'
import * as path from 'path'
import { validateCode, ValidationResult } from '../utils/conventions.js'

interface DesignReviewArgs {
  filePath?: string
  code?: string
  directory?: string
  autoFix?: boolean
  focus?: 'all' | 'components' | 'styling' | 'structure'
  verbose?: boolean
}

interface ReviewFinding {
  category: string
  severity: 'error' | 'warning' | 'info'
  message: string
  line?: number
  suggestion?: string
  autoFixable: boolean
}

export async function designReviewWorkflow(args: DesignReviewArgs) {
  const {
    filePath,
    code,
    directory,
    autoFix = false,
    focus = 'all',
    verbose = false,
  } = args

  const findings: ReviewFinding[] = []
  const filesReviewed: string[] = []
  let totalLines = 0

  try {
    // Determine what to review
    let filesToReview: Array<{ path: string; content: string }> = []

    if (code) {
      filesToReview.push({ path: 'inline-code', content: code })
    } else if (filePath) {
      const fullPath = filePath.startsWith('/') 
        ? filePath 
        : path.join('/Users/rebecca/repos/excalibrr-mcp-server/demo', filePath)
      
      if (!fs.existsSync(fullPath)) {
        return {
          content: [{ type: 'text', text: `❌ File not found: ${fullPath}` }],
          isError: true,
        }
      }
      
      const content = fs.readFileSync(fullPath, 'utf-8')
      filesToReview.push({ path: fullPath, content })
    } else if (directory) {
      const fullDir = directory.startsWith('/')
        ? directory
        : path.join('/Users/rebecca/repos/excalibrr-mcp-server/demo', directory)
      
      filesToReview = collectTsxFiles(fullDir)
    } else {
      return {
        content: [{
          type: 'text',
          text: `❌ No input provided. Please specify:
- \`code\`: Inline code to review
- \`filePath\`: Path to file
- \`directory\`: Directory to scan`
        }],
        isError: true,
      }
    }

    // Review each file
    for (const file of filesToReview) {
      filesReviewed.push(file.path)
      totalLines += file.content.split('\n').length
      
      const fileFindings = reviewFile(file.content, file.path, focus)
      findings.push(...fileFindings)
    }

    // Generate report
    const report = generateReport(findings, filesReviewed, totalLines, verbose)

    // Auto-fix if requested
    let fixReport = ''
    if (autoFix && findings.some(f => f.autoFixable)) {
      fixReport = await applyFixes(filesToReview, findings)
    }

    return {
      content: [{ type: 'text', text: report + fixReport }],
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error in design review: ${error}` }],
      isError: true,
    }
  }
}

function collectTsxFiles(dir: string): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = []
  
  if (!fs.existsSync(dir)) return files
  
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...collectTsxFiles(fullPath))
    } else if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8')
        files.push({ path: fullPath, content })
      } catch {
        // Skip unreadable files
      }
    }
  }
  
  return files
}

function reviewFile(content: string, filePath: string, focus: string): ReviewFinding[] {
  const findings: ReviewFinding[] = []
  const lines = content.split('\n')

  // Component checks
  if (focus === 'all' || focus === 'components') {
    // Check for raw HTML elements
    const rawHtmlPatterns = [
      { pattern: /<div\s+style=\{\{[^}]*display:\s*['"]?flex/gi, msg: 'Use <Horizontal> or <Vertical> instead of flex div', fix: 'Horizontal/Vertical' },
      { pattern: /<div\s+className=['"]/gi, msg: 'Consider using <Horizontal> or <Vertical> for layout divs', fix: 'Layout component' },
      { pattern: /<p\b[^>]*>/gi, msg: 'Use <Texto category="p1"> instead of <p>', fix: 'Texto' },
      { pattern: /<h[1-6]\b[^>]*>/gi, msg: 'Use <Texto category="h1-h6"> instead of heading tags', fix: 'Texto' },
      { pattern: /<span\b[^>]*>/gi, msg: 'Use <Texto> instead of <span>', fix: 'Texto' },
      { pattern: /<button\b[^>]*>/gi, msg: 'Use <GraviButton> instead of <button>', fix: 'GraviButton' },
    ]

    lines.forEach((line, idx) => {
      for (const { pattern, msg, fix } of rawHtmlPatterns) {
        if (pattern.test(line)) {
          findings.push({
            category: 'components',
            severity: 'error',
            message: msg,
            line: idx + 1,
            suggestion: `Replace with ${fix}`,
            autoFixable: true,
          })
        }
        pattern.lastIndex = 0 // Reset regex
      }
    })

    // Check for appearance="secondary" misuse
    lines.forEach((line, idx) => {
      if (/appearance=['"]secondary['"]/i.test(line)) {
        findings.push({
          category: 'components',
          severity: 'error',
          message: 'appearance="secondary" is BLUE, not gray! Use "medium" for gray text.',
          line: idx + 1,
          suggestion: 'Change to appearance="medium" for gray text',
          autoFixable: true,
        })
      }
    })

    // Check for Modal visible prop (should use open in antd v5)
    lines.forEach((line, idx) => {
      if (/<Modal[^>]*\svisible=/i.test(line)) {
        findings.push({
          category: 'components',
          severity: 'error',
          message: 'Use "open" prop instead of "visible" for Modal (antd v5)',
          line: idx + 1,
          suggestion: 'Change visible={...} to open={...}',
          autoFixable: true,
        })
      }
    })

    // Check for htmlType on GraviButton
    lines.forEach((line, idx) => {
      if (/GraviButton[^>]*htmlType/i.test(line)) {
        findings.push({
          category: 'components',
          severity: 'error',
          message: 'GraviButton does not support htmlType. Use onClick={() => form.submit()}',
          line: idx + 1,
          suggestion: 'Remove htmlType, add onClick handler',
          autoFixable: false,
        })
      }
    })
  }

  // Styling checks
  if (focus === 'all' || focus === 'styling') {
    // Check for hardcoded colors
    lines.forEach((line, idx) => {
      if (/color:\s*['"]#[0-9a-f]{3,6}['"]/i.test(line) || /color:\s*#[0-9a-f]{3,6}/i.test(line)) {
        findings.push({
          category: 'styling',
          severity: 'warning',
          message: 'Avoid hardcoded colors. Use theme variables like var(--theme-text)',
          line: idx + 1,
          suggestion: 'Use var(--theme-color-*) or Texto appearance prop',
          autoFixable: false,
        })
      }
    })

    // Check for gap prop (doesn't exist)
    lines.forEach((line, idx) => {
      if (/<(Horizontal|Vertical)[^>]*\sgap=/i.test(line)) {
        findings.push({
          category: 'styling',
          severity: 'error',
          message: 'Horizontal/Vertical do not have a gap prop. Use style={{ gap: "Xpx" }}',
          line: idx + 1,
          suggestion: 'Change gap={X} to style={{ gap: "Xpx" }}',
          autoFixable: true,
        })
      }
    })

    // Check for BEM naming
    lines.forEach((line, idx) => {
      if (/className=['"][^'"]*__[^'"]*['"]/.test(line) || /className=['"][^'"]*--[^'"]*['"]/.test(line)) {
        findings.push({
          category: 'styling',
          severity: 'warning',
          message: 'Avoid BEM naming (__ or --). Use kebab-case class names.',
          line: idx + 1,
          suggestion: 'Use .component-element-modifier pattern',
          autoFixable: false,
        })
      }
    })
  }

  // Structure checks
  if (focus === 'all' || focus === 'structure') {
    // Check for missing agPropOverrides
    if (content.includes('GraviGrid') && !content.includes('agPropOverrides')) {
      findings.push({
        category: 'structure',
        severity: 'error',
        message: 'GraviGrid requires agPropOverrides prop (even if empty {})',
        suggestion: 'Add agPropOverrides={{}} to GraviGrid',
        autoFixable: false,
      })
    }

    // Check for missing storageKey on GraviGrid
    if (content.includes('GraviGrid') && !content.includes('storageKey')) {
      findings.push({
        category: 'structure',
        severity: 'warning',
        message: 'GraviGrid should have a storageKey for column state persistence',
        suggestion: 'Add storageKey="UniqueGridName"',
        autoFixable: false,
      })
    }

    // Check for useMemo on columnDefs
    if (content.includes('columnDefs') && content.includes('GraviGrid')) {
      if (!content.includes('useMemo')) {
        findings.push({
          category: 'structure',
          severity: 'warning',
          message: 'columnDefs should be memoized with useMemo for performance',
          suggestion: 'Wrap columnDefs in useMemo(() => [...], [])',
          autoFixable: false,
        })
      }
    }

    // Check for default export
    if (/export\s+default\s+function/.test(content)) {
      findings.push({
        category: 'structure',
        severity: 'warning',
        message: 'Use named exports instead of default exports',
        suggestion: 'Change to: export function ComponentName()',
        autoFixable: false,
      })
    }
  }

  return findings
}

function generateReport(
  findings: ReviewFinding[],
  filesReviewed: string[],
  totalLines: number,
  verbose: boolean
): string {
  const lines: string[] = ['# 🔍 Design Review Report\n']

  // Summary
  const errors = findings.filter(f => f.severity === 'error')
  const warnings = findings.filter(f => f.severity === 'warning')
  const infos = findings.filter(f => f.severity === 'info')
  const autoFixable = findings.filter(f => f.autoFixable)

  lines.push('## Summary')
  lines.push(`- **Files reviewed:** ${filesReviewed.length}`)
  lines.push(`- **Lines analyzed:** ${totalLines.toLocaleString()}`)
  lines.push(`- **Total findings:** ${findings.length}`)
  lines.push(`  - ❌ Errors: ${errors.length}`)
  lines.push(`  - ⚠️ Warnings: ${warnings.length}`)
  lines.push(`  - ℹ️ Info: ${infos.length}`)
  lines.push(`- **Auto-fixable:** ${autoFixable.length}`)
  lines.push('')

  if (findings.length === 0) {
    lines.push('✅ **No issues found!** Code follows Excalibrr conventions.')
    return lines.join('\n')
  }

  // Group by category
  const byCategory = new Map<string, ReviewFinding[]>()
  for (const finding of findings) {
    const cat = finding.category
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(finding)
  }

  // Findings by category
  for (const [category, catFindings] of byCategory) {
    lines.push(`## ${category.charAt(0).toUpperCase() + category.slice(1)} Issues`)
    lines.push('')
    
    for (const f of catFindings) {
      const icon = f.severity === 'error' ? '❌' : f.severity === 'warning' ? '⚠️' : 'ℹ️'
      const lineRef = f.line ? ` (line ${f.line})` : ''
      const fixable = f.autoFixable ? ' 🔧' : ''
      
      lines.push(`${icon} **${f.message}**${lineRef}${fixable}`)
      if (f.suggestion) {
        lines.push(`   → ${f.suggestion}`)
      }
      lines.push('')
    }
  }

  // Quick fixes section
  if (autoFixable.length > 0) {
    lines.push('## 🔧 Auto-Fixable Issues')
    lines.push('')
    lines.push('Run with `autoFix: true` to automatically fix these issues:')
    lines.push('')
    for (const f of autoFixable) {
      lines.push(`- ${f.message}`)
    }
    lines.push('')
  }

  // Files reviewed (verbose only)
  if (verbose && filesReviewed.length > 1) {
    lines.push('## Files Reviewed')
    lines.push('')
    for (const file of filesReviewed) {
      lines.push(`- \`${file}\``)
    }
  }

  return lines.join('\n')
}

async function applyFixes(
  files: Array<{ path: string; content: string }>,
  findings: ReviewFinding[]
): Promise<string> {
  const lines: string[] = ['\n---\n', '## 🔧 Auto-Fix Results\n']
  let fixedCount = 0

  for (const file of files) {
    if (file.path === 'inline-code') continue // Can't fix inline code
    
    let content = file.content
    let modified = false

    // Fix appearance="secondary" → appearance="medium"
    if (/appearance=['"]secondary['"]/i.test(content)) {
      content = content.replace(/appearance=['"]secondary['"]/gi, 'appearance="medium"')
      modified = true
      fixedCount++
    }

    // Fix Modal open → visible
    if (/<Modal([^>]*)\sopen=/i.test(content)) {
      content = content.replace(/(<Modal[^>]*)\sopen=/gi, '$1 visible=')
      modified = true
      fixedCount++
    }

    // Fix gap prop → style
    const gapMatch = content.match(/<(Horizontal|Vertical)([^>]*)\sgap=\{?['"]?(\d+)['"]?\}?/gi)
    if (gapMatch) {
      content = content.replace(
        /<(Horizontal|Vertical)([^>]*)\sgap=\{?['"]?(\d+)['"]?\}?/gi,
        '<$1$2 style={{ gap: \'$3px\' }}'
      )
      modified = true
      fixedCount++
    }

    if (modified) {
      try {
        fs.writeFileSync(file.path, content)
        lines.push(`✅ Fixed: \`${file.path}\``)
      } catch (err) {
        lines.push(`❌ Could not write: \`${file.path}\``)
      }
    }
  }

  if (fixedCount === 0) {
    lines.push('No auto-fixes were applied.')
  } else {
    lines.push('')
    lines.push(`**Total fixes applied:** ${fixedCount}`)
  }

  return lines.join('\n')
}
