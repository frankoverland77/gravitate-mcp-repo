/**
 * Reference Comparison Script
 *
 * Compares a reference solution's code quality score against the actual demo implementation.
 * Usage: npm run eval:compare -- <case-id>
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import { tier1Cases } from '../cases/tier1-smoke/index.js'
import { gradeCodeQuality, checkAntiPatterns, findRawHtmlElements, checkImportOrder } from '../graders/code-quality.js'
import type { Finding } from '../graders/types.js'

const EVALS_ROOT = path.resolve(import.meta.dirname, '../../..')
const REFERENCE_ROOT = path.join(EVALS_ROOT, 'evals/reference-solutions')

const REFERENCE_MAP: Record<string, { dir: string; files: string[] }> = {
  'smoke-simple-grid': { dir: 'simple-grid', files: ['SimpleGrid.tsx'] },
  'smoke-form-feature': { dir: 'form-modal', files: ['ContractForm.tsx'] },
  'smoke-dashboard': { dir: 'dashboard', files: ['DashboardPage.tsx'] },
}

function scoreFindings(findings: Finding[]): number {
  const conventionFindings = findings.filter(f => !f.ruleId.startsWith('eslint/'))
  let score = 100
  score -= conventionFindings.filter(f => f.severity === 'critical').length * 20
  score -= conventionFindings.filter(f => f.severity === 'major').length * 8
  score -= conventionFindings.filter(f => f.severity === 'minor').length * 2
  return Math.max(0, Math.min(100, score))
}

function gradeReferenceFiles(filePaths: string[]): { score: number; findings: Finding[] } {
  const allFindings: Finding[] = []

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`  Reference file not found: ${filePath}`))
      continue
    }
    const code = fs.readFileSync(filePath, 'utf-8')
    const relativePath = path.relative(REFERENCE_ROOT, filePath)

    allFindings.push(...checkAntiPatterns(code, relativePath))
    if (filePath.endsWith('.tsx')) {
      allFindings.push(...findRawHtmlElements(code, relativePath))
      allFindings.push(...checkImportOrder(code, relativePath))
    }
  }

  return { score: scoreFindings(allFindings), findings: allFindings }
}

function printFindings(findings: Finding[], label: string) {
  if (findings.length === 0) {
    console.log(chalk.gray(`  No findings.`))
    return
  }
  for (const f of findings) {
    const badge = f.severity === 'critical' ? chalk.red('[critical]')
      : f.severity === 'major' ? chalk.yellow('[major]')
      : chalk.gray('[minor]')
    const loc = f.file ? ` (${f.file}${f.line ? `:${f.line}` : ''})` : ''
    console.log(`  ${badge} ${f.message}${loc}`)
  }
}

function main() {
  const caseId = process.argv[2]
  if (!caseId) {
    console.error(chalk.red('Usage: npm run eval:compare -- <case-id>'))
    console.error(`Available: ${Object.keys(REFERENCE_MAP).join(', ')}`)
    process.exit(1)
  }

  const refInfo = REFERENCE_MAP[caseId]
  if (!refInfo) {
    console.error(chalk.red(`No reference solution for case "${caseId}"`))
    console.error(`Available: ${Object.keys(REFERENCE_MAP).join(', ')}`)
    process.exit(1)
  }

  const evalCase = tier1Cases.find(c => c.id === caseId)
  if (!evalCase) {
    console.error(chalk.red(`Eval case "${caseId}" not found in tier1 cases`))
    process.exit(1)
  }

  console.log(chalk.bold(`\n  Comparing: ${evalCase.name} (${caseId})\n`))

  // Grade reference solution
  const refFiles = refInfo.files.map(f => path.join(REFERENCE_ROOT, refInfo.dir, f))
  const refResult = gradeReferenceFiles(refFiles)

  // Grade actual implementation
  const actualResult = gradeCodeQuality(evalCase)

  // Print reference results
  const refColor = refResult.score >= 95 ? chalk.green : refResult.score >= 80 ? chalk.yellow : chalk.red
  console.log(`  ${chalk.bold('Reference:')} ${refColor(`${refResult.score}/100`)} (${refResult.findings.length} finding${refResult.findings.length !== 1 ? 's' : ''})`)
  printFindings(refResult.findings, 'Reference')

  console.log()

  // Print actual results
  const actColor = actualResult.score >= 95 ? chalk.green : actualResult.score >= 80 ? chalk.yellow : chalk.red
  console.log(`  ${chalk.bold('Actual:')}    ${actColor(`${actualResult.score}/100`)} (${actualResult.findings.length} finding${actualResult.findings.length !== 1 ? 's' : ''})`)
  printFindings(actualResult.findings, 'Actual')

  console.log()

  // Gap
  const gap = actualResult.score - refResult.score
  const gapColor = gap >= 0 ? chalk.green : chalk.red
  console.log(`  ${chalk.bold('Gap:')}       ${gapColor(`${gap >= 0 ? '+' : ''}${gap} points`)}`)

  // Findings in actual but not reference
  const refRuleIds = new Set(refResult.findings.map(f => f.ruleId))
  const uniqueActual = actualResult.findings.filter(f => !refRuleIds.has(f.ruleId))
  if (uniqueActual.length > 0) {
    console.log(chalk.bold(`\n  Issues in actual but not in reference:`))
    printFindings(uniqueActual, 'Unique')
  }

  console.log()

  // Sanity check
  if (refResult.score < 95) {
    console.log(chalk.yellow(`  ⚠ Reference solution scores below 95 — review the reference or grader rules.`))
  }
}

main()
