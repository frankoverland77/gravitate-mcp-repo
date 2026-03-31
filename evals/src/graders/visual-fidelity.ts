/**
 * Visual Fidelity Grader (Phase 2 — Deterministic)
 *
 * Code-based checks for theme compliance, hardcoded colors/spacing,
 * and screenshot capture success. No LLM needed.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { EvalCase } from '../cases/schema.js'
import type { DimensionScore, Finding } from './types.js'
import type { ScreenshotResult } from '../runners/screenshot-runner.js'

const DEMO_ROOT = path.resolve(import.meta.dirname, '../../../demo')

// ---------------------------------------------------------------------------
// Theme wrapper check
// ---------------------------------------------------------------------------

function checkThemeWrapper(evalCase: EvalCase): Finding[] {
  if (!evalCase.theme) return [] // No theme expectation = skip

  // Check pageConfig.tsx for ThemeRouteWrapper on this route
  const pageConfigPath = path.join(DEMO_ROOT, 'src/pageConfig.tsx')
  const pageConfig = fs.readFileSync(pageConfigPath, 'utf-8')

  // Look for ThemeRouteWrapper near this page's route path
  const routePath = evalCase.routePath ?? ''
  const routeRegion = pageConfig.indexOf(routePath)

  if (routeRegion === -1) return [] // Route not found in config

  // Check if there's a ThemeRouteWrapper within ~500 chars of the route definition
  const regionStart = Math.max(0, routeRegion - 500)
  const regionEnd = Math.min(pageConfig.length, routeRegion + 500)
  const region = pageConfig.slice(regionStart, regionEnd)

  if (!region.includes('ThemeRouteWrapper')) {
    return [{
      ruleId: 'missing-theme-wrapper',
      message: `Route "${routePath}" has no ThemeRouteWrapper but expects theme "${evalCase.theme}"`,
      plainEnglish: `This page should be wrapped with the ${evalCase.theme} theme but isn't — it'll show with the default theme instead.`,
      severity: 'major',
      file: 'pageConfig.tsx',
    }]
  }

  return []
}

// ---------------------------------------------------------------------------
// Hardcoded color check
// ---------------------------------------------------------------------------

// Match hex colors (#fff, #ffffff, #ffffffff), rgb(), rgba(), hsl(), hsla()
// Exclude common non-color hex patterns: #region, #pragma, CSS selectors
const HEX_COLOR_PATTERN = /(?:^|[^&\w])#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?\b/g
const RGB_PATTERN = /\brgba?\s*\(\s*\d/g
const HSL_PATTERN = /\bhsla?\s*\(\s*\d/g

// Colors that are acceptable (common non-theme colors used in code)
const ALLOWED_COLORS = new Set([
  '#fff', '#FFF', '#ffffff', '#FFFFFF',  // white is universal
  '#000', '#000000',                      // black is universal
  '#f5f5f5', '#fafafa',                  // very light grays (common defaults)
])

function stripStringsAndComments(code: string): string {
  let result = code.replace(/`[^`]*`/g, 'STRLIT')
  result = result.replace(/"[^"]*"/g, 'STRLIT')
  result = result.replace(/'[^']*'/g, 'STRLIT')
  result = result.replace(/\/\/.*$/gm, '')
  result = result.replace(/\/\*[\s\S]*?\*\//g, '')
  return result
}

function checkHardcodedColors(code: string, filePath: string): Finding[] {
  // Only check TSX files (where styles are applied)
  if (!filePath.endsWith('.tsx')) return []

  const cleaned = stripStringsAndComments(code)
  const findings: Finding[] = []
  const lines = cleaned.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip import lines and type definitions
    if (line.trimStart().startsWith('import ') || line.includes('type ') || line.includes('interface ')) continue

    // Check hex colors
    const hexMatches = line.matchAll(HEX_COLOR_PATTERN)
    for (const match of hexMatches) {
      const color = match[0].replace(/^[^#]/, '')
      if (!ALLOWED_COLORS.has(color)) {
        findings.push({
          ruleId: 'hardcoded-color',
          message: `Hardcoded color "${color}" found — use a CSS variable or theme token`,
          plainEnglish: `Found a hardcoded color (${color}) — use a theme variable like var(--theme-color-2) so it adapts to different themes.`,
          severity: 'minor',
          file: filePath,
          line: i + 1,
        })
      }
    }

    // Check rgb/rgba
    if (RGB_PATTERN.test(line)) {
      RGB_PATTERN.lastIndex = 0
      findings.push({
        ruleId: 'hardcoded-color-rgb',
        message: 'Hardcoded rgb/rgba color — use a CSS variable or theme token',
        plainEnglish: 'Found a hardcoded rgb() color — use a theme variable so it adapts to different themes.',
        severity: 'minor',
        file: filePath,
        line: i + 1,
      })
    }

    // Check hsl/hsla
    if (HSL_PATTERN.test(line)) {
      HSL_PATTERN.lastIndex = 0
      findings.push({
        ruleId: 'hardcoded-color-hsl',
        message: 'Hardcoded hsl/hsla color — use a CSS variable or theme token',
        plainEnglish: 'Found a hardcoded hsl() color — use a theme variable so it adapts to different themes.',
        severity: 'minor',
        file: filePath,
        line: i + 1,
      })
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Hardcoded pixel spacing check
// ---------------------------------------------------------------------------

const HARDCODED_SPACING_PATTERN = /style\s*=\s*\{\{[^}]*(margin|padding)\s*:\s*['"]?\d+px/g

function checkHardcodedSpacing(code: string, filePath: string): Finding[] {
  if (!filePath.endsWith('.tsx')) return []

  const cleaned = stripStringsAndComments(code)
  const findings: Finding[] = []
  const lines = cleaned.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const lineRegex = new RegExp(HARDCODED_SPACING_PATTERN.source)
    if (lineRegex.test(lines[i])) {
      findings.push({
        ruleId: 'hardcoded-pixel-spacing',
        message: 'Hardcoded pixel margin/padding in inline style',
        plainEnglish: 'Use spacing utility classes (like className="mb-2 p-3") instead of inline pixel values for consistent spacing.',
        severity: 'minor',
        file: filePath,
        line: i + 1,
      })
    }
  }

  return findings
}

// ---------------------------------------------------------------------------
// Screenshot success check
// ---------------------------------------------------------------------------

function checkScreenshotSuccess(
  evalCase: EvalCase,
  screenshotResult: ScreenshotResult | undefined
): Finding[] {
  if (!evalCase.routePath) return [] // No route = no screenshot expected

  if (!screenshotResult) {
    return [{
      ruleId: 'screenshot-not-attempted',
      message: 'Screenshot was not captured for this page',
      plainEnglish: 'No screenshot was taken — the page may not have a route configured.',
      severity: 'major',
    }]
  }

  if (screenshotResult.error) {
    return [{
      ruleId: 'screenshot-failed',
      message: `Screenshot failed: ${screenshotResult.error}`,
      plainEnglish: `The page failed to load for a screenshot — it might have an error or crash on render. Error: ${screenshotResult.error}`,
      severity: 'critical',
    }]
  }

  return []
}

// ---------------------------------------------------------------------------
// Main grader
// ---------------------------------------------------------------------------

export function gradeVisualFidelity(
  evalCase: EvalCase,
  screenshotResult?: ScreenshotResult
): DimensionScore {
  const allFindings: Finding[] = []

  // 1. Theme wrapper check
  allFindings.push(...checkThemeWrapper(evalCase))

  // 2. Hardcoded colors and spacing in target files
  for (const targetFile of evalCase.targetFiles) {
    const fullPath = path.join(DEMO_ROOT, 'src', targetFile)
    if (!fs.existsSync(fullPath)) continue

    const code = fs.readFileSync(fullPath, 'utf-8')
    allFindings.push(...checkHardcodedColors(code, targetFile))
    allFindings.push(...checkHardcodedSpacing(code, targetFile))
  }

  // 3. Screenshot success
  allFindings.push(...checkScreenshotSuccess(evalCase, screenshotResult))

  // Calculate score
  const criticalCount = allFindings.filter(f => f.severity === 'critical').length
  const majorCount = allFindings.filter(f => f.severity === 'major').length
  const minorCount = allFindings.filter(f => f.severity === 'minor').length

  let score = 100
  score -= criticalCount * 25
  score -= majorCount * 10
  // Minor visual findings (hardcoded colors) are light deductions, capped
  score -= Math.min(minorCount * 2, 20)
  score = Math.max(0, Math.min(100, score))

  const summary = criticalCount === 0 && majorCount === 0
    ? minorCount === 0
      ? 'Visual fidelity checks passed.'
      : `${minorCount} minor visual issue${minorCount !== 1 ? 's' : ''} (hardcoded colors/spacing).`
    : `Found ${criticalCount} critical, ${majorCount} major, and ${minorCount} minor visual issue${minorCount !== 1 ? 's' : ''}.`

  return {
    dimension: 'Visual Fidelity',
    score,
    findings: allFindings,
    summary,
  }
}
