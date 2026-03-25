/**
 * check_navigation_sync - Verify pageConfig ↔ AuthenticatedRoute alignment
 * 
 * Checks that:
 * 1. Every key in pageConfig has a corresponding scope in AuthenticatedRoute
 * 2. Reports missing scopes
 * 3. Reports orphaned scopes (in route but not in config)
 */

import * as fs from 'fs'
import * as path from 'path'
import { PAGE_CONFIG_PATH, AUTH_ROUTE_PATH } from '../utils/paths.js'

interface CheckNavigationSyncArgs {
  pageConfigPath?: string
  authenticatedRoutePath?: string
  fix?: boolean
}

export async function checkNavigationSyncTool(args: CheckNavigationSyncArgs) {
  const {
    pageConfigPath = PAGE_CONFIG_PATH,
    authenticatedRoutePath = AUTH_ROUTE_PATH,
    fix = false,
  } = args

  try {
    // Read files
    let pageConfigContent = ''
    let authRouteContent = ''

    try {
      pageConfigContent = fs.readFileSync(pageConfigPath, 'utf-8')
    } catch {
      return {
        content: [{
          type: 'text',
          text: `❌ Could not read pageConfig at: ${pageConfigPath}\n\nMake sure the file exists.`
        }],
        isError: true,
      }
    }

    try {
      authRouteContent = fs.readFileSync(authenticatedRoutePath, 'utf-8')
    } catch {
      return {
        content: [{
          type: 'text',
          text: `❌ Could not read AuthenticatedRoute at: ${authenticatedRoutePath}\n\nMake sure the file exists.`
        }],
        isError: true,
      }
    }

    // Extract keys from pageConfig
    // Looking for patterns like: key: 'FeatureName' or key: "FeatureName"
    const pageConfigKeys: string[] = []
    const keyRegex = /key:\s*['"]([^'"]+)['"]/g
    let match
    while ((match = keyRegex.exec(pageConfigContent)) !== null) {
      pageConfigKeys.push(match[1])
    }

    // Extract scopes from AuthenticatedRoute
    // Looking for patterns in: const scopes = { Key: true, ... }
    const scopesMatch = authRouteContent.match(/const\s+scopes\s*=\s*\{([^}]+)\}/s)
    const authRouteScopes: string[] = []
    
    if (scopesMatch) {
      const scopesBlock = scopesMatch[1]
      // Match patterns like: ScopeName: true, or ScopeName:true
      const scopeRegex = /(\w+)\s*:\s*true/g
      while ((match = scopeRegex.exec(scopesBlock)) !== null) {
        authRouteScopes.push(match[1])
      }
    }

    // Find discrepancies
    const missingScopes = pageConfigKeys.filter(key => !authRouteScopes.includes(key))
    const orphanedScopes = authRouteScopes.filter(scope => !pageConfigKeys.includes(scope))

    // Build report
    const lines: string[] = ['# Navigation Sync Check\n']

    lines.push(`## Summary`)
    lines.push(`- **pageConfig keys found:** ${pageConfigKeys.length}`)
    lines.push(`- **AuthenticatedRoute scopes found:** ${authRouteScopes.length}`)
    lines.push('')

    if (missingScopes.length === 0 && orphanedScopes.length === 0) {
      lines.push('✅ **All synced!** Every pageConfig key has a matching scope.\n')
    } else {
      if (missingScopes.length > 0) {
        lines.push(`### ❌ Missing Scopes (in pageConfig but not in AuthenticatedRoute)`)
        lines.push('')
        lines.push('These features are registered in pageConfig but have no scope in AuthenticatedRoute:')
        lines.push('')
        missingScopes.forEach(key => {
          lines.push(`- \`${key}\``)
        })
        lines.push('')
        lines.push('**To fix, add to AuthenticatedRoute.jsx scopes:**')
        lines.push('```javascript')
        lines.push('const scopes = {')
        lines.push('  // ...existing scopes')
        missingScopes.forEach(key => {
          lines.push(`  ${key}: true,`)
        })
        lines.push('}')
        lines.push('```')
        lines.push('')
      }

      if (orphanedScopes.length > 0) {
        lines.push(`### ⚠️ Orphaned Scopes (in AuthenticatedRoute but not in pageConfig)`)
        lines.push('')
        lines.push('These scopes exist in AuthenticatedRoute but have no matching pageConfig entry:')
        lines.push('')
        orphanedScopes.forEach(scope => {
          lines.push(`- \`${scope}\``)
        })
        lines.push('')
        lines.push('This may be intentional (API-only permissions) or these could be removed.')
        lines.push('')
      }
    }

    // Detailed lists
    lines.push('## All Keys')
    lines.push('')
    lines.push('### pageConfig Keys')
    lines.push('```')
    pageConfigKeys.forEach(key => lines.push(key))
    lines.push('```')
    lines.push('')
    lines.push('### AuthenticatedRoute Scopes')
    lines.push('```')
    authRouteScopes.forEach(scope => lines.push(scope))
    lines.push('```')

    // Auto-fix if requested
    if (fix && missingScopes.length > 0) {
      lines.push('')
      lines.push('---')
      lines.push('## Auto-Fix Applied')
      
      // Find the scopes block and add missing scopes
      const scopesBlockRegex = /(const\s+scopes\s*=\s*\{)([^}]+)(\})/s
      const scopesBlockMatch = authRouteContent.match(scopesBlockRegex)
      
      if (scopesBlockMatch) {
        const existingScopesBlock = scopesBlockMatch[2]
        const newScopes = missingScopes.map(key => `  ${key}: true,`).join('\n')
        const updatedScopesBlock = existingScopesBlock.trimEnd() + '\n' + newScopes + '\n'
        const updatedContent = authRouteContent.replace(
          scopesBlockRegex,
          `$1${updatedScopesBlock}$3`
        )
        
        fs.writeFileSync(authenticatedRoutePath, updatedContent)
        lines.push(`✅ Added ${missingScopes.length} scope(s) to AuthenticatedRoute.jsx`)
        lines.push('')
        lines.push('Added scopes:')
        missingScopes.forEach(key => lines.push(`- ${key}`))
      } else {
        lines.push('❌ Could not locate scopes block to auto-fix')
      }
    }

    return {
      content: [{ type: 'text', text: lines.join('\n') }],
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error checking navigation sync: ${error}`
      }],
      isError: true,
    }
  }
}
