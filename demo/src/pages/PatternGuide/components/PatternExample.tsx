import React, { useState } from 'react'
import styles from './PatternExample.module.css'

interface PatternExampleProps {
  label: string
  caption?: string
  code?: string
  children: React.ReactNode
}

export function PatternExample({ label, caption, code, children }: PatternExampleProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles['label-bar']}>
        <span>{label}</span>
        {code && (
          <button
            className={styles['code-toggle']}
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide code' : 'Show code'}
          </button>
        )}
      </div>
      <div className={styles.example}>{children}</div>
      {showCode && code && (
        <div className={styles['code-block']}>
          <pre>{code}</pre>
        </div>
      )}
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  )
}
