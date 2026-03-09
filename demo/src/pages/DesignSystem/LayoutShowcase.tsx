import React from 'react'
import { Horizontal, Vertical, DashboardWidget, WidgetHeader, GridControlBar, Texto } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

function PlaceholderBox({ label, color = '#e6f7ff' }: { label: string; color?: string }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: color,
        border: '1px dashed #91d5ff',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#1890ff',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}

export function LayoutShowcase() {
  return (
    <ShowcaseShell
      title="Layout"
      subtitle="Horizontal, Vertical, DashboardWidget, WidgetHeader, GridControlBar"
      accentColor="#2f54eb"
      gridMode="2col"
    >
      <SectionDivider title="Horizontal" />
      <SpecimenCard label="Default" props="(children rendered in a row)">
        <Horizontal>
          <PlaceholderBox label="Item 1" />
          <PlaceholderBox label="Item 2" />
          <PlaceholderBox label="Item 3" />
        </Horizontal>
      </SpecimenCard>
      <SpecimenCard label="justifyContent='space-between'" props='justifyContent="space-between"'>
        <div style={{ width: '100%' }}>
          <Horizontal justifyContent="space-between">
            <PlaceholderBox label="Left" />
            <PlaceholderBox label="Right" />
          </Horizontal>
        </div>
      </SpecimenCard>
      <SpecimenCard label="alignItems='center'" props='alignItems="center"'>
        <Horizontal gap={8} alignItems="center">
          <PlaceholderBox label="Short" />
          <div style={{ padding: '24px 16px', background: '#fff7e6', border: '1px dashed #ffd591', borderRadius: '4px', fontSize: '12px', color: '#fa8c16' }}>Tall</div>
          <PlaceholderBox label="Short" />
        </Horizontal>
      </SpecimenCard>
      <SpecimenCard label="With gap (via style)" props='style={{ gap: "16px" }}'>
        <Horizontal gap={16}>
          <PlaceholderBox label="A" />
          <PlaceholderBox label="B" />
          <PlaceholderBox label="C" />
        </Horizontal>
      </SpecimenCard>

      <SectionDivider title="Vertical" />
      <SpecimenCard label="Default" props="(children stacked vertically)">
        <Vertical style={{ height: 'auto' }}>
          <PlaceholderBox label="Row 1" />
          <PlaceholderBox label="Row 2" />
          <PlaceholderBox label="Row 3" />
        </Vertical>
      </SpecimenCard>
      <SpecimenCard label='flex="1"' props='flex="1"'>
        <div style={{ height: '120px', display: 'flex' }}>
          <Vertical flex="1">
            <PlaceholderBox label="Fills parent" color="#f6ffed" />
          </Vertical>
        </div>
      </SpecimenCard>

      <SectionDivider title="DashboardWidget" />
      <SpecimenCard label="DashboardWidget" props='title="Revenue Summary"' wide>
        <DashboardWidget>
          <div style={{ padding: '16px' }}>
            <Texto category="p1">Widget content area</Texto>
          </div>
        </DashboardWidget>
      </SpecimenCard>

      <SectionDivider title="WidgetHeader" />
      <SpecimenCard label="WidgetHeader" props='title="Monthly Stats"'>
        <WidgetHeader title="Monthly Stats" />
      </SpecimenCard>

      <SectionDivider title="GridControlBar" />
      <SpecimenCard label="GridControlBar" props="(container for grid toolbar controls)" wide>
        <GridControlBar>
          <PlaceholderBox label="Search" color="#f9f0ff" />
          <PlaceholderBox label="Filter" color="#f9f0ff" />
          <PlaceholderBox label="Export" color="#f9f0ff" />
        </GridControlBar>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
