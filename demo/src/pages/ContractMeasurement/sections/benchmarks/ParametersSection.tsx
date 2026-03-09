import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import type { AnalysisParameters } from '../../types/scenario.types'

interface ParametersSectionProps {
  parameters: AnalysisParameters
  onUpdateParameters: (params: AnalysisParameters) => void
}

export function ParametersSection({ parameters, onUpdateParameters }: ParametersSectionProps) {
  return (
    <Vertical gap={16}>
      {/* Section Header - styled like Scenario Comparison */}
      <div>
        <Texto category="h4" weight="600">
          Parameters
        </Texto>
        <Texto category="p2" appearance="medium">
          Configure analysis settings for price history
        </Texto>
      </div>

      {/* Card/Tile container */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
        }}
      >
        <Horizontal gap={24} alignItems="center">
          <Horizontal gap={4} alignItems="center">
            <Texto category="p2" appearance="medium">
              Lookback Period:
            </Texto>
            <Select
              size="small"
              value={parameters.price.lookback}
              onChange={(val) =>
                onUpdateParameters({ ...parameters, price: { ...parameters.price, lookback: val } })
              }
              options={[
                { value: '30d', label: 'Last 30 Days' },
                { value: '3mo', label: 'Last 3 Months' },
                { value: '6mo', label: 'Last 6 Months' },
                { value: '12mo', label: 'Last 12 Months' },
                { value: 'full', label: 'Entire Contract Duration' },
              ]}
              style={{ width: '200px' }}
            />
          </Horizontal>
          <Horizontal gap={4} alignItems="center">
            <Texto category="p2" appearance="medium">
              Averaging Method:
            </Texto>
            <Select
              size="small"
              value={parameters.price.method}
              onChange={(val) =>
                onUpdateParameters({ ...parameters, price: { ...parameters.price, method: val } })
              }
              options={[
                { value: 'simple', label: 'Simple Average' },
                { value: 'weekly-median', label: 'Avg of Weekly Medians' },
                { value: 'monthly-median', label: 'Avg of Monthly Medians' },
              ]}
              style={{ width: '200px' }}
            />
          </Horizontal>
        </Horizontal>
      </div>
    </Vertical>
  )
}
