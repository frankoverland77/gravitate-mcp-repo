export type ThresholdSeverity = 'Hard' | 'Soft' | 'Off'

export type ExceptionType = 'hard' | 'soft' | 'clean'

export type ProfileTier = 'org' | 'personal'

export type DrawerMode = 'empty' | 'single' | 'multi'

export type ThresholdComponent = {
  component: string
  colorDot: string
  floor: number
  ceiling: number
  severity: ThresholdSeverity
  orgFloor: number
  orgCeiling: number
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
  floor: number
  ceiling: number
  severity: ThresholdSeverity
}

export type DrawerState = {
  isOpen: boolean
  mode: DrawerMode
  selectedRowIds: number[]
  actionMode: 'profile' | 'override'
  selectedProfileKey: string | null
}
