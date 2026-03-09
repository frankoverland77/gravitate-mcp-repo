import React, { useState } from 'react'
import { DateSkipper, RangePicker } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function DateTimeShowcase() {
  const [dateSkipperDate, setDateSkipperDate] = useState(new Date())

  return (
    <ShowcaseShell
      title="Date & Time"
      subtitle="DateSkipper, RangePicker"
      accentColor="#eb2f96"
      gridMode="2col"
    >
      <SectionDivider title="DateSkipper" />
      <SpecimenCard label="DateSkipper" props='value={date} onChange={setDate}'>
        <DateSkipper value={dateSkipperDate} onChange={setDateSkipperDate} />
      </SpecimenCard>

      <SectionDivider title="RangePicker" />
      <SpecimenCard label="RangePicker" props="(date range selection)">
        <RangePicker onChange={() => {}} />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
