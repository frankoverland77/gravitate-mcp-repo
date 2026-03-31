import dayjs from 'dayjs';

/**
 * Determines whether a revaluation confirmation modal should be shown
 * after a price save. Returns true if the effective date falls outside
 * the automatic revaluation window (prior month start → next month end).
 */
export function shouldShowRevaluationModal(effectiveDate: string): boolean {
  const eff = dayjs(effectiveDate);
  const priorStart = dayjs().subtract(1, 'month').startOf('month');
  const targetEnd = dayjs().add(1, 'month').endOf('month');
  return eff.isBefore(priorStart) || eff.isAfter(targetEnd);
}
