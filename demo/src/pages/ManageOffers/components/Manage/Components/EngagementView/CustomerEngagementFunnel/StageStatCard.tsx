import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { fmt } from '../../../../../utils/formatters'
import { Card } from 'antd'

export type StageStatCardProps = {
  step: number
  title: string
  count: number | string
  percent?: number
  lostText?: string
  onViewCustomers?: () => void
  viewLinkText?: string
  className?: string
}

export function StageStatCard({
  step,
  title,
  count,
  percent,
  onViewCustomers,
  viewLinkText = 'View customers \u2192',
  className,
}: StageStatCardProps) {
  const showPercent = typeof percent === 'number' && !Number.isNaN(percent)

  return (
    <Card className={`funnel-card ${className ?? ''}`} onClick={onViewCustomers}>
      <Vertical className='gap-10'>
        <Horizontal verticalCenter className='gap-8'>
          <span className='funnel-card__step'>{step}</span>
          <Texto className='ml-2' weight='600'>
            {title}
          </Texto>
        </Horizontal>

        <Horizontal style={{ alignItems: 'center' }}>
          <Texto category='h2' weight='700'>
            {count}
          </Texto>

          {showPercent && (
            <Vertical className='ml-4'>
              <Texto category='h5' className='funnel-card__percent' weight='700'>
                {fmt.decimal(percent, 0)}%
              </Texto>
            </Vertical>
          )}
        </Horizontal>

        <Horizontal justifyContent='flex-end'>
          <Texto className='funnel-card-link'>{viewLinkText}</Texto>
        </Horizontal>
      </Vertical>
    </Card>
  )
}
