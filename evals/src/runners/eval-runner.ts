/**
 * Eval Runner
 *
 * Orchestrates: load cases -> run graders on target files -> aggregate -> report.
 */

import type { EvalCase } from '../cases/schema.js'
import type { GradeResult } from '../graders/types.js'
import { gradeCodeQuality } from '../graders/code-quality.js'
import { buildGradeResult } from '../reporters/scorecard.js'

export interface RunOptions {
  /** Only run cases matching these tiers */
  tiers?: number[]
  /** Only run cases matching these tags */
  tags?: string[]
  /** Only run specific case IDs */
  caseIds?: string[]
}

function filterCases(cases: EvalCase[], options: RunOptions): EvalCase[] {
  let filtered = cases

  if (options.tiers && options.tiers.length > 0) {
    filtered = filtered.filter(c => options.tiers!.includes(c.tier))
  }

  if (options.tags && options.tags.length > 0) {
    filtered = filtered.filter(c =>
      c.tags?.some(t => options.tags!.includes(t))
    )
  }

  if (options.caseIds && options.caseIds.length > 0) {
    filtered = filtered.filter(c => options.caseIds!.includes(c.id))
  }

  return filtered
}

export function runEvals(cases: EvalCase[], options: RunOptions = {}): GradeResult[] {
  const filtered = filterCases(cases, options)
  const results: GradeResult[] = []

  for (const evalCase of filtered) {
    // Phase 1: Only code quality dimension
    const codeQuality = gradeCodeQuality(evalCase)

    // Build the grade result with scorecard verdict
    const result = buildGradeResult(evalCase, [codeQuality])
    results.push(result)
  }

  return results
}
