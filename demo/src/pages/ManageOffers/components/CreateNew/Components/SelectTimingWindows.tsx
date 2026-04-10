import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SelectInvitationDate } from './SelectInvitationDate'
import { TimingPresets } from '../../QuickSetup/TimingPresets'
import { timingWindowList, weekDays } from '../../../utils/Constants/TimingWindowConstants'
import {
  type CalendarDay,
  createDisabledTimeForDate,
  generateCalendarDays,
  getAndSetClickResult,
  isValidDateSelection,
} from '../../../utils/Utils/TimingWindowHelpers'
import { dateFormat } from '../../../utils/formatters'
import { Button, DatePicker, Form, TimePicker } from 'antd'
import type { FormInstance } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isBetween)

export interface SelectTimingWindowsProps {
  form: FormInstance
  currentStep: number
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowStartTime?: Dayjs
  selectedPickupWindowStart?: Dayjs
  selectedVisibilityWindowEnd?: Dayjs
  selectedPickupWindowEnd?: Dayjs
  onSetToFutureTime: () => void
}

export function SelectTimingWindows({
  form,
  currentStep,
  selectedPickupWindowStart,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowStartTime,
  selectedVisibilityWindowEnd,
  selectedPickupWindowEnd,
  onSetToFutureTime,
}: SelectTimingWindowsProps) {
  const [selectedPreset, setSelectedPreset] = useState('next-day')
  const isCustomMode = selectedPreset === 'custom'

  const [currentDate, setCurrentDate] = useState(dayjs())
  const clickRef = useRef(0)
  const [currentMinute, setCurrentMinute] = useState(() => dayjs().startOf('minute'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinute(dayjs().startOf('minute'))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const visibilityEndTime = Form.useWatch('VisibilityWindowEndTime', form)
  const pickupStartTime = Form.useWatch('PickupWindowStartTime', form)
  const pickupEndTime = Form.useWatch('PickupWindowEndTime', form)

  const getDateForTimeField = (timeFieldName: string): Dayjs | undefined => {
    switch (timeFieldName) {
      case 'VisibilityWindowStartTime': return selectedVisibilityWindowStart
      case 'VisibilityWindowEndTime': return selectedVisibilityWindowEnd
      case 'PickupWindowStartTime': return selectedPickupWindowStart
      case 'PickupWindowEndTime': return selectedPickupWindowEnd
      default: return undefined
    }
  }

  const visibilityWindowWarnings = useMemo(() => {
    const errors: { text: string }[] = []
    if (selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
      const startDateTime = dayjs(selectedVisibilityWindowStart).hour(selectedVisibilityWindowStartTime.hour()).minute(selectedVisibilityWindowStartTime.minute()).second(0)
      if (!startDateTime.startOf('minute').isAfter(currentMinute)) {
        errors.push({ text: 'Visibility start date and time must be at least 1 minute in the future' })
      }
    }
    if (selectedVisibilityWindowEnd && visibilityEndTime && selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
      const endDateTime = dayjs(selectedVisibilityWindowEnd).hour(visibilityEndTime.hour()).minute(visibilityEndTime.minute()).second(0)
      const startDateTime = dayjs(selectedVisibilityWindowStart).hour(selectedVisibilityWindowStartTime.hour()).minute(selectedVisibilityWindowStartTime.minute()).second(0)
      if (endDateTime.isSameOrBefore(startDateTime)) {
        errors.push({ text: 'Visibility end must be after start' })
      }
    }
    return errors
  }, [selectedVisibilityWindowStart, selectedVisibilityWindowStartTime, selectedVisibilityWindowEnd, visibilityEndTime, currentMinute])

  const pickupWindowWarnings = useMemo(() => {
    const errors: { text: string }[] = []
    if (selectedPickupWindowStart && pickupStartTime) {
      const startDateTime = dayjs(selectedPickupWindowStart).hour(pickupStartTime.hour()).minute(pickupStartTime.minute()).second(0)
      if (!startDateTime.startOf('minute').isAfter(currentMinute)) {
        errors.push({ text: 'Pickup start date and time must be at least 1 minute in the future' })
      }
      if (selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
        const visibilityStart = dayjs(selectedVisibilityWindowStart).hour(selectedVisibilityWindowStartTime.hour()).minute(selectedVisibilityWindowStartTime.minute()).second(0)
        if (startDateTime.isBefore(visibilityStart)) {
          errors.push({ text: 'Pickup start must be at or after Visibility start' })
        }
      }
    }
    if (selectedPickupWindowEnd && pickupEndTime && selectedPickupWindowStart && pickupStartTime) {
      const endDateTime = dayjs(selectedPickupWindowEnd).hour(pickupEndTime.hour()).minute(pickupEndTime.minute()).second(0)
      const startDateTime = dayjs(selectedPickupWindowStart).hour(pickupStartTime.hour()).minute(pickupStartTime.minute()).second(0)
      if (endDateTime.isSameOrBefore(startDateTime)) {
        errors.push({ text: 'Pickup end must be after start' })
      }
    }
    return errors
  }, [selectedPickupWindowStart, pickupStartTime, selectedPickupWindowEnd, pickupEndTime, selectedVisibilityWindowStart, selectedVisibilityWindowStartTime, currentMinute])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => (direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')))
  }

  const calendarDays = generateCalendarDays(currentDate)

  const isDateDisabledByRules = (dayInfo: CalendarDay): boolean => {
    if (dayInfo.isPast) return true
    switch (clickRef.current) {
      case 1:
        return !isValidDateSelection({ newDate: dayInfo.date, windowType: 'visibility', position: 'end', selectedVisibilityWindowStart, selectedPickupWindowStart, form })
      case 2:
        return !isValidDateSelection({ newDate: dayInfo.date, windowType: 'pickup', position: 'start', selectedVisibilityWindowStart, selectedPickupWindowStart, form })
      case 3:
        return !isValidDateSelection({ newDate: dayInfo.date, windowType: 'pickup', position: 'end', selectedVisibilityWindowStart, selectedPickupWindowStart, form })
      default:
        return false
    }
  }

  const handleDateClick = (dayInfo: CalendarDay) => () => {
    if (dayInfo.isPast) return
    getAndSetClickResult({ clickRef, dayInfo, selectedVisibilityWindowStart, selectedPickupWindowStart, form })
  }

  const getDisabledDate = (current: Dayjs, fieldName: string) => {
    if (!current) return false
    const isPast = current.isBefore(dayjs().startOf('day'))
    if (fieldName === 'VisibilityWindowEndDate' && selectedVisibilityWindowStart) {
      return isPast || dayjs(current).isSameOrBefore(dayjs(selectedVisibilityWindowStart))
    }
    if (fieldName === 'PickupWindowStartDate' && selectedVisibilityWindowStart) {
      return isPast || dayjs(current).isBefore(dayjs(selectedVisibilityWindowStart))
    }
    if (fieldName === 'PickupWindowEndDate' && selectedPickupWindowStart) {
      return isPast || dayjs(current).isSameOrBefore(dayjs(selectedPickupWindowStart))
    }
    return isPast
  }

  const getWindowWarnings = (title: string) => {
    if (title.includes('Visibility')) return visibilityWindowWarnings
    if (title.includes('Pickup')) return pickupWindowWarnings
    return []
  }

  const showCheck = (title: string) => {
    if (title.includes('Visibility') && selectedVisibilityWindowStart && selectedVisibilityWindowEnd) return true
    return !!(title.includes('Pickup') && selectedPickupWindowEnd && selectedPickupWindowStart)
  }

  const nextUpField = useMemo(() => {
    switch (clickRef.current) {
      case 0: return 'Visibility Start Date'
      case 1: return 'Visibility End Date'
      case 2: return 'Pickup Start Date'
      case 3: return 'Pickup End Date'
      case 4: return 'Click any to reset'
      default: return ''
    }
  }, [clickRef.current])

  return (
    <Vertical
      style={{
        ...(currentStep !== 2 && {
          display: 'none',
        }),
      }}
      className={'p-4 timing-window-container'}
    >
      <Texto category={'h4'} className={'text-18'}>Configure Timing</Texto>
      <Texto className={'mb-4 text-14'}>Set when customers can see and respond to your deal</Texto>

      <TimingPresets form={form} selectedPreset={selectedPreset} onSelectPreset={setSelectedPreset} />

      {isCustomMode && (
        <>
          <SelectInvitationDate
            form={form}
            selectedVisibilityWindowStart={selectedVisibilityWindowStart}
            selectedVisibilityWindowStartTime={selectedVisibilityWindowStartTime}
            onSetToFutureTime={onSetToFutureTime}
          />
          {timingWindowList.map((window) => (
            <Vertical key={window.title} className={'p-4 bordered mb-4 border-radius-5'}>
              <Horizontal justifyContent='space-between' verticalCenter>
                <Texto category={'h5'}>{window.title}</Texto>
                {showCheck(window.title) && <CheckOutlined style={{ color: 'var(--theme-success)' }} />}
              </Horizontal>
              <Texto className={'mb-2'}>{window.description}</Texto>
              <Horizontal className={'mb-2'} verticalCenter gap="10px" style={{ overflow: 'visible' }}>
                <Texto className={'text-14'}>Start: </Texto>
                <Form.Item name={window.startDateName} rules={[{ required: true, message: 'Start date is required' }]} style={{ marginBottom: 0 }}>
                  <DatePicker format={dateFormat.DATE_SLASH} disabledDate={(current) => getDisabledDate(current, window.startDateName)} className={'border-radius-5'} />
                </Form.Item>
                <Texto className={'text-14'}>at</Texto>
                <Form.Item name={window.startTimeName} rules={[{ required: true, message: 'Start time is required' }]} style={{ marginBottom: 0 }}>
                  <TimePicker format={'h:mm A'} className={'border-radius-5'} disabledTime={() => createDisabledTimeForDate(getDateForTimeField(window.startTimeName))} />
                </Form.Item>
              </Horizontal>
              <Horizontal verticalCenter gap="10px" style={{ overflow: 'visible' }}>
                <Texto className={'mr-2 text-14'}>End: </Texto>
                <Form.Item name={window.endDateName} rules={[{ required: true, message: 'End date is required' }]} style={{ marginBottom: 0 }}>
                  <DatePicker format={dateFormat.DATE_SLASH} disabledDate={(current) => getDisabledDate(current, window.endDateName)} className={'border-radius-5'} />
                </Form.Item>
                <Texto className={'text-14'}>at</Texto>
                <Form.Item name={window.endTimeName} rules={[{ required: true, message: 'End time is required' }]} style={{ marginBottom: 0 }}>
                  <TimePicker format={'h:mm A'} className={'border-radius-5'} disabledTime={() => createDisabledTimeForDate(getDateForTimeField(window.endTimeName))} />
                </Form.Item>
              </Horizontal>
              {getWindowWarnings(window.title)?.map((err, index) => (
                <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>{err.text}</Texto>
              ))}
            </Vertical>
          ))}

          <Vertical className={'p-4 bordered mb-4 border-radius-5'}>
            <Horizontal className={'mb-2'} justifyContent='space-between' verticalCenter>
              <Vertical>
                <Texto category={'h4'} className={'text-18'}>Calendar View</Texto>
                <Texto className={'mb-2 text-14'}>When customers can see and bid on your deal</Texto>
              </Vertical>
              <GraviButton size={'small'} icon={<LeftOutlined />} onClick={() => navigateMonth('prev')} appearance='outlined' className={'border-radius-5'} />
              <Texto className={'mx-2 text-14'}>{currentDate.format('MMMM YYYY')}</Texto>
              <GraviButton size={'small'} icon={<RightOutlined />} onClick={() => navigateMonth('next')} appearance='outlined' className={'border-radius-5'} />
            </Horizontal>

            <Vertical className={'p-2 mb-2 border-radius-5'}>
              <Horizontal className={'mb-2'} verticalCenter gap="20px" style={{ overflow: 'visible' }}>
                <Horizontal verticalCenter>
                  <div style={{ width: 15, height: 15, border: '1px solid var(--visibility-border)' }} className={'timing-window-visibility-selected timing-window-visibility-range border-radius-5 timing-window-visibility-border-thin'} />
                  <Texto className={'ml-2 text-14'}>Visibility</Texto>
                </Horizontal>
                <Horizontal verticalCenter>
                  <div style={{ width: 15, height: 15 }} className={'timing-window-pickup-selected timing-window-pickup-range border-radius-5 timing-window-pickup-border-thin'} />
                  <Texto className={'ml-2 text-14'}>Pickup</Texto>
                </Horizontal>
              </Horizontal>

              <Vertical className={'p-4 bordered border-radius-5'}>
                <Horizontal className={'mb-1'} gap="10px" style={{ overflow: 'visible' }}>
                  {weekDays.map((day) => (
                    <Vertical key={day}>
                      <Texto className={'text-14'} category={'p2'} weight='bold' align={'center'}>{day}</Texto>
                    </Vertical>
                  ))}
                </Horizontal>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                  {calendarDays.map((dayInfo, index) => {
                    const date = dayjs(dayInfo.date)
                    const isInRange = () => {
                      const ranges: [Dayjs | undefined, Dayjs | undefined][] = [
                        [selectedVisibilityWindowStart, selectedVisibilityWindowEnd],
                        [selectedPickupWindowStart, selectedPickupWindowEnd],
                      ]
                      const includedRanges: string[] = []
                      const current = dayjs(dayInfo.date)
                      ranges.forEach((range, idx) => {
                        if (range?.[0] && range?.[1]) {
                          if (current.isBetween(dayjs(range[0]), dayjs(range[1]), 'day', '[]')) {
                            includedRanges.push(idx === 0 ? 'visibility' : 'pickup')
                          }
                        } else if (range?.[0]) {
                          if (current.isSame(dayjs(range[0]), 'day')) {
                            includedRanges.push(idx === 0 ? 'visibility' : 'pickup')
                          }
                        }
                      })
                      return includedRanges
                    }

                    const rangeClasses = isInRange()
                    const rangeClass = rangeClasses.includes('visibility') && rangeClasses.includes('pickup')
                      ? ' timing-window-both'
                      : rangeClasses.includes('visibility')
                      ? ' timing-window-visibility-range'
                      : rangeClasses.includes('pickup')
                      ? ' timing-window-pickup-range'
                      : ''

                    const dayClass = (selectedVisibilityWindowStart && dayjs(selectedVisibilityWindowStart).isSame(date, 'day')) ||
                      (selectedVisibilityWindowEnd && dayjs(selectedVisibilityWindowEnd).isSame(date, 'day'))
                        ? 'timing-window-visibility-selected timing-window-visibility-border'
                        : (selectedPickupWindowStart && dayjs(selectedPickupWindowStart).isSame(date, 'day')) ||
                          (selectedPickupWindowEnd && dayjs(selectedPickupWindowEnd).isSame(date, 'day'))
                        ? 'timing-window-pickup-selected timing-window-pickup-border'
                        : dayInfo.isToday
                        ? 'timing-window-today'
                        : 'timing-window-calendar-day'

                    return (
                      <Button
                        key={index}
                        disabled={isDateDisabledByRules(dayInfo)}
                        onClick={handleDateClick(dayInfo)}
                        className={`border-radius-5 cal-button ${dayClass}${rangeClass}`}
                      >
                        <Horizontal horizontalCenter verticalCenter>
                          <Texto className={'text-14'} appearance={isDateDisabledByRules(dayInfo) ? 'hint' : 'default'} weight={'normal'}>
                            {dayInfo.day.toString()}
                          </Texto>
                        </Horizontal>
                      </Button>
                    )
                  })}
                </div>
              </Vertical>
              <Texto className={'text-muted mt-2'}>
                {clickRef.current < 4
                  ? `Click any date to quickly fill the next empty field: ${nextUpField}`
                  : 'Click any date to reset'}
              </Texto>
            </Vertical>
          </Vertical>
        </>
      )}
    </Vertical>
  )
}
