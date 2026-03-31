#!/usr/bin/env tsx
/**
 * Generate eval report (JSON + HTML with screenshots).
 *
 * Usage: yarn eval:report
 */

import * as fs from 'fs'
import * as path from 'path'
import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { runEvals } from '../runners/eval-runner.js'
import { printSummary } from '../reporters/console-reporter.js'
import { writeHtmlReport } from '../reporters/html-reporter.js'

const allCases = [...tier1Cases]
const { results, screenshotDir } = await runEvals(allCases)

// Write JSON report
const reportDir = path.resolve(import.meta.dirname, '../../reports')
fs.mkdirSync(reportDir, { recursive: true })

const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const jsonPath = path.join(reportDir, `eval-${timestamp}.json`)
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2))
console.log(`\n  JSON report: ${jsonPath}`)

// Write HTML report
const htmlPath = path.join(reportDir, 'eval-report.html')
writeHtmlReport(results, screenshotDir, htmlPath)
console.log(`  HTML report: ${htmlPath}`)

printSummary(results)
