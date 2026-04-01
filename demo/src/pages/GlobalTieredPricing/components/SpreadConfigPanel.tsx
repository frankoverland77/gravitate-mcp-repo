/**
 * Spread Configuration Panel for controlling tier calculation settings
 */

import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { InputNumber, Checkbox } from 'antd'
import type { SpreadConfigPanelProps } from '../GlobalTieredPricing.types'

export function SpreadConfigPanel({
  tier2Spread,
  tier3Spread,
  autoCalculate,
  onSpreadChange,
  onAutoCalculateToggle,
}: SpreadConfigPanelProps) {
  return (
    <Horizontal gap={32} alignItems='center' className='tiered-pricing-config-panel'>
      <Texto category='p2' className='tiered-pricing-config-title'>
        Default Tier Spreads
      </Texto>

      <Horizontal gap={16} alignItems='center'>
        <Checkbox
          checked={autoCalculate}
          onChange={(e) => onAutoCalculateToggle(e.target.checked)}
        >
          <Texto category='p2' appearance='medium'>
            Auto-calculate Tier 2 &amp; 3
          </Texto>
        </Checkbox>

        {autoCalculate && (
          <>
            <Horizontal gap={8} alignItems='center'>
              <Texto category='p2' appearance='medium'>
                Tier 2 Spread:
              </Texto>
              <InputNumber
                value={tier2Spread}
                onChange={(value) => onSpreadChange('tier2', value)}
                precision={4}
                step={0.0001}
                size='small'
                className='tiered-pricing-spread-input'
              />
            </Horizontal>

            <Horizontal gap={8} alignItems='center'>
              <Texto category='p2' appearance='medium'>
                Tier 3 Spread:
              </Texto>
              <InputNumber
                value={tier3Spread}
                onChange={(value) => onSpreadChange('tier3', value)}
                precision={4}
                step={0.0001}
                size='small'
                className='tiered-pricing-spread-input'
              />
            </Horizontal>
          </>
        )}
      </Horizontal>
    </Horizontal>
  )
}
