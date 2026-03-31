import dayjs, { type Dayjs } from 'dayjs'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { createDisabledTimeForDate } from '../../../utils/Utils/TimingWindowHelpers'
import { dateFormat } from '../../../utils/formatters'
import { Checkbox, DatePicker, Form, TimePicker } from 'antd'
import type { FormInstance } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface SelectInvitationDateProps {
  form: FormInstance
  selectedVisibilityWindowStart?: Dayjs
  selectedVisibilityWindowStartTime?: Dayjs
  onSetToFutureTime: () => void
}

export function SelectInvitationDate({
  form,
  selectedVisibilityWindowStart,
  selectedVisibilityWindowStartTime,
  onSetToFutureTime,
}: SelectInvitationDateProps) {
  const sendOnCreate = Form.useWatch('SendInvitesOnCreate', form)
  const inviteTriggerDate = Form.useWatch('InviteTriggerDate', form)
  const inviteTriggerTime = Form.useWatch('InviteTriggerTime', form)

  const [currentMinute, setCurrentMinute] = useState(() => dayjs().startOf('minute'))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinute(dayjs().startOf('minute'))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getDisabledDate = useCallback(
    (current: Dayjs) => {
      if (!current) return false
      if (dayjs(current).isSame(dayjs(), 'day')) return false
      return (
        dayjs(current).isBefore(dayjs(), 'day') ||
        (selectedVisibilityWindowStart ? dayjs(current).isAfter(dayjs(selectedVisibilityWindowStart), 'day') : false)
      )
    },
    [selectedVisibilityWindowStart]
  )

  const getDisabledTimeWithVisibilityCheck = useCallback(() => {
    const baseDisabled = createDisabledTimeForDate(inviteTriggerDate)

    if (!selectedVisibilityWindowStart || !selectedVisibilityWindowStartTime) {
      return baseDisabled
    }

    const inviteDate = inviteTriggerDate || dayjs()
    const visibilityStartDate = dayjs(selectedVisibilityWindowStart)

    if (!dayjs(inviteDate).isSame(visibilityStartDate, 'day')) {
      return baseDisabled
    }

    const visibilityHour = selectedVisibilityWindowStartTime.hour()
    const visibilityMinute = selectedVisibilityWindowStartTime.minute()

    return {
      disabledHours: () => {
        const disabled = baseDisabled.disabledHours?.() || []
        for (let i = visibilityHour + 1; i < 24; i++) {
          if (!disabled.includes(i)) {
            disabled.push(i)
          }
        }
        return disabled
      },
      disabledMinutes: (selectedHour: number) => {
        const disabled = baseDisabled.disabledMinutes?.(selectedHour) || []
        if (selectedHour === visibilityHour) {
          for (let i = visibilityMinute + 1; i < 60; i++) {
            if (!disabled.includes(i)) {
              disabled.push(i)
            }
          }
        }
        return disabled
      },
    }
  }, [inviteTriggerDate, selectedVisibilityWindowStart, selectedVisibilityWindowStartTime])

  const validateTriggerDate = useCallback(
    (_: any, value: Dayjs) => {
      if (sendOnCreate) return Promise.resolve()
      if (!value) return Promise.reject(new Error('Date is required'))
      if (getDisabledDate(value)) return Promise.reject(new Error('Adjust date'))
      return Promise.resolve()
    },
    [sendOnCreate, getDisabledDate]
  )

  const validateTriggerTime = useCallback(
    (_: any, value: Dayjs) => {
      if (sendOnCreate) return Promise.resolve()
      if (!value) return Promise.reject(new Error('Invite time is required'))

      const disabledConfig = getDisabledTimeWithVisibilityCheck()
      const selectedHour = value.hour()
      const selectedMinute = value.minute()

      const disabledHours = disabledConfig.disabledHours?.() || []
      if (disabledHours.includes(selectedHour)) return Promise.reject(new Error('Adjust time'))

      const disabledMinutes = disabledConfig.disabledMinutes?.(selectedHour) || []
      if (disabledMinutes.includes(selectedMinute)) return Promise.reject(new Error('Adjust time'))

      return Promise.resolve()
    },
    [sendOnCreate, getDisabledTimeWithVisibilityCheck]
  )

  const isTimeInPast = useMemo(() => {
    if (sendOnCreate || !inviteTriggerDate || !inviteTriggerTime) return false
    const triggerDateTime = dayjs(inviteTriggerDate).hour(inviteTriggerTime.hour()).minute(inviteTriggerTime.minute()).second(0)
    return !triggerDateTime.startOf('minute').isAfter(currentMinute)
  }, [sendOnCreate, inviteTriggerDate, inviteTriggerTime, currentMinute])

  const warnings = useMemo(() => {
    const errors: { text: string }[] = []
    if (sendOnCreate) return errors

    if (inviteTriggerDate && inviteTriggerTime) {
      const triggerDateTime = dayjs(inviteTriggerDate).hour(inviteTriggerTime.hour()).minute(inviteTriggerTime.minute()).second(0)
      if (!triggerDateTime.startOf('minute').isAfter(currentMinute)) {
        errors.push({ text: 'Invitation date and time must be at least 1 minute in the future' })
      }
      if (selectedVisibilityWindowStart && selectedVisibilityWindowStartTime) {
        const visibilityStartDateTime = dayjs(selectedVisibilityWindowStart)
          .hour(selectedVisibilityWindowStartTime.hour())
          .minute(selectedVisibilityWindowStartTime.minute())
          .second(0)
        if (triggerDateTime.startOf('minute').isAfter(visibilityStartDateTime.startOf('minute'))) {
          errors.push({ text: 'Invitation date and time must be at or before the Visibility Start' })
        }
      }
    }
    return errors
  }, [sendOnCreate, inviteTriggerDate, inviteTriggerTime, selectedVisibilityWindowStart, selectedVisibilityWindowStartTime, currentMinute])

  return (
    <Vertical className={'p-4 bordered mb-4 border-radius-5'}>
      <Horizontal justifyContent='space-between' verticalCenter>
        <Texto category={'h5'}>Send Invites</Texto>
      </Horizontal>
      <Horizontal className={'mb-2'} verticalCenter style={{ gap: '10px', overflow: 'visible' }}>
        <Form.Item name={'SendInvitesOnCreate'} valuePropName='checked' style={{ marginBottom: 0 }}>
          <Checkbox
            onChange={(check) => {
              if (check) form.resetFields(['InviteTriggerDate'])
            }}
          />
        </Form.Item>
        <Texto className={'text-14'}>Send Invites on Create</Texto>
      </Horizontal>
      <Horizontal className={'mb-2'} style={{ width: '100%', gap: '10px', overflow: 'visible' }}>
        <Texto className={`text-14 pt-1`} appearance={sendOnCreate ? 'hint' : 'default'}>
          Invite Trigger Date:
        </Texto>
        <Horizontal style={{ gap: '10px', overflow: 'visible' }}>
          <Form.Item name={'InviteTriggerDate'} rules={[{ validator: validateTriggerDate }]} style={{ marginBottom: 0 }}>
            <DatePicker
              disabled={sendOnCreate}
              format={dateFormat.DATE_SLASH}
              disabledDate={getDisabledDate}
              className={'border-radius-5'}
            />
          </Form.Item>
          <Texto className={'text-14 pt-1'}>at</Texto>
          <Form.Item name={'InviteTriggerTime'} rules={[{ validator: validateTriggerTime }]} style={{ marginBottom: 0 }}>
            <TimePicker
              disabled={sendOnCreate}
              format={'h:mm A'}
              className={'border-radius-5'}
              disabledTime={getDisabledTimeWithVisibilityCheck}
            />
          </Form.Item>
        </Horizontal>
      </Horizontal>
      {warnings?.map((err, index) => (
        <Texto key={index} appearance={'error'} className={'mb-1 text-14'}>
          {err.text}
        </Texto>
      ))}
      {isTimeInPast && (
        <GraviButton
          buttonText='Set to future time'
          onClick={onSetToFutureTime}
          size='small'
          appearance='outlined'
          className='mt-2'
        />
      )}
    </Vertical>
  )
}
