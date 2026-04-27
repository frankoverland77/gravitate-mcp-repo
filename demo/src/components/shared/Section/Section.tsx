import React from 'react'
import styles from './Section.module.css'

export type SectionDensity = 'standard' | 'compact'
export type SectionBodyPadding = 'standard' | 'compact' | 'flush'

export interface SectionProps {
  /**
   * Title rendered in the header bar. If omitted, no header is rendered and the
   * component is just a bordered, rounded container — useful for wrapping a grid
   * or an embedded widget without adding a title bar.
   */
  title?: React.ReactNode
  /**
   * Optional icon rendered before the title. Color defaults to --theme-color-1
   * (brand teal) so it ties into the same accent used by ActionFooter.
   */
  icon?: React.ReactNode
  /**
   * Optional secondary text next to the title — "(3 fields)", "updated 2m ago",
   * a row count, etc. Keep it short and muted.
   */
  subtitle?: React.ReactNode
  /**
   * Right-side header slot. Use for Edit / Expand / Collapse buttons, filter
   * toggles, or a StatusBadge describing the section's state.
   */
  actions?: React.ReactNode
  /**
   * Header density. 'standard' (12px/16px padding) for page content. 'compact'
   * (8px/12px) for sidebars, drawers, and dense dashboards where multiple
   * sections stack.
   */
  density?: SectionDensity
  /**
   * Body padding:
   *  - standard (default) — 16px/20px. For form content, prose, mixed layouts.
   *  - compact — 12px/16px with flex column + 8px gap between children.
   *    Matches the ContractHeaderSidebar pattern.
   *  - flush — 0 padding. Use when the child is a grid, table, or component
   *    that already owns its own padding (e.g. GraviGrid, an image, a nested Section).
   */
  bodyPadding?: SectionBodyPadding
  /**
   * If true, the body scrolls independently when it overflows. Use when the
   * Section sits inside a flex column with a fixed-height container.
   */
  scrollBody?: boolean
  /**
   * If true, strip the outer border and radius. Use when the Section is
   * embedded inside another bordered container and you just want the header bar.
   */
  flush?: boolean
  className?: string
  children?: React.ReactNode
}

export function Section({
  title,
  icon,
  subtitle,
  actions,
  density = 'standard',
  bodyPadding = 'standard',
  scrollBody,
  flush,
  className,
  children,
}: SectionProps) {
  const sectionClasses = [styles.section, flush && styles.flush, className].filter(Boolean).join(' ')
  const headerClasses = [styles.header, density === 'compact' && styles.compact].filter(Boolean).join(' ')
  const bodyClasses = [
    styles.body,
    bodyPadding === 'compact' && styles.compact,
    bodyPadding === 'flush' && styles.flush,
    scrollBody && styles.scroll,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClasses}>
      {title && (
        <header className={headerClasses}>
          <div className={styles.headerLeft}>
            {icon && <span className={styles.headerIcon}>{icon}</span>}
            <span className={styles.title}>{title}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          </div>
          {actions && <div className={styles.headerActions}>{actions}</div>}
        </header>
      )}
      <div className={bodyClasses}>{children}</div>
    </section>
  )
}
