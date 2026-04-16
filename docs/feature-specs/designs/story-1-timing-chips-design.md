# Story 1: Quick-Select Timing Chips — Design Revision

## Current State

The timing step (Step 3) already implements **date-range preset chips** for both windows:

| Section | Chips | Status |
|---------|-------|--------|
| Visibility | Now → 1 Hour, Now → EOD, Now → Tomorrow EOD, Tomorrow Morning, This Week, Custom | ✅ Implemented |
| Pickup | Same as Visibility, Next Day, Next 3 Days, Next Week, Next Month, Custom | ✅ Implemented |

These chips auto-fill all 4 fields (start date, start time, end date, end time) for each window. Manual override detection deselects the active chip. Invalid presets are dynamically disabled.

## What's Missing: Time Quick-Select Chips

Each window section has 4 fields: Start Date, Start Time, End Date, End Time. The **date-range chips** fill all 4 at once, but when a user wants to tweak just the time (e.g., change end time from 17:00 to midnight), they must open the TimePicker and scroll. This is the remaining friction.

### Proposed: Inline Time Chips

Add a compact row of **time-only chips** directly below each TimePicker. These set only the time portion of that single field, leaving the date untouched.

#### Chip Sets

**Start Time chips:**
| Chip | Value | Notes |
|------|-------|-------|
| Now | Rounded up to next 15-min mark | Only for start times; disabled if date is in the future |
| 06:00 | 06:00 | Common early-morning start |
| 08:00 | 08:00 | Standard business open |
| Midnight | 00:00 | Start of day |

**End Time chips:**
| Chip | Value | Notes |
|------|-------|-------|
| Now | Rounded up to next 15-min mark | Only if date is today |
| 17:00 | 17:00 | Standard business close (EOD) |
| 18:00 | 18:00 | Extended hours close |
| Midnight | 23:59 | End of day |

#### Layout

```
Start: [DatePicker]  at  [TimePicker]
       ○ Now  ○ 06:00  ○ 08:00  ○ Midnight

End:   [DatePicker]  at  [TimePicker]
       ○ Now  ○ 17:00  ○ 18:00  ○ Midnight
```

Time chips are smaller than date-range chips (11px font, 4px 10px padding) to fit inline without visual clutter. They use the same `.timing-chip` base class with a `.timing-chip-sm` modifier.

#### Behavior

1. Clicking a time chip sets the TimePicker value for that field only
2. The corresponding date field is NOT affected
3. If no date is set yet, the chip also sets today's date as a convenience
4. "Now" chip is disabled when the field's date is in the future (time hasn't happened yet)
5. Selecting a time chip deselects the active date-range preset chip (since user is overriding)
6. Active time chip highlights with the same blue treatment as date-range chips

#### Interaction with Date-Range Chips

