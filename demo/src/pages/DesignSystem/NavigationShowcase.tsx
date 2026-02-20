import React from 'react'
import { Texto, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function NavigationShowcase() {
  const tabItems = [
    { key: '1', label: 'Overview', children: <div style={{ padding: '16px' }}><Texto category="p1">Overview content</Texto></div> },
    { key: '2', label: 'Details', children: <div style={{ padding: '16px' }}><Texto category="p1">Details content</Texto></div> },
    { key: '3', label: 'History', children: <div style={{ padding: '16px' }}><Texto category="p1">History content</Texto></div> },
  ]

  return (
    <ShowcaseShell
      title="Navigation"
      subtitle="Tabs (horizontal/vertical positions)"
      accentColor="#597ef7"
      gridMode="wide"
    >
      <SectionDivider title="Tabs — Horizontal (default)" />
      <SpecimenCard label="Tabs (top)" props='tabPosition="top" items={[...]}'>
        <div style={{ width: '100%' }}>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </SpecimenCard>

      <SectionDivider title="Tabs — Vertical" />
      <SpecimenCard label="Tabs (left)" props='tabPosition="left" items={[...]}'>
        <div style={{ width: '100%' }}>
          <Tabs defaultActiveKey="1" tabPosition="left" items={tabItems} />
        </div>
      </SpecimenCard>

      <SectionDivider title="Tabs — Card Style" />
      <SpecimenCard label="Tabs (card)" props='type="card" items={[...]}'>
        <div style={{ width: '100%' }}>
          <Tabs defaultActiveKey="1" type="card" items={tabItems} />
        </div>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
