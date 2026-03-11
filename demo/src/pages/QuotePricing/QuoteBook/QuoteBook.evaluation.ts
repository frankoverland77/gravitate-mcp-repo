import type { QuoteRow } from './QuoteBook.data'
import type { ExceptionProfile, ThresholdComponent, EvaluationResult, ComponentViolation } from './QuoteBook.types'

const FIELD_MAP: Record<string, (row: QuoteRow) => number | null> = {
  'Margin': (row) => row.proposed_margin,
  'Cost': (row) => row.prior_lastPrice,
  'Market Move': (row) => row.proposed_marketMove,
  'Price Delta': (row) => row.proposed_delta,
  'Price': (row) => row.proposed_price,
  'Bench Delta': (row) => Math.abs(row.benchmark_ulsd - row.proposed_price),
  'Bench Value': () => null,
}

function evaluateComponent(
  row: QuoteRow,
  threshold: ThresholdComponent,
): ComponentViolation | null {
  if (threshold.severity === 'Off') return null

  // Check for row-level override
  const override = row.overrides?.find(o => o.component === threshold.component)
  const floor = override ? override.floor : threshold.floor
  const ceiling = override ? override.ceiling : threshold.ceiling
  const severity = override ? override.severity : threshold.severity
  if (severity === 'Off') return null

  const getValue = FIELD_MAP[threshold.component]
  if (!getValue) return null
  const value = getValue(row)
  if (value === null) return null

  // For Market Move and Bench Delta, compare absolute value against ceiling only
  const isAbsoluteComponent = threshold.component === 'Market Move' || threshold.component === 'Bench Delta'
  const compareValue = isAbsoluteComponent ? Math.abs(value) : value

  if (isAbsoluteComponent) {
    if (compareValue > ceiling) {
      const devPct = ceiling !== 0 ? Math.abs((compareValue - ceiling) / ceiling) * 100 : 0
      return {
        component: threshold.component,
        severity: severity as 'Hard' | 'Soft',
        value: compareValue,
        threshold: ceiling,
        direction: 'above_ceiling',
        deviationPct: Math.round(devPct * 10) / 10,
      }
    }
    return null
  }

  if (compareValue < floor) {
    const bound = floor
    const devPct = bound !== 0 ? Math.abs((compareValue - bound) / bound) * 100 : 0
    return {
      component: threshold.component,
      severity: severity as 'Hard' | 'Soft',
      value: compareValue,
      threshold: bound,
      direction: 'below_floor',
      deviationPct: Math.round(devPct * 10) / 10,
    }
  }

  if (compareValue > ceiling) {
    const bound = ceiling
    const devPct = bound !== 0 ? Math.abs((compareValue - bound) / bound) * 100 : 0
    return {
      component: threshold.component,
      severity: severity as 'Hard' | 'Soft',
      value: compareValue,
      threshold: bound,
      direction: 'above_ceiling',
      deviationPct: Math.round(devPct * 10) / 10,
    }
  }

  return null
}

export function evaluateRow(row: QuoteRow, profile: ExceptionProfile): EvaluationResult {
  const violations: ComponentViolation[] = []

  for (const threshold of profile.thresholds) {
    const violation = evaluateComponent(row, threshold)
    if (violation) {
      violations.push(violation)
    }
  }

  const hasHard = violations.some(v => v.severity === 'Hard')
  const exceptionType = hasHard ? 'hard' : violations.length > 0 ? 'soft' : 'clean'

  return {
    exceptionType,
    exceptionCount: violations.length,
    violations,
  }
}

export function evaluateAllRows(
  rows: QuoteRow[],
  profileMap: Record<string, ExceptionProfile>,
): Map<number, EvaluationResult> {
  const results = new Map<number, EvaluationResult>()

  for (const row of rows) {
    const profile = profileMap[row.profileKey || 'default'] || profileMap['default']
    if (profile) {
      results.set(row.id, evaluateRow(row, profile))
    }
  }

  return results
}