- Selecting a date-range chip (e.g., "Now → EOD") fills all fields AND deselects any individual time chip highlights
- Selecting a time chip deselects the parent date-range chip (it's now a custom override)
- This is consistent with the existing "manual override deselects chip" behavior

## Acceptance Criteria Coverage

| Criteria | Implementation |
|----------|---------------|
| Visibility chips above date/time pickers | ✅ Already done (date-range row) |
| Pickup chips below visibility | ✅ Already done (date-range row) |
| Chip auto-fills Form.Item fields | ✅ Date-range chips fill all 4; time chips fill 1 |
| "Custom" leaves fields empty | ✅ Already done |
| Timezone-aware calculations | ⚠️ Chips use browser local time; timezone selector is visual only (demo limitation) |
| Invalid chips disabled | ✅ Date-range: time-of-day checks; Time: "Now" disabled for future dates |
| Manual override deselects chip | ✅ useEffect watchers already handle this |
| Pickup chips reference visibility values | ✅ "Same as Visibility" already implemented |
| **Time quick-select chips** | 🆕 New addition per user request |

---

## Volume Configuration: Collapsible Defaults

### Problem

Step 2 (Products) currently displays five volume fields after product selection:
1. **Total Offered Volume** — the only field users always need to set
2. Min Volume Per Order — inherited from template defaults, rarely changed
3. Max Volume Per Order — inherited from template defaults, rarely changed
4. Volume Increment — inherited from template defaults, rarely changed

Displaying all five fields creates visual noise and unnecessary cognitive load. The min/max/increment values are pre-populated from the selected offer template (e.g., Auction defaults to min=1000, max=10000, increment=500) and are changed in <5% of offer creations.

### Proposed: Collapsed Defaults with "Customize" Link

**Default state (collapsed):**
```
Volume Configuration
Set total volume available for this deal

Total Offered Volume
[ ______________ ]
Total gallons available for this deal

Using template defaults: Min 1,000 · Max 10,000 · Increment 500    [Customize]
```

**Expanded state (after clicking "Customize"):**
```
Volume Configuration
Set total volume available for this deal

Total Offered Volume
[ ______________ ]
Total gallons available for this deal

Order Limits                                                         [Reset to Defaults]
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Min Per Order    │ │ Max Per Order    │ │ Increment       │
│ [ 1,000       ] │ │ [ 10,000      ] │ │ [ 500         ] │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Behavior

1. **On template selection** (Step 1): Min/max/increment form fields are pre-filled with template defaults. The collapsed summary displays these values.
2. **Collapsed state**: Shows a single-line summary of defaults with a "Customize" text link. The three fields exist in the form but are hidden — they still pass validation because they have values.
3. **Clicking "Customize"**: Expands to show the three input fields with current values. The link changes to "Reset to Defaults".
4. **Clicking "Reset to Defaults"**: Restores template default values to all three fields, collapses the section back.
5. **Validation**: Min/max/increment are always `required`, but since template defaults are pre-filled, validation passes without user interaction. If a user expands and clears a field, validation errors appear normally.
6. **Form submission**: All five values (total + min/max/increment) are submitted regardless of collapsed/expanded state.

### Interaction Savings

| Before | After |
|--------|-------|
| 4 fields visible, 3 pre-filled but still visually present | 1 field visible + summary line |
| User mentally processes 5 inputs | User mentally processes 1 input |
| ~5 interactions (review 3 defaults + enter total + scroll past) | ~1 interaction (enter total volume) |

---

## Duration-Based End Date Selection

### Problem

Users typically think about how long an offer should stay open ("3 days") rather than picking a specific end date ("March 20th"). The existing date-range preset chips (Now → EOD, Now → Tomorrow EOD, etc.) cover common scenarios but don't let users express arbitrary durations. Picking an explicit end date requires opening a DatePicker and navigating to the right day — friction that adds up across many offers.

### Implemented: Hybrid Duration Chips + Custom Input

Each window (Visibility and Pickup) now has a **"Duration from start:"** row between the start and end date fields.

#### Layout

```
Start: [DatePicker: Today ▼]  at  [TimePicker: Now ▼]
       ○ Now  ○ 8 AM  ○ Mkt Open  ○ Noon  ...     (time chips, hybrid)

Duration from start:
  ○ Rest of Day  ○ +1 Day  ○ +2 Days  ○ +3 Days  ○ +1 Week  [__] days

End:   [Mar 20, 2026]  at  [TimePicker: 5 PM ▼]     ← auto-calculated when duration active
       Pick specific date instead                      ← escape hatch link
```

#### Duration Chips

| Chip | Days Added | Notes |
|------|-----------|-------|
| Rest of Day | 0 | End date = start date (same day) |
| +1 Day | 1 | |
| +2 Days | 2 | |
| +3 Days | 3 | |
| +1 Week | 7 | |
| `[__] days` | Custom | Small InputNumber styled inline with chips (0–365) |

#### Behavior

1. **Clicking a duration chip** sets the end date to `startDate + N days`, preserving the end time
2. **Chips are disabled** when no start date is set (except "Rest of Day")
3. **Custom days input** works the same as chips — any value 0–365 recalculates end date
4. **When duration is active**, the end date field becomes a **read-only display** (gray background, date text only). A "Pick specific date instead" link switches back to the full DatePicker
5. **When in manual mode**, a "Use duration instead" link switches back to duration chips
6. **Changing the start date** while a duration is active automatically recalculates the end date
7. **Selecting a date-range preset** (e.g., "Now → EOD") clears duration state entirely
8. The hidden `Form.Item` for end date always stays in the DOM so form validation works regardless of display mode

#### Interaction with Other Chip Types

- Selecting a **date-range preset chip** clears active duration chip + custom days + manual mode
- Selecting a **duration chip** deselects the active date-range preset (it's now a custom override)
- **Time chips** remain independent — they only affect the time portion, not the date
- Duration chips and time chips can be used together (e.g., "+3 Days" for date + "5 PM" for time)

#### Interaction Savings

| Scenario | Before | After |
|----------|--------|-------|
| "Leave open for 3 days" | Open DatePicker, navigate to correct date, click | 1 click (+3 Days chip) |
| "Open for 10 days" | Open DatePicker, navigate, count days, click | Type "10" in custom input |
| "Just today" | Already covered by "Now → EOD" preset | Also: "Rest of Day" duration chip |

---

## Future: Template-Level Default End Times

> **Status:** Design note for developer discussion — not yet implemented.

### Problem

Even with time chips, users must still select an end time for both the visibility window and pickup window on every offer. In practice, most offers for a given template end at the same time (e.g., visibility always ends at 5 PM, pickup always ends at 6 PM). There's no way to encode this preference today.

### Proposed: Add Default Times to Offer Templates

Extend the `OfferTemplate` model with optional default end times:

```
OfferTemplate
  ...existing fields...
+ DefaultVisibilityEndTime: string | null   // e.g. "17:00"
+ DefaultPickupEndTime: string | null       // e.g. "18:00"
```

### Behavior

1. When an offer template is selected (Step 1), the default end times are stored as the "template preference."
2. On the timing step, when a user sets a start date/time (either via chip or manually), the end time fields auto-populate with the template's default end time if no end time has been explicitly set yet.
3. The auto-filled end time behaves like any other chip-set value — the user can override it, and doing so clears the "inherited from template" indicator.
4. If the template has no default end times (`null`), behavior is unchanged — the user selects manually.

### Why This Matters

This eliminates the most repetitive remaining interaction: selecting the same end time on every offer. Combined with date-range chips and time chips, this would reduce the timing step to:
- 1 click (date-range chip for visibility) + 0 clicks (end time auto-filled) + 1 click (pickup chip) = **2 clicks** for the entire timing step in the common case.

### Database/Backend Requirements

- New nullable columns on `SpecialOfferTemplate` table (or equivalent configuration surface)
- Admin UI to configure default end times per template
- API to return these values with the template payload
