/**
 * Formula Utility Functions
 *
 * Shared helpers for building formula expressions from variables and mode.
 * Used by both FormulaEditorPanel (display) and FormulaEditorDrawer (save).
 */

import type { FormulaVariable, FormulaMode } from '../../../../../shared/types/formula.types'
import { isPlaceholder } from '../../../../demos/grids/FormulaTemplates.data'

/**
 * Group variables by their group number from variableName pattern
 */
export function getVariablesByGroup(variables: FormulaVariable[]): Record<number, FormulaVariable[]> {
  const groups: Record<number, FormulaVariable[]> = {}
  for (const v of variables) {
    const match = v.variableName.match(/group_(\d+)/)
    const groupNum = match ? parseInt(match[1], 10) : 1
    if (!groups[groupNum]) groups[groupNum] = []
    groups[groupNum].push(v)
  }
  return groups
}

/**
 * Build formula expression from variables and mode
 */
export function buildExpression(variables: FormulaVariable[], mode: FormulaMode): string {
  if (variables.length === 0) return ''

  const formatVar = (v: FormulaVariable): string => {
    const name = v.displayName && !isPlaceholder(v.displayName) ? v.displayName : v.variableName
    const diffStr =
      v.differential !== 0
        ? ` ${v.differential > 0 ? '+' : '-'} $${Math.abs(v.differential).toFixed(4)}`
        : ''
    return `${name}${diffStr}`
  }

  if (mode === 'lower-of-2' || mode === 'lower-of-3') {
    const groups = getVariablesByGroup(variables)
    const groupCount = mode === 'lower-of-2' ? 2 : 3
    const exprs: string[] = []
    for (let g = 1; g <= groupCount; g++) {
      const gv = groups[g] || []
      exprs.push(gv.length > 0 ? gv.map(formatVar).join(' + ') : '...')
    }
    return `MIN(${exprs.join(', ')})`
  }

  return variables.map(formatVar).join(' + ')
}
