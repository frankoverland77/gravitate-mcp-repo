import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Button, DatePicker, Form, InputNumber, Select, TimePicker } from 'antd';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { TIMING_WINDOWS } from '../ManageOffers.data';

interface SelectTimingWindowsProps {
  currentStep: number;
  form: FormInstance;
}

type VisibilityPreset = 'now-1h' | 'now-eod' | 'now-tomorrow' | 'tomorrow-morning' | 'this-week' | 'custom';
type PickupPreset = 'same-as-visibility' | 'next-day' | 'next-3-days' | 'next-week' | 'next-month' | 'custom';

interface TimingChip<T extends string> {
  key: T;
  label: string;
}

const VISIBILITY_CHIPS: TimingChip<VisibilityPreset>[] = [
  { key: 'now-1h', label: 'Now → 1 Hour' },
  { key: 'now-eod', label: 'Now → EOD' },
  { key: 'now-tomorrow', label: 'Now → Tomorrow EOD' },
  { key: 'tomorrow-morning', label: 'Tomorrow Morning' },
  { key: 'this-week', label: 'This Week' },
  { key: 'custom', label: 'Custom' },
];

const PICKUP_CHIPS: TimingChip<PickupPreset>[] = [
  { key: 'same-as-visibility', label: 'Same as Visibility' },
  { key: 'next-day', label: 'Next Day' },
  { key: 'next-3-days', label: 'Next 3 Days' },
  { key: 'next-week', label: 'Next Week' },
  { key: 'next-month', label: 'Next Month' },
  { key: 'custom', label: 'Custom' },
];

interface TimeChip {
  key: string;
  label: string;
  getTime: () => Dayjs;
}

const TIME_CHIPS: TimeChip[] = [
  { key: 'now', label: 'Now', getTime: () => roundUpToQuarter(dayjs()) },
  { key: '08:00', label: '8 AM', getTime: () => dayjs().hour(8).minute(0).second(0) },
  { key: '09:00', label: 'Mkt Open', getTime: () => dayjs().hour(9).minute(0).second(0) },
  { key: '12:00', label: 'Noon', getTime: () => dayjs().hour(12).minute(0).second(0) },
  { key: '14:30', label: 'Mkt Close', getTime: () => dayjs().hour(14).minute(30).second(0) },
  { key: '17:00', label: '5 PM', getTime: () => dayjs().hour(17).minute(0).second(0) },
  { key: '18:00', label: '6 PM', getTime: () => dayjs().hour(18).minute(0).second(0) },
  { key: '00:00', label: 'Midnight', getTime: () => dayjs().hour(0).minute(0).second(0) },
];

interface DurationChip {
  key: string;
  label: string;
  days: number; // 0 = rest of day (same day)
}

const DURATION_CHIPS: DurationChip[] = [
  { key: 'rest-of-day', label: 'Rest of Day', days: 0 },
  { key: '1-day', label: '+1 Day', days: 1 },
  { key: '2-days', label: '+2 Days', days: 2 },
  { key: '3-days', label: '+3 Days', days: 3 },
  { key: '1-week', label: '+1 Week', days: 7 },
];

type WindowKey = 'visibility' | 'pickup';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_ZONES = [
  { value: 'ET', label: 'Eastern Time' },
  { value: 'CT', label: 'Central Time' },
  { value: 'MT', label: 'Mountain Time' },
  { value: 'PT', label: 'Pacific Time' },
];

/** End-of-day: 5:00 PM */
function eod(date: Dayjs): Dayjs {
  return date.hour(17).minute(0).second(0).millisecond(0);
}

/** Start-of-business: 8:00 AM */
function sob(date: Dayjs): Dayjs {
  return date.hour(8).minute(0).second(0).millisecond(0);
}

/** Round current time up to the next 15-minute mark */
function roundUpToQuarter(d: Dayjs): Dayjs {
  const minutes = d.minute();
  const remainder = minutes % 15;
  if (remainder === 0 && d.second() === 0) return d.second(0).millisecond(0);
  return d.add(15 - remainder, 'minute').second(0).millisecond(0);
}

function computeVisibilityDates(preset: VisibilityPreset): { start: Dayjs; end: Dayjs } | null {
  const now = dayjs();
  const roundedNow = roundUpToQuarter(now);

  switch (preset) {
    case 'now-1h':
      return { start: roundedNow, end: roundedNow.add(1, 'hour') };
    case 'now-eod':
      return { start: roundedNow, end: eod(now) };
    case 'now-tomorrow':
      return { start: roundedNow, end: eod(now.add(1, 'day')) };
    case 'tomorrow-morning': {
      const tomorrow = now.add(1, 'day');
      return { start: sob(tomorrow), end: eod(tomorrow) };
    }
    case 'this-week': {
      const monday = now.startOf('week').add(1, 'day');
      const startDate = monday.isBefore(now) ? roundedNow : sob(monday);
      const friday = now.startOf('week').add(5, 'day');
      return { start: startDate, end: eod(friday) };
    }
    case 'custom':
      return null;
  }
}

