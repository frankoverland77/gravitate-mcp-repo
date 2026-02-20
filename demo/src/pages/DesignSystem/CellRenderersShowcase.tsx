import React from 'react'
import { TextCell, NumberCell, SingleDateCell, TagCell } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

function MockCellRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
        padding: '8px 0',
      }}
    >
      <div
        style={{
          width: '140px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#8c8c8c',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

export function CellRenderersShowcase() {
  return (
    <ShowcaseShell
      title="Cell Renderers"
      subtitle="TextCell, NumberCell, SingleDateCell, TagCell"
      accentColor="#36cfc9"
      gridMode="2col"
    >
      <SectionDivider title="TextCell" />
      <SpecimenCard label="TextCell" props='value="Acme Corp"' column>
        <MockCellRow label="Company">
          <TextCell value="Acme Corp" />
        </MockCellRow>
        <MockCellRow label="Product">
          <TextCell value="Ultra Low Sulfur Diesel" />
        </MockCellRow>
      </SpecimenCard>

      <SectionDivider title="NumberCell" />
      <SpecimenCard label="NumberCell" props='value={1234.56}' column>
        <MockCellRow label="Volume">
          <NumberCell value={12500} />
        </MockCellRow>
        <MockCellRow label="Price">
          <NumberCell value={2.4567} />
        </MockCellRow>
      </SpecimenCard>

      <SectionDivider title="SingleDateCell" />
      <SpecimenCard label="SingleDateCell" props='value="2024-01-15"' column>
        <MockCellRow label="Start Date">
          <SingleDateCell value="2024-01-15" />
        </MockCellRow>
        <MockCellRow label="End Date">
          <SingleDateCell value="2024-12-31" />
        </MockCellRow>
      </SpecimenCard>

      <SectionDivider title="TagCell" />
      <SpecimenCard label="TagCell" props='value="Active"' column>
        <MockCellRow label="Status">
          <TagCell value="Active" />
        </MockCellRow>
        <MockCellRow label="Type">
          <TagCell value="Fixed" />
        </MockCellRow>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
