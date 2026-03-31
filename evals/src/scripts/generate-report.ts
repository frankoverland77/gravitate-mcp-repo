#!/usr/bin/env tsx
/**
 * Generate eval report (JSON for now, HTML in Phase 2).
 *
 * Usage: yarn eval:report
 */

import * as fs from 'fs'
import * as path from 'path'
import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { runEvals } from '../runners/eval-runner.js'
import { printSummary } from '../reporters/console-reporter.js'

const allCases = [...tier1Cases]
const results = runEvals(allCases)

// Write JSON report
const reportDir = path.resolve(import.meta.dirname, '../../reports')
fs.mkdirSync(reportDir, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const reportPath = path.join(reportDir, `eval-${timestamp}.json`)

fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
console.log(`\nReport written to: ${reportPath}`)

printSummary(results)
