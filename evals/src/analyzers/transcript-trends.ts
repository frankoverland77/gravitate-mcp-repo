/**
 * Transcript Trends
 *
 * Aggregates metrics from saved transcript JSON reports to show patterns over time.
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import type { TranscriptMetrics } from './transcript-parser.js'

export interface TranscriptTrends {
  totalSessions: number
  avgTurns: number
  avgToolCalls: number
  avgDurationMinutes: number
  skillConsultationRate: number
  componentApiReadRate: number
  skillBeforeWriteRate: number
  avgExistingDemosRead: number
  mostCommonPatternSources: Array<{ path: string; count: number }>
}

export function computeTrends(reports: TranscriptMetrics[]): TranscriptTrends {
  const n = reports.length
  if (n === 0) {
    return {
      totalSessions: 0,
      avgTurns: 0,
      avgToolCalls: 0,
      avgDurationMinutes: 0,
      skillConsultationRate: 0,
      componentApiReadRate: 0,
      skillBeforeWriteRate: 0,
      avgExistingDemosRead: 0,
      mostCommonPatternSources: [],
    }
  }

  const sumTurns = reports.reduce((s, r) => s + r.nTurns, 0)
  const sumToolCalls = reports.reduce((s, r) => s + r.nToolCalls, 0)
  const sumDuration = reports.reduce((s, r) => s + r.durationMinutes, 0)
  const skillConsulted = reports.filter(r => r.skillDocsRead.length > 0).length
  const componentApiRead = reports.filter(r => r.componentApiRead).length
  const skillBeforeWrite = reports.filter(r => r.skillReadBeforeFirstWrite).length
  const sumDemosRead = reports.reduce((s, r) => s + r.existingDemosRead.length, 0)

  // Count which demos are read most often
  const demoCounter = new Map<string, number>()
  for (const report of reports) {
    for (const demo of report.existingDemosRead) {
      demoCounter.set(demo, (demoCounter.get(demo) ?? 0) + 1)
    }
  }
  const mostCommonPatternSources = [...demoCounter.entries()]
    .map(([p, count]) => ({ path: p, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    totalSessions: n,
    avgTurns: Math.round(sumTurns / n * 10) / 10,
    avgToolCalls: Math.round(sumToolCalls / n * 10) / 10,
    avgDurationMinutes: Math.round(sumDuration / n * 10) / 10,
    skillConsultationRate: Math.round(skillConsulted / n * 100),
    componentApiReadRate: Math.round(componentApiRead / n * 100),
    skillBeforeWriteRate: Math.round(skillBeforeWrite / n * 100),
    avgExistingDemosRead: Math.round(sumDemosRead / n * 10) / 10,
    mostCommonPatternSources,
  }
}

const BORDER = '═'.repeat(51)
const DIVIDER = '─'.repeat(51)

function pct(rate: number, total: number, count: number): string {
  const label = `${rate}% of sessions (${count}/${total})`
  if (rate >= 70) return chalk.green(label)
  if (rate >= 40) return chalk.yellow(label)
  return chalk.red(label)
}

export function printTrends(trends: TranscriptTrends): void {
  console.log('')
  console.log(chalk.bold(`  ${BORDER}`))
  console.log(chalk.bold(`  Transcript Trends (${trends.totalSessions} session${trends.totalSessions !== 1 ? 's' : ''})`))
  console.log(chalk.bold(`  ${BORDER}`))
  console.log('')

  if (trends.totalSessions === 0) {
    console.log(chalk.gray('  No transcript reports found. Run `npm run transcript -- --latest` first.'))
    console.log('')
    return
  }

  console.log(`  Avg turns:              ${trends.avgTurns}`)
  console.log(`  Avg tool calls:         ${trends.avgToolCalls}`)
  console.log(`  Avg duration:           ${trends.avgDurationMinutes} min`)
  console.log('')

  const n = trends.totalSessions
  const skillCount = Math.round(trends.skillConsultationRate / 100 * n)
  const apiCount = Math.round(trends.componentApiReadRate / 100 * n)
  const beforeCount = Math.round(trends.skillBeforeWriteRate / 100 * n)

  console.log(`  Skill docs read:        ${pct(trends.skillConsultationRate, n, skillCount)}`)
  console.log(`  component-api.md read:  ${pct(trends.componentApiReadRate, n, apiCount)}`)
  console.log(`  Skill before write:     ${pct(trends.skillBeforeWriteRate, n, beforeCount)}`)
  console.log('')

  if (trends.mostCommonPatternSources.length > 0) {
    console.log(chalk.bold('  Most pattern-matched demos:'))
    for (let i = 0; i < trends.mostCommonPatternSources.length; i++) {
      const source = trends.mostCommonPatternSources[i]
      console.log(chalk.gray(`    ${i + 1}. ${source.path}  (${source.count} session${source.count !== 1 ? 's' : ''})`))
    }
    console.log('')
  }

  console.log(chalk.bold(`  ${BORDER}`))
  console.log('')
}

export function loadReports(reportsDir: string): TranscriptMetrics[] {
  if (!fs.existsSync(reportsDir)) return []

  const reports: TranscriptMetrics[] = []
  for (const entry of fs.readdirSync(reportsDir)) {
    if (!entry.startsWith('transcript-') || !entry.endsWith('.json')) continue
    try {
      const content = fs.readFileSync(path.join(reportsDir, entry), 'utf-8')
      reports.push(JSON.parse(content))
    } catch {
      // Skip unreadable files
    }
  }
  return reports
}
