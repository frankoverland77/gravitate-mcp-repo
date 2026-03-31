/**
 * Grading result types for the eval framework.
 */

export type Severity = 'critical' | 'major' | 'minor' | 'info'
export type Verdict = 'PASS' | 'NEEDS_WORK' | 'FAIL'

export interface Finding {
  /** Rule that triggered this finding */
  ruleId: string
  /** Human-readable description of the issue */
  message: string
  /** Plain-English explanation a non-technical user can understand */
  plainEnglish: string
  /** Severity level */
  severity: Severity
  /** File where the issue was found */
  file?: string
  /** Line number */
  line?: number
}

export interface DimensionScore {
  /** Dimension name */
  dimension: string
  /** Score from 0-100 */
  score: number
  /** Individual findings */
  findings: Finding[]
  /** Human-readable summary */
  summary: string
}

export interface GradeResult {
  /** The eval case that was graded */
  caseId: string
  /** Overall verdict */
  verdict: Verdict
  /** Scores per dimension */
  dimensions: DimensionScore[]
  /** Overall score (0-100) */
  overallScore: number
  /** Top findings to fix, ordered by impact */
  topFindings: Finding[]
  /** Timestamp */
  timestamp: string
}
