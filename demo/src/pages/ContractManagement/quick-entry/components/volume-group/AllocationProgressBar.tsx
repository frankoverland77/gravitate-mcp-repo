/**
 * AllocationProgressBar
 *
 * Simple progress bar showing allocation percentage with compliance-colored fill.
 * Green for ok, amber for warning.
 */

import type { GroupCompliance } from '../../../types/contract.types'
import { getComplianceBarColor } from '../../volumeGroup.utils'
import styles from './AllocationProgressBar.module.css'

interface AllocationProgressBarProps {
  percent: number
  compliance: GroupCompliance
}

export function AllocationProgressBar({ percent, compliance }: AllocationProgressBarProps) {
  const fillColor = getComplianceBarColor(compliance)
  const clampedPercent = Math.min(Math.max(percent, 0), 100)

  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${clampedPercent}%`, backgroundColor: fillColor }}
        />
      </div>
      <span className={styles.label} style={{ color: fillColor }}>
        {percent}%
      </span>
    </div>
  )
}
