import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Radio, Tooltip, Switch } from 'antd'
import { BarChartOutlined, ShrinkOutlined, ArrowsAltOutlined, ExportOutlined } from '@ant-design/icons'
import type { PublicationMode } from '../InventoryAnalytics.types'

interface InventoryAnalyticsActionButtonsProps {
  publicationMode: PublicationMode
  setPublicationMode: (mode: PublicationMode) => void
  showAnalytics: boolean
  setShowAnalytics: (v: boolean) => void
  showSpreadRows: boolean
  setShowSpreadRows: (v: boolean) => void
}

export function InventoryAnalyticsActionButtons({
  publicationMode,
  setPublicationMode,
  showAnalytics,
  setShowAnalytics,
  showSpreadRows,
  setShowSpreadRows,
}: InventoryAnalyticsActionButtonsProps) {
  return (
    <Horizontal gap={16} alignItems="center">
      <Radio.Group
        value={publicationMode}
        onChange={e => setPublicationMode(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        size="small"
        options={[
          { value: 'EndOfDay', label: 'EOD' },
          { value: 'EndOfDayCurrentPeriod', label: 'Current' },
          { value: 'IntraDay', label: 'Intraday' },
        ]}
      />
      <Tooltip title="Show spread rows">
        <Switch
          checked={showSpreadRows}
          onChange={setShowSpreadRows}
          checkedChildren={<ShrinkOutlined />}
          unCheckedChildren={<ArrowsAltOutlined />}
        />
      </Tooltip>
      <Tooltip title="Toggle analytics panel">
        <Switch
          checked={showAnalytics}
          onChange={setShowAnalytics}
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<BarChartOutlined />}
        />
      </Tooltip>
      <GraviButton
        buttonText="Export"
        icon={<ExportOutlined />}
        onClick={() => {}}
      />
      <Texto appearance="medium">Last Save: Today 9:14 AM</Texto>
    </Horizontal>
  )
}
