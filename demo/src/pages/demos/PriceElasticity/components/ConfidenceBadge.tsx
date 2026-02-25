import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import { getConfidenceBadge } from '../data/elasticity.data'

interface ConfidenceBadgeProps {
  level: 'high' | 'moderate' | 'low'
  sampleSize?: number
  rSquared?: number
  calculationDate?: string
  observationPeriodStart?: string
  observationPeriodEnd?: string
}

export function ConfidenceBadge({
  level,
  sampleSize,
  rSquared,
  calculationDate,
  observationPeriodStart,
  observationPeriodEnd,
}: ConfidenceBadgeProps) {
  const { label, color } = getConfidenceBadge(level)

  const tooltipContent = (
    <div style={{ padding: '4px 0' }}>
      {sampleSize !== undefined && <div>Sample Size: {sampleSize} periods</div>}
      {rSquared !== undefined && <div>R-squared: {rSquared.toFixed(2)}</div>}
      {calculationDate && <div>Last Calculated: {calculationDate}</div>}
      {observationPeriodStart && observationPeriodEnd && (
        <div>
          Period: {observationPeriodStart} to {observationPeriodEnd}
        </div>
      )}
    </div>
  )

  return (
    <Tooltip title={tooltipContent} placement="bottomRight">
      <div>
        <Horizontal
          alignItems="center"
          style={{
            gap: '6px',
            padding: '2px 10px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            border: `1px solid ${color}40`,
            cursor: 'help',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
          <Texto category="p2" weight="500" style={{ color, fontSize: '12px' }}>
            {label}
          </Texto>
          {sampleSize !== undefined && (
            <Texto category="p2" appearance="medium" style={{ fontSize: '11px' }}>
              ({sampleSize} obs)
            </Texto>
          )}
        </Horizontal>
      </div>
    </Tooltip>
  )
}
