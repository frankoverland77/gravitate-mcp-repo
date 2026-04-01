/**
 * Transcript Analyzer CLI
 *
 * Usage:
 *   npm run transcript -- /path/to/session.jsonl
 *   npm run transcript -- --latest
 *   npm run transcript -- --session <id-prefix>
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import { parseTranscript } from '../analyzers/transcript-parser.js'
import { printTranscriptReport } from '../analyzers/transcript-reporter.js'

const EVALS_ROOT = path.resolve(import.meta.dirname, '../..')
const REPORTS_DIR = path.join(EVALS_ROOT, 'reports')
const HOME = process.env.HOME ?? ''

function findProjectDir(): string | null {
  // Look for Claude Code project transcripts for this repo
  const candidates = [
    path.join(HOME, '.claude/projects/-Users-rebecca-repos-excalibrr-mcp-server'),
    path.join(HOME, '.claude/projects'),
  ]

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  return null
}

function findTranscriptFiles(dir: string): Array<{ path: string; mtime: Date }> {
  const files: Array<{ path: string; mtime: Date }> = []

  try {
    for (const entry of fs.readdirSync(dir)) {
      if (!entry.endsWith('.jsonl')) continue
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      if (stat.isFile()) {
        files.push({ path: fullPath, mtime: stat.mtime })
      }
    }
  } catch {
    // Directory not readable
  }

  return files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
}

function resolveTranscriptPath(args: string[]): string | null {
  // Direct file path
  if (args.length === 1 && !args[0].startsWith('--')) {
    const p = path.resolve(args[0])
    if (fs.existsSync(p)) return p
    console.error(chalk.red(`File not found: ${args[0]}`))
    return null
  }

  const projectDir = findProjectDir()
  if (!projectDir) {
    console.error(chalk.red('Could not find Claude Code project directory'))
    return null
  }

  // --latest
  if (args.includes('--latest')) {
    const files = findTranscriptFiles(projectDir)
    if (files.length === 0) {
      console.error(chalk.red(`No .jsonl files found in ${projectDir}`))
      return null
    }
    console.log(chalk.gray(`  Using latest transcript: ${path.basename(files[0].path)}`))
    return files[0].path
  }

  // --session <id>
  const sessionIdx = args.indexOf('--session')
  if (sessionIdx !== -1 && args[sessionIdx + 1]) {
    const prefix = args[sessionIdx + 1]
    const files = findTranscriptFiles(projectDir)
    const match = files.find(f => path.basename(f.path).startsWith(prefix))
    if (!match) {
      console.error(chalk.red(`No transcript matching session prefix "${prefix}"`))
      return null
    }
    return match.path
  }

  console.error(chalk.red('Usage: npm run transcript -- <path.jsonl | --latest | --session <id>>'))
  return null
}

function main() {
  const args = process.argv.slice(2)
  const transcriptPath = resolveTranscriptPath(args)
  if (!transcriptPath) process.exit(1)

  const content = fs.readFileSync(transcriptPath, 'utf-8')
  const metrics = parseTranscript(content)

  printTranscriptReport(metrics)

  // Save JSON report
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }
  const reportPath = path.join(REPORTS_DIR, `transcript-${metrics.sessionId.slice(0, 8)}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2))
  console.log(chalk.gray(`  Saved metrics to ${path.relative(process.cwd(), reportPath)}`))
  console.log('')
}

main()
