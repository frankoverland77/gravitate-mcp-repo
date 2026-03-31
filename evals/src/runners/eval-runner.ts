/**
 * Eval Runner
 *
 * Orchestrates: load cases -> run graders on target files -> aggregate -> report.
 */

import type { EvalCase } from '../cases/schema.js'
import type { GradeResult } from '../graders/types.js'
import { gradeCodeQuality } from '../graders/code-quality.js'
import { gradeVisualFidelity } from '../graders/visual-fidelity.js'
import { captureScreenshots, type ScreenshotResult } from './screenshot-runner.js'
import { buildGradeResult } from '../reporters/scorecard.js'

export interface RunOptions {
  /** Only run cases matching these tiers */
  tiers?: number[]
  /** Only run cases matching these tags */
  tags?: string[]
  /** Only run specific case IDs */
  caseIds?: string[]
  /** Skip screenshot capture (for quick runs) */
  noScreenshots?: boolean
  /** Only run visual fidelity checks */
  visualOnly?: boolean
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

export async function runEvals(
  cases: EvalCase[],
  options: RunOptions = {}
): Promise<{ results: GradeResult[]; screenshotDir: string }> {
  const filtered = filterCases(cases, options)

  // Capture screenshots if not skipped
  let screenshotResults: Map<string, ScreenshotResult> = new Map()
  let screenshotDir = ''

  if (!options.noScreenshots) {
    const casesWithRoutes = filtered.filter(c => c.routePath)
    if (casesWithRoutes.length > 0) {
      console.log(`\n  Capturing ${casesWithRoutes.length} screenshots...`)
      const capture = await captureScreenshots(casesWithRoutes)
      screenshotDir = capture.screenshotDir
      for (const result of capture.results) {
        screenshotResults.set(result.caseId, result)
      }
      console.log(`  Screenshots saved to ${screenshotDir}\n`)
    }
  }

  // Grade each case
  const results: GradeResult[] = []

  for (const evalCase of filtered) {
    const dimensions = []

    // Code quality (skip if visual-only)
    if (!options.visualOnly) {
      dimensions.push(gradeCodeQuality(evalCase))
    }

    // Visual fidelity (skip if noScreenshots and not visual-only)
    if (!options.noScreenshots || options.visualOnly) {
      const screenshotResult = screenshotResults.get(evalCase.id)
      dimensions.push(gradeVisualFidelity(evalCase, screenshotResult))
    }

    const result = buildGradeResult(evalCase, dimensions)
    results.push(result)
  }

  return { results, screenshotDir }
}