function computePickupDates(
  preset: PickupPreset,
  visStart: Dayjs | null,
  visEnd: Dayjs | null,
): { start: Dayjs; end: Dayjs } | null {
  if (preset === 'custom') return null;

  if (preset === 'same-as-visibility') {
    if (!visStart || !visEnd) return null;
    return { start: visStart, end: visEnd };
  }

  const anchor = visEnd || dayjs();

  switch (preset) {
    case 'next-day': {
      const nextDay = anchor.add(1, 'day');
      return { start: sob(nextDay), end: eod(nextDay) };
    }
    case 'next-3-days': {
      const start = anchor.add(1, 'day');
      return { start: sob(start), end: eod(start.add(2, 'day')) };
    }
    case 'next-week': {
      const start = anchor.add(1, 'day');
      return { start: sob(start), end: eod(start.add(6, 'day')) };
    }
    case 'next-month': {
      const start = anchor.add(1, 'day');
      return { start: sob(start), end: eod(start.add(1, 'month')) };
    }
  }
}

function isVisibilityPresetDisabled(preset: VisibilityPreset): boolean {
  if (preset === 'custom') return false;
  const now = dayjs();

  switch (preset) {
    case 'now-1h':
      return now.hour() >= 23 && now.minute() >= 30;
    case 'now-eod':
      return now.hour() >= 16 && now.minute() >= 30;
    case 'now-tomorrow':
    case 'tomorrow-morning':
      return false;
    case 'this-week': {
      const day = now.day();
      if (day === 0 || day === 6) return true;
      if (day === 5 && now.hour() >= 16) return true;
      return false;
    }
    default:
      return false;
  }
}

function generateCalendarDays(month: Dayjs) {
  const start = month.startOf('month').startOf('week');
  const end = month.endOf('month').endOf('week');
  const days: { date: Dayjs; day: number; isCurrentMonth: boolean; isPast: boolean; isToday: boolean }[] = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    days.push({
      date: current,
      day: current.date(),
      isCurrentMonth: current.month() === month.month(),
      isPast: current.isBefore(dayjs().startOf('day')),
      isToday: current.isSame(dayjs(), 'day'),
    });
    current = current.add(1, 'day');
  }
  return days;
}

