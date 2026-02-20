import React, { useState } from 'react'
import {
  DataSectionHeader,
  DataSectionValueHeader,
  EditSectionHeader,
  UnderlineHeader,
} from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function HeadersShowcase() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <ShowcaseShell
      title="Headers"
      subtitle="DataSectionHeader, DataSectionValueHeader, EditSectionHeader, UnderlineHeader"
      accentColor="#13c2c2"
      gridMode="wide"
    >
      <SectionDivider title="DataSectionHeader" />
      <SpecimenCard label="DataSectionHeader" props='title="Contract Overview"'>
        <DataSectionHeader title="Contract Overview" />
      </SpecimenCard>

      <SectionDivider title="DataSectionValueHeader" />
      <SpecimenCard label="DataSectionValueHeader" props='title="Total" value="$45,230.00"'>
        <DataSectionValueHeader title="Total" value="$45,230.00" />
      </SpecimenCard>

      <SectionDivider title="EditSectionHeader" />
      <SpecimenCard label="View Mode" props='title="Settings" isEditing={false}'>
        <EditSectionHeader
          title="Settings"
          isEditing={false}
          onEdit={() => setIsEditing(true)}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </SpecimenCard>
      <SpecimenCard label="Edit Mode" props='title="Settings" isEditing={true}'>
        <EditSectionHeader
          title="Settings"
          isEditing={true}
          onEdit={() => {}}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </SpecimenCard>

      <SectionDivider title="UnderlineHeader" />
      <SpecimenCard label="UnderlineHeader" props='title="Performance Metrics"'>
        <UnderlineHeader title="Performance Metrics" />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
