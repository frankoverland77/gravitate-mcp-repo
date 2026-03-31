#!/usr/bin/env tsx
/**
 * Run full eval suite (all tiers).
 *
 * Usage: yarn eval
 *        yarn eval -- --tags grid
 *        yarn eval -- --case smoke-simple-grid
 *        yarn eval -- --no-screenshots
 */

import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { runEvals } from '../runners/eval-runner.js'
import { printResult, printSummary } from '../reporters/console-reporter.js'

// Parse CLI args
const args = process.argv.slice(2)
const tags = args.includes('--tags') ? args[args.indexOf('--tags') + 1]?.split(',') : undefined
const caseId = args.includes('--case') ? args[args.indexOf('--case') + 1] : undefined
const noScreenshots = args.includes('--no-screenshots')

// Collect all cases (add tier2, tier3 as they're implemented)
const allCases = [...tier1Cases]

const { results } = await runEvals(allCases, {
  tags,
  caseIds: caseId ? [caseId] : undefined,
  noScreenshots,
})

for (const result of results) {
  printResult(result)
}

printSummary(results)

// Exit with non-zero if any failures
const hasFailures = results.some(r => r.verdict === 'FAIL')
process.exit(hasFailures ? 1 : 0)
