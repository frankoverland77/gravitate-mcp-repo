import React from 'react'
import { DataItem, DataItemRow, NothingMessage, NotificationMessage } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function DataDisplayShowcase() {
  return (
    <ShowcaseShell
      title="Data Display"
      subtitle="DataItem, DataItemRow, NothingMessage, NotificationMessage"
      accentColor="#fa8c16"
      gridMode="2col"
    >
      <SectionDivider title="DataItem" />
      <SpecimenCard label="DataItem" props='label="Contract ID" value="CTR-2024-001"'>
        <DataItem label="Contract ID" value="CTR-2024-001" />
      </SpecimenCard>
      <SpecimenCard label="DataItem — Numeric" props='label="Total Volume" value="12,500 gal"'>
        <DataItem label="Total Volume" value="12,500 gal" />
      </SpecimenCard>

      <SectionDivider title="DataItemRow" />
      <SpecimenCard label="DataItemRow" props='label="Status" value="Active"' wide>
        <DataItemRow label="Status" value="Active" />
      </SpecimenCard>
      <SpecimenCard label="DataItemRow" props='label="Effective Date" value="01/15/2024"' wide>
        <DataItemRow label="Effective Date" value="01/15/2024" />
      </SpecimenCard>

      <SectionDivider title="NothingMessage" />
      <SpecimenCard label="NothingMessage" props='message="No data available"' wide>
        <NothingMessage message="No data available" />
      </SpecimenCard>

      <SectionDivider title="NotificationMessage" />
      <SpecimenCard label="Success Notification" props="NotificationMessage('Success', 'Record saved', false)">
        <div>
          <button
            onClick={() => NotificationMessage('Success.', 'Record saved successfully', false)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #52c41a',
              background: '#f6ffed',
              cursor: 'pointer',
            }}
          >
            Trigger Success Notification
          </button>
        </div>
      </SpecimenCard>
      <SpecimenCard label="Error Notification" props="NotificationMessage('Error', 'Save failed', true)">
        <div>
          <button
            onClick={() => NotificationMessage('Error.', 'Failed to save record', true)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ff4d4f',
              background: '#fff2f0',
              cursor: 'pointer',
            }}
          >
            Trigger Error Notification
          </button>
        </div>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
