#!/usr/bin/env tsx
/**
 * Run quick eval — Tier 1 smoke tests only.
 *
 * Usage: yarn eval:quick
 */

import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { runEvals } from '../runners/eval-runner.js'
import { printResult, printSummary } from '../reporters/console-reporter.js'

const results = runEvals(tier1Cases, { tiers: [1] })

for (const result of results) {
  printResult(result)
}

printSummary(results)

const hasFailures = results.some(r => r.verdict === 'FAIL')
process.exit(hasFailures ? 1 : 0)
