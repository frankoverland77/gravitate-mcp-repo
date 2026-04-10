import { useState } from 'react'
import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import { QuoteRowsTab } from './Tabs/QuoteRows/QuoteRowsTab'
import { QuoteSpreadsTab } from './Tabs/QuoteSpreads/QuoteSpreadsTab'
import { PriceExceptionsTab } from './Tabs/PriceExceptions/PriceExceptionsTab'
import { CompetitorMappingsTab } from './Tabs/CompetitorMappings/CompetitorMappingsTab'
import { useFeatureMode } from '../../../contexts/FeatureModeContext'

export function ManageQuoteRows() {
  const { isFutureMode: _isFutureMode } = useFeatureMode()
  const [activeKey, setActiveKey] = useState('quoteRows')

  return (
    <Vertical height="100%">
      <style>{`
        .quote-pricing-tabs > .ant-tabs-content-holder {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .quote-pricing-tabs > .ant-tabs-content-holder > .ant-tabs-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .quote-pricing-tabs .ant-tabs-tabpane-active {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
      `}</style>
      <Tabs
        className="quote-pricing-tabs"
        activeKey={activeKey}
        onChange={setActiveKey}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        tabBarStyle={{ marginBottom: 0, paddingLeft: 16 }}
        items={[
          {
            key: 'quoteRows',
            label: 'Quote Rows',
            children: <QuoteRowsTab />,
            style: { height: '100%' },
          },
          {
            key: 'excel',
            label: 'Work in Excel',
            children: (
              <Vertical className="gap-8" style={{ padding: 24 }}>
                <Texto category="h5">Work in Excel</Texto>
                <Texto appearance="medium">
                  Upload/download Excel files for bulk quote row management.
                </Texto>
              </Vertical>
            ),
          },
          {
            key: 'spreads',
            label: 'Manage Spreads',
            children: activeKey === 'spreads' && <QuoteSpreadsTab />,
            style: { height: '100%' },
          },
          {
            key: 'benchmarks',
            label: 'Manage Benchmarks',
            children: (
              <Vertical className="gap-8" style={{ padding: 24 }}>
                <Texto category="h5">Manage Benchmarks</Texto>
                <Texto appearance="medium">
                  Benchmark correlation management coming soon.
                </Texto>
              </Vertical>
            ),
          },
          {
            key: 'priceExceptions',
            label: 'Price Exceptions',
            children: activeKey === 'priceExceptions' && <PriceExceptionsTab />,
            style: { height: '100%' },
          },
          {
            key: 'competitorMappings',
            label: 'Competitor Mappings',
            children: activeKey === 'competitorMappings' && <CompetitorMappingsTab />,
            style: { height: '100%' },
          },
        ]}
      />
    </Vertical>
  )
}
