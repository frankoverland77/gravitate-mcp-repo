import dayjs, { type Dayjs } from 'dayjs'

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const defaultStartTime = '08:00:00'
export const defaultEndTime = '17:00:00'

export function getDefaultStartTime(): Dayjs {
  const now = dayjs()
  const eightAM = dayjs().hour(8).minute(0).second(0).millisecond(0)

  if (now.isBefore(eightAM)) {
    return eightAM
  }

  const nearestHour = now.minute() >= 30
    ? now.add(1, 'hour').startOf('hour')
    : now.startOf('hour')

  return nearestHour.add(1, 'hour')
}

export function getDefaultEndTime(): Dayjs {
  const fivePM = dayjs(defaultEndTime, 'HH:mm:ss')
  const startTime = getDefaultStartTime()

  if (fivePM.isAfter(startTime)) {
    return fivePM
  }

  return startTime.add(1, 'hour')
}

export const timingWindowList = [
  {
    title: 'Visibility Window',
    description: 'When customers can see and bid on your deal',
    startDateName: 'VisibilityWindowStartDate',
    startTimeName: 'VisibilityWindowStartTime',
    endDateName: 'VisibilityWindowEndDate',
    endTimeName: 'VisibilityWindowEndTime',
  },
  {
    title: 'Pickup Window',
    description: 'When customers can pickup their product',
    startDateName: 'PickupWindowStartDate',
    startTimeName: 'PickupWindowStartTime',
    endDateName: 'PickupWindowEndDate',
    endTimeName: 'PickupWindowEndTime',
  },
]
