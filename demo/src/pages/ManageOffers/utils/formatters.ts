export const fmt = {
  currency: (value: number | null | undefined, decimals = 2): string => {
    if (value == null || isNaN(value)) return '-'
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  },
  decimal: (value: number | null | undefined, decimals = 2): string => {
    if (value == null || isNaN(value)) return '-'
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  },
  integer: (value: number | null | undefined, _minDigits = 0): string => {
    if (value == null || isNaN(value)) return '-'
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  },
}

export const addCommasToNumber = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return '-'
  return value.toLocaleString('en-US')
}

export const dateFormat = {
  ISO: 'YYYY-MM-DDTHH:mm:ss',
  ISO_V2: 'YYYY-MM-DDTHH:mm:ss',
  DATE_SLASH: 'MM/DD/YYYY',
  MONTH_DATE_V2: 'MMM D',
  MONTH_DATE_YEAR: 'MMM D, YYYY',
  MONTH_DATE_TIME: 'MMM D, h:mm A',
  SHORT_DATE_YEAR_TIME_V2: 'MM/DD/YYYY h:mm A',
  DATE_TIME: 'MM/DD/YYYY h:mm A',
}

export function numberToShortString(value: number, decimals = 1, addCommas = false): string {
  if (value >= 1_000_000) {
    const v = value / 1_000_000
    return `${v.toFixed(decimals)}M`
  }
  if (value >= 1_000) {
    const v = value / 1_000
    return `${v.toFixed(decimals)}K`
  }
  if (addCommas) return value.toLocaleString('en-US')
  return value.toFixed(decimals)
}
