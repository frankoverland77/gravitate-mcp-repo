import React from 'react'
import styles from './DosDonts.module.css'

interface DosDontsProps {
  doExample: React.ReactNode
  dontExample: React.ReactNode
  doCaption: string
  dontCaption: string
}

export function DosDonts({ doExample, dontExample, doCaption, dontCaption }: DosDontsProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.panel} ${styles['panel-do']}`}>
        <div className={`${styles['panel-label']} ${styles['label-do']}`}>
          <span>&#10003;</span> Do
        </div>
        <div className={styles['panel-example']}>{doExample}</div>
        <div className={styles['panel-caption']}>{doCaption}</div>
      </div>
      <div className={`${styles.panel} ${styles['panel-dont']}`}>
        <div className={`${styles['panel-label']} ${styles['label-dont']}`}>
          <span>&#10007;</span> Don't
        </div>
        <div className={styles['panel-example']}>{dontExample}</div>
        <div className={styles['panel-caption']}>{dontCaption}</div>
      </div>
    </div>
  )
}
