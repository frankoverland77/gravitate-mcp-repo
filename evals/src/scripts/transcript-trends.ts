/**
 * Transcript Trends CLI
 *
 * Reads saved transcript JSON reports and prints aggregate trends.
 * Usage: npm run transcript:trends
 */

import * as path from 'path'
import { loadReports, computeTrends, printTrends } from '../analyzers/transcript-trends.js'

const REPORTS_DIR = path.resolve(import.meta.dirname, '../../reports')

function main() {
  const reports = loadReports(REPORTS_DIR)
  const trends = computeTrends(reports)
  printTrends(trends)
}

main()
