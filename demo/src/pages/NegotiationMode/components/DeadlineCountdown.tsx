import React, { useEffect, useState } from 'react'

interface DeadlineCountdownProps {
  deadline: string
  submittedAt: string
  isExternal?: boolean
}

function getTimeRemaining(deadline: string): { hours: number; minutes: number; totalMs: number } {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const totalMs = deadlineDate.getTime() - now.getTime()

  if (totalMs <= 0) return { hours: 0, minutes: 0, totalMs: 0 }

  const hours = Math.floor(totalMs / (1000 * 60 * 60))
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes, totalMs }
}

function getProgressPercent(submittedAt: string, deadline: string): number {
  const start = new Date(submittedAt).getTime()
  const end = new Date(deadline).getTime()
  const now = Date.now()

  const total = end - start
  const elapsed = now - start

  if (total <= 0) return 100
  const percent = Math.min(100, Math.max(0, (elapsed / total) * 100))
  return percent
}

export function DeadlineCountdown({ deadline, submittedAt, isExternal }: DeadlineCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(deadline))
  const [progress, setProgress] = useState(getProgressPercent(submittedAt, deadline))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(deadline))
      setProgress(getProgressPercent(submittedAt, deadline))
    }, 60000)

    return () => clearInterval(interval)
  }, [deadline, submittedAt])

  const formattedDeadline = new Date(deadline).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const remainingText =
    timeRemaining.totalMs <= 0
      ? 'Expired'
      : `${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''} remaining`

  const isWarning = isExternal || progress > 60

  return (
    <div className='deadline-bar'>
      <div className='deadline-text'>
        <span>Respond by: {formattedDeadline}</span>
        <span className='deadline-time-remaining'>{remainingText}</span>
      </div>
      <div className='deadline-progress-bar'>
        <div
          className={`deadline-progress-fill ${isWarning ? 'fill-warning' : 'fill-normal'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
