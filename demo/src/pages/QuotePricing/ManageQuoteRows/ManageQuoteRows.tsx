import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import { QuoteRowsTab } from './tabs/QuoteRowsTab'
import { QuoteSpreadsTab } from './tabs/QuoteSpreadsTab'

export function ManageQuoteRows() {
  return (
    <Vertical height="100%">
      <Tabs
        defaultActiveKey="quoteRows"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        tabBarStyle={{ marginBottom: 0, paddingLeft: 16 }}
      >
        <Tabs.TabPane tab="Quote Rows" key="quoteRows" style={{ height: '100%' }}>
          <QuoteRowsTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Work in Excel" key="excel">
          <Vertical className="gap-8" style={{ padding: 24 }}>
            <Texto category="h5">Work in Excel</Texto>
            <Texto appearance="medium">
              Upload/download Excel files for bulk quote row management.
            </Texto>
          </Vertical>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Manage Spreads" key="spreads" style={{ height: '100%' }}>
          <QuoteSpreadsTab />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Manage Benchmarks" key="benchmarks">
          <Vertical className="gap-8" style={{ padding: 24 }}>
            <Texto category="h5">Manage Benchmarks</Texto>
            <Texto appearance="medium">
              Benchmark correlation management coming soon.
            </Texto>
          </Vertical>
        </Tabs.TabPane>
      </Tabs>
    </Vertical>
  )
}