export function SelectTimingWindows({ currentStep, form }: SelectTimingWindowsProps) {
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());
  const [visibilityPreset, setVisibilityPreset] = useState<VisibilityPreset | null>(null);
  const [pickupPreset, setPickupPreset] = useState<PickupPreset | null>(null);
  const [chipSetValues, setChipSetValues] = useState<Record<string, string>>({});
  const [activeTimeChips, setActiveTimeChips] = useState<Record<string, string>>({});
  const [activeDuration, setActiveDuration] = useState<Record<WindowKey, string | null>>({
    visibility: null,
    pickup: null,
  });
  const [customDays, setCustomDays] = useState<Record<WindowKey, number | null>>({
    visibility: null,
    pickup: null,
  });
  const [manualEndDate, setManualEndDate] = useState<Record<WindowKey, boolean>>({
    visibility: false,
    pickup: false,
  });

  const visibilityStart = Form.useWatch('VisibilityWindowStartDate', form);
  const visibilityEnd = Form.useWatch('VisibilityWindowEndDate', form);
  const pickupStart = Form.useWatch('PickupWindowStartDate', form);
  const pickupEnd = Form.useWatch('PickupWindowEndDate', form);

  const calendarDays = useMemo(() => generateCalendarDays(calendarDate), [calendarDate]);

  // Default start dates to today when the timing step becomes visible
  useEffect(() => {
    if (currentStep === 2) {
      const today = dayjs().startOf('day');
      const updates: Record<string, Dayjs> = {};
      if (!form.getFieldValue('VisibilityWindowStartDate')) {
        updates.VisibilityWindowStartDate = today;
      }
      if (!form.getFieldValue('PickupWindowStartDate')) {
        updates.PickupWindowStartDate = today;
      }
      if (Object.keys(updates).length > 0) {
        form.setFieldsValue(updates);
      }
    }
  }, [currentStep, form]);

  // Detect manual overrides — deselect chip if user changes a field the chip auto-filled
  useEffect(() => {
    if (visibilityPreset && visibilityPreset !== 'custom') {
      const fields = [
        'VisibilityWindowStartDate',
        'VisibilityWindowStartTime',
        'VisibilityWindowEndDate',
        'VisibilityWindowEndTime',
      ];
      const currentValues = form.getFieldsValue(fields);
      const mismatch = fields.some((field) => {
        const chipVal = chipSetValues[field];
        const currentVal = currentValues[field];
        if (!chipVal || !currentVal) return false;
        return dayjs(currentVal).format('YYYY-MM-DD HH:mm') !== chipVal;
      });
      if (mismatch) setVisibilityPreset(null);
    }
  }, [visibilityStart, visibilityEnd]);

  useEffect(() => {
    if (pickupPreset && pickupPreset !== 'custom') {
      const fields = [
        'PickupWindowStartDate',
        'PickupWindowStartTime',
        'PickupWindowEndDate',
        'PickupWindowEndTime',
      ];
      const currentValues = form.getFieldsValue(fields);
      const mismatch = fields.some((field) => {
        const chipVal = chipSetValues[field];
        const currentVal = currentValues[field];
        if (!chipVal || !currentVal) return false;
        return dayjs(currentVal).format('YYYY-MM-DD HH:mm') !== chipVal;
      });
      if (mismatch) setPickupPreset(null);
    }
  }, [pickupStart, pickupEnd]);

  const applyVisibilityPreset = useCallback(
    (preset: VisibilityPreset) => {
      setVisibilityPreset(preset);
      // Clear individual time chip highlights and duration state when a date-range preset is selected
      setActiveTimeChips((prev) => {
        const next = { ...prev };
        delete next[TIMING_WINDOWS[0].startTimeName];
        delete next[TIMING_WINDOWS[0].endTimeName];
        return next;
      });
      setActiveDuration((prev) => ({ ...prev, visibility: null }));
      setCustomDays((prev) => ({ ...prev, visibility: null }));
      setManualEndDate((prev) => ({ ...prev, visibility: false }));
      if (preset === 'custom') {
        form.setFieldsValue({
          VisibilityWindowStartDate: undefined,
          VisibilityWindowStartTime: undefined,
          VisibilityWindowEndDate: undefined,
          VisibilityWindowEndTime: undefined,
        });
        setChipSetValues((prev) => {
          const next = { ...prev };
          delete next.VisibilityWindowStartDate;
          delete next.VisibilityWindowStartTime;
          delete next.VisibilityWindowEndDate;
          delete next.VisibilityWindowEndTime;
          return next;
        });
        return;
      }

      const dates = computeVisibilityDates(preset);
      if (dates) {
        form.setFieldsValue({
          VisibilityWindowStartDate: dates.start,
          VisibilityWindowStartTime: dates.start,
          VisibilityWindowEndDate: dates.end,
          VisibilityWindowEndTime: dates.end,
        });
        setChipSetValues((prev) => ({
          ...prev,
          VisibilityWindowStartDate: dates.start.format('YYYY-MM-DD HH:mm'),
          VisibilityWindowStartTime: dates.start.format('YYYY-MM-DD HH:mm'),
          VisibilityWindowEndDate: dates.end.format('YYYY-MM-DD HH:mm'),
          VisibilityWindowEndTime: dates.end.format('YYYY-MM-DD HH:mm'),
        }));

        // Auto-fill invite trigger to match visibility start
        form.setFieldsValue({
          InviteTriggerDate: dates.start,
          InviteTriggerTime: dates.start,
        });
      }
    },
    [form],
  );

  const applyPickupPreset = useCallback(
    (preset: PickupPreset) => {
      setPickupPreset(preset);
      // Clear individual time chip highlights and duration state when a date-range preset is selected
      setActiveTimeChips((prev) => {
        const next = { ...prev };
        delete next[TIMING_WINDOWS[1].startTimeName];
        delete next[TIMING_WINDOWS[1].endTimeName];
        return next;
      });
      setActiveDuration((prev) => ({ ...prev, pickup: null }));
      setCustomDays((prev) => ({ ...prev, pickup: null }));
      setManualEndDate((prev) => ({ ...prev, pickup: false }));
      if (preset === 'custom') {
        form.setFieldsValue({
          PickupWindowStartDate: undefined,
          PickupWindowStartTime: undefined,
          PickupWindowEndDate: undefined,
          PickupWindowEndTime: undefined,
        });
        setChipSetValues((prev) => {
          const next = { ...prev };
          delete next.PickupWindowStartDate;
          delete next.PickupWindowStartTime;
          delete next.PickupWindowEndDate;
          delete next.PickupWindowEndTime;
          return next;
        });
        return;
      }

      const visStart = form.getFieldValue('VisibilityWindowStartDate');
      const visEnd = form.getFieldValue('VisibilityWindowEndDate');
      const dates = computePickupDates(
        preset,
        visStart ? dayjs(visStart) : null,
        visEnd ? dayjs(visEnd) : null,
      );
      if (dates) {
        form.setFieldsValue({
          PickupWindowStartDate: dates.start,
          PickupWindowStartTime: dates.start,
          PickupWindowEndDate: dates.end,
          PickupWindowEndTime: dates.end,
        });
        setChipSetValues((prev) => ({
          ...prev,
          PickupWindowStartDate: dates.start.format('YYYY-MM-DD HH:mm'),
          PickupWindowStartTime: dates.start.format('YYYY-MM-DD HH:mm'),
          PickupWindowEndDate: dates.end.format('YYYY-MM-DD HH:mm'),
          PickupWindowEndTime: dates.end.format('YYYY-MM-DD HH:mm'),
        }));
      }
    },
    [form],
  );

  const applyTimeChip = useCallback(
    (timeFieldName: string, dateFieldName: string, chip: TimeChip) => {
      const time = chip.getTime();
      const existingDate = form.getFieldValue(dateFieldName);
      const datePart = existingDate ? dayjs(existingDate) : dayjs();

      // Build combined datetime preserving the existing date
      const combined = datePart.hour(time.hour()).minute(time.minute()).second(0);

      form.setFieldsValue({
        [timeFieldName]: combined,
        // If no date is set yet, also set today as a convenience
        ...(!existingDate ? { [dateFieldName]: combined } : {}),
      });

      setActiveTimeChips((prev) => ({ ...prev, [timeFieldName]: chip.key }));

      // Deselect parent date-range preset since user is overriding
      if (timeFieldName.includes('Visibility')) setVisibilityPreset(null);
      if (timeFieldName.includes('Pickup')) setPickupPreset(null);
    },
    [form],
  );

  const isTimeChipDisabled = useCallback(
    (chip: TimeChip, dateFieldName: string): boolean => {
      if (chip.key !== 'now') return false;
      const existingDate = form.getFieldValue(dateFieldName);
      if (!existingDate) return false;
      // "Now" is disabled if the date field is set to a future date
      return dayjs(existingDate).isAfter(dayjs(), 'day');
    },
    [form],
  );

  /** Apply a duration (in days) from the start date to compute end date */
  const applyDuration = useCallback(
    (windowKey: WindowKey, days: number, chipKey: string) => {
      const windowIndex = windowKey === 'visibility' ? 0 : 1;
      const startDateName = TIMING_WINDOWS[windowIndex].startDateName;
      const endDateName = TIMING_WINDOWS[windowIndex].endDateName;

      const startDate = form.getFieldValue(startDateName);
      if (startDate) {
        const newEndDate = days === 0
          ? dayjs(startDate) // "Rest of Day" = same date
          : dayjs(startDate).add(days, 'day');
        form.setFieldsValue({ [endDateName]: newEndDate });
      }

      setActiveDuration((prev) => ({ ...prev, [windowKey]: chipKey }));
      setManualEndDate((prev) => ({ ...prev, [windowKey]: false }));

      // Deselect parent date-range preset since user is customizing
      if (windowKey === 'visibility') setVisibilityPreset(null);
      if (windowKey === 'pickup') setPickupPreset(null);
    },
    [form],
  );

  /** Apply custom days input */
  const applyCustomDuration = useCallback(
    (windowKey: WindowKey, days: number | null) => {
      setCustomDays((prev) => ({ ...prev, [windowKey]: days }));
      if (days !== null && days >= 0) {
        applyDuration(windowKey, days, 'custom');
      }
    },
    [applyDuration],
  );

  /** Switch to manual end date picker mode */
  const switchToManualEndDate = useCallback(
    (windowKey: WindowKey) => {
      setActiveDuration((prev) => ({ ...prev, [windowKey]: null }));
      setCustomDays((prev) => ({ ...prev, [windowKey]: null }));
      setManualEndDate((prev) => ({ ...prev, [windowKey]: true }));
    },
    [],
  );

  /** Switch back to duration mode */
  const switchToDurationMode = useCallback(
    (windowKey: WindowKey) => {
      setManualEndDate((prev) => ({ ...prev, [windowKey]: false }));
    },
    [],
  );

  // Recalculate end date when start date changes and a duration is active
  useEffect(() => {
    if (activeDuration.visibility && visibilityStart) {
      const chip = DURATION_CHIPS.find((c) => c.key === activeDuration.visibility);
      const days = chip ? chip.days : (activeDuration.visibility === 'custom' ? customDays.visibility : null);
      if (days !== null && days !== undefined) {
        const newEnd = days === 0 ? dayjs(visibilityStart) : dayjs(visibilityStart).add(days, 'day');
        const currentEnd = form.getFieldValue('VisibilityWindowEndDate');
        if (!currentEnd || !dayjs(currentEnd).isSame(newEnd, 'day')) {
          form.setFieldsValue({ VisibilityWindowEndDate: newEnd });
        }
      }
    }
  }, [visibilityStart, activeDuration.visibility, customDays.visibility]);

  useEffect(() => {
    if (activeDuration.pickup && pickupStart) {
      const chip = DURATION_CHIPS.find((c) => c.key === activeDuration.pickup);
      const days = chip ? chip.days : (activeDuration.pickup === 'custom' ? customDays.pickup : null);
      if (days !== null && days !== undefined) {
        const newEnd = days === 0 ? dayjs(pickupStart) : dayjs(pickupStart).add(days, 'day');
        const currentEnd = form.getFieldValue('PickupWindowEndDate');
        if (!currentEnd || !dayjs(currentEnd).isSame(newEnd, 'day')) {
          form.setFieldsValue({ PickupWindowEndDate: newEnd });
        }
      }
    }
  }, [pickupStart, activeDuration.pickup, customDays.pickup]);

  const navigateMonth = (dir: 'prev' | 'next') => {
    setCalendarDate((prev) => (dir === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')));
  };

  const showCheck = (title: string) => {
    if (title.includes('Visibility') && visibilityStart && visibilityEnd) return true;
    if (title.includes('Pickup') && pickupStart && pickupEnd) return true;
    return false;
  };

  const getDateRange = (date: Dayjs) => {
    const ranges: string[] = [];
    if (visibilityStart && visibilityEnd) {
      if (
        date.isAfter(dayjs(visibilityStart).subtract(1, 'day')) &&
        date.isBefore(dayjs(visibilityEnd).add(1, 'day'))
      ) {
        ranges.push('visibility');
      }
    } else if (visibilityStart && date.isSame(dayjs(visibilityStart), 'day')) {
      ranges.push('visibility');
    }
    if (pickupStart && pickupEnd) {
      if (
        date.isAfter(dayjs(pickupStart).subtract(1, 'day')) &&
        date.isBefore(dayjs(pickupEnd).add(1, 'day'))
      ) {
        ranges.push('pickup');
      }
    } else if (pickupStart && date.isSame(dayjs(pickupStart), 'day')) {
      ranges.push('pickup');
    }
    return ranges;
  };

  const getDisabledDate = (current: Dayjs, fieldName: string) => {
    if (!current) return false;
    const isPast = current.isBefore(dayjs().startOf('day'));
    if (fieldName.includes('End') && fieldName.includes('Visibility') && visibilityStart) {
      return isPast || current.isSameOrBefore(dayjs(visibilityStart));
    }
    if (fieldName === 'PickupWindowStartDate' && visibilityStart) {
      return isPast || current.isBefore(dayjs(visibilityStart));
    }
    if (fieldName === 'PickupWindowEndDate' && pickupStart) {
      return isPast || current.isSameOrBefore(dayjs(pickupStart));
    }
    return isPast;
  };

  const renderChipRow = useCallback(
    (chips: TimeChip[], timeFieldName: string, dateFieldName: string) => (
      <Horizontal gap={4} style={{ flexWrap: 'wrap' }}>
        {chips.map((chip) => {
          const isActive = activeTimeChips[timeFieldName] === chip.key;
          const isDisabled = isTimeChipDisabled(chip, dateFieldName);
          return (
            <button
              key={chip.key}
              type="button"
              disabled={isDisabled}
              className={`timing-chip timing-chip-sm${isActive ? ' timing-chip-active' : ''}${isDisabled ? ' timing-chip-disabled' : ''}`}
              onClick={() => applyTimeChip(timeFieldName, dateFieldName, chip)}
            >
              {chip.label}
            </button>
          );
        })}
      </Horizontal>
    ),
    [activeTimeChips, applyTimeChip, isTimeChipDisabled],
  );

  /** Face-up chips: only shown when the time field is empty */
  const renderTimeChips = useCallback(
    (chips: TimeChip[], timeFieldName: string, dateFieldName: string) => {
      const hasValue = !!form.getFieldValue(timeFieldName);
      if (hasValue) return null;
      return <div className="mt-1 mb-1">{renderChipRow(chips, timeFieldName, dateFieldName)}</div>;
    },
    [form, renderChipRow, visibilityStart, visibilityEnd, pickupStart, pickupEnd],
  );

  /** Dropdown footer chips: shown inside the TimePicker panel when a value already exists */
  const renderTimePickerFooter = useCallback(
    (chips: TimeChip[], timeFieldName: string, dateFieldName: string) => () => (
      <div className="p-1">{renderChipRow(chips, timeFieldName, dateFieldName)}</div>
    ),
    [renderChipRow],
  );

  /** Render a row of duration chips + custom days input for a window */
  const renderDurationRow = useCallback(
    (windowKey: WindowKey) => {
      const windowIndex = windowKey === 'visibility' ? 0 : 1;
      const hasStartDate = !!form.getFieldValue(TIMING_WINDOWS[windowIndex].startDateName);

      return (
        <Vertical className="mt-2 mb-1">
          <Texto className="text-12 mb-1" appearance="medium">Duration from start:</Texto>
          <Horizontal gap={4} style={{ flexWrap: 'wrap' }} verticalCenter>
            {DURATION_CHIPS.map((chip) => {
              const isActive = activeDuration[windowKey] === chip.key;
              return (
                <button
                  key={chip.key}
                  type="button"
                  disabled={!hasStartDate && chip.key !== 'rest-of-day'}
                  className={`timing-chip timing-chip-sm${isActive ? ' timing-chip-active' : ''}${!hasStartDate && chip.key !== 'rest-of-day' ? ' timing-chip-disabled' : ''}`}
                  onClick={() => applyDuration(windowKey, chip.days, chip.key)}
                >
                  {chip.label}
                </button>
              );
            })}
            <Horizontal verticalCenter gap={3} style={{ display: 'inline-flex' }}>
              <InputNumber
                size="small"
                min={0}
                max={365}
                precision={0}
                placeholder="#"
                value={customDays[windowKey]}
                onChange={(val) => applyCustomDuration(windowKey, val)}
                disabled={!hasStartDate}
                className="border-radius-5"
                style={{ width: 52, height: 22, fontSize: 11 }}
              />
              <Texto className="text-11" appearance="medium">days</Texto>
            </Horizontal>
          </Horizontal>
        </Vertical>
      );
    },
    [form, activeDuration, customDays, applyDuration, applyCustomDuration, visibilityStart, pickupStart],
  );

  /** Render end date section — read-only display when duration is active, full picker otherwise */
  const renderEndDateSection = useCallback(
    (windowKey: WindowKey) => {
      const windowIndex = windowKey === 'visibility' ? 0 : 1;
      const tw = TIMING_WINDOWS[windowIndex];
      const isDurationActive = !!activeDuration[windowKey] && !manualEndDate[windowKey];
      const endDateValue = form.getFieldValue(tw.endDateName);

      if (isDurationActive && endDateValue) {
        // Read-only display with escape hatch
        return (
          <Vertical>
            <Horizontal gap={10} verticalCenter>
              <Texto className="mr-2 text-14">End: </Texto>
              <Horizontal
                className="p-1 px-3 bordered border-radius-5"
                verticalCenter
                style={{ backgroundColor: 'var(--bg-2)', minWidth: 120, height: 32 }}
              >
                <Texto className="text-14">{dayjs(endDateValue).format('MM/DD/YYYY')}</Texto>
              </Horizontal>
              {/* Hidden form field to keep value in sync */}
              <Form.Item name={tw.endDateName} rules={[{ required: true, message: 'End date is required' }]} style={{ display: 'none' }}>
                <DatePicker />
              </Form.Item>
              <Texto className="text-14">at</Texto>
              <Form.Item
                name={tw.endTimeName}
                rules={[{ required: true, message: 'End time is required' }]}
              >
                <TimePicker format="HH:mm" className="border-radius-5" renderExtraFooter={renderTimePickerFooter(TIME_CHIPS, tw.endTimeName, tw.endDateName)} />
              </Form.Item>
            </Horizontal>
            {renderTimeChips(TIME_CHIPS, tw.endTimeName, tw.endDateName)}
            <button
              type="button"
              onClick={() => switchToManualEndDate(windowKey)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-color-1)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 0 0 0',
                textAlign: 'left',
                width: 'fit-content',
              }}
            >
              Pick specific date instead
            </button>
          </Vertical>
        );
      }

      // Full end date picker (manual mode or no duration active)
      return (
        <Vertical>
          <Horizontal gap={10} verticalCenter>
            <Texto className="mr-2 text-14">End: </Texto>
            <Form.Item
              name={tw.endDateName}
              rules={[{ required: true, message: 'End date is required' }]}
            >
              <DatePicker
                format="MM/DD/YYYY"
                disabledDate={(current) => getDisabledDate(current, tw.endDateName)}
                className="border-radius-5"
              />
            </Form.Item>
            <Texto className="text-14">at</Texto>
            <Form.Item
              name={tw.endTimeName}
              rules={[{ required: true, message: 'End time is required' }]}
            >
              <TimePicker format="HH:mm" className="border-radius-5" renderExtraFooter={renderTimePickerFooter(TIME_CHIPS, tw.endTimeName, tw.endDateName)} />
            </Form.Item>
          </Horizontal>
          {renderTimeChips(TIME_CHIPS, tw.endTimeName, tw.endDateName)}
          {manualEndDate[windowKey] && (
            <button
              type="button"
              onClick={() => switchToDurationMode(windowKey)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--theme-color-1)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 0 0 0',
                textAlign: 'left',
                width: 'fit-content',
              }}
            >
              Use duration instead
            </button>
          )}
        </Vertical>
      );
    },
    [form, activeDuration, manualEndDate, renderTimeChips, renderTimePickerFooter, switchToManualEndDate, switchToDurationMode, getDisabledDate, visibilityStart, visibilityEnd, pickupStart, pickupEnd],
  );

  const isPickupSameDisabled = !visibilityStart || !visibilityEnd;

  return (
    <Vertical
      style={{
        display: currentStep === 2 ? 'block' : 'none',
        visibility: currentStep === 2 ? 'visible' : 'hidden',
      }}
      className="p-4 timing-window-container"
    >
      <Texto category="h4" className="text-18">
        Configure Timing
      </Texto>
      <Texto className="mb-4 text-14">Set when customers can see and respond to your deal</Texto>

      {/* Invitation Trigger */}
      <Vertical className="p-4 bordered mb-4 border-radius-5">
        <Texto category="h5">Invitation Trigger</Texto>
        <Texto className="mb-2 text-14" appearance="medium">
          When to notify customers about this offer
        </Texto>
        <Horizontal gap={10} verticalCenter>
          <Texto className="text-14">Date:</Texto>
          <Form.Item name="InviteTriggerDate" rules={[{ required: true, message: 'Required' }]}>
            <DatePicker
              format="MM/DD/YYYY"
              disabledDate={(current) => current && current.isBefore(dayjs().startOf('day'))}
              className="border-radius-5"
            />
          </Form.Item>
          <Texto className="text-14">at</Texto>
          <Form.Item name="InviteTriggerTime" rules={[{ required: true, message: 'Required' }]}>
            <TimePicker format="HH:mm" className="border-radius-5" />
          </Form.Item>
          <Texto className="text-14 ml-2">Timezone:</Texto>
          <Form.Item name="TimeZoneId">
            <Select options={TIME_ZONES} style={{ width: 160 }} className="border-radius-5" />
          </Form.Item>
        </Horizontal>
      </Vertical>

      {/* Visibility Window */}
      <Vertical className="p-4 bordered mb-4 border-radius-5">
        <Horizontal justifyContent="space-between" verticalCenter>
          <Texto category="h5">{TIMING_WINDOWS[0].title}</Texto>
          {showCheck(TIMING_WINDOWS[0].title) && <CheckOutlined style={{ color: 'var(--theme-success)' }} />}
        </Horizontal>
        <Texto className="mb-3" appearance="medium">
          {TIMING_WINDOWS[0].description}
        </Texto>

        <Horizontal gap={8} className="mb-3" style={{ flexWrap: 'wrap' }}>
          {VISIBILITY_CHIPS.map((chip) => {
            const isActive = visibilityPreset === chip.key;
            const isDisabled = chip.key !== 'custom' && isVisibilityPresetDisabled(chip.key);
            return (
              <button
                key={chip.key}
                type="button"
                disabled={isDisabled}
                className={`timing-chip${isActive ? ' timing-chip-active' : ''}${isDisabled ? ' timing-chip-disabled' : ''}`}
                onClick={() => applyVisibilityPreset(chip.key)}
              >
                {chip.label}
              </button>
            );
          })}
        </Horizontal>

        <Vertical className="mb-2">
          <Horizontal gap={10} verticalCenter>
            <Texto className="text-14">Start: </Texto>
            <Form.Item
              name={TIMING_WINDOWS[0].startDateName}
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker
                format="MM/DD/YYYY"
                disabledDate={(current) => getDisabledDate(current, TIMING_WINDOWS[0].startDateName)}
                className="border-radius-5"
              />
            </Form.Item>
            <Texto className="text-14">at</Texto>
            <Form.Item
              name={TIMING_WINDOWS[0].startTimeName}
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <TimePicker format="HH:mm" className="border-radius-5" renderExtraFooter={renderTimePickerFooter(TIME_CHIPS, TIMING_WINDOWS[0].startTimeName, TIMING_WINDOWS[0].startDateName)} />
            </Form.Item>
          </Horizontal>
          {renderTimeChips(TIME_CHIPS, TIMING_WINDOWS[0].startTimeName, TIMING_WINDOWS[0].startDateName)}
        </Vertical>
        {renderDurationRow('visibility')}
        {renderEndDateSection('visibility')}
      </Vertical>

      {/* Pickup Window */}
      <Vertical className="p-4 bordered mb-4 border-radius-5">
        <Horizontal justifyContent="space-between" verticalCenter>
          <Texto category="h5">{TIMING_WINDOWS[1].title}</Texto>
          {showCheck(TIMING_WINDOWS[1].title) && <CheckOutlined style={{ color: 'var(--theme-success)' }} />}
        </Horizontal>
        <Texto className="mb-3" appearance="medium">
          {TIMING_WINDOWS[1].description}
        </Texto>

        <Horizontal gap={8} className="mb-3" style={{ flexWrap: 'wrap' }}>
          {PICKUP_CHIPS.map((chip) => {
            const isActive = pickupPreset === chip.key;
            const isDisabled = chip.key === 'same-as-visibility' && isPickupSameDisabled;
            return (
              <button
                key={chip.key}
                type="button"
                disabled={isDisabled}
                className={`timing-chip${isActive ? ' timing-chip-active' : ''}${isDisabled ? ' timing-chip-disabled' : ''}`}
                onClick={() => applyPickupPreset(chip.key)}
              >
                {chip.label}
              </button>
            );
          })}
        </Horizontal>

        <Vertical className="mb-2">
          <Horizontal gap={10} verticalCenter>
            <Texto className="text-14">Start: </Texto>
            <Form.Item
              name={TIMING_WINDOWS[1].startDateName}
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker
                format="MM/DD/YYYY"
                disabledDate={(current) => getDisabledDate(current, TIMING_WINDOWS[1].startDateName)}
                className="border-radius-5"
              />
            </Form.Item>
            <Texto className="text-14">at</Texto>
            <Form.Item
              name={TIMING_WINDOWS[1].startTimeName}
              rules={[{ required: true, message: 'Start time is required' }]}
            >
              <TimePicker format="HH:mm" className="border-radius-5" renderExtraFooter={renderTimePickerFooter(TIME_CHIPS, TIMING_WINDOWS[1].startTimeName, TIMING_WINDOWS[1].startDateName)} />
            </Form.Item>
          </Horizontal>
          {renderTimeChips(TIME_CHIPS, TIMING_WINDOWS[1].startTimeName, TIMING_WINDOWS[1].startDateName)}
        </Vertical>
        {renderDurationRow('pickup')}
        {renderEndDateSection('pickup')}
      </Vertical>

      {/* Calendar View */}
      <Vertical className="p-4 bordered mb-4 border-radius-5">
        <Horizontal className="mb-2" justifyContent="space-between" verticalCenter>
          <Vertical>
            <Texto category="h4" className="text-18">
              Calendar View
            </Texto>
            <Texto className="mb-2 text-14" appearance="medium">
              When customers can see and bid on your deal
            </Texto>
          </Vertical>
          <Horizontal verticalCenter>
            <GraviButton
              size="small"
              icon={<LeftOutlined />}
              onClick={() => navigateMonth('prev')}
              appearance="outlined"
              className="border-radius-5"
            />
            <Texto className="mx-2 text-14">{calendarDate.format('MMMM YYYY')}</Texto>
            <GraviButton
              size="small"
              icon={<RightOutlined />}
              onClick={() => navigateMonth('next')}
              appearance="outlined"
              className="border-radius-5"
            />
          </Horizontal>
        </Horizontal>

        <Vertical className="p-2 mb-2 border-radius-5">
          <Horizontal gap={20} className="mb-2" verticalCenter>
            <Horizontal verticalCenter>
              <div
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: 'var(--visibility-bg, #dbeafe)',
                  borderRadius: 4,
                  border: '1px solid #4386f6',
                }}
              />
              <Texto className="ml-2 text-14">Visibility</Texto>
            </Horizontal>
            <Horizontal verticalCenter>
              <div
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: 'var(--pickup-bg, #dcfce7)',
                  borderRadius: 4,
                  border: '1px solid #32ae5e',
                }}
              />
              <Texto className="ml-2 text-14">Pickup</Texto>
            </Horizontal>
          </Horizontal>

          <Vertical className="p-4 bordered border-radius-5">
            <Horizontal gap={10} className="mb-1">
              {WEEKDAYS.map((day) => (
                <Vertical key={day} style={{ flex: 1 }}>
                  <Texto className="text-14" weight="bold" align="center">
                    {day}
                  </Texto>
                </Vertical>
              ))}
            </Horizontal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
              {calendarDays.map((dayInfo, index) => {
                const ranges = getDateRange(dayInfo.date);
                const isVisStart = visibilityStart && dayInfo.date.isSame(dayjs(visibilityStart), 'day');
                const isVisEnd = visibilityEnd && dayInfo.date.isSame(dayjs(visibilityEnd), 'day');
                const isPickStart = pickupStart && dayInfo.date.isSame(dayjs(pickupStart), 'day');
                const isPickEnd = pickupEnd && dayInfo.date.isSame(dayjs(pickupEnd), 'day');

                let className = 'border-radius-5 cal-button ';
                if (isVisStart || isVisEnd) {
                  className += 'timing-window-visibility-selected timing-window-visibility-border ';
                } else if (isPickStart || isPickEnd) {
                  className += 'timing-window-pickup-selected timing-window-pickup-border ';
                } else if (dayInfo.isToday) {
                  className += 'timing-window-today ';
                } else {
                  className += 'timing-window-calendar-day ';
                }
                if (ranges.includes('visibility') && ranges.includes('pickup')) {
                  className += 'timing-window-both ';
                } else if (ranges.includes('visibility')) {
                  className += 'timing-window-visibility-range ';
                } else if (ranges.includes('pickup')) {
                  className += 'timing-window-pickup-range ';
                }

                return (
                  <Button
                    key={index}
                    disabled={dayInfo.isPast || !dayInfo.isCurrentMonth}
                    className={className}
                  >
                    <Texto
                      className="text-14"
                      appearance={dayInfo.isPast || !dayInfo.isCurrentMonth ? 'hint' : 'default'}
                      weight="normal"
                    >
                      {dayInfo.day}
                    </Texto>
                  </Button>
                );
              })}
            </div>
          </Vertical>
        </Vertical>
      </Vertical>
    </Vertical>
  );
}
