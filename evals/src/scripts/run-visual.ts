#!/usr/bin/env tsx
/**
 * Run visual fidelity checks only (with screenshots).
 *
 * Usage: yarn eval:visual
 */

import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { runEvals } from '../runners/eval-runner.js'
import { printResult, printSummary } from '../reporters/console-reporter.js'

const { results } = await runEvals(tier1Cases, { visualOnly: true })

for (const result of results) {
  printResult(result)
}

printSummary(results)

const hasFailures = results.some(r => r.verdict === 'FAIL')
process.exit(hasFailures ? 1 : 0)
