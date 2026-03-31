import React from 'react'
import { numberToShortString } from '../formatters'

const MIN_SEGMENT_PX = 72

export const LabelIfFits: React.FC<any> = (p) => {
  const vb = p.viewBox ?? {}
  const width = vb.width ?? p.width ?? 0
  const height = vb.height ?? p.height ?? 0
  const x = vb.x ?? p.x ?? 0
  const y = vb.y ?? p.y ?? 0
  const value = Number(p.value ?? 0)
  if (!value || width < MIN_SEGMENT_PX) return null

  return (
    <text
      x={x + width / 2}
      y={y + height / 2 + 4}
      fill={p.fill ?? '#fff'}
      textAnchor='middle'
      fontWeight={600}
      style={{ fontSize: '16px' }}
    >
      {`${numberToShortString(value, 2, true)} gal`}
    </text>
  )
}

type Props = {
  active?: boolean
  payload?: any[]
  hoverKey?: string | null
}

export const BarHoverTooltip: React.FC<Props> = ({ active, payload, hoverKey }) => {
  if (!active || !payload || payload.length === 0 || !hoverKey) return null

  const item = payload.find((p: any) => p.name === hoverKey) ?? payload[payload.length - 1]

  const value = Number(item?.value ?? 0)
  if (!value) return null

  const seriesLabel = (item?.name as string) || String(item?.dataKey ?? '')

  return (
    <div
      style={{
        pointerEvents: 'none',
        padding: '6px 10px',
        borderRadius: 8,
        background: 'rgba(17,17,17,0.9)',
        color: '#fff',
        fontWeight: 600,
        boxShadow: '0 4px 16px rgba(0,0,0,.2)',
        transform: 'translateY(-12px)',
      }}
    >
      {seriesLabel}: {numberToShortString(value, 2, true)} gal
    </div>
  )
}
