import React from 'react'
import styles from './SpacingDiagram.module.css'

interface SpacingSwatchProps {
  tokens: { name: string; value: string; color: string }[]
  label?: string
}

export function SpacingSwatches({ tokens, label }: SpacingSwatchProps) {
  return (
    <div className={styles.container}>
      {label && <div className={styles['label-bar']}>{label}</div>}
      <div className={styles.diagram}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {tokens.map((t) => (
            <div key={t.name} className={styles['swatch-row']}>
              <div
                className={styles['swatch-block']}
                style={{
                  width: parseInt(t.value) || 4,
                  height: 24,
                  background: t.color,
                  minWidth: 4,
                }}
              />
              <span className={styles['swatch-label']}>{t.name}</span>
              <span className={styles['swatch-value']}>{t.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface NestingLevel {
  label: string
  token: string
  value: string
  color: string
}

interface NestingDiagramProps {
  levels: NestingLevel[]
  label?: string
}

export function NestingDiagram({ levels, label }: NestingDiagramProps) {
  const renderLevel = (index: number): React.ReactNode => {
    if (index >= levels.length) return null
    const level = levels[index]
    const padding = parseInt(level.value) || 16
    const scaledPadding = Math.min(padding, 32)

    return (
      <div
        className={styles['nesting-box']}
        style={{
          borderColor: level.color,
          padding: scaledPadding,
          background: `${level.color}08`,
        }}
      >
        <span className={styles['nesting-label']} style={{ color: level.color }}>
          {level.label} ({level.token}: {level.value})
        </span>
        {index < levels.length - 1 ? (
          renderLevel(index + 1)
        ) : (
          <div
            style={{
              background: '#f5f5f5',
              borderRadius: 4,
              padding: '12px 16px',
              fontSize: 12,
              color: '#8c8c8c',
              textAlign: 'center',
            }}
          >
            Content
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {label && <div className={styles['label-bar']}>{label}</div>}
      <div className={styles.diagram}>{renderLevel(0)}</div>
    </div>
  )
}
