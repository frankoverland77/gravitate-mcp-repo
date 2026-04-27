import React from 'react'
import styles from './MetricCard.module.css'

export type MetricCardSize = 'sm' | 'md' | 'lg'
export type MetricCardAlign = 'left' | 'center'
export type MetricCardOrder = 'valueFirst' | 'labelFirst'

export interface MetricCardProps {
  /** Short description of the metric. Keep to a phrase — "Active Deals", not "Number of active deals in the pipeline". */
  label: React.ReactNode
  /** The headline number or string. */
  value: React.ReactNode
  /**
   * Optional supporting text below the value/label pair. Use for denominators ("of 240"),
   * secondary context ("last updated 3m ago"), or a small trend string.
   */
  sub?: React.ReactNode
  /**
   * Optional trend slot below sub. Intended for StatusBadge, sparkline, or delta chip.
   * Keep quiet — a metric card should be readable at a glance, not busy.
   */
  trend?: React.ReactNode
  /** Visual alignment. Default 'left' for density; 'center' for hero KPI dashboards. */
  align?: MetricCardAlign
  /**
   * Stacking order of value vs label:
   *  - valueFirst (default) — big number on top, label below. Dashboard style.
   *  - labelFirst — label on top, number below. Denser, better for many stats in a row.
   */
  order?: MetricCardOrder
  /** Size scales the value. Label and sub stay constant so the number is the focal point. */
  size?: MetricCardSize
  /** Adds a brand-colored border to mark a primary or currently-filtered metric. */
  highlight?: boolean
  /** If provided, the card becomes clickable with hover + focus states. */
  onClick?: () => void
  className?: string
  /** Accessible label for screen readers when the visible label alone is ambiguous. */
  ariaLabel?: string
}

const sizeClass: Record<MetricCardSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

export function MetricCard({
  label,
  value,
  sub,
  trend,
  align = 'left',
  order = 'valueFirst',
  size = 'md',
  highlight,
  onClick,
  className,
  ariaLabel,
}: MetricCardProps) {
  const interactive = typeof onClick === 'function'
  const classes = [
    styles.card,
    sizeClass[size],
    align === 'center' ? styles.alignCenter : styles.alignLeft,
    order === 'labelFirst' && styles.labelFirst,
    highlight && styles.highlight,
    interactive && styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
      {trend && <div className={styles.trend}>{trend}</div>}
    </>
  )

  if (interactive) {
    return (
      <button
        type='button'
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
        style={{ textAlign: 'inherit', font: 'inherit' }}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={classes} role={ariaLabel ? 'group' : undefined} aria-label={ariaLabel}>
      {content}
    </div>
  )
}
