/**
 * Transcript Parser
 *
 * Parses Claude Code session transcripts (JSONL) into structured metrics.
 * Tracks tool usage, file access patterns, skill consultation, and token usage.
 */

export interface FileAccess {
  path: string
  timestamp: string
  tool: 'Read' | 'Write' | 'Edit' | 'Bash'
}

export interface TranscriptMetrics {
  sessionId: string
  startTime: string
  endTime: string
  durationMinutes: number

  // Conversation shape
  nTurns: number
  nAssistantMessages: number
  nToolCalls: number
  toolCallBreakdown: Record<string, number>

  // File access patterns
  filesRead: FileAccess[]
  filesWritten: FileAccess[]

  // Skill consultation
  skillDocsRead: string[]
  skillReadBeforeFirstWrite: boolean
  componentApiRead: boolean

  // Pattern-matching signals
  existingDemosRead: string[]

  // Token usage
  totalInputTokens: number
  totalOutputTokens: number
}

interface TranscriptEntry {
  type: string
  timestamp?: string
  sessionId?: string
  message?: {
    role: string
    content: string | ContentBlock[]
    usage?: { input_tokens: number; output_tokens: number }
  }
}

interface ContentBlock {
  type: string
  name?: string
  input?: Record<string, unknown>
}

function normalizePath(filePath: string): string {
  // Strip common repo root prefixes for cleaner display
  const markers = ['/demo/', '/evals/', '/mcp-server/']
  for (const marker of markers) {
    const idx = filePath.indexOf(marker)
    if (idx !== -1) return filePath.slice(idx + 1)
  }
  // Try stripping everything up to the repo name
  const repoMatch = filePath.match(/excalibrr-mcp-server\/(.+)/)
  if (repoMatch) return repoMatch[1]
  return filePath
}

function isSkillDoc(filePath: string): boolean {
  return /skills\/|SKILL\.md|references\//.test(filePath)
}

function isComponentApi(filePath: string): boolean {
  return /component-api\.md/.test(filePath)
}

function isExistingDemo(filePath: string): boolean {
  return /pages\//.test(filePath)
}

function extractBashFilePaths(command: string): string[] {
  const paths: string[] = []
  const patterns = [/\bcat\s+["']?([^\s"']+)/g, /\bless\s+["']?([^\s"']+)/g, /\bhead\s+["']?([^\s"']+)/g]
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(command)) !== null) {
      paths.push(match[1])
    }
  }
  return paths
}

export function parseTranscript(jsonlContent: string): TranscriptMetrics {
  const lines = jsonlContent.split('\n').filter(l => l.trim())
  const entries: TranscriptEntry[] = []

  for (const line of lines) {
    try {
      entries.push(JSON.parse(line))
    } catch {
      // Skip malformed lines
    }
  }

  let sessionId = ''
  let startTime = ''
  let endTime = ''
  let nTurns = 0
  let nAssistantMessages = 0
  let nToolCalls = 0
  const toolCallBreakdown: Record<string, number> = {}
  const filesRead: FileAccess[] = []
  const filesWritten: FileAccess[] = []
  const skillDocsSet = new Set<string>()
  const existingDemosSet = new Set<string>()
  let componentApiRead = false
  let totalInputTokens = 0
  let totalOutputTokens = 0
  let firstWriteTimestamp = ''
  let earliestSkillReadTimestamp = ''

  for (const entry of entries) {
    const ts = entry.timestamp ?? ''

    // Track session bounds
    if (!sessionId && entry.sessionId) sessionId = entry.sessionId
    if (ts && (!startTime || ts < startTime)) startTime = ts
    if (ts && (!endTime || ts > endTime)) endTime = ts

    if (entry.type === 'user' && entry.message) {
      // A "turn" is a user message where content is a string (actual prompt, not tool results)
      if (typeof entry.message.content === 'string') {
        nTurns++
      }
    }

    if (entry.type === 'assistant' && entry.message) {
      nAssistantMessages++

      // Token usage
      if (entry.message.usage) {
        totalInputTokens += entry.message.usage.input_tokens ?? 0
        totalOutputTokens += entry.message.usage.output_tokens ?? 0
      }

      // Extract tool calls
      const content = entry.message.content
      if (!Array.isArray(content)) continue

      for (const block of content) {
        if (block.type !== 'tool_use') continue
        nToolCalls++
        const toolName = block.name ?? 'unknown'
        toolCallBreakdown[toolName] = (toolCallBreakdown[toolName] ?? 0) + 1

        const input = block.input ?? {}
        const filePath = input.file_path as string | undefined

        if (toolName === 'Read' && filePath && /^[/.~]/.test(filePath)) {
          const normalized = normalizePath(filePath)
          filesRead.push({ path: normalized, timestamp: ts, tool: 'Read' })

          if (isSkillDoc(filePath)) {
            skillDocsSet.add(normalized)
            if (!earliestSkillReadTimestamp || ts < earliestSkillReadTimestamp) {
              earliestSkillReadTimestamp = ts
            }
          }
          if (isComponentApi(filePath)) componentApiRead = true
          if (isExistingDemo(filePath)) existingDemosSet.add(normalized)
        }

        if ((toolName === 'Write' || toolName === 'Edit') && filePath && /^[/.~]/.test(filePath)) {
          const normalized = normalizePath(filePath)
          filesWritten.push({ path: normalized, timestamp: ts, tool: toolName as 'Write' | 'Edit' })
          if (!firstWriteTimestamp || ts < firstWriteTimestamp) {
            firstWriteTimestamp = ts
          }
        }

        if (toolName === 'Bash' && input.command) {
          const bashPaths = extractBashFilePaths(input.command as string)
          for (const bp of bashPaths) {
            const normalized = normalizePath(bp)
            filesRead.push({ path: normalized, timestamp: ts, tool: 'Bash' })
            if (isSkillDoc(bp)) skillDocsSet.add(normalized)
            if (isComponentApi(bp)) componentApiRead = true
            if (isExistingDemo(bp)) existingDemosSet.add(normalized)
          }
        }
      }
    }
  }

  // Compute duration
  let durationMinutes = 0
  if (startTime && endTime) {
    durationMinutes = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000 * 10) / 10
  }

  // Skill read before first write?
  const skillReadBeforeFirstWrite = !!(
    earliestSkillReadTimestamp &&
    firstWriteTimestamp &&
    earliestSkillReadTimestamp < firstWriteTimestamp
  )

  // Remove written files from existingDemosRead (only count files the agent READ but didn't write)
  const writtenPaths = new Set(filesWritten.map(f => f.path))
  const existingDemosRead = [...existingDemosSet].filter(p => !writtenPaths.has(p))

  return {
    sessionId: sessionId || 'unknown',
    startTime,
    endTime,
    durationMinutes,
    nTurns,
    nAssistantMessages,
    nToolCalls,
    toolCallBreakdown,
    filesRead,
    filesWritten,
    skillDocsRead: [...skillDocsSet],
    skillReadBeforeFirstWrite,
    componentApiRead,
    existingDemosRead,
    totalInputTokens,
    totalOutputTokens,
  }
}
