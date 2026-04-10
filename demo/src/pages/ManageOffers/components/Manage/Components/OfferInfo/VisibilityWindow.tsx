import '../../../../styles.css'

import { CheckCircleOutlined, CloseCircleOutlined, EditFilled, EyeOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { formatDateTimeRange } from '../../../../utils/Utils/OfferInfoHelpers'
import { Card, DatePicker, notification } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'

const { RangePicker } = DatePicker
const { Meta } = Card

type VisibilityWindowProps = {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
}

export function VisibilityWindow({ data, canWrite }: VisibilityWindowProps) {
  const offer = data.OfferInfo

  const visStart = dayjs(offer.VisibilityStartDateTime)
  const visEnd = dayjs(offer.VisibilityEndDateTime)

  const canEditVisibility = canWrite && dayjs().isBefore(dayjs(offer.VisibilityEndDateTime))
  const [isEditingVisibility, setIsEditingVisibility] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [draftVisibilityRange, setDraftVisibilityRange] = useState<[Dayjs, Dayjs]>([visStart, visEnd])

  const startEditing = () => {
    setDraftVisibilityRange([visStart, visEnd])
    setIsEditingVisibility(true)
  }

  const onSaveVisibility = async () => {
    const newEnd = draftVisibilityRange?.[1]
    if (!newEnd) return

    setIsSaving(true)
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 500))
    notification.success({ message: 'Visibility Updated', description: `End date updated to ${newEnd.format('MM/DD/YYYY h:mm A')}` })
    setIsSaving(false)
    setIsEditingVisibility(false)
  }

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card offer-info-card--accent-visibility-window'>
        <Meta
          avatar={<EyeOutlined style={{ fontSize: 18 }} />}
          title={
            <Horizontal verticalCenter justifyContent='space-between'>
              <Texto weight='600'>Visibility Window</Texto>

              {canEditVisibility && !isEditingVisibility && (
                <EditFilled style={{ cursor: 'pointer', fontSize: 18 }} onClick={startEditing} />
              )}

              {canEditVisibility && isEditingVisibility && (
                <Horizontal verticalCenter gap={10}>
                  <CloseCircleOutlined
                    style={{
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-warning)',
                      opacity: isSaving ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (isSaving) return
                      setIsEditingVisibility(false)
                    }}
                  />
                  <CheckCircleOutlined
                    style={{
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      fontSize: 18,
                      color: 'var(--theme-success)',
                      opacity: isSaving ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (isSaving) return
                      onSaveVisibility()
                    }}
                  />
                </Horizontal>
              )}
            </Horizontal>
          }
          description={
            !isEditingVisibility ? (
              <Texto>{formatDateTimeRange(visStart, visEnd)}</Texto>
            ) : (
              <RangePicker
                value={draftVisibilityRange}
                variant='borderless'
                showTime={{ use12Hours: true, format: 'hh:mm A' }}
                format='MM/DD/YY h:mm A'
                size='small'
                style={{ minWidth: '100%', marginLeft: '-8px' }}
                autoFocus
                disabled={[true, false]}
                className={`visibility-range-picker ${isEditingVisibility ? 'visibility-range-picker--editing' : ''}`}
                onChange={(vals) => {
                  if (!vals || !vals[0] || !vals[1]) return
                  setDraftVisibilityRange([vals[0], vals[1]])
                }}
              />
            )
          }
        />
      </Card>
    </div>
  )
}
