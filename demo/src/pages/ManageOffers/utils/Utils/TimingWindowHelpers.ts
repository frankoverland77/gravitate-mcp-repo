import dayjs, { type Dayjs } from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import type { FormInstance } from 'antd'
import type { MutableRefObject } from 'react'

import { dateFormat } from '../formatters'

dayjs.extend(isSameOrBefore)

export interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
}

export function createDisabledTimeForDate(dateValue: Dayjs | undefined): DisabledTimeConfig {
  if (!dateValue) {
    return {}
  }

  const isToday = dayjs(dateValue).isSame(dayjs(), 'day')
  if (!isToday) {
    return {}
  }

  const now = dayjs()
  return {
    disabledHours: () => {
      const hours: number[] = []
      for (let i = 0; i < now.hour(); i++) {
        hours.push(i)
      }
      return hours
    },
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === now.hour()) {
        const minutes: number[] = []
        for (let i = 0; i <= now.minute(); i++) {
          minutes.push(i)
        }
        return minutes
      }
      return []
    },
  }
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
}

export function generateCalendarDays(currentDate: Dayjs): CalendarDay[] {
  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')
  const startOfWeek = startOfMonth.startOf('week')
  const endOfWeek = endOfMonth.endOf('week')

  const days: CalendarDay[] = []
  let current = startOfWeek

  while (current.isSameOrBefore(endOfWeek)) {
    days.push({
      date: current.format(dateFormat.DATE_SLASH),
      day: current.date(),
      isCurrentMonth: current.isSame(currentDate, 'month'),
      isToday: current.isSame(dayjs(), 'day'),
      isPast: current.isBefore(dayjs(), 'day'),
    })
    current = current.add(1, 'day')
  }
  return days
}

export function isValidDateSelection({
  newDate,
  windowType,
  position,
  selectedVisibilityWindowStart,
  selectedPickupWindowStart,
  form,
}: {
  newDate: string | undefined
  windowType: 'visibility' | 'pickup'
  position: 'start' | 'end'
  selectedVisibilityWindowStart?: Dayjs
  selectedPickupWindowStart?: Dayjs
  form?: FormInstance
}): boolean {
  const selectedDate = dayjs(newDate)
  if (form) {
    const visStartTime = form.getFieldValue('VisibilityWindowStartTime')
    const visEndTime = form.getFieldValue('VisibilityWindowEndTime')
    const pickStartTime = form.getFieldValue('PickupWindowStartTime')
    const pickEndTime = form.getFieldValue('PickupWindowEndTime')
    const selectedVisEndDate = form.getFieldValue('VisibilityWindowEndDate')

    if (windowType === 'visibility' && position === 'end' && selectedVisibilityWindowStart) {
      if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && visEndTime) {
        if (dayjs(visEndTime, 'HH:mm:ss').isBefore(dayjs(visStartTime, 'HH:mm:ss'))) {
          return false
        }
      }
    } else if (windowType === 'pickup') {
      if (position === 'start' && selectedVisibilityWindowStart) {
        if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && pickStartTime) {
          if (dayjs(pickStartTime, 'HH:mm:ss').isBefore(dayjs(visStartTime, 'HH:mm:ss'))) {
            return false
          }
        }
      } else if (position === 'end' && selectedPickupWindowStart && selectedVisEndDate) {
        if (selectedDate.isBefore(selectedVisEndDate, 'day')) {
          return false
        }
        if (selectedDate.isSame(selectedVisEndDate, 'day') && visEndTime && pickEndTime) {
          if (dayjs(pickEndTime, 'HH:mm:ss').isBefore(dayjs(visEndTime, 'HH:mm:ss'))) {
            return false
          }
        }
        if (selectedDate.isSame(selectedPickupWindowStart, 'day') && pickStartTime && pickEndTime) {
          if (dayjs(pickEndTime, 'HH:mm:ss').isBefore(dayjs(pickStartTime, 'HH:mm:ss'))) {
            return false
          }
        }
      }
    }
  }

  return true
}

export function getAndSetClickResult({
  clickRef,
  dayInfo,
  selectedVisibilityWindowStart,
  selectedPickupWindowStart,
  form,
}: {
  clickRef: MutableRefObject<number>
  dayInfo: CalendarDay
  selectedVisibilityWindowStart?: Dayjs
  selectedPickupWindowStart?: Dayjs
  form: FormInstance
}) {
  switch (clickRef.current) {
    case 0:
      form.setFieldsValue({ VisibilityWindowStartDate: dayjs(dayInfo.date) })
      clickRef.current = 1
      break
    case 1: {
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'visibility',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
        })
      ) {
        return
      }
      form.setFieldsValue({ VisibilityWindowEndDate: dayjs(dayInfo.date) })
      clickRef.current = 2
      break
    }
    case 2:
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'start',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
        })
      ) {
        return
      }
      form.setFieldsValue({ PickupWindowStartDate: dayjs(dayInfo.date) })
      clickRef.current = 3
      break
    case 3: {
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
        })
      ) {
        return
      }

      form.setFieldsValue({ PickupWindowEndDate: dayjs(dayInfo.date) })
      clickRef.current = 4
      break
    }
    case 4:
      form.setFieldsValue({ VisibilityWindowStartDate: undefined })
      form.setFieldsValue({ VisibilityWindowEndDate: undefined })
      form.setFieldsValue({ PickupWindowStartDate: undefined })
      form.setFieldsValue({ PickupWindowEndDate: undefined })
      clickRef.current = 0
      break
    default:
      break
  }
}
