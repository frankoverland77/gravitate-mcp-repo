import { DollarCircleOutlined, EyeOutlined, MailOutlined, TrophyOutlined, UserAddOutlined } from '@ant-design/icons'
import type { SpecialOfferBreakdownCustomerEngagement } from '../../ManageOffers.types'
import { type ReactNode, createElement } from 'react'

export type EngagementStageKey = 'Invited' | 'Opened' | 'Viewed' | 'Submitted' | 'Accepted'

export interface EngagementStage {
  key: EngagementStageKey
  title: string
  step: number
  count: number
  percent?: number
  customers?: string[]
  lostText?: string
  lostNames?: string[]
}

const uniq = (arr: (string | null | undefined)[] = []): string[] => {
  const out: string[] = []
  const seen = new Set<string>()
  for (const v of arr) {
    const s = (v ?? '').trim()
    if (!s) continue
    if (!seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  return out
}

function getNamesForStage(e: SpecialOfferBreakdownCustomerEngagement, key: EngagementStageKey): string[] | undefined {
  switch (key) {
    case 'Invited':
      return uniq(e.InvitedCustomerNames)
    case 'Opened':
      return uniq((e as any).OpenedCustomerNames)
    case 'Viewed':
      return uniq(e.ViewedCustomerNames)
    case 'Submitted':
      return uniq(e.SubmittedCustomerNames)
    case 'Accepted':
      return uniq(e.AcceptedCustomerNames)
    default:
      return undefined
  }
}

function getCountForStage(e: SpecialOfferBreakdownCustomerEngagement, key: EngagementStageKey): number | undefined {
  switch (key) {
    case 'Invited':
      return e.InvitedCount
    case 'Opened':
      return (e as any).OpenedCount
    case 'Viewed':
      return e.ViewedCount
    case 'Submitted':
      return e.SubmittedCount
    case 'Accepted':
      return e.AcceptedCount
    default:
      return undefined
  }
}

export function buildEngagementStages(e?: SpecialOfferBreakdownCustomerEngagement): EngagementStage[] {
  if (!e) return []

  const keys: EngagementStageKey[] = ['Invited', 'Opened', 'Viewed', 'Submitted', 'Accepted']
  const pipeline = keys
    .map((key) => {
      const names = getNamesForStage(e, key)
      const count = getCountForStage(e, key)
      if (count == null) return undefined
      return { key, names: names ?? undefined, count }
    })
    .filter(Boolean) as Array<{ key: EngagementStageKey; names?: string[]; count: number }>

  const stages: EngagementStage[] = []

  pipeline.forEach((stage, idx) => {
    const prev = idx > 0 ? pipeline[idx - 1] : undefined

    let percent: number | undefined
    if (prev) {
      const currBase = stage.count
      const prevBase = prev.count
      percent = prevBase > 0 ? Number(((currBase / prevBase) * 100).toFixed(1)) : undefined
    } else {
      percent = undefined
    }

    let lostNames: string[] | undefined
    let lostText: string | undefined
    if (prev) {
      if (prev.names && stage.names) {
        lostNames = prev.names.filter((n) => !new Set(stage.names!).has(n))
        if (lostNames.length > 0) lostText = `${lostNames.length} lost`
      } else {
        const lost = Math.max(0, prev.count - stage.count)
        if (lost > 0) lostText = `${lost} lost`
      }
    }

    stages.push({
      key: stage.key,
      title: stage.key,
      step: stages.length + 1,
      count: stage.count,
      percent,
      customers: stage.names,
      lostText,
      lostNames,
    })
  })

  const won = stages.find((s) => s.key === 'Accepted')
  if (won && (won.percent == null || Number.isNaN(won.percent))) {
    const fallback = e.ApprovalPercentage
    if (typeof fallback === 'number') won.percent = Number(fallback.toFixed?.(1) ?? fallback)
  }

  return stages
}

export function getStageIcon(key: EngagementStageKey): ReactNode {
  switch (key) {
    case 'Invited':
      return createElement(UserAddOutlined)
    case 'Opened':
      return createElement(MailOutlined)
    case 'Viewed':
      return createElement(EyeOutlined)
    case 'Submitted':
      return createElement(DollarCircleOutlined)
    case 'Accepted':
      return createElement(TrophyOutlined)
    default:
      return null
  }
}
