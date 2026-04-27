import { RangePicker, Texto } from '@gravitate-js/excalibrr';
import { addDays, isSameDay, startOfYear, subMonths } from 'date-fns';
import moment, { Moment } from 'moment';

// Analyst workflow thinks in trailing windows — match the presets to that
// mental model. Mirrors the ContractsReport production pattern (see
// frontend/src/modules/ContractManagement/ContractsReport/page.tsx:43).
const today = () => new Date();

const staticRanges = [
  {
    label: 'Last 7 days',
    range: () => ({ startDate: addDays(today(), -7), endDate: today() }),
  },
  {
    label: 'Last 30 days',
    range: () => ({ startDate: addDays(today(), -30), endDate: today() }),
  },
  {
    label: 'Last 90 days',
    range: () => ({ startDate: addDays(today(), -90), endDate: today() }),
  },
  {
    label: 'Last 6 months',
    range: () => ({ startDate: subMonths(today(), 6), endDate: today() }),
  },
  {
    label: 'Last 12 months',
    range: () => ({ startDate: subMonths(today(), 12), endDate: today() }),
  },
  {
    label: 'Year to date',
    range: () => ({ startDate: startOfYear(today()), endDate: today() }),
  },
];

const staticRangeHandler = {
  range: {},
  isSelected(range: { startDate: Date; endDate: Date }) {
    const definedRange = this.range as { startDate: Date; endDate: Date };
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

const customStaticRanges = staticRanges.map((r) => ({ ...staticRangeHandler, ...r }));

export type PeriodDates = [Moment, Moment];

interface PeriodSelectorProps {
  value: PeriodDates;
  onChange: (value: PeriodDates) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const [start, end] = value;
  const days = Math.max(1, Math.round(end.diff(start, 'days', true)));
  const label = `${start.format('MMM D')} – ${end.format('MMM D, YYYY')} · ${days} prices published`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <div style={{ width: 'fit-content' }}>
        <RangePicker
          inputKey="cpp-period"
          dates={value}
          onChange={(dates: Moment[]) => onChange([moment(dates[0]), moment(dates[1])] as PeriodDates)}
          placement="bottomLeft"
          staticRanges={customStaticRanges}
          format="MMM D, YYYY"
        />
      </div>
      <Texto category="p2" appearance="medium">
        {label}
      </Texto>
    </div>
  );
}
