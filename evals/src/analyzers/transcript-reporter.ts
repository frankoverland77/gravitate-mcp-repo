/**
 * Transcript Reporter
 *
 * Renders TranscriptMetrics to the terminal in a human-readable format.
 * Matches the visual style of the eval console-reporter.
 */

import chalk from 'chalk'
import type { TranscriptMetrics, FileAccess } from './transcript-parser.js'

const BORDER = '═'.repeat(51)
const DIVIDER = '─'.repeat(51)

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatToolBreakdown(breakdown: Record<string, number>): string {
  const entries = Object.entries(breakdown).sort((a, b) => b[1] - a[1])
  return entries.map(([name, count]) => `${name}: ${count}`).join(', ')
}

function formatTime(timestamp: string): string {
  if (!timestamp) return '??:??:??'
  const d = new Date(timestamp)
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function printTranscriptReport(metrics: TranscriptMetrics): void {
  console.log('')
  console.log(chalk.bold(`  ${BORDER}`))
  console.log(chalk.bold(`  Transcript Analysis: ${metrics.sessionId.slice(0, 12)}`))
  console.log(chalk.bold(`  ${BORDER}`))
  console.log('')

  // Overview
  console.log(`  Duration:     ${metrics.durationMinutes} minutes`)
  console.log(`  Turns:        ${metrics.nTurns} user prompt${metrics.nTurns !== 1 ? 's' : ''} → ${metrics.nAssistantMessages} completion${metrics.nAssistantMessages !== 1 ? 's' : ''}`)
  console.log(`  Tool calls:   ${metrics.nToolCalls} total (${formatToolBreakdown(metrics.toolCallBreakdown)})`)
  console.log(`  Tokens:       ${formatTokens(metrics.totalInputTokens)} in / ${formatTokens(metrics.totalOutputTokens)} out`)
  console.log('')

  // Skill consultation
  console.log(`  ${DIVIDER}`)
  console.log(chalk.bold(`  Skill Consultation`))
  console.log(`  ${DIVIDER}`)
  console.log('')

  if (metrics.skillReadBeforeFirstWrite) {
    console.log(`  Read skill docs before writing?  ${chalk.green('✓ YES')}`)
  } else if (metrics.skillDocsRead.length > 0) {
    console.log(`  Read skill docs before writing?  ${chalk.yellow('✗ NO (read after first write)')}`)
  } else {
    console.log(`  Read skill docs before writing?  ${chalk.red('✗ NO (never read skill docs)')}`)
  }

  if (metrics.skillDocsRead.length > 0) {
    console.log(`  Docs consulted:`)
    for (const doc of metrics.skillDocsRead) {
      console.log(chalk.gray(`    • ${doc}`))
    }
  }

  console.log('')
  if (metrics.componentApiRead) {
    console.log(`  component-api.md read?  ${chalk.green('✓ YES')}`)
  } else {
    console.log(`  component-api.md read?  ${chalk.red('✗ NO')}`)
  }

  console.log('')

  // Pattern-matching signals
  console.log(`  ${DIVIDER}`)
  console.log(chalk.bold(`  Pattern-Matching Signals`))
  console.log(`  ${DIVIDER}`)
  console.log('')

  if (metrics.existingDemosRead.length > 0) {
    console.log(`  Existing demos inspected before writing:`)
    for (const demo of metrics.existingDemosRead) {
      console.log(chalk.gray(`    • ${demo}`))
    }
    console.log('')
    console.log(chalk.yellow(`  ⚠ Agent read ${metrics.existingDemosRead.length} existing demo${metrics.existingDemosRead.length !== 1 ? 's' : ''} — likely pattern-matching`))
  } else {
    console.log(chalk.gray(`  No existing demos inspected.`))
  }

  console.log('')

  // File timeline
  console.log(`  ${DIVIDER}`)
  console.log(chalk.bold(`  File Timeline`))
  console.log(`  ${DIVIDER}`)
  console.log('')

  const allAccesses: FileAccess[] = [
    ...metrics.filesRead.map(f => ({ ...f })),
    ...metrics.filesWritten.map(f => ({ ...f })),
  ].sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  // Dedupe consecutive reads of same file
  const shown = new Set<string>()
  for (const access of allAccesses) {
    const key = `${access.tool}-${access.path}`
    if (shown.has(key)) continue
    shown.add(key)

    const time = chalk.gray(formatTime(access.timestamp))
    const action = access.tool === 'Read' || access.tool === 'Bash'
      ? chalk.cyan('READ  ')
      : access.tool === 'Write'
        ? chalk.green('WRITE ')
        : chalk.yellow('EDIT  ')
    console.log(`  ${time}  ${action} ${access.path}`)
  }

  console.log('')
  console.log(chalk.bold(`  ${BORDER}`))
  console.log('')
}
