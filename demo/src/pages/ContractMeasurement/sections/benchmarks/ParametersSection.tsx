import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import type { AnalysisParameters } from '../../types/scenario.types'

interface ParametersSectionProps {
  parameters: AnalysisParameters
  onUpdateParameters: (params: AnalysisParameters) => void
}

export function ParametersSection({ parameters, onUpdateParameters }: ParametersSectionProps) {
  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Section Header - styled like Scenario Comparison */}
      <div>
        <Texto category="h4" weight="600">
          Parameters
        </Texto>
        <Texto category="p2" appearance="medium">
          Configure analysis settings for price and volume history
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
        {/* Two-column layout: Price History | Volume History */}
        <Horizontal style={{ gap: '48px' }} alignItems="flex-start">
          {/* Price History */}
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="600">
              Price History
            </Texto>
            <Horizontal style={{ gap: '12px' }} alignItems="center">
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Lookback:
                </Texto>
                <Select
                  size="small"
                  value={parameters.price.lookback}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, price: { ...parameters.price, lookback: val } })
                  }
                  options={[
                    { value: '6mo', label: '6mo' },
                    { value: '12mo', label: '12mo' },
                    { value: '18mo', label: '18mo' },
                    { value: '24mo', label: '24mo' },
                  ]}
                  style={{ width: '80px' }}
                />
              </Horizontal>
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Aggregation:
                </Texto>
                <Select
                  size="small"
                  value={parameters.price.aggregation}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, price: { ...parameters.price, aggregation: val } })
                  }
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                  ]}
                  style={{ width: '100px' }}
                />
              </Horizontal>
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Method:
                </Texto>
                <Select
                  size="small"
                  value={parameters.price.method}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, price: { ...parameters.price, method: val } })
                  }
                  options={[
                    { value: 'weighted', label: 'Weighted Avg' },
                    { value: 'simple', label: 'Simple Avg' },
                    { value: 'median', label: 'Median' },
                  ]}
                  style={{ width: '120px' }}
                />
              </Horizontal>
            </Horizontal>
          </Vertical>

          {/* Volume History */}
          <Vertical style={{ gap: '8px' }}>
            <Texto category="p2" weight="600">
              Volume History
            </Texto>
            <Horizontal style={{ gap: '12px' }} alignItems="center">
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Lookback:
                </Texto>
                <Select
                  size="small"
                  value={parameters.volume.lookback}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, volume: { ...parameters.volume, lookback: val } })
                  }
                  options={[
                    { value: '6mo', label: '6mo' },
                    { value: '12mo', label: '12mo' },
                    { value: '18mo', label: '18mo' },
                    { value: '24mo', label: '24mo' },
                  ]}
                  style={{ width: '80px' }}
                />
              </Horizontal>
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Granularity:
                </Texto>
                <Select
                  size="small"
                  value={parameters.volume.granularity}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, volume: { ...parameters.volume, granularity: val } })
                  }
                  options={[
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'quarterly', label: 'Quarterly' },
                  ]}
                  style={{ width: '100px' }}
                />
              </Horizontal>
              <Horizontal style={{ gap: '4px' }} alignItems="center">
                <Texto category="p2" appearance="medium">
                  Calculation:
                </Texto>
                <Select
                  size="small"
                  value={parameters.volume.calculation}
                  onChange={(val) =>
                    onUpdateParameters({ ...parameters, volume: { ...parameters.volume, calculation: val } })
                  }
                  options={[
                    { value: 'sum', label: 'Sum' },
                    { value: 'average', label: 'Average' },
                  ]}
                  style={{ width: '100px' }}
                />
              </Horizontal>
            </Horizontal>
          </Vertical>
        </Horizontal>
      </div>
    </Vertical>
  )
}
