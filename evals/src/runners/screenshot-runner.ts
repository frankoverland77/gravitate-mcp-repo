/**
 * Screenshot Runner
 *
 * Uses Playwright to capture screenshots of demo pages.
 * Starts the Vite dev server if not already running, navigates to each
 * demo route, and saves 1280x800 PNG screenshots.
 */

import { execSync, spawn, type ChildProcess } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { chromium, type Browser, type Page } from 'playwright'
import type { EvalCase } from '../cases/schema.js'

const DEMO_ROOT = path.resolve(import.meta.dirname, '../../../demo')
const SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../../reports/screenshots')
const DEV_SERVER_PORT = 3000
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`
const VIEWPORT = { width: 1280, height: 800 }

export interface ScreenshotResult {
  caseId: string
  screenshotPath: string | null
  error: string | null
}

function isDevServerRunning(): boolean {
  try {
    execSync(`lsof -ti:${DEV_SERVER_PORT}`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

async function waitForServer(url: string, timeoutMs: number = 30000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return true
    } catch {
      // Server not ready yet
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  return false
}

function startDevServer(): ChildProcess {
  const child = spawn('npx', ['vite', '--port', String(DEV_SERVER_PORT)], {
    cwd: DEMO_ROOT,
    stdio: 'pipe',
    detached: false,
  })
  return child
}

export async function captureScreenshots(
  cases: EvalCase[]
): Promise<{ results: ScreenshotResult[]; screenshotDir: string }> {
  // Ensure screenshots directory exists
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })

  // Filter to cases that have a route path
  const screenshotCases = cases.filter(c => c.routePath)
  if (screenshotCases.length === 0) {
    return { results: [], screenshotDir: SCREENSHOTS_DIR }
  }

  // Start dev server if needed
  let serverProcess: ChildProcess | null = null
  const serverWasRunning = isDevServerRunning()

  if (!serverWasRunning) {
    console.log('  Starting Vite dev server...')
    serverProcess = startDevServer()
    const ready = await waitForServer(DEV_SERVER_URL)
    if (!ready) {
      serverProcess.kill()
      return {
        results: screenshotCases.map(c => ({
          caseId: c.id,
          screenshotPath: null,
          error: 'Dev server failed to start within 30s',
        })),
        screenshotDir: SCREENSHOTS_DIR,
      }
    }
    console.log('  Dev server ready.')
  }

  // Launch browser
  let browser: Browser | null = null
  const results: ScreenshotResult[] = []

  try {
    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ viewport: VIEWPORT })

    for (const evalCase of screenshotCases) {
      let page: Page | null = null
      try {
        page = await context.newPage()
        const url = `${DEV_SERVER_URL}${evalCase.routePath}`

        // Navigate and wait for network idle
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })

        // Wait a bit for any animations to settle
        await page.waitForTimeout(500)

        // Capture screenshot
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${evalCase.id}.png`)
        await page.screenshot({ path: screenshotPath, fullPage: false })

        results.push({
          caseId: evalCase.id,
          screenshotPath,
          error: null,
        })
      } catch (err) {
        results.push({
          caseId: evalCase.id,
          screenshotPath: null,
          error: err instanceof Error ? err.message : String(err),
        })
      } finally {
        if (page) await page.close()
      }
    }

    await context.close()
  } finally {
    if (browser) await browser.close()
    // Only kill the server if we started it
    if (serverProcess && !serverWasRunning) {
      serverProcess.kill()
    }
  }

  return { results, screenshotDir: SCREENSHOTS_DIR }
}
