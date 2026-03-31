import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferBreakdownPriceDiscovery } from '../../../../../ManageOffers.types'
import { fmt, numberToShortString } from '../../../../../utils/formatters'
import { statusColor } from '../../../../../utils/Utils/StatusColors'
import { renderCustomPriceDiscoveryLegend } from './PriceDiscoveryLegend'
import { useMemo } from 'react'
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Props = {
  priceDiscovery?: SpecialOfferBreakdownPriceDiscovery
  height?: number
}

type AxisDomainTuple = [number, number] | ['auto', 'auto'] | [number, 'auto'] | ['auto', number]

export default function PriceDiscoveryChart({ priceDiscovery, height = 280 }: Props) {
  const data = priceDiscovery?.BidPrices ?? []
  const reserve = priceDiscovery?.ReservePrice

  const yDomain: AxisDomainTuple = useMemo(() => {
    const prices = data.map((d) => d.Price)
    if (typeof reserve === 'number') prices.push(reserve)
    if (prices.length === 0) return ['auto', 'auto']
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1 || 1
    return [min - padding, max + padding]
  }, [data, reserve])

  const xDomain: AxisDomainTuple = useMemo(() => {
    const vols = data.map((d) => d.Volume)
    if (vols.length === 0) return [0, 'auto']
    return [0, Math.max(...vols) * 1.1]
  }, [data])

  const PDTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    const p = payload[0]?.payload ?? {}
    return (
      <Vertical className='pd-tooltip-container'>
        <Horizontal justifyContent='space-between'>
          <Texto>Volume:</Texto>
          <Texto>{numberToShortString(label as number)}</Texto>
        </Horizontal>
        <Horizontal justifyContent='space-between'>
          <Texto>Price:</Texto>
          <Texto> {fmt.currency(p.Price, 4)}</Texto>
        </Horizontal>
        <Horizontal justifyContent='space-between'>
          <Texto>Status:</Texto>
          <Texto>{p.Status ?? '\u2014'}</Texto>
        </Horizontal>
      </Vertical>
    )
  }

  return (
    <div className='p-4' style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 100, bottom: 0, left: 50 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            type='number'
            dataKey='Volume'
            xAxisId='Volume'
            name='Volume'
            domain={xDomain}
            tickFormatter={(value) => (value === 0 || value === 'auto' ? '0' : numberToShortString(value, 0))}
            label={{ value: 'Volume (gallons)', position: 'insideBottom', offset: -5, fontWeight: 600 }}
          />
          <YAxis
            dataKey='Price'
            yAxisId='Price'
            name='Price'
            domain={yDomain}
            orientation='left'
            tickFormatter={(value) => fmt.currency(value as number, 4)}
            label={{ value: 'Price per gallon', angle: -90, position: 'inside', dx: -50, fontWeight: 600 }}
          />

          {reserve !== undefined && reserve !== null && (
            <ReferenceLine
              xAxisId='Volume'
              yAxisId='Price'
              y={reserve}
              stroke='#f59e0c'
              strokeDasharray='10 10'
              label={{
                value: 'Reserve Price',
                position: 'right',
                fill: '#f59e0c',
                fontSize: 12,
              }}
            />
          )}
          <Scatter xAxisId='Volume' yAxisId='Price' name='Bids' data={data} dataKey='Price'>
            {data.map((d, i) => (
              <Cell key={`cell-${i}`} fill={statusColor(d.Status)} />
            ))}
          </Scatter>
          <Tooltip
            labelFormatter={(label) => `Volume: ${numberToShortString(label as number)}`}
            content={<PDTooltip />}
          />
          <Legend
            content={renderCustomPriceDiscoveryLegend(priceDiscovery?.BidPrices)}
            verticalAlign='bottom'
            align='center'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
