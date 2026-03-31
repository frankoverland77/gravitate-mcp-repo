/**
 * HTML Reporter
 *
 * Generates a self-contained HTML file with embedded screenshots,
 * score bars, and plain-English findings. Designed to be shareable
 * via Slack/email and scannable in under 30 seconds.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { GradeResult, Verdict, Finding, DimensionScore } from '../graders/types.js'

function getScreenshotBase64(caseId: string, screenshotDir: string): string | null {
  const screenshotPath = path.join(screenshotDir, `${caseId}.png`)
  if (!fs.existsSync(screenshotPath)) return null
  const buffer = fs.readFileSync(screenshotPath)
  return buffer.toString('base64')
}

function verdictColor(verdict: Verdict): string {
  switch (verdict) {
    case 'PASS': return '#22c55e'
    case 'NEEDS_WORK': return '#eab308'
    case 'FAIL': return '#ef4444'
  }
}

function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case 'PASS': return 'PASS'
    case 'NEEDS_WORK': return 'NEEDS WORK'
    case 'FAIL': return 'FAIL'
  }
}

function scoreBarHtml(score: number, label: string): string {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'
  return `
    <div class="score-bar">
      <div class="score-label">${label}</div>
      <div class="score-track">
        <div class="score-fill" style="width: ${score}%; background: ${color}"></div>
      </div>
      <div class="score-value">${score}</div>
    </div>`
}

function severityBadge(severity: string): string {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    major: '#f97316',
    minor: '#6b7280',
    info: '#3b82f6',
  }
  return `<span class="severity-badge" style="background: ${colors[severity] ?? '#6b7280'}">${severity}</span>`
}

function findingHtml(finding: Finding): string {
  const location = finding.file
    ? `<span class="finding-location">${finding.file}${finding.line ? `:${finding.line}` : ''}</span>`
    : ''
  return `
    <div class="finding">
      ${severityBadge(finding.severity)}
      <span class="finding-text">${escapeHtml(finding.plainEnglish)}</span>
      ${location}
    </div>`
}

function dimensionCardHtml(dim: DimensionScore): string {
  return `
    <div class="dimension-card">
      ${scoreBarHtml(dim.score, dim.dimension)}
      <div class="dimension-summary">${escapeHtml(dim.summary)}</div>
    </div>`
}

function caseCardHtml(result: GradeResult, screenshotBase64: string | null): string {
  const verdictBg = verdictColor(result.verdict)
  const dimensions = result.dimensions.map(d => dimensionCardHtml(d)).join('')
  const findings = result.topFindings.map(f => findingHtml(f)).join('')

  const screenshotImg = screenshotBase64
    ? `<img class="screenshot" src="data:image/png;base64,${screenshotBase64}" alt="Screenshot of ${escapeHtml(result.caseId)}" />`
    : `<div class="screenshot-placeholder">No screenshot available</div>`

  return `
    <div class="case-card">
      <div class="case-header">
        <div class="case-title">${escapeHtml(result.caseId)}</div>
        <div class="verdict-badge" style="background: ${verdictBg}">${verdictLabel(result.verdict)}</div>
      </div>
      <div class="case-body">
        <div class="case-screenshot">${screenshotImg}</div>
        <div class="case-scores">
          ${dimensions}
          ${findings ? `<div class="findings-section">
            <div class="findings-title">Top Issues</div>
            ${findings}
          </div>` : ''}
        </div>
      </div>
    </div>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function generateHtmlReport(
  results: GradeResult[],
  screenshotDir: string
): string {
  const passed = results.filter(r => r.verdict === 'PASS').length
  const needsWork = results.filter(r => r.verdict === 'NEEDS_WORK').length
  const failed = results.filter(r => r.verdict === 'FAIL').length
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
    : 0

  const overallVerdict: Verdict = failed > 0 ? 'FAIL' : needsWork > 0 ? 'NEEDS_WORK' : 'PASS'
  const headerColor = verdictColor(overallVerdict)

  const caseCards = results
    .map(r => caseCardHtml(r, getScreenshotBase64(r.caseId, screenshotDir)))
    .join('')

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Builder Eval Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #1e293b;
      line-height: 1.5;
    }

    /* Header */
    .header {
      background: ${headerColor};
      color: white;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title { font-size: 20px; font-weight: 700; }
    .header-meta { font-size: 14px; opacity: 0.9; }
    .header-verdict { font-size: 32px; font-weight: 800; }

    /* Summary */
    .summary {
      display: flex;
      gap: 16px;
      padding: 24px 32px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      flex-wrap: wrap;
    }
    .summary-stat {
      flex: 1;
      min-width: 120px;
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      background: #f1f5f9;
    }
    .summary-stat-value { font-size: 28px; font-weight: 700; }
    .summary-stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Case cards */
    .cases { padding: 24px 32px; display: flex; flex-direction: column; gap: 16px; }
    .case-card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .case-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .case-title { font-weight: 600; font-size: 14px; }
    .verdict-badge {
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .case-body {
      display: flex;
      gap: 16px;
      padding: 16px;
    }
    .case-screenshot { flex: 0 0 320px; }
    .case-screenshot img {
      width: 320px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .screenshot-placeholder {
      width: 320px;
      height: 200px;
      background: #f1f5f9;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 13px;
    }
    .case-scores { flex: 1; display: flex; flex-direction: column; gap: 8px; }

    /* Score bars */
    .score-bar { display: flex; align-items: center; gap: 8px; }
    .score-label { width: 120px; font-size: 12px; font-weight: 600; color: #475569; }
    .score-track {
      flex: 1;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .score-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .score-value { width: 32px; font-size: 13px; font-weight: 700; text-align: right; }

    /* Dimension cards */
    .dimension-card { margin-bottom: 4px; }
    .dimension-summary { font-size: 12px; color: #64748b; margin-left: 128px; }

    /* Findings */
    .findings-section { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
    .findings-title { font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; }
    .finding { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; font-size: 13px; }
    .severity-badge {
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .finding-text { color: #334155; }
    .finding-location { color: #94a3b8; font-size: 11px; flex-shrink: 0; }

    /* Footer */
    .footer {
      text-align: center;
      padding: 24px;
      color: #94a3b8;
      font-size: 12px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .case-body { flex-direction: column; }
      .case-screenshot { flex: none; }
      .case-screenshot img { width: 100%; }
      .screenshot-placeholder { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="header-title">Gravitate Demo Builder — Eval Report</div>
      <div class="header-meta">${timestamp} · ${results.length} demos evaluated</div>
    </div>
    <div class="header-verdict">${verdictLabel(overallVerdict)}</div>
  </div>

  <div class="summary">
    <div class="summary-stat">
      <div class="summary-stat-value">${avgScore}</div>
      <div class="summary-stat-label">Avg Score</div>
    </div>
    <div class="summary-stat">
      <div class="summary-stat-value" style="color: #22c55e">${passed}</div>
      <div class="summary-stat-label">Passed</div>
    </div>
    <div class="summary-stat">
      <div class="summary-stat-value" style="color: #eab308">${needsWork}</div>
      <div class="summary-stat-label">Needs Work</div>
    </div>
    <div class="summary-stat">
      <div class="summary-stat-value" style="color: #ef4444">${failed}</div>
      <div class="summary-stat-label">Failed</div>
    </div>
  </div>

  <div class="cases">
    ${caseCards}
  </div>

  <div class="footer">
    Generated by Gravitate Demo Builder Eval Framework
  </div>
</body>
</html>`
}

export function writeHtmlReport(
  results: GradeResult[],
  screenshotDir: string,
  outputPath: string
): void {
  const html = generateHtmlReport(results, screenshotDir)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, html)
}
