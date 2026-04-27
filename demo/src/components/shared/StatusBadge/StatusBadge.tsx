import React from 'react'
import styles from './StatusBadge.module.css'

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type StatusVariant = 'filled' | 'quiet' | 'solid'
export type StatusSize = 'sm' | 'md' | 'lg'

export interface StatusBadgeProps {
  /** Tone drives the color (background, border, text). */
  tone: StatusTone
  /** Visible label. Use short copy — 1–2 words. */
  label: React.ReactNode
  /**
   * Visual treatment:
   *  - filled  (default) — subtle tinted chip. Use everywhere by default.
   *  - quiet — just a dot + muted text. Use in dense grids where a pill per row would shout.
   *  - solid — saturated chip with white text. Reserve for statuses that must demand attention.
   */
  variant?: StatusVariant
  /** Chip size. Default md (12px text). sm (11px) for tight grids, lg (13px) for page headers. */
  size?: StatusSize
  /** Render a small colored dot before the label. Default true for quiet, false otherwise. */
  dot?: boolean
  className?: string
}

const sizeClass: Record<StatusSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

const toneClass: Record<StatusTone, string> = {
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  info: styles.toneInfo,
  neutral: styles.toneNeutral,
}

const variantClass: Record<StatusVariant, string | undefined> = {
  filled: undefined,
  quiet: styles.variantQuiet,
  solid: styles.variantSolid,
}

export function StatusBadge({
  tone,
  label,
  variant = 'filled',
  size = 'md',
  dot,
  className,
}: StatusBadgeProps) {
  const showDot = dot ?? variant === 'quiet'
  const classes = [
    styles.badge,
    sizeClass[size],
    toneClass[tone],
    variantClass[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      {showDot && <span className={styles.dot} aria-hidden='true' />}
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Variant maps                                                        */
/*                                                                     */
/* The typical usage is `<StatusBadge tone={map[value]} label={value} />`*/
/* — define the map at call-site when you want explicit control, or    */
/* import a preset when you want the common Gravitate vocabulary.      */
/* ------------------------------------------------------------------ */

export type StatusMap<K extends string> = Record<K, { tone: StatusTone; label?: string }>

/** Lifecycle: active / draft / archived / pending. Matches ProjectHub. */
export const LIFECYCLE_STATUS: StatusMap<'active' | 'draft' | 'archived' | 'pending'> = {
  active: { tone: 'success', label: 'Active' },
  draft: { tone: 'warning', label: 'Draft' },
  archived: { tone: 'neutral', label: 'Archived' },
  pending: { tone: 'info', label: 'Pending' },
}

/** RFP / deal flow: draft / in-progress / submitted / won / lost / declined. */
export const DEAL_STATUS: StatusMap<
  'draft' | 'inProgress' | 'submitted' | 'won' | 'lost' | 'partialWin' | 'advanced' | 'declined'
> = {
  draft: { tone: 'neutral', label: 'Draft' },
  inProgress: { tone: 'info', label: 'In Progress' },
  submitted: { tone: 'info', label: 'Submitted' },
  won: { tone: 'success', label: 'Won' },
  lost: { tone: 'danger', label: 'Lost' },
  partialWin: { tone: 'warning', label: 'Partial Win' },
  advanced: { tone: 'info', label: 'Advanced' },
  declined: { tone: 'neutral', label: 'Declined' },
}

/** Operational health: on-track / at-risk / behind / blocked. Stoplight vocabulary. */
export const HEALTH_STATUS: StatusMap<'onTrack' | 'atRisk' | 'behind' | 'blocked'> = {
  onTrack: { tone: 'success', label: 'On Track' },
  atRisk: { tone: 'warning', label: 'At Risk' },
  behind: { tone: 'danger', label: 'Behind' },
  blocked: { tone: 'danger', label: 'Blocked' },
}
