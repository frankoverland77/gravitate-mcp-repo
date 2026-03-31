import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../../ManageOffers.types'
import { StageStatCard } from './StageStatCard'
import { ViewCustomers } from './ViewCustomers'
import {
  buildEngagementStages,
  type EngagementStage,
} from '../../../../../utils/Utils/CustomerEngagementHelpers'
import { Skeleton } from 'antd'
import { useState } from 'react'

type CustomerEngagementFunnelProps = {
  data?: SpecialOfferBreakdownResponseData
}

export function CustomerEngagementFunnel({ data }: CustomerEngagementFunnelProps) {
  const engagement = data?.CustomerEngagement
  const stages = buildEngagementStages(engagement)

  const [viewCustomersModalOpen, setViewCustomersModalOpen] = useState(false)
  const [selectedStage, setSelectedStage] = useState<EngagementStage | null>(null)

  if (!engagement) return <Skeleton active />

  return (
    <Vertical>
      <Texto category='h4'>Customer Engagement Funnel</Texto>
      <Vertical className='info-container'>
        <Texto category='h5'>Stage Details</Texto>
        <Horizontal className='mt-2' flex='1' verticalCenter justifyContent='space-between'>
          {stages.map((s) => (
            <StageStatCard
              key={s.key}
              step={s.step}
              title={s.title}
              count={s.count}
              percent={s.percent}
              lostText={s.lostText}
              onViewCustomers={() => {
                setSelectedStage(s)
                setViewCustomersModalOpen(true)
              }}
            />
          ))}
        </Horizontal>
        <ViewCustomers
          viewCustomersModalOpen={viewCustomersModalOpen}
          setViewCustomersModalOpen={setViewCustomersModalOpen}
          stage={selectedStage}
        />
      </Vertical>
    </Vertical>
  )
}
