import { useState } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Popover } from 'antd'
import { CheckCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons'
import type { SellerRFPDetail, DetailAvailability } from '../types/sellerRfp.types'
import { formatVolume, formatVolumeTotal, getAvailabilityColor } from '../types/sellerRfp.types'
import styles from './AvailabilityPopover.module.css'

interface AvailabilityPopoverProps {
  detail: SellerRFPDetail
  avail: DetailAvailability
  children: React.ReactNode
}

const AVAIL_COLOR_MAP = { green: '#52c41a', amber: '#faad14', red: '#ff4d4f', neutral: '#8c8c8c' }

export function AvailabilityPopover({ detail, avail, children }: AvailabilityPopoverProps) {
  const [open, setOpen] = useState(false)

  const netColor = getAvailabilityColor(avail.netPerMonth, detail.volume)

  const content = (
    <Vertical gap={16} style={{ width: 340 }} className={styles.popover}>
      {/* Header */}
      <Vertical gap={2}>
        <Texto category="p2" weight="600">Supply Availability</Texto>
        <Texto category="p3" appearance="medium">
          {detail.product} @ {detail.terminal}
        </Texto>
      </Vertical>

      {/* Sources */}
      <Vertical gap={10}>
        <Texto category="p3" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#8c8c8c' }}>
          Supply Sources
        </Texto>
        {avail.sources.length > 0 ? (
          <Vertical gap={8}>
            {avail.sources.map((src, i) => {
              const pct = src.capacityPerMonth > 0
                ? Math.round((src.availablePerMonth / src.capacityPerMonth) * 100)
                : 0
              return (
                <Vertical key={i} className={styles.sourceRow}>
                  <Horizontal alignItems="center" justifyContent="space-between">
                    <Texto category="p2" weight="500">{src.name}</Texto>
                    <Texto category="p2" weight="600">{formatVolume(src.availablePerMonth)}</Texto>
                  </Horizontal>
                  {detail.costType === 'contract' && (
                    <Horizontal gap={6} alignItems="center">
                      <div className={styles.capacityBar}>
                        <div className={styles.capacityFill} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <Texto category="p3" appearance="medium">{pct}% of {formatVolume(src.capacityPerMonth).replace(' gal/mo', '')}</Texto>
                    </Horizontal>
                  )}
                </Vertical>
              )
            })}
          </Vertical>
        ) : (
          <Texto category="p3" appearance="medium">
            No {detail.costType} sources found.
          </Texto>
        )}
      </Vertical>

      {/* Summary */}
      {avail.sources.length > 0 && (
        <Vertical gap={8} style={{ paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
          <Horizontal alignItems="center" justifyContent="space-between">
            <Texto category="p3" appearance="medium">Aggregate Available</Texto>
            <Texto category="p2" weight="500">{formatVolume(avail.availablePerMonth)}</Texto>
          </Horizontal>

          {avail.hasVolume && (
            <>
              <Horizontal alignItems="center" justifyContent="space-between">
                <Texto category="p3" appearance="medium">This Detail Volume</Texto>
                <Texto category="p2" weight="500" style={{ color: '#595959' }}>
                  &minus;{formatVolume(detail.volume)}
                </Texto>
              </Horizontal>

              <div className={styles.divider} />

              <Horizontal alignItems="center" justifyContent="space-between">
                <Horizontal gap={6} alignItems="center">
                  <Texto category="p2" weight="600">Net Available/mo</Texto>
                  {avail.netPerMonth !== null && avail.netPerMonth > 0 && (
                    <CheckCircleFilled style={{ fontSize: 12, color: '#52c41a' }} />
                  )}
                  {avail.netPerMonth !== null && avail.netPerMonth <= 0 && (
                    <CloseCircleFilled style={{ fontSize: 12, color: '#ff4d4f' }} />
                  )}
                </Horizontal>
                <Texto category="p2" weight="700" style={{ color: AVAIL_COLOR_MAP[netColor] }}>
                  {formatVolume(avail.netPerMonth)}
                </Texto>
              </Horizontal>

              {avail.netPerTerm !== null && avail.hasContractDates && (
                <Horizontal alignItems="center" justifyContent="space-between">
                  <Texto category="p3" appearance="medium">
                    Net Available/Term ({avail.contractMonths}mo)
                  </Texto>
                  <Texto category="p2" weight="500" style={{ color: AVAIL_COLOR_MAP[netColor] }}>
                    {formatVolumeTotal(avail.netPerTerm)}
                  </Texto>
                </Horizontal>
              )}
            </>
          )}

          {!avail.hasVolume && (
            <Horizontal alignItems="center" gap={6} style={{ paddingTop: '4px' }}>
              <WarningFilled style={{ fontSize: 12, color: '#faad14' }} />
              <Texto category="p3" appearance="medium">Set volume to see net availability.</Texto>
            </Horizontal>
          )}
        </Vertical>
      )}
    </Vertical>
  )

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
    >
      {children}
    </Popover>
  )
}
