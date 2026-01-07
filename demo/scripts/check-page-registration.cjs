#!/usr/bin/env node
/**
 * Page Registration Check Script
 *
 * Ensures all page directories in src/pages/ are properly registered in:
 * 1. pageConfig.tsx (import statement)
 * 2. pageConfig.tsx (config section in createPageConfig())
 * 3. AuthenticatedRoute.jsx (scope entry)
 *
 * Usage:
 *   node scripts/check-page-registration.js        # Block mode (exit 1 on issues)
 *   node scripts/check-page-registration.js --warn # Warn mode (exit 0, just print)
 */
const fs = require('fs')
const path = require('path')

const PAGES_DIR = path.join(__dirname, '../src/pages')
const PAGE_CONFIG = path.join(__dirname, '../src/pageConfig.tsx')
const AUTH_ROUTE = path.join(__dirname, '../src/_Main/AuthenticatedRoute.jsx')

// Directories that are NOT top-level pages (subdirectories, shared components, etc.)
const IGNORE_DIRS = ['demos', 'WelcomePages']

// Parse command line arguments
const args = process.argv.slice(2)
const warnOnly = args.includes('--warn')

/**
 * Get all page directories that should be registered
 */
function getPageDirectories() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`Pages directory not found: ${PAGES_DIR}`)
    process.exit(1)
  }

  return fs
    .readdirSync(PAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !IGNORE_DIRS.includes(entry.name))
    .map((entry) => entry.name)
}

/**
 * Check if page is registered in pageConfig.tsx
 * Looks for:
 * 1. Import from the page directory (e.g., from "./pages/PageName/...")
 * 2. Config section: config.PageName = { ... }
 */
function checkPageConfig(content, pageName) {
  // Check for import from this page's directory
  // Matches: import { ... } from "./pages/PageName/..." or similar patterns
  const importRegex = new RegExp(`from\\s+["']\\./pages/${pageName}/`)
  const hasImport = importRegex.test(content)

  // Check for config section: config.PageName = { ... }
  const configRegex = new RegExp(`config\\.${pageName}\\s*=`)
  const hasConfig = configRegex.test(content)

  return { hasImport, hasConfig }
}

/**
 * Check if page has scope in AuthenticatedRoute.jsx
 */
function checkAuthRoute(content, pageName) {
  // Check for scope: PageName: true
  const scopeRegex = new RegExp(`${pageName}:\\s*true`)
  return scopeRegex.test(content)
}

/**
 * Main function
 */
function main() {
  const pages = getPageDirectories()

  if (pages.length === 0) {
    console.log('No page directories found to check.')
    process.exit(0)
  }

  let pageConfigContent, authRouteContent

  try {
    pageConfigContent = fs.readFileSync(PAGE_CONFIG, 'utf-8')
  } catch (err) {
    console.error(`Could not read pageConfig.tsx: ${err.message}`)
    process.exit(1)
  }

  try {
    authRouteContent = fs.readFileSync(AUTH_ROUTE, 'utf-8')
  } catch (err) {
    console.error(`Could not read AuthenticatedRoute.jsx: ${err.message}`)
    process.exit(1)
  }

  const issues = []

  for (const page of pages) {
    const missing = []
    const { hasImport, hasConfig } = checkPageConfig(pageConfigContent, page)
    const hasScope = checkAuthRoute(authRouteContent, page)

    if (!hasImport) missing.push('pageConfig.tsx import')
    if (!hasConfig) missing.push('pageConfig.tsx config section')
    if (!hasScope) missing.push('AuthenticatedRoute.jsx scope')

    if (missing.length > 0) {
      issues.push({ page, missing })
    }
  }

  if (issues.length > 0) {
    const prefix = warnOnly ? '\n\u26a0\ufe0f  WARNING: ' : '\n\u274c '
    console.error(`${prefix}UNREGISTERED PAGE(S) DETECTED\n`)

    for (const { page, missing } of issues) {
      console.error(`  Page: ${page}`)
      console.error(`  Location: src/pages/${page}/`)
      console.error(`  Missing from:`)
      missing.forEach((m) => console.error(`    \u2717 ${m}`))
      console.error('')
    }

    console.error('  To fix, add registration in:')
    console.error('    1. Import component in pageConfig.tsx')
    console.error('    2. Add config section in createPageConfig()')
    console.error('    3. Add scope in AuthenticatedRoute.jsx')
    console.error('')

    if (warnOnly) {
      console.error('  (Warning only - not blocking)\n')
      process.exit(0)
    } else {
      console.error('  Commit blocked. Fix registration and try again.\n')
      process.exit(1)
    }
  }

  console.log('\u2705 All pages registered')
  process.exit(0)
}

main()
