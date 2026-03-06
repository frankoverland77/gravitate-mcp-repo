import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Select, Switch, Tooltip } from 'antd'
import { BarChartOutlined, ShrinkOutlined, ArrowsAltOutlined } from '@ant-design/icons'

interface QuoteBookActionButtonsProps {
  publicationMode: 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'
  setPublicationMode: (mode: 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay') => void
  showAnalytics: boolean
  setShowAnalytics: (v: boolean) => void
  showSpreadRows: boolean
  setShowSpreadRows: (v: boolean) => void
  publishMode: boolean
}

export function QuoteBookActionButtons({
  publicationMode,
  setPublicationMode,
  showAnalytics,
  setShowAnalytics,
  showSpreadRows,
  setShowSpreadRows,
  publishMode,
}: QuoteBookActionButtonsProps) {
  return (
    <Horizontal style={{ gap: '16px' }} alignItems="center">
      {publicationMode !== 'IntraDay' && (
        <Horizontal alignItems="center" style={{ gap: '8px' }}>
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
      <Texto appearance="medium">Last Save: Today 9:14 AM</Texto>
    </Horizontal>
  )
}
