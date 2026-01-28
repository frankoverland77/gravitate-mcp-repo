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
  viewingRound?: number // Which round user is viewing (when in history mode)
  onRoundClick?: (round: number) => void
}

export function RoundStepper({
  currentRound,
  totalRounds,
  roundSupplierCounts,
  isViewingHistory,
  viewingRound,
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

  // Determine if a step is clickable
  const isClickable = (step: RoundStep): boolean => {
    // Completed rounds are always clickable
    if (step.isCompleted) return true
    // Current round (by number) is clickable when viewing a different (historical) round
    if (step.round === currentRound && viewingRound && viewingRound !== currentRound) return true
    return false
  }

  const handleStepClick = (step: RoundStep) => {
    // Allow clicking if step is clickable
    if (isClickable(step) && onRoundClick && step.round > 0) {
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
            className={`${styles.step} ${step.isCompleted ? styles.stepCompleted : ''} ${step.isCurrent ? styles.stepCurrent : ''} ${isClickable(step) && onRoundClick ? styles.stepClickable : ''}`}
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
