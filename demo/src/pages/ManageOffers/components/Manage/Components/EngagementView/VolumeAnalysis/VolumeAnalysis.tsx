import { Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownResponseData } from '../../../../../ManageOffers.types'
import VolumeAnalysisChart from './VolumeAnalysisChart'
import { VolumeAnalysisStatusBanner } from './VolumeAnalysisStatusBanner'
import { Skeleton } from 'antd'

export type VolumeAnalysisProps = { data?: SpecialOfferBreakdownResponseData }

export function VolumeAnalysis({ data }: VolumeAnalysisProps) {
  if (!data?.VolumeAnalysis) return <Skeleton active />

  return (
    <Vertical className='mt-5'>
      <Texto category='h4'>Volume Analysis</Texto>
      <Vertical className='info-container'>
        <VolumeAnalysisChart volumeAnalysis={data.VolumeAnalysis} />
        <VolumeAnalysisStatusBanner data={data} />
      </Vertical>
    </Vertical>
  )
}
