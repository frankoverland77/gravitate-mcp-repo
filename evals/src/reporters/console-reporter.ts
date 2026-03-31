/**
 * Console Reporter
 *
 * Renders eval results to the terminal with color and plain-English findings.
 * Designed to be understandable by PMs and designers.
 */

import chalk from 'chalk'
import type { GradeResult, Verdict } from '../graders/types.js'

const VERDICT_STYLE: Record<Verdict, (text: string) => string> = {
  PASS: chalk.green.bold,
  NEEDS_WORK: chalk.yellow.bold,
  FAIL: chalk.red.bold,
}

const VERDICT_EMOJI: Record<Verdict, string> = {
  PASS: 'PASS',
  NEEDS_WORK: 'NEEDS WORK',
  FAIL: 'FAIL',
}

function scoreBar(score: number): string {
  const filled = Math.round(score / 5)
  const empty = 20 - filled
  const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red
  return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty)) + ` ${score}/100`
}

export function printResult(result: GradeResult): void {
  const verdictFn = VERDICT_STYLE[result.verdict]

  console.log('')
  console.log(chalk.bold(`  ${result.caseId}`))
  console.log(`  Verdict: ${verdictFn(VERDICT_EMOJI[result.verdict])}`)
  console.log('')

  // Dimension scores
  for (const dim of result.dimensions) {
    console.log(`  ${dim.dimension.padEnd(20)} ${scoreBar(dim.score)}`)
    if (dim.findings.length > 0) {
      console.log(chalk.gray(`  ${''.padEnd(20)} ${dim.summary}`))
    }
  }

  // Top findings
  if (result.topFindings.length > 0) {
    console.log('')
    console.log(chalk.bold('  Top issues to fix:'))
    for (let i = 0; i < result.topFindings.length; i++) {
      const f = result.topFindings[i]
      const severityColor = f.severity === 'critical' ? chalk.red
        : f.severity === 'major' ? chalk.yellow
        : chalk.gray
      const location = f.file ? ` (${f.file}${f.line ? `:${f.line}` : ''})` : ''
      console.log(`  ${i + 1}. ${severityColor(`[${f.severity}]`)} ${f.plainEnglish}${chalk.gray(location)}`)
    }
  }

  console.log('')
}

export function printSummary(results: GradeResult[]): void {
  const passed = results.filter(r => r.verdict === 'PASS').length
  const needsWork = results.filter(r => r.verdict === 'NEEDS_WORK').length
  const failed = results.filter(r => r.verdict === 'FAIL').length
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
    : 0

  console.log(chalk.bold.underline('\n  Eval Summary'))
  console.log('')
  console.log(`  Total cases:    ${results.length}`)
  console.log(`  ${chalk.green('Passed:')}         ${passed}`)
  if (needsWork > 0) console.log(`  ${chalk.yellow('Needs work:')}     ${needsWork}`)
  if (failed > 0) console.log(`  ${chalk.red('Failed:')}         ${failed}`)
  console.log(`  Average score:  ${scoreBar(avgScore)}`)
  console.log('')

  // Overall verdict
  const overall = failed > 0 ? 'FAIL' : needsWork > 0 ? 'NEEDS_WORK' : 'PASS'
  const verdictFn = VERDICT_STYLE[overall]
  console.log(`  Overall: ${verdictFn(VERDICT_EMOJI[overall])}`)
  console.log('')
}
