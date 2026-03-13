export type ExceptionType = 'hard' | 'soft' | 'clean'

export type ProfileTier = 'org' | 'personal'

export type DrawerMode = 'empty' | 'single' | 'multi'

export type ThresholdComponent = {
  component: string
  colorDot: string
  criticalBelow: number | null
  warningBelow: number | null
  warningAbove: number | null
  criticalAbove: number | null
  orgCriticalBelow: number | null
  orgWarningBelow: number | null
  orgWarningAbove: number | null
  orgCriticalAbove: number | null
}

export type ExceptionProfile = {
  key: string
  name: string
  tier: ProfileTier
  description: string
  isSystem: boolean
  scope: string
  badge: { text: string; variant: string } | null
  thresholds: ThresholdComponent[]
}

export type ThresholdOverride = {
  component: string
  criticalBelow: number | null
  warningBelow: number | null
  warningAbove: number | null
  criticalAbove: number | null
}

export type ComponentViolation = {
  component: string
  severity: 'Hard' | 'Soft'
  value: number
  threshold: number
  direction: 'below_critical' | 'below_warning' | 'above_warning' | 'above_critical'
  deviationPct: number
}

export type EvaluationResult = {
  exceptionType: ExceptionType
  exceptionCount: number
  violations: ComponentViolation[]
}

export type DrawerState = {
  isOpen: boolean
  mode: DrawerMode
  selectedRowIds: number[]
  actionMode: 'profile' | 'override'
  selectedProfileKey: string | null
}

export type PeriodDisplay = 'neither' | 'column-families' | 'toggle'
export type PeriodToggleValue = 'proposed' | 'current'

export const PROPOSED_COMPONENTS = ['Margin', 'Market Move', 'Price Delta', 'Cost'] as const
export const CURRENT_COMPONENTS = ['Ref Strategy to Price'] as const

export function getComponentStatus(t: ThresholdComponent): 'hard' | 'soft' | 'off' {
  if (t.criticalBelow !== null || t.criticalAbove !== null) return 'hard'
  if (t.warningBelow !== null || t.warningAbove !== null) return 'soft'
  return 'off'
}
