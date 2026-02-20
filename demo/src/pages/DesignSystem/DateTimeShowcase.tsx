import React, { useState } from 'react'
import { DateSkipper, RangePicker, DayPickerControl, PayrollPickerControl } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function DateTimeShowcase() {
  const [dateSkipperDate, setDateSkipperDate] = useState(new Date())
  const [dayPickerDate, setDayPickerDate] = useState(new Date())
  const [payrollDate, setPayrollDate] = useState(new Date())

  return (
    <ShowcaseShell
      title="Date & Time"
      subtitle="DateSkipper, RangePicker, DayPickerControl, PayrollPickerControl"
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

      <SectionDivider title="DayPickerControl" />
      <SpecimenCard label="DayPickerControl" props='value={date} onChange={setDate}'>
        <DayPickerControl value={dayPickerDate} onChange={setDayPickerDate} />
      </SpecimenCard>

      <SectionDivider title="PayrollPickerControl" />
      <SpecimenCard label="PayrollPickerControl" props='value={date} onChange={setDate}'>
        <PayrollPickerControl value={payrollDate} onChange={setPayrollDate} />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
