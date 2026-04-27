import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import styles from './PageFooter.module.css'

export interface StepFooterProps {
  /** Zero-indexed current step. */
  currentStep: number
  /** Total number of steps. Drives the dot indicator and last-step detection. */
  totalSteps: number
  onBack: () => void
  onNext: () => void
  backLabel?: string
  nextLabel?: string
  /** Label shown on the final step instead of nextLabel. */
  finishLabel?: string
  /** Show loading state on the next/finish button. */
  loading?: boolean
  /** Disable the next/finish button (e.g. validation pending). */
  nextDisabled?: boolean
  /**
   * Step labels for screen readers and optional visible text. If omitted,
   * the indicator shows "Step N of M" in muted text.
   */
  stepNames?: string[]
  className?: string
}

export function StepFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  backLabel = 'Previous',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  loading,
  nextDisabled,
  stepNames,
  className,
}: StepFooterProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep >= totalSteps - 1
  const label = stepNames?.[currentStep] ?? `Step ${currentStep + 1} of ${totalSteps}`

  const classes = [styles.step, className].filter(Boolean).join(' ')

  return (
    <div className={classes} role='toolbar' aria-label='Wizard navigation'>
      <GraviButton
        appearance='outlined'
        disabled={isFirst || loading}
        onClick={onBack}
        icon={<ArrowLeftOutlined />}
        buttonText={backLabel}
      />

      <div className={styles.stepIndicator} aria-live='polite'>
        <div className={styles.stepDots} aria-hidden='true'>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const cls = [
              styles.stepDot,
              i === currentStep && styles.stepDotActive,
              i < currentStep && styles.stepDotComplete,
            ]
              .filter(Boolean)
              .join(' ')
            return <span key={i} className={cls} />
          })}
        </div>
        <span className={styles.stepLabel}>{label}</span>
      </div>

      <GraviButton
        theme1
        loading={loading}
        disabled={nextDisabled}
        onClick={onNext}
        icon={!isLast ? <ArrowRightOutlined /> : undefined}
        buttonText={isLast ? finishLabel : nextLabel}
      />
    </div>
  )
}
