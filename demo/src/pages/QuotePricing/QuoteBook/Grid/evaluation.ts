import type { QuoteRow } from '../Api/mockData'
import type { ExceptionProfile, ThresholdComponent, EvaluationResult, ComponentViolation } from '../Api/types.schema'

const FIELD_MAP: Record<string, (row: QuoteRow) => number | null> = {
  'Margin': (row) => row.proposed_margin,
  'Cost': (row) => row.prior_lastPrice,
  'Market Move': (row) => row.proposed_marketMove,
  'Price Delta': (row) => row.proposed_delta,
  'Reference Strategy Delta': (row) => Math.abs(row.benchmark_ulsd - row.proposed_price),
}

const ABSOLUTE_COMPONENTS = new Set(['Market Move', 'Reference Strategy Delta'])

function evaluateComponent(
  row: QuoteRow,
  threshold: ThresholdComponent,
): ComponentViolation | null {
  // Merge override boundaries if row has one
  const override = row.overrides?.find(o => o.component === threshold.component)
  const cb = override ? override.criticalBelow : threshold.criticalBelow
  const wb = override ? override.warningBelow : threshold.warningBelow
  const wa = override ? override.warningAbove : threshold.warningAbove
  const ca = override ? override.criticalAbove : threshold.criticalAbove

  // All null → component is off
  if (cb === null && wb === null && wa === null && ca === null) return null

  const getValue = FIELD_MAP[threshold.component]
  if (!getValue) return null
  const rawValue = getValue(row)
  if (rawValue === null) return null

  const isAbsolute = ABSOLUTE_COMPONENTS.has(threshold.component)
  const value = isAbsolute ? Math.abs(rawValue) : rawValue

  // Check zones worst-first
  if (cb !== null && value < cb) {
    const devPct = cb !== 0 ? Math.abs((value - cb) / cb) * 100 : 0
    return { component: threshold.component, severity: 'Hard', value, threshold: cb, direction: 'below_critical', deviationPct: Math.round(devPct * 10) / 10 }
  }
  if (ca !== null && value > ca) {
    const devPct = ca !== 0 ? Math.abs((value - ca) / ca) * 100 : 0
    return { component: threshold.component, severity: 'Hard', value, threshold: ca, direction: 'above_critical', deviationPct: Math.round(devPct * 10) / 10 }
  }
  if (wb !== null && value < wb) {
    const devPct = wb !== 0 ? Math.abs((value - wb) / wb) * 100 : 0
    return { component: threshold.component, severity: 'Soft', value, threshold: wb, direction: 'below_warning', deviationPct: Math.round(devPct * 10) / 10 }
  }
  if (wa !== null && value > wa) {
    const devPct = wa !== 0 ? Math.abs((value - wa) / wa) * 100 : 0
    return { component: threshold.component, severity: 'Soft', value, threshold: wa, direction: 'above_warning', deviationPct: Math.round(devPct * 10) / 10 }
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
