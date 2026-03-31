import type { SpecialOfferBreakdownVolumeAnalysis } from '../../../../../ManageOffers.types'
import { fmt, numberToShortString } from '../../../../../utils/formatters'
import { BarHoverTooltip, LabelIfFits } from '../../../../../utils/Utils/VolumeAnalysisChartLabel'
import { renderCustomLegend } from './VolumeAnalysisLegend'
import { useMemo, useState } from 'react'
import { Bar, BarChart, LabelList, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Props = {
  volumeAnalysis: SpecialOfferBreakdownVolumeAnalysis
  height?: number
}

export default function VolumeAnalysisChart({ volumeAnalysis, height = 200 }: Props) {
  const data = useMemo(() => {
    const AvailableVolume =
      (volumeAnalysis?.AcceptedVolume + volumeAnalysis?.PendingVolume) / volumeAnalysis?.TotalVolume
    const AvailableVolumePercentage = fmt.decimal(AvailableVolume * 100, 0)
    return [
      {
        row: 'vol',
        AcceptedVolume: volumeAnalysis?.AcceptedVolume ?? 0,
        PendingVolume: volumeAnalysis?.PendingVolume ?? 0,
        RemainingVolume: volumeAnalysis?.RemainingVolume ?? 0,
        RejectedVolume: volumeAnalysis?.RejectedVolume ?? 0,
        AvailableVolume: volumeAnalysis?.TotalVolume,
        AvailableVolumeMaxPercentage: AvailableVolumePercentage ?? 0,
      },
    ]
  }, [volumeAnalysis])

  const showAvailableLabel = (data[0]?.AvailableVolume ?? 0) > 0

  const [hoverKey, setHoverKey] = useState<string | null>(null)

  return (
    <div className='p-4' style={{ width: '100%', height }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          layout='vertical'
          data={data}
          margin={{
            top: 0,
            right: 30,
            left: 30,
            bottom: 0,
          }}
        >
          <XAxis type='number' domain={[0, 1]} hide />
          <YAxis type='category' dataKey='row' hide />
          <Legend
            content={renderCustomLegend(volumeAnalysis?.IsOverSubscribed, volumeAnalysis?.OverSubscriptionPercentage)}
            verticalAlign='bottom'
            align='center'
          />
          <Bar
            dataKey='AcceptedVolume'
            name='Accepted'
            stackId='v'
            fill='#14a349'
            barSize={55}
            radius={data[0].RemainingVolume === 0 && data[0].PendingVolume === 0 ? [12, 12, 12, 12] : [12, 0, 0, 12]}
            onMouseEnter={() => setHoverKey('Accepted')}
            onMouseLeave={() => setHoverKey(null)}
          >
            <LabelList dataKey='AcceptedVolume' content={(p) => <LabelIfFits {...p} fill='#fff' />} />
          </Bar>
          <Bar
            dataKey='PendingVolume'
            name='Pending'
            stackId='v'
            fill='#f59e0c'
            radius={
              data[0].RemainingVolume === 0 ? [0, 12, 12, 0] : data[0].AcceptedVolume === 0 ? [12, 0, 0, 12] : undefined
            }
            onMouseEnter={() => setHoverKey('Pending')}
            onMouseLeave={() => setHoverKey(null)}
          >
            <LabelList dataKey='PendingVolume' content={(p) => <LabelIfFits {...p} fill='#fff' />} />
          </Bar>
          <Bar
            dataKey='RemainingVolume'
            name='Remaining'
            stackId='v'
            fill='#e4e6ea'
            radius={data[0].AcceptedVolume === 0 && data[0].PendingVolume === 0 ? [12, 12, 12, 12] : [0, 12, 12, 0]}
            onMouseEnter={() => setHoverKey('Remaining')}
            onMouseLeave={() => setHoverKey(null)}
          >
            <LabelList
              onMouseEnter={() => setHoverKey('Remaining')}
              onMouseLeave={() => setHoverKey(null)}
              dataKey='RemainingVolume'
              content={(p) => <LabelIfFits {...p} fill='var(--gray-500)' />}
            />
          </Bar>
          {showAvailableLabel && (
            <ReferenceLine
              x={data[0]?.AvailableVolume}
              stroke='var(--gray-500)'
              strokeWidth={2}
              strokeDasharray='0 0'
              ifOverflow='extendDomain'
              label={{
                value: `Offered: ${numberToShortString(data[0]?.AvailableVolume, 2, true)} gal`,
                position: data[0]?.AvailableVolume === 0 ? 'insideLeft' : 'insideTopRight',
                fontWeight: 600,
                fontSize: 'medium',
                dy: -2,
                dx: -2,
              }}
            />
          )}
          <Tooltip
            cursor={{ fill: 'transparent' }}
            wrapperStyle={{ border: 'none' }}
            content={<BarHoverTooltip hoverKey={hoverKey} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
