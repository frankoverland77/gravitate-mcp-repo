import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr'
import { CheckOutlined, TrophyOutlined } from '@ant-design/icons'
import styles from './RoundStepper.module.css'

interface RoundStep {
  round: number
  label: string
  sublabel: string
  isCompleted: boolean
  isCurrent: boolean
  isAward?: boolean
}

interface RoundStepperProps {
  currentRound: number // Now supports any round number
  totalRounds: number // Total number of rounds to display
  roundSupplierCounts: Map<number, number> // round -> supplier count at that round
  isViewingHistory: boolean
  onRoundClick?: (round: number) => void
}

export function RoundStepper({
  currentRound,
  totalRounds,
  roundSupplierCounts,
  isViewingHistory,
  onRoundClick,
}: RoundStepperProps) {
  // Build steps array dynamically based on total rounds
  const steps: RoundStep[] = []

  // Generate steps for each round
  for (let round = 1; round <= totalRounds; round++) {
    const isCompleted = round < currentRound
    const isCurrent = round === currentRound && !isViewingHistory
    const supplierCount = roundSupplierCounts.get(round) || 0
    const nextRoundCount = roundSupplierCounts.get(round + 1)

    // Build sublabel based on state
    let sublabel: string
    if (isCompleted && nextRoundCount !== undefined) {
      // Completed round: show transition "8 → 3"
      sublabel = `${supplierCount} → ${nextRoundCount}`
    } else if (round === 1) {
      sublabel = `${supplierCount} suppliers`
    } else {
      sublabel = `${supplierCount} finalist${supplierCount !== 1 ? 's' : ''}`
    }

    steps.push({
      round,
      label: `Round ${round}`,
      sublabel,
      isCompleted,
      isCurrent,
    })
  }

  const handleStepClick = (step: RoundStep) => {
    // Only allow clicking completed rounds
    if (step.isCompleted && onRoundClick && step.round > 0) {
      onRoundClick(step.round)
    }
  }

  return (
    <Horizontal alignItems="center" style={{ gap: '8px' }}>
      {steps.map((step, index) => (
        <Horizontal key={step.round || 'award'} alignItems="center" style={{ gap: '8px' }}>
          {/* Step indicator */}
          <Horizontal
            alignItems="center"
            style={{ gap: '12px' }}
            className={`${styles.step} ${step.isCompleted ? styles.stepCompleted : ''} ${step.isCurrent ? styles.stepCurrent : ''} ${step.isCompleted && onRoundClick ? styles.stepClickable : ''}`}
            onClick={() => handleStepClick(step)}
          >
            <div className={styles.stepIcon}>
              {step.isAward ? (
                <TrophyOutlined />
              ) : step.isCompleted ? (
                <CheckOutlined />
              ) : (
                <span className={styles.stepDot} />
              )}
            </div>
            <Vertical style={{ gap: '2px' }}>
              <Texto weight="600" category="p2">
                {step.label}
              </Texto>
              {step.sublabel && (
                <Texto category="p2" appearance="medium">
                  {step.sublabel}
                </Texto>
              )}
            </Vertical>
          </Horizontal>

          {/* Connector line (not after last step) */}
          {index < steps.length - 1 && <div className={styles.connector} />}
        </Horizontal>
      ))}
    </Horizontal>
  )
}
