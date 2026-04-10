import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Select, Switch, Tooltip, Segmented } from 'antd'
import { BarChartOutlined, ShrinkOutlined, ArrowsAltOutlined, SettingOutlined } from '@ant-design/icons'
import { useFeatureMode } from '../../../../contexts/FeatureModeContext'
import type { PeriodDisplay, PeriodToggleValue } from '../Api/types.schema'

interface ActionButtonsProps {
  publicationMode: 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'
  setPublicationMode: (mode: 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay') => void
  showAnalytics: boolean
  setShowAnalytics: (v: boolean) => void
  showSpreadRows: boolean
  setShowSpreadRows: (v: boolean) => void
  publishMode: boolean
  onManageThresholds?: () => void
  periodDisplay?: PeriodDisplay
  periodToggleValue?: PeriodToggleValue
  onPeriodToggleChange?: (v: PeriodToggleValue) => void
}

export function ActionButtons({
  publicationMode,
  setPublicationMode,
  showAnalytics,
  setShowAnalytics,
  showSpreadRows,
  setShowSpreadRows,
  publishMode,
  onManageThresholds,
  periodDisplay,
  periodToggleValue,
  onPeriodToggleChange,
}: ActionButtonsProps) {
  const { isFutureMode } = useFeatureMode()

  return (
    <Horizontal gap={16} alignItems="center">
      {publicationMode !== 'IntraDay' && (
        <Horizontal gap={8} alignItems="center">
          <Texto>Publishing For</Texto>
          <Select
            options={[
              { value: 'EndOfDay', label: 'EOD' },
              { value: 'EndOfDayCurrentPeriod', label: 'Current Period' },
            ]}
            value={publicationMode}
            onChange={setPublicationMode}
            style={{ width: 150 }}
          />
        </Horizontal>
      )}
      <Tooltip title="Show spread rows">
        <Switch
          checked={showSpreadRows}
          onChange={setShowSpreadRows}
          checkedChildren={<ShrinkOutlined />}
          unCheckedChildren={<ArrowsAltOutlined />}
        />
      </Tooltip>
      <Tooltip title={publishMode ? 'Cannot show analytics while publishing' : 'Show analytics'}>
        <Switch
          checked={showAnalytics}
          onChange={setShowAnalytics}
          disabled={publishMode}
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<BarChartOutlined />}
        />
      </Tooltip>
      {periodDisplay === 'toggle' && onPeriodToggleChange && (
        <Segmented
          size="small"
          value={periodToggleValue || 'proposed'}
          options={[
            { value: 'proposed', label: 'Proposed' },
            { value: 'current', label: 'Current' },
          ]}
          onChange={(val) => onPeriodToggleChange(val as PeriodToggleValue)}
        />
      )}
      {isFutureMode && (
        <GraviButton
          buttonText="Manage Thresholds"
          icon={<SettingOutlined />}
          onClick={onManageThresholds}
        />
      )}
      <Texto appearance="medium">Last Save: Today 9:14 AM</Texto>
    </Horizontal>
  )
}
