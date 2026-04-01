/**
 * Code Quality Grader
 *
 * Deterministic grader that checks generated demo code against Excalibrr conventions.
 * Runs ESLint, anti-pattern detection, page registration, and component usage checks.
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import type { EvalCase } from '../cases/schema.js'
import type { DimensionScore, Finding, Severity } from './types.js'

const DEMO_ROOT = path.resolve(import.meta.dirname, '../../../demo')

// ---------------------------------------------------------------------------
// Anti-pattern rules (derived from tests/validation/AntiPatternTestFile.tsx)
// ---------------------------------------------------------------------------

interface AntiPatternRule {
  id: string
  severity: Severity
  /** Regex to match the anti-pattern */
  pattern: RegExp
  /** Human-readable message */
  message: string
  /** Plain-English explanation for non-technical users */
  plainEnglish: string
}

const ANTI_PATTERN_RULES: AntiPatternRule[] = [
  // CRITICAL: flex prop via style instead of component prop
  {
    id: 'use-flex-prop-not-style',
    severity: 'critical',
    pattern: /<(?:Vertical|Horizontal)\s[^>]*style\s*=\s*\{\{[^}]*flex\s*:/g,
    message: 'Using style={{ flex: ... }} instead of flex prop on Vertical/Horizontal',
    plainEnglish: 'Layout components have a built-in "flex" prop — use <Vertical flex="1"> instead of inline styles.',
  },
  // CRITICAL: Using visible instead of open on Modal/Drawer (v4 → v5 migration)
  {
    id: 'modal-drawer-visible-not-open',
    severity: 'critical',
    pattern: /<(?:Modal|Drawer)\s[^>]*\bvisible\s*=\s*\{/g,
    message: 'Using visible prop instead of open on Modal/Drawer',
    plainEnglish: 'Modals and Drawers should use the "open" prop, not "visible" (changed in v5).',
  },
  // MAJOR: Inline gap style instead of gap prop
  {
    id: 'use-gap-prop-not-style',
    severity: 'major',
    pattern: /<(?:Horizontal|Vertical)\s[^>]*style\s*=\s*\{\{[^}]*gap\s*:/g,
    message: 'Using style={{ gap: ... }} instead of gap prop',
    plainEnglish: 'Use the gap prop directly: <Horizontal gap={12}> instead of inline style gap.',
  },
  // MAJOR: Inline style for alignment instead of component props
  {
    id: 'prefer-component-props-for-alignment',
    severity: 'major',
    pattern: /<(?:Horizontal|Vertical)\s[^>]*style\s*=\s*\{\{[^}]*(justifyContent|alignItems)\s*:/g,
    message: 'Using inline style for alignment instead of component prop',
    plainEnglish: 'Layout alignment should use component props like justifyContent="space-between", not inline styles.',
  },
  // MAJOR: GraviGrid without agPropOverrides
  {
    id: 'gravigrid-missing-agpropoverrides',
    severity: 'major',
    pattern: /<GraviGrid(?![^]*?agPropOverrides)[^>]*\/>/g,
    message: 'GraviGrid missing agPropOverrides prop',
    plainEnglish: 'Every GraviGrid needs agPropOverrides={{}} — production grids always have this.',
  },
  // MAJOR: Using destroyOnClose instead of destroyOnHidden
  {
    id: 'destroy-on-close-not-hidden',
    severity: 'major',
    pattern: /\bdestroyOnClose\b/g,
    message: 'Using destroyOnClose — should be destroyOnHidden',
    plainEnglish: 'Use "destroyOnHidden" instead of "destroyOnClose" on Modals and Drawers.',
  },
  // MAJOR: Using onVisibleChange instead of onOpenChange
  {
    id: 'on-visible-change-deprecated',
    severity: 'major',
    pattern: /\bonVisibleChange\b/g,
    message: 'Using onVisibleChange — should be onOpenChange',
    plainEnglish: 'Use "onOpenChange" instead of "onVisibleChange".',
  },
  // MAJOR: appearance='outline' instead of 'outlined'
  {
    id: 'appearance-outline-typo',
    severity: 'major',
    pattern: /appearance\s*=\s*['"]outline['"]/g,
    message: "Using appearance='outline' — should be 'outlined'",
    plainEnglish: 'Button appearance should be "outlined" (with a d), not "outline".',
  },
  // MINOR: Texto appearance="secondary" when gray text is intended
  {
    id: 'texto-secondary-is-blue',
    severity: 'minor',
    pattern: /<Texto[^>]*appearance\s*=\s*["']secondary["']/g,
    message: 'Texto appearance="secondary" renders BLUE — use "medium" for gray text',
    plainEnglish: '"secondary" on Texto is blue, not gray. Use "medium" for gray/muted text.',
  },
  // MINOR: Using htmlType="submit" on GraviButton
  {
    id: 'no-html-type-submit',
    severity: 'minor',
    pattern: /<GraviButton[^>]*htmlType\s*=\s*["']submit["']/g,
    message: 'Using htmlType="submit" — use onClick={() => form.submit()} instead',
    plainEnglish: 'GraviButton should use onClick with form.submit() instead of htmlType="submit".',
  },

  // --- Added: AntD v5 + export/import conventions ---

  // MAJOR: GraviGrid data={} instead of rowData={}
  {
    id: 'gravigrid-data-not-rowdata',
    severity: 'major',
    pattern: /<GraviGrid\s[^>]*(?<!\w)data\s*=\s*\{/g,
    message: 'Using data={} on GraviGrid — should be rowData={}',
    plainEnglish: 'GraviGrid uses the "rowData" prop to pass data, not "data".',
  },
  // MAJOR: Old AntD v4 Tabs.TabPane / TabPane children pattern
  {
    id: 'antd-tabs-tabpane-children',
    severity: 'major',
    pattern: /<(?:Tabs\.)?TabPane[\s>]/g,
    message: 'Using <Tabs.TabPane> children — use <Tabs items={[...]}/> instead',
    plainEnglish: 'Tabs should use the "items" prop with an array, not <TabPane> children (changed in AntD v5).',
  },
  // MAJOR: Old AntD v4 Menu.Item children pattern
  {
    id: 'antd-menu-item-children',
    severity: 'major',
    pattern: /<Menu\.Item[\s>]/g,
    message: 'Using <Menu.Item> children — use <Menu items={[...]}/> instead',
    plainEnglish: 'Menu should use the "items" prop with an array, not <Menu.Item> children (changed in AntD v5).',
  },
  // MAJOR: Old AntD v4 Select.Option children pattern
  {
    id: 'antd-select-option-children',
    severity: 'major',
    pattern: /<Select\.Option[\s>]/g,
    message: 'Using <Select.Option> children — use <Select options={[...]}/> instead',
    plainEnglish: 'Select should use the "options" prop with an array, not <Select.Option> children (changed in AntD v5).',
  },
  // MAJOR: Import path with slash after @ (e.g., @/components instead of @components)
  {
    id: 'import-path-slash-after-at',
    severity: 'major',
    pattern: /from\s+['"]@\//g,
    message: 'Using @/ import path — should be @ without slash (e.g., @components)',
    plainEnglish: 'Import paths use @components, not @/components — no slash after the @.',
  },
  // MINOR: Default exports in demo files
  {
    id: 'no-default-export',
    severity: 'minor',
    pattern: /export\s+default\b/g,
    message: 'Using export default — demos should use named exports only',
    plainEnglish: 'Demo files use named exports like "export function MyPage()" instead of "export default".',
  },
  // MINOR: React.lazy or lazy() imports
  {
    id: 'no-react-lazy',
    severity: 'minor',
    pattern: /\bReact\.lazy\s*\(|(?<![.\w])lazy\s*\(/g,
    message: 'Using React.lazy() — demos do not use lazy loading',
    plainEnglish: 'Demo pages are not lazy-loaded — import components directly.',
  },
  // MAJOR: GraviGrid with style prop
  {
    id: 'gravigrid-style-prop',
    severity: 'major',
    pattern: /<GraviGrid\s[^>]*\bstyle\s*=\s*\{/g,
    message: 'Using style={} on GraviGrid — wrap in a Vertical/div instead',
    plainEnglish: 'GraviGrid does not accept a style prop — wrap it in a <Vertical> for styling.',
  },
]

// ---------------------------------------------------------------------------
// Raw HTML element detection
// ---------------------------------------------------------------------------

const RAW_HTML_ELEMENTS = ['div', 'span', 'p', 'button', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']

function stripStringsAndComments(code: string): string {
  // Remove template literals
  let result = code.replace(/`[^`]*`/g, 'STRLIT')
  // Remove double-quoted strings
  result = result.replace(/"[^"]*"/g, 'STRLIT')
  // Remove single-quoted strings
  result = result.replace(/'[^']*'/g, 'STRLIT')
  // Remove single-line comments
  result = result.replace(/\/\/.*$/gm, '')
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '')
  return result
}

export function findRawHtmlElements(code: string, filePath: string): Finding[] {
  const cleaned = stripStringsAndComments(code)
  const findings: Finding[] = []
  const lines = cleaned.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const element of RAW_HTML_ELEMENTS) {
      // Match opening JSX tags like <div> or <div className="...">
      const regex = new RegExp(`<${element}[\\s>/]`, 'g')
      if (regex.test(line)) {
        findings.push({
          ruleId: `no-raw-html-${element}`,
          message: `Raw <${element}> element found — use Excalibrr component instead`,
          plainEnglish: `Use Excalibrr components instead of raw HTML <${element}>. For example, use <Vertical> instead of <div>, <Texto> instead of <p>, <GraviButton> instead of <button>.`,
          severity: 'minor',
          file: filePath,
          line: i + 1,
        })
      }
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Component usage check
// ---------------------------------------------------------------------------

function checkComponentUsage(code: string, filePath: string, expected: string[]): Finding[] {
  // Only check main page JSX files — data/type/columnDefs files won't have these components
  if (!filePath.endsWith('.tsx') || filePath.includes('.columnDefs.')) return []

  const findings: Finding[] = []
  for (const component of expected) {
    const importRegex = new RegExp(`\\b${component}\\b`)
    if (!importRegex.test(code)) {
      findings.push({
        ruleId: 'missing-expected-component',
        message: `Expected component "${component}" not found in ${filePath}`,
        plainEnglish: `This page should use the ${component} component but doesn't seem to.`,
        severity: 'major',
        file: filePath,
      })
    }
  }
  return findings
}

// ---------------------------------------------------------------------------
// Must-not-contain check
// ---------------------------------------------------------------------------

function checkMustNotContain(code: string, filePath: string, forbidden: string[]): Finding[] {
  const cleaned = stripStringsAndComments(code)
  const findings: Finding[] = []
  for (const pattern of forbidden) {
    if (cleaned.includes(pattern)) {
      findings.push({
        ruleId: 'forbidden-pattern',
        message: `Forbidden pattern "${pattern}" found in ${filePath}`,
        plainEnglish: `This page contains "${pattern}" which shouldn't be used in Excalibrr demos.`,
        severity: 'major',
        file: filePath,
      })
    }
  }
  return findings
}

// ---------------------------------------------------------------------------
// Anti-pattern checks
// ---------------------------------------------------------------------------

export function checkAntiPatterns(code: string, filePath: string): Finding[] {
  const cleaned = stripStringsAndComments(code)
  const findings: Finding[] = []

  for (const rule of ANTI_PATTERN_RULES) {
    // Reset regex state
    rule.pattern.lastIndex = 0
    const lines = cleaned.split('\n')
    for (let i = 0; i < lines.length; i++) {
      // Create a fresh regex per line to avoid global state issues
      const lineRegex = new RegExp(rule.pattern.source, rule.pattern.flags.replace('g', ''))
      if (lineRegex.test(lines[i])) {
        findings.push({
          ruleId: rule.id,
          message: rule.message,
          plainEnglish: rule.plainEnglish,
          severity: rule.severity,
          file: filePath,
          line: i + 1,
        })
      }
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Import order check (React → Excalibrr → AntD → local)
// ---------------------------------------------------------------------------

export function checkImportOrder(code: string, filePath: string): Finding[] {
  const findings: Finding[] = []
  const lines = code.split('\n')

  // Category order: 0=react, 1=excalibrr/library, 2=antd, 3=local
  let lastCategory = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line.startsWith('import ')) continue
    if (!line.includes('from ')) continue

    let category: number
    if (/from\s+['"]react['"]/.test(line)) {
      category = 0
    } else if (/from\s+['"]@gravitate/.test(line)) {
      category = 1
    } else if (/from\s+['"](?:antd|@ant-design)/.test(line)) {
      category = 2
    } else if (/from\s+['"][.]/.test(line)) {
      category = 3
    } else {
      // Other libraries group with excalibrr
      category = 1
    }

    if (lastCategory !== -1 && category < lastCategory) {
      if (category <= 1 && lastCategory === 2) {
        findings.push({
          ruleId: 'import-order',
          message: 'Excalibrr imports should come before AntD imports',
          plainEnglish: 'Import order should be: React → Excalibrr → AntD → local files.',
          severity: 'minor',
          file: filePath,
          line: i + 1,
        })
      }
      if (category < 3 && lastCategory === 3) {
        findings.push({
          ruleId: 'import-order',
          message: 'Library imports should come before local imports',
          plainEnglish: 'Import order should be: React → Excalibrr → AntD → local files.',
          severity: 'minor',
          file: filePath,
          line: i + 1,
        })
      }
    }

    if (category > lastCategory) {
      lastCategory = category
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// ESLint check (runs ESLint CLI on target files)
// ---------------------------------------------------------------------------

interface EslintMessage {
  ruleId: string | null
  severity: number
  message: string
  line: number
  column: number
}

interface EslintResult {
  filePath: string
  messages: EslintMessage[]
  errorCount: number
  warningCount: number
}

function runEslint(files: string[]): Finding[] {
  const findings: Finding[] = []
  const absolutePaths = files
    .map(f => path.join(DEMO_ROOT, 'src', f))
    .filter(f => fs.existsSync(f) && (f.endsWith('.ts') || f.endsWith('.tsx')))

  if (absolutePaths.length === 0) return findings

  try {
    const result = execSync(
      `npx eslint --format json ${absolutePaths.map(p => `"${p}"`).join(' ')}`,
      { cwd: DEMO_ROOT, encoding: 'utf-8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe'] }
    )
    const parsed: EslintResult[] = JSON.parse(result)
    for (const fileResult of parsed) {
      for (const msg of fileResult.messages) {
        findings.push({
          ruleId: `eslint/${msg.ruleId ?? 'unknown'}`,
          message: msg.message,
          plainEnglish: translateEslintMessage(msg),
          severity: msg.severity === 2 ? 'major' : 'minor',
          file: path.relative(path.join(DEMO_ROOT, 'src'), fileResult.filePath),
          line: msg.line,
        })
      }
    }
  } catch (error: unknown) {
    // ESLint exits with code 1 when there are lint errors — parse output anyway
    const err = error as { stdout?: string }
    if (err.stdout) {
      try {
        const parsed: EslintResult[] = JSON.parse(err.stdout)
        for (const fileResult of parsed) {
          for (const msg of fileResult.messages) {
            findings.push({
              ruleId: `eslint/${msg.ruleId ?? 'unknown'}`,
              message: msg.message,
              plainEnglish: translateEslintMessage(msg),
              severity: msg.severity === 2 ? 'major' : 'minor',
              file: path.relative(path.join(DEMO_ROOT, 'src'), fileResult.filePath),
              line: msg.line,
            })
          }
        }
      } catch {
        findings.push({
          ruleId: 'eslint/parse-error',
          message: 'ESLint output could not be parsed',
          plainEnglish: 'The code linter ran into a problem — the code might have syntax errors.',
          severity: 'critical',
        })
      }
    }
  }

  return findings
}

function translateEslintMessage(msg: EslintMessage): string {
  const translations: Record<string, string> = {
    'max-lines': 'This file is too long — consider splitting it into smaller files.',
    'max-lines-per-function': 'This function is too long — break it into smaller pieces.',
    'complexity': 'This function has too many branches — simplify the logic.',
    'max-depth': 'Too many levels of nesting — flatten the code.',
    '@typescript-eslint/no-explicit-any': 'Avoid using "any" type — use a specific type instead.',
    'no-console': 'Remove console.log statements before finishing.',
    'react/forbid-dom-props': 'Avoid inline styles — use component props or CSS classes.',
    'unused-imports/no-unused-imports': 'Remove unused imports to keep the code clean.',
  }
  return translations[msg.ruleId ?? ''] ?? msg.message
}

// ---------------------------------------------------------------------------
// Page registration check
// ---------------------------------------------------------------------------

function checkPageRegistration(pageDir: string, navKey?: string): Finding[] {
  const findings: Finding[] = []
  const configKey = navKey ?? pageDir

  // Directly check the two files for this specific page (instead of running the global script)
  const pageConfigPath = path.join(DEMO_ROOT, 'src/pageConfig.tsx')
  const authRoutePath = path.join(DEMO_ROOT, 'src/_Main/AuthenticatedRoute.jsx')

  try {
    const pageConfig = fs.readFileSync(pageConfigPath, 'utf-8')
    const authRoute = fs.readFileSync(authRoutePath, 'utf-8')

    // Match both `from './pages/X/File'` and barrel `from './pages/X'`
    const hasImport = new RegExp(`from\\s+["']\\./pages/${pageDir}[/'"]`).test(pageConfig)
    // Match both `config.Key = {` and object literal `Key: {`
    const hasConfig = new RegExp(`(?:config\\.${configKey}\\s*=|\\b${configKey}\\s*:\\s*\\{)`).test(pageConfig)
    // Match scope entry — check both pageDir and configKey
    const hasScope = new RegExp(`(?:${configKey}|${pageDir}):\\s*true`).test(authRoute)

    const missing: string[] = []
    if (!hasImport) missing.push('pageConfig.tsx import')
    if (!hasConfig) missing.push('pageConfig.tsx config section')
    if (!hasScope) missing.push('AuthenticatedRoute.jsx scope')

    if (missing.length > 0) {
      findings.push({
        ruleId: 'page-not-registered',
        message: `Page "${pageDir}" is missing from: ${missing.join(', ')}`,
        plainEnglish: `This demo page isn't showing up in the navigation. It needs to be added to: ${missing.join(', ')}.`,
        severity: 'critical',
      })
    }
  } catch {
    findings.push({
      ruleId: 'page-registration-check-failed',
      message: 'Could not read pageConfig.tsx or AuthenticatedRoute.jsx',
      plainEnglish: 'Could not verify page registration — the config files may be missing.',
      severity: 'critical',
    })
  }

  return findings
}

// ---------------------------------------------------------------------------
// Main grader
// ---------------------------------------------------------------------------

export function gradeCodeQuality(evalCase: EvalCase): DimensionScore {
  const allFindings: Finding[] = []

  // 1. Anti-pattern checks on each target file
  const allCode: string[] = []
  for (const targetFile of evalCase.targetFiles) {
    const fullPath = path.join(DEMO_ROOT, 'src', targetFile)
    if (!fs.existsSync(fullPath)) {
      allFindings.push({
        ruleId: 'file-not-found',
        message: `Target file not found: ${targetFile}`,
        plainEnglish: `The file "${targetFile}" doesn't exist — the demo might have been moved or deleted.`,
        severity: 'critical',
        file: targetFile,
      })
      continue
    }

    const code = fs.readFileSync(fullPath, 'utf-8')
    allCode.push(code)

    // Anti-pattern checks
    if (evalCase.expectations.zeroCriticalAntiPatterns !== false) {
      allFindings.push(...checkAntiPatterns(code, targetFile))
    }

    // Raw HTML element detection (only in JSX files)
    if (targetFile.endsWith('.tsx')) {
      allFindings.push(...findRawHtmlElements(code, targetFile))
      allFindings.push(...checkImportOrder(code, targetFile))
    }

    // Must-not-contain checks
    if (evalCase.expectations.mustNotContain) {
      allFindings.push(...checkMustNotContain(code, targetFile, evalCase.expectations.mustNotContain))
    }
  }

  // Component usage checks — across all target files collectively
  if (evalCase.expectations.mustContainComponents) {
    const combinedCode = allCode.join('\n')
    for (const component of evalCase.expectations.mustContainComponents) {
      if (!new RegExp(`\\b${component}\\b`).test(combinedCode)) {
        allFindings.push({
          ruleId: 'missing-expected-component',
          message: `Expected component "${component}" not found in any target file`,
          plainEnglish: `This page should use the ${component} component but doesn't seem to.`,
          severity: 'major',
        })
      }
    }
  }

  // 2. ESLint checks
  allFindings.push(...runEslint(evalCase.targetFiles))

  // 3. Page registration check
  if (evalCase.expectations.mustBeRegistered) {
    allFindings.push(...checkPageRegistration(evalCase.pageDir, evalCase.navKey))
  }

  // Separate anti-pattern/convention findings from ESLint findings
  const conventionFindings = allFindings.filter(f => !f.ruleId.startsWith('eslint/'))
  const eslintFindings = allFindings.filter(f => f.ruleId.startsWith('eslint/'))

  const criticalCount = allFindings.filter(f => f.severity === 'critical').length
  const majorCount = allFindings.filter(f => f.severity === 'major').length
  const minorCount = allFindings.filter(f => f.severity === 'minor').length

  // Scoring: weighted by category
  // Convention violations are weighted heavily (they're what matters for demo quality)
  // ESLint issues are weighted lighter (many are style nits)
  let score = 100

  // Critical convention findings: -20 each (page not registered, key anti-patterns)
  score -= conventionFindings.filter(f => f.severity === 'critical').length * 20
  // Major convention findings: -8 each
  score -= conventionFindings.filter(f => f.severity === 'major').length * 8
  // Minor convention findings: -2 each (raw HTML, texto appearance, etc.)
  score -= conventionFindings.filter(f => f.severity === 'minor').length * 2

  // ESLint errors: -3 each (capped at -30 total)
  const eslintErrors = eslintFindings.filter(f => f.severity === 'major').length
  score -= Math.min(eslintErrors * 3, 30)
  // ESLint warnings: -1 each (capped at -10 total)
  const eslintWarnings = eslintFindings.filter(f => f.severity === 'minor').length
  score -= Math.min(eslintWarnings * 1, 10)

  score = Math.max(0, Math.min(100, score))

  const summary = criticalCount === 0 && majorCount === 0
    ? `Clean code — ${minorCount} minor issue${minorCount !== 1 ? 's' : ''} found.`
    : `Found ${criticalCount} critical, ${majorCount} major, and ${minorCount} minor issue${minorCount !== 1 ? 's' : ''}.`

  return {
    dimension: 'Code Quality',
    score,
    findings: allFindings,
    summary,
  }
}
