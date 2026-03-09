import { useState } from 'react'
import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'

import { CustomerElasticityView } from './components/CustomerElasticityView'
import { LiftingsVsBenchmarkElasticity } from './components/LiftingsVsBenchmarkElasticity'
import { LiftingsVsMarginElasticity } from './components/LiftingsVsMarginElasticity'
import { TerminalComparisonView } from './components/TerminalComparisonView'

export function PriceElasticity() {
  const [activeTab, setActiveTab] = useState('customer')

  return (
    <Vertical height="100%" gap={0} style={{ padding: '16px' }}>
      {/* Page header */}
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
        <Vertical gap={2}>
          <Texto category="h3" weight="600">
            Price Elasticity / Sensitivity Curves
          </Texto>
          <Texto category="p2" appearance="medium">
            ULSD - Baltimore Terminal - Q1 2026
          </Texto>
        </Vertical>
        <Horizontal gap={8} alignItems="center">
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            <Texto category="p2" weight="500" style={{ color: '#52c41a', fontSize: '12px' }}>
              Last calculated: Feb 20, 2026
            </Texto>
          </div>
        </Horizontal>
      </Horizontal>

      {/* Tabbed views */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        items={[
          {
            key: 'customer',
            label: 'Customer Liftings',
            children: (
              <div style={{ flex: 1, height: 'calc(100vh - 180px)' }}>
                <CustomerElasticityView />
              </div>
            ),
          },
          {
            key: 'benchmark',
            label: 'Liftings vs Benchmark',
            children: (
              <div style={{ flex: 1, height: 'calc(100vh - 180px)' }}>
                <LiftingsVsBenchmarkElasticity />
              </div>
            ),
          },
          {
            key: 'margin',
            label: 'Liftings vs Margin',
            children: (
              <div style={{ flex: 1, height: 'calc(100vh - 180px)' }}>
                <LiftingsVsMarginElasticity />
              </div>
            ),
          },
          {
            key: 'terminal',
            label: 'Terminal Comparison',
            children: (
              <div style={{ flex: 1, height: 'calc(100vh - 180px)' }}>
                <TerminalComparisonView />
              </div>
            ),
          },
        ]}
      />
    </Vertical>
  )
}
