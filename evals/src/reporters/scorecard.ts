/**
 * Scorecard Logic
 *
 * Converts raw GradeResults into a simple verdict:
 *   PASS — all dimensions >= 80, no critical findings
 *   NEEDS_WORK — any dimension 60-79, or minor failures
 *   FAIL — any dimension < 60, or critical anti-patterns
 */

import type { DimensionScore, Finding, GradeResult, Verdict } from '../graders/types.js'
import type { EvalCase } from '../cases/schema.js'

export function computeVerdict(dimensions: DimensionScore[]): Verdict {
  const hasCritical = dimensions.some(d =>
    d.findings.some(f => f.severity === 'critical')
  )
  if (hasCritical) return 'FAIL'

  const minScore = Math.min(...dimensions.map(d => d.score))
  if (minScore < 60) return 'FAIL'
  if (minScore < 80) return 'NEEDS_WORK'
  return 'PASS'
}

export function selectTopFindings(dimensions: DimensionScore[], count: number): Finding[] {
  const allFindings = dimensions.flatMap(d => d.findings)

  // Sort by severity (critical > major > minor > info), then deduplicate by ruleId
  const severityOrder: Record<string, number> = { critical: 0, major: 1, minor: 2, info: 3 }
  const sorted = allFindings.sort((a, b) =>
    (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
  )

  // Deduplicate: keep first occurrence of each ruleId
  const seen = new Set<string>()
  const unique: Finding[] = []
  for (const finding of sorted) {
    if (!seen.has(finding.ruleId)) {
      seen.add(finding.ruleId)
      unique.push(finding)
    }
  }

  return unique.slice(0, count)
}

export function buildGradeResult(
  evalCase: EvalCase,
  dimensions: DimensionScore[]
): GradeResult {
  const verdict = computeVerdict(dimensions)
  const overallScore = dimensions.length > 0
    ? Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length)
    : 0
  const topFindings = selectTopFindings(dimensions, 3)

  return {
    caseId: evalCase.id,
    verdict,
    dimensions,
    overallScore,
    topFindings,
    timestamp: new Date().toISOString(),
  }
}
