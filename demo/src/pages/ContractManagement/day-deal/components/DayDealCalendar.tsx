/**
 * Day Deal Calendar
 *
 * Always-visible inline calendar with two-color date range selection.
 * Start date = teal (#006d75), End date = blue (#1890ff).
 * Click a date field to set active target, then click calendar days.
 */

import { useState, useCallback, useMemo } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './DayDealCalendar.module.css';

interface DayDealCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  activeTarget: 'start' | 'end';
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onActiveTargetChange: (target: 'start' | 'end') => void;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare < today;
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function formatDisplayDate(date: Date | null): string {
  if (!date) return 'Select date...';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

function getCalendarDays(displayMonth: Date): CalendarDay[] {
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const startDayOfWeek = firstOfMonth.getDay();
  const days: CalendarDay[] = [];

  // Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    days.push({ date: new Date(year, month, d), isCurrentMonth: true });
  }

  // Next month padding to fill 6 rows
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

export function DayDealCalendar({
  startDate,
  endDate,
  activeTarget,
  onStartDateChange,
  onEndDateChange,
  onActiveTargetChange,
}: DayDealCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarDays = useMemo(() => getCalendarDays(displayMonth), [displayMonth]);

  const handlePrevMonth = useCallback(() => {
    setDisplayMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDisplayMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      if (!day.isCurrentMonth || isPast(day.date)) return;

      if (activeTarget === 'start') {
        onStartDateChange(day.date);
        // If new start > current end, clear end
        if (endDate && day.date > endDate) {
          onActiveTargetChange('end');
        } else {
          // Auto-advance to end date
          onActiveTargetChange('end');
        }
      } else {
        // Setting end date
        if (startDate && day.date < startDate) {
          // End before start: set as new start and keep targeting end
          onStartDateChange(day.date);
        } else {
          onEndDateChange(day.date);
          // Both dates set, no auto-advance
        }
      }
    },
    [activeTarget, startDate, endDate, onStartDateChange, onEndDateChange, onActiveTargetChange]
  );

  const getDayClasses = useCallback(
    (day: CalendarDay): string => {
      const classes = [styles['calendar-day']];

      if (!day.isCurrentMonth) {
        classes.push(styles['day-other-month']);
        return classes.join(' ');
      }

      if (isPast(day.date)) {
        classes.push(styles['day-disabled']);
        return classes.join(' ');
      }

      if (isToday(day.date)) {
        classes.push(styles['day-today']);
      }

      if (startDate && isSameDay(day.date, startDate)) {
        classes.push(styles['day-start']);
      } else if (endDate && isSameDay(day.date, endDate)) {
        classes.push(styles['day-end']);
      }

      return classes.join(' ');
    },
    [startDate, endDate]
  );

  const helperText = useMemo(() => {
    if (!startDate && !endDate) return 'Click any date to set: Start Date';
    if (startDate && !endDate) return 'Click any date to set: End Date';
    if (activeTarget === 'start') return 'Click any date to change: Start Date';
    if (activeTarget === 'end') return 'Click any date to change: End Date';
    return 'Click either date field to change';
  }, [startDate, endDate, activeTarget]);

  const startFieldClasses = [
    styles['date-input-display'],
    startDate ? styles['date-input-display-has-value'] : '',
    activeTarget === 'start' ? styles['date-input-display-active-start'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const endFieldClasses = [
    styles['date-input-display'],
    endDate ? styles['date-input-display-has-value'] : '',
    activeTarget === 'end' ? styles['date-input-display-active-end'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      <div className={styles.title}>Deal Dates</div>

      {/* Date display fields + legend */}
      <div className={styles['date-fields-row']}>
        <div className={styles['date-field-group']}>
          <span className={styles['date-field-label']}>Start Date</span>
          <div className={startFieldClasses} onClick={() => onActiveTargetChange('start')}>
            {formatDisplayDate(startDate)}
          </div>
        </div>

        <span className={styles['date-range-separator']}>&mdash;</span>

        <div className={styles['date-field-group']}>
          <span className={styles['date-field-label']}>End Date</span>
          <div className={endFieldClasses} onClick={() => onActiveTargetChange('end')}>
            {formatDisplayDate(endDate)}
          </div>
        </div>

        <div className={styles['date-legend']}>
          <div className={styles['legend-item']}>
            <div className={`${styles['legend-swatch']} ${styles['legend-swatch-start']}`} />
            Start
          </div>
          <div className={styles['legend-item']}>
            <div className={`${styles['legend-swatch']} ${styles['legend-swatch-end']}`} />
            End
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div className={styles['calendar-nav']}>
        <button className={styles['calendar-nav-btn']} onClick={handlePrevMonth}>
          <LeftOutlined />
        </button>
        <span className={styles['calendar-month-label']}>{getMonthLabel(displayMonth)}</span>
        <button className={styles['calendar-nav-btn']} onClick={handleNextMonth}>
          <RightOutlined />
        </button>
      </div>

      {/* Calendar grid */}
      <div className={styles['calendar-grid']}>
        {DAY_HEADERS.map((h) => (
          <div key={h} className={styles['calendar-day-header']}>
            {h}
          </div>
        ))}
        {calendarDays.map((day, idx) => (
          <div key={idx} className={getDayClasses(day)} onClick={() => handleDayClick(day)}>
            {day.date.getDate()}
          </div>
        ))}
      </div>

      {/* Helper text */}
      <div className={styles['calendar-helper-text']}>{helperText}</div>
    </div>
  );
}
