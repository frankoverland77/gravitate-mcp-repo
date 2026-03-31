// ─── Shared Status Color Utilities ──────────────────────────────────────────
// Consolidates status→color mapping used across all PriceManagement pages.

/** Full-word status → theme color mapping */
export const STATUS_COLOR_MAP: Record<string, string> = {
  Complete: 'var(--theme-success)',
  Actual: 'var(--theme-success)',
  Current: 'var(--theme-success)',
  Missing: 'var(--theme-error)',
  'Missing Prices': 'var(--theme-error)',
  Failed: 'var(--theme-error)',
  Stale: 'var(--theme-warning)',
  Pending: 'var(--theme-warning)',
  Estimate: 'var(--theme-color-1)',
  'In Progress': 'var(--theme-color-1)',
  Fixed: 'var(--theme-text)',
  External: 'var(--theme-text)',
};

/**
 * Cell style for Status columns in grids (full-word statuses).
 * Returns { color, fontWeight, fontStyle? }
 */
export function getStatusCellStyle(status: string): Record<string, string> {
  const color = STATUS_COLOR_MAP[status] || 'var(--theme-text)';
  const base: Record<string, string> = { color, fontWeight: '600' };
  if (status === 'Estimate') {
    base.fontStyle = 'italic';
  }
  return base;
}

/**
 * Cell style for formula variable grids (A/M/O/E → background colors).
 * Returns { backgroundColor } or {}
 */
export function getComponentCellStyle(status: string): Record<string, string> {
  switch (status) {
    case 'M':
      return { backgroundColor: 'var(--theme-error-trans)' };
    case 'O':
      return { backgroundColor: 'var(--theme-optimal-dim)' };
    case 'A':
      return { backgroundColor: 'var(--theme-success-dim)' };
    case 'E':
      return { backgroundColor: 'var(--theme-color-1-dim)' };
    default:
      return {};
  }
}

/**
 * Color for revaluation change columns (positive/negative/zero).
 */
export function getChangeColor(value: number | null | undefined): string {
  if (value == null || value === 0) return 'var(--theme-text)';
  return value > 0 ? 'var(--theme-success)' : 'var(--theme-error)';
}
