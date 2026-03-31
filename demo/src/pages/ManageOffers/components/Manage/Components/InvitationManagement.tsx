import '../../../styles.css'

import { CheckOutlined, CloseOutlined, EditFilled } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../ManageOffers.types'
import { dateFormat } from '../../../utils/formatters'
import { Card, DatePicker, Form, notification } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

const { Meta } = Card

export function InvitationManagement({ data, canWrite }: { data: SpecialOfferBreakdownResponseData; canWrite: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [form] = useForm()
  const [isLoading, setIsLoading] = useState(false)

  const invitationStatusDescription = useMemo(() => {
    if (!data)
      return (
        <Texto style={{ color: 'inherit' }} className='text-14'>
          N/A
        </Texto>
      )

    if (data.OfferInfo.InvitationNotificationSentDateTimeUTC) {
      return (
        <Texto>
          Sent:{' '}
          {dayjs(data.OfferInfo.InvitationNotificationSentDateTimeUTC).format(dateFormat.MONTH_DATE_TIME)}
        </Texto>
      )
    }

    const canEdit = canWrite && dayjs(data.OfferInfo.VisibilityStartDateTime).isAfter(dayjs())
    return (
      <Horizontal verticalCenter justifyContent='space-between' style={{ height: '22px' }}>
        <Texto style={{ color: 'inherit' }} className='text-14'>
          Scheduled:{' '}
          {data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
            ? dayjs(data.OfferInfo.InvitationNotificationTriggerDateTimeUTC).format(dateFormat.MONTH_DATE_TIME)
            : 'Not Set'}
        </Texto>
        {canEdit && (
          <GraviButton className='ghost-gravi-button p-0' icon={<EditFilled />} onClick={() => setIsEditing(true)} />
        )}
      </Horizontal>
    )
  }, [data, canWrite])

  const handleSubmitForm = async (values: { InvitationTriggerDateTime: Dayjs }) => {
    setIsLoading(true)
    try {
      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 500))
      notification.success({
        message: 'Date Updated',
        description: `Invitation date set to ${values.InvitationTriggerDateTime.format(dateFormat.DATE_TIME)}`,
      })
      setIsEditing(false)
    } catch {
      notification.error({ message: 'Unable to update date', description: 'Could not update date' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      const date =
        data.OfferInfo.InvitationNotificationSentDateTimeUTC || data.OfferInfo.InvitationNotificationTriggerDateTimeUTC
      if (date) {
        form.setFieldsValue({ InvitationTriggerDateTime: dayjs(date) })
      } else {
        form.setFieldsValue({ InvitationTriggerDateTime: undefined })
      }
    }
  }, [isEditing])

  useEffect(() => {
    if (data.OfferInfo.InvitationNotificationTriggerDateTimeUTC) {
      form.setFieldsValue({
        InvitationTriggerDateTime: dayjs(data.OfferInfo.InvitationNotificationTriggerDateTimeUTC),
      })
    } else {
      form.setFieldsValue({ InvitationTriggerDateTime: undefined })
    }
  }, [data.OfferInfo.InvitationNotificationTriggerDateTimeUTC])

  const editingInvitation = useMemo(() => {
    return (
      <Form onFinish={handleSubmitForm} form={form}>
        <Horizontal verticalCenter justifyContent='space-between'>
          <Horizontal flex='2'>
            <Form.Item name='InvitationTriggerDateTime' rules={[{ required: true, message: 'Date is required' }]}>
              <DatePicker
                disabledDate={(current) =>
                  !!current &&
                  (dayjs(current).isAfter(dayjs(data.OfferInfo.VisibilityStartDateTime).endOf('day')) ||
                    dayjs(current).isBefore(dayjs().startOf('day')))
                }
                showTime
              />
            </Form.Item>
          </Horizontal>
          <Horizontal flex='1' justifyContent='flex-end'>
            <GraviButton
              disabled={isLoading}
              style={{ borderRadius: '50%' }}
              error
              className='mr-2'
              icon={<CloseOutlined />}
              onClick={() => setIsEditing(false)}
            />
            <GraviButton
              loading={isLoading}
              style={{ borderRadius: '50%' }}
              success
              icon={<CheckOutlined />}
              onClick={() => form.submit()}
            />
          </Horizontal>
        </Horizontal>
      </Form>
    )
  }, [data, isLoading])

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta title='Invitation Status' description={isEditing ? editingInvitation : invitationStatusDescription} />
      </Card>
    </div>
  )
}
