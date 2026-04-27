import React from 'react'
import styles from './PageFooter.module.css'

export interface ActionFooterProps {
  /** Optional icon on the left — usually the page's section icon (FileTextOutlined, etc.). */
  icon?: React.ReactNode
  /** Optional title on the left. Keep it short — it's the page's commit context, not a headline. */
  title?: React.ReactNode
  /**
   * Optional slot between title and actions. Use for inline alerts, validation notices,
   * or a StatusBadge that describes the page's current commit state.
   */
  notice?: React.ReactNode
  /** The action buttons. The caller composes the button cluster (GraviButton / GraviButton theme1). */
  actions: React.ReactNode
  /**
   * Emphasis variant:
   *  - none (default) — flat bar, no accent.
   *  - title — adds a 2px brand-colored underline on the title block. Use when the
   *    footer title labels the whole page (e.g. Contract Management).
   */
  emphasis?: 'none' | 'title'
  /** Compact density (40px tall, tighter padding). Use for grid pages. */
  compact?: boolean
  className?: string
}

export function ActionFooter({
  icon,
  title,
  notice,
  actions,
  emphasis = 'none',
  compact,
  className,
}: ActionFooterProps) {
  const classes = [
    styles.action,
    emphasis === 'title' && styles.emphasisTitle,
    compact && styles.compact,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role='toolbar'>
      <div className={styles.actionLeft}>
        {icon && <span className={styles.actionIcon}>{icon}</span>}
        {title && <span className={styles.actionTitle}>{title}</span>}
        {notice && <span className={styles.actionNotice}>{notice}</span>}
      </div>
      <div className={styles.actionRight}>{actions}</div>
    </div>
  )
}
