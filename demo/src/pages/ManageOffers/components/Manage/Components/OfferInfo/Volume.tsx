import '../../../../styles.css'

import { CheckCircleOutlined, CloseCircleOutlined, EditFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../ManageOffers.types'
import { numberToShortString } from '../../../../utils/formatters'
import { Card, InputNumber, notification } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'

const { Meta } = Card

type VolumeProps = {
  data: SpecialOfferBreakdownResponseData
  canWrite: boolean
  status: string
}

export function Volume({ data, canWrite }: VolumeProps) {
  const offer = data.OfferInfo

  const canEditVolume = canWrite && dayjs().isBefore(dayjs(offer.VisibilityEndDateTime))
  const [isEditingVolume, setIsEditingVolume] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [draftVolume, setDraftVolume] = useState<number>(offer.TotalVolume)

  const startEditing = () => {
    setDraftVolume(offer.TotalVolume)
    setIsEditingVolume(true)
  }

  const onSaveVolume = async () => {
    setIsSaving(true)
    // Mock save
    await new Promise((resolve) => setTimeout(resolve, 500))
    notification.success({ message: 'Volume Updated', description: `Volume updated to ${draftVolume.toLocaleString()} gal` })
    setIsSaving(false)
    setIsEditingVolume(false)
  }

  return (
    <div className='offer-info-item'>
      <Card className='offer-info-card'>
        <Meta
          title={
            <Horizontal verticalCenter justifyContent='space-between'>
              <Texto weight='600'>Volume</Texto>

              {canEditVolume && !isEditingVolume && (
                <EditFilled style={{ cursor: 'pointer', fontSize: 18 }} onClick={startEditing} />
              )}

              {canEditVolume && isEditingVolume && (
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
                      setIsEditingVolume(false)
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
                      onSaveVolume()
                    }}
                  />
                </Horizontal>
              )}
            </Horizontal>
          }
          description={
            !isEditingVolume ? (
              <Texto category='h4'>{numberToShortString(offer.TotalVolume)} gal</Texto>
            ) : (
              <InputNumber
                className={`volume-h4-input ${isEditingVolume ? 'volume-h4-input--editing' : ''}`}
                size='large'
                variant='borderless'
                value={draftVolume}
                min={0}
                formatter={(value) => (value != null ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                parser={(value) => Number(value?.replace(/,/g, '') || 0)}
                onChange={(val) => setDraftVolume(val ?? 0)}
                autoFocus
                controls={false}
              />
            )
          }
        />
      </Card>
    </div>
  )
}
