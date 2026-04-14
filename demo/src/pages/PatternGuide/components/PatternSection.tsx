import React from 'react'
import styles from '../PatternShell.module.css'

interface PatternSectionProps {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}

export function PatternSection({ id, title, description, children }: PatternSectionProps) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>{title}</h2>
        {description && <p className={styles['section-description']}>{description}</p>}
      </div>
      <div className={styles['section-content']}>{children}</div>
    </section>
  )
}
