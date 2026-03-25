/**
 * Page Registration Utilities
 *
 * Shared utilities for checking if pages are properly registered
 * in the navigation system (pageConfig.tsx and AuthenticatedRoute.jsx)
 */

import * as fs from 'fs'
import { PAGE_CONFIG_PATH, AUTH_ROUTE_PATH } from './paths.js'

export interface RegistrationStatus {
  pageName: string
  hasImport: boolean
  hasConfig: boolean
  hasScope: boolean
  isFullyRegistered: boolean
  missing: string[]
}

/**
 * Check if a page is properly registered in the navigation system
 */
export function checkPageRegistration(pageName: string): RegistrationStatus {
  let pageConfigContent = ''
  let authRouteContent = ''

  try {
    pageConfigContent = fs.readFileSync(PAGE_CONFIG_PATH, 'utf-8')
  } catch {
    // File not found - all checks will fail
  }

  try {
    authRouteContent = fs.readFileSync(AUTH_ROUTE_PATH, 'utf-8')
  } catch {
    // File not found - all checks will fail
  }

  // Check for import from this page's directory
  const importRegex = new RegExp(`from\\s+["']\\./pages/${pageName}/`)
  const hasImport = importRegex.test(pageConfigContent)

  // Check for config section: config.PageName = { ... }
  const configRegex = new RegExp(`config\\.${pageName}\\s*=`)
  const hasConfig = configRegex.test(pageConfigContent)

  // Check for scope: PageName: true
  const scopeRegex = new RegExp(`${pageName}:\\s*true`)
  const hasScope = scopeRegex.test(authRouteContent)

  const missing: string[] = []
  if (!hasImport) missing.push('pageConfig.tsx import')
  if (!hasConfig) missing.push('pageConfig.tsx config section')
  if (!hasScope) missing.push('AuthenticatedRoute.jsx scope')

  return {
    pageName,
    hasImport,
    hasConfig,
    hasScope,
    isFullyRegistered: hasImport && hasConfig && hasScope,
    missing,
  }
}

/**
 * Extract page name from a file path
 * Returns null if the path doesn't match the expected pattern
 *
 * Matches patterns like:
 * - src/pages/SubscriptionManagement/SubscriptionManagement.tsx
 * - src/pages/ContractMeasurement/ContractMeasurementGrid.tsx
 */
export function extractPageNameFromPath(filePath: string): string | null {
  // Match: pages/PageName/anything.tsx
  const match = filePath.match(/pages\/([^\/]+)\/[^\/]+\.tsx$/)
  if (!match) return null

  const dirName = match[1]

  // Ignore known non-page directories
  const ignoreDirs = ['demos', 'WelcomePages']
  if (ignoreDirs.includes(dirName)) return null

  return dirName
}

/**
 * Format registration status as a warning message
 */
export function formatRegistrationWarning(status: RegistrationStatus): string {
  if (status.isFullyRegistered) return ''

  let message = `Page "${status.pageName}" is not fully registered in navigation.\n`
  message += `Missing from: ${status.missing.join(', ')}\n`
  message += `\nTo fix, either:\n`
  message += `  1. Use the register_demo MCP tool\n`
  message += `  2. Manually add:\n`
  message += `     - Import in pageConfig.tsx\n`
  message += `     - Config section in createPageConfig()\n`
  message += `     - Scope in AuthenticatedRoute.jsx`

  return message
}
