/**
 * Operator Toolbar
 *
 * Toolbar for inserting operators in advanced formula mode.
 * Matches wireframe prototype v4.
 */

import { Horizontal } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'

import styles from './OperatorToolbar.module.css'

interface OperatorToolbarProps {
  onInsert: (operator: string) => void
}

interface OperatorButton {
  label: string
  value: string
  tooltip: string
  isFunction?: boolean
}

const OPERATORS: OperatorButton[] = [
  { label: '+', value: '+', tooltip: 'Addition' },
  { label: '-', value: '-', tooltip: 'Subtraction' },
  { label: '×', value: '*', tooltip: 'Multiplication' },
  { label: '÷', value: '/', tooltip: 'Division' },
  { label: '(', value: '(', tooltip: 'Open parenthesis' },
  { label: ')', value: ')', tooltip: 'Close parenthesis' },
  { label: 'MIN', value: 'MIN(', tooltip: 'Minimum function', isFunction: true },
  { label: 'MAX', value: 'MAX(', tooltip: 'Maximum function', isFunction: true },
]

export function OperatorToolbar({ onInsert }: OperatorToolbarProps) {
  return (
    <Horizontal className={styles.toolbar}>
      {OPERATORS.map((op) => (
        <Tooltip key={op.value} title={op.tooltip}>
          <button
            onClick={() => onInsert(op.value)}
            className={`${styles.operatorButton} ${op.isFunction ? styles.function : ''}`}
          >
            {op.label}
          </button>
        </Tooltip>
      ))}
    </Horizontal>
  )
}
