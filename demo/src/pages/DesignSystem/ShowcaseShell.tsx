import React, { useEffect, useRef } from 'react'
import styles from './ShowcaseShell.module.css'

interface SpecimenCardProps {
  label: string
  props?: string
  children: React.ReactNode
  wide?: boolean
  column?: boolean
}

export function SpecimenCard({ label, props, children, column }: SpecimenCardProps) {
  return (
    <div className={styles['specimen-card']}>
      <div className={styles['specimen-label']}>{label}</div>
      {props && <div className={styles['specimen-props']}>{props}</div>}
      <div className={column ? styles['specimen-content-col'] : styles['specimen-content']}>{children}</div>
    </div>
  )
}

interface ShowcaseShellProps {
  title: string
  subtitle?: string
  accentColor?: string
  children: React.ReactNode
  gridMode?: 'auto' | 'wide' | '2col'
}

export function ShowcaseShell({
  title,
  subtitle,
  accentColor = '#1890ff',
  children,
  gridMode = 'auto',
}: ShowcaseShellProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setAttribute('data-showcase-ready', 'true')
    }
  }, [])

  const gridClass =
    gridMode === 'wide'
      ? styles['specimen-grid-wide']
      : gridMode === '2col'
        ? styles['specimen-grid-2col']
        : styles['specimen-grid']

  return (
    <div ref={canvasRef} className={styles['showcase-canvas']}>
      <div className={styles['showcase-header']}>
        <div className={styles['accent-bar']} style={{ backgroundColor: accentColor }} />
        <div>
          <h1 className={styles['showcase-title']}>{title}</h1>
          {subtitle && <p className={styles['showcase-subtitle']}>{subtitle}</p>}
        </div>
      </div>
      <div className={gridClass}>{children}</div>
    </div>
  )
}

export function SectionDivider({ title }: { title: string }) {
  return <div className={styles['section-divider']}>{title}</div>
}
