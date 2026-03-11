# Phase 4: Logic & Interactivity — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Price Exceptions feature fully interactive — evaluation engine computes violations live, profiles can be applied/edited/created, overrides work, analytics reflect real data, and publish workflow gates on hard exceptions.

**Architecture:** All state (rows, profiles) lives in QuoteBook.tsx. A pure evaluation function in a new utility file computes violations per row. Child components receive callbacks to mutate state. Grid re-renders via ag-grid's `rowData` reactivity. No server — all client-side demo state.

**Tech Stack:** React 18, TypeScript, ag-grid (via GraviGrid), antd v4.20, @gravitate-js/excalibrr

---

## Important Conventions

- **antd v4.20:** Use `visible`/`onVisibleChange`, NOT `open`/`onOpenChange`
- **No MaterialIcon:** Use antd icons from `@ant-design/icons`
- **Texto no onClick:** Wrap in `<span>` for click handling
- **Excalibrr layout:** Use `flex="1"` not `style={{ flex: 1 }}`, but use plain divs for structural wrappers (Vertical/Horizontal apply overflow:hidden)
- **CLAUDE.md workflow:** Run preflight → validate_code → pre-commit hook before presenting code
- **Theme:** PE_LIGHT theme

---

## Task 1: Evaluation Engine Utility

**Files:**
- Create: `QuoteBook.evaluation.ts`
- Modify: `QuoteBook.types.ts` (add 2 new types)

**Step 1: Add types to QuoteBook.types.ts**

Add after the existing `DrawerState` type:

```typescript
export type ComponentViolation = {
  component: string
  severity: 'Hard' | 'Soft'
  value: number
  threshold: number
  direction: 'below_floor' | 'above_ceiling'
  deviationPct: number
}

export type EvaluationResult = {
  exceptionType: ExceptionType
  exceptionCount: number
  violations: ComponentViolation[]
}
```

**Step 2: Create QuoteBook.evaluation.ts**

Pure function. Field mapping:

| Component    | Row Field           | Comparison Mode       |
|-------------|--------------------|-----------------------|
| Margin      | `proposed_margin`   | Direct (as percentage, divide by 100) |
| Cost        | `prior_lastPrice`   | Direct dollar value   |
| Market Move | `proposed_marketMove` | Absolute value vs ± threshold |
| Price Delta | `proposed_delta`    | Direct (signed, floor negative, ceiling positive) |
| Price       | `proposed_price`    | Direct dollar value   |
| Bench Delta | `benchmark_ulsd - proposed_price` | Absolute value vs ± threshold |
| Bench Value | —                   | Skip (no field mapping) |

The function signature:
```typescript
import type { QuoteRow } from './QuoteBook.data'
import type { ExceptionProfile, ThresholdOverride, EvaluationResult, ComponentViolation } from './QuoteBook.types'

export function evaluateRow(row: QuoteRow, profile: ExceptionProfile): EvaluationResult
```

Logic per threshold component:
1. If severity is 'Off', skip
2. Check if row has override for this component → use override's floor/ceiling/severity instead
3. Get field value from row using field mapping
4. If value < floor → violation (below_floor)
5. If value > ceiling → violation (above_ceiling)
6. Record ComponentViolation with deviationPct = `|value - threshold| / |threshold| * 100`

Aggregation:
- Any Hard violation → exceptionType = 'hard'
- Only Soft violations → exceptionType = 'soft'
- No violations → exceptionType = 'clean'
- exceptionCount = violations.length

Also export a batch function:
```typescript
export function evaluateAllRows(
  rows: QuoteRow[],
  profileMap: Record<string, ExceptionProfile>
): Map<number, EvaluationResult>
```

**Step 3: Verify**

Run: `cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server && npx tsc --noEmit --project demo/tsconfig.json 2>&1 | grep -i "QuoteBook" | head -20`

Expected: No new TypeScript errors in QuoteBook files.

**Step 4: Commit**

```
feat(quotebook): add exception evaluation engine and violation types
```

---

## Task 2: Lift State — Mutable Rows + Profiles in QuoteBook.tsx

**Files:**
- Modify: `QuoteBook.tsx`

**Step 1: Add mutable row state and evaluation**

In QuoteBook.tsx:
- Import `evaluateRow`, `evaluateAllRows` from `./QuoteBook.evaluation`
- Import `exceptionProfileMap` type and profiles
- Add `useState` for mutable rows: `const [rows, setRows] = useState<QuoteRow[]>(() => quoteBookData.map(r => ({...r})))`
- Add `useState` for mutable profiles: `const [profiles, setProfiles] = useState<ExceptionProfile[]>(() => exceptionProfiles.map(p => ({...p, thresholds: p.thresholds.map(t => ({...t}))})))`
- Derive `profileMap` via `useMemo`: `Record<string, ExceptionProfile>` from profiles array
- Add `evaluationMap` via `useMemo`: calls `evaluateAllRows(rows, profileMap)` → `Map<number, EvaluationResult>`
- Create `evaluatedRows` via `useMemo`: maps `rows` and overlays `evaluationMap` results onto each row's `exceptionType` and `exceptionCount`
- Change `filteredRows` to filter from `evaluatedRows` instead of `quoteBookData`

**Step 2: Create row mutation helpers**

```typescript
const updateRows = useCallback((updater: (rows: QuoteRow[]) => QuoteRow[]) => {
  setRows(prev => updater(prev))
}, [])
```

**Step 3: Verify**

Same TS check. Grid should now show dynamically computed exceptions (may differ slightly from static seed data — that's expected and correct).

**Step 4: Commit**

```
feat(quotebook): lift row/profile data to mutable state with live evaluation
```

---

## Task 3: Wire Drawer — Apply Profile + Override

**Files:**
- Modify: `QuoteBook.tsx` (add handler callbacks)
- Modify: `components/QuoteBookExceptionDrawer.tsx` (wire buttons to callbacks)

**Step 1: Add callbacks in QuoteBook.tsx**

```typescript
// Apply profile to selected rows
const handleApplyProfile = useCallback((profileKey: string) => {
  setRows(prev => prev.map(r => {
    if (!drawerState.selectedRowIds.includes(r.id)) return r
    return { ...r, profileKey, overrides: [] }
  }))
  // Clear selection
  gridApiRef.current?.deselectAll()
  setDrawerState(prev => ({ ...prev, mode: 'empty', selectedRowIds: [], selectedProfileKey: null }))
}, [drawerState.selectedRowIds])

// Apply override to selected rows
const handleApplyOverride = useCallback((override: ThresholdOverride, overwriteExisting: boolean) => {
  setRows(prev => prev.map(r => {
    if (!drawerState.selectedRowIds.includes(r.id)) return r
    const existing = r.overrides || []
    const hasExisting = existing.some(o => o.component === override.component)
    if (hasExisting && !overwriteExisting) return r
    const newOverrides = existing.filter(o => o.component !== override.component).concat(override)
    return { ...r, overrides: newOverrides }
  }))
  gridApiRef.current?.deselectAll()
  setDrawerState(prev => ({ ...prev, mode: 'empty', selectedRowIds: [], selectedProfileKey: null }))
}, [drawerState.selectedRowIds])

// Reset to defaults
const handleResetToDefaults = useCallback(() => {
  setRows(prev => prev.map(r => {
    if (!drawerState.selectedRowIds.includes(r.id)) return r
    return { ...r, profileKey: 'default', overrides: [] }
  }))
  gridApiRef.current?.deselectAll()
  setDrawerState(prev => ({ ...prev, mode: 'empty', selectedRowIds: [], selectedProfileKey: null }))
}, [drawerState.selectedRowIds])

// Clear selection
const handleClearSelection = useCallback(() => {
  gridApiRef.current?.deselectAll()
}, [])
```

**Step 2: Pass callbacks to drawer**

Update `<QuoteBookExceptionDrawer>` props to include:
- `onApplyProfile: (profileKey: string) => void`
- `onApplyOverride: (override: ThresholdOverride, overwriteExisting: boolean) => void`
- `onResetToDefaults: () => void`
- `onClearSelection: () => void`
- `profiles: ExceptionProfile[]` (for radio cards to use live profiles)

**Step 3: Update QuoteBookExceptionDrawer.tsx**

- Add `onApplyProfile`, `onApplyOverride`, `onResetToDefaults`, `onClearSelection`, `profiles` to props interface
- Wire footer buttons:
  - "Reset to Defaults" → `onResetToDefaults()`
  - "Apply to Row" / "Apply to N Rows" → `onApplyProfile(selectedProfileKey)` (disabled if no profile selected)
  - "Override Row" / "Override N Rows" → collect form values → `onApplyOverride({component, floor, ceiling, severity}, overwriteExisting)`
  - "Clear Selection" → `onClearSelection()`
- Lift override form state: `component`, `floor`, `ceiling`, `severity`, `overwriteExisting` as local state in SingleRowState/MultiRowState
- Pass `profiles` to `ProfileRadioCards` instead of importing static data
- Wire antd form controls (Select, InputNumber) with controlled state

**Step 4: Verify**

TS check + manual test: select a row, pick a profile, click Apply. Row should update in grid.

**Step 5: Commit**

```
feat(quotebook): wire drawer apply-profile and override actions
```

---

## Task 4: Grid Reactivity — Cell-Level Violation Highlighting

**Files:**
- Modify: `QuoteBook.columnDefs.tsx` (accept evaluationMap, use per-cell violations)
- Modify: `QuoteBook.tsx` (pass evaluationMap to column defs)

**Step 1: Update column defs factory**

Change `getQuoteBookColumnDefs` to accept a second parameter:
```typescript
type ColumnOptions = {
  onHistoryClick: () => void
  evaluationMap: Map<number, EvaluationResult>
}
```

Update cell highlights on numeric columns to check per-component violations instead of just `exceptionType`:
- `proposed_margin` → check if 'Margin' component has a violation in this row's evaluation
- `proposed_marketMove` → check if 'Market Move' component has a violation
- `proposed_price` → check if 'Price' component has a violation
- `proposed_delta` → check if 'Price Delta' component has a violation

For each: if Hard violation → `{ color: '#dc2626', fontWeight: 600 }`, if Soft → `{ color: '#d97706', fontWeight: 600 }`, else null.

**Step 2: Update QuoteBook.tsx column defs memo**

Pass `evaluationMap` to `getQuoteBookColumnDefs`:
```typescript
const columnDefs = useMemo(() => getQuoteBookColumnDefs({
  onHistoryClick: () => setIsHistoryDrawerOpen(true),
  evaluationMap,
}), [evaluationMap])
```

**Step 3: Verify**

TS check. Grid should now highlight individual cells based on which specific threshold is violated (not blanket exceptionType).

**Step 4: Commit**

```
feat(quotebook): cell-level violation highlighting from evaluation engine
```

---

## Task 5: Live Analytics

**Files:**
- Modify: `components/QuoteBookExceptionAnalytics.tsx` (accept computed data, render live)
- Modify: `QuoteBook.tsx` (compute analytics data, pass to component)

**Step 1: Compute analytics in QuoteBook.tsx**

Add a `useMemo` that computes from `evaluatedRows` (all rows, not just filtered):
```typescript
const analyticsData = useMemo(() => {
  const allEvaluated = rows.map(r => {
    const ev = evaluationMap.get(r.id)
    return { ...r, ...(ev || {}) }
  })
  const hard = allEvaluated.filter(r => r.exceptionType === 'hard')
  const soft = allEvaluated.filter(r => r.exceptionType === 'soft')
  const clean = allEvaluated.filter(r => r.exceptionType === 'clean')
  const total = allEvaluated.length
  const readinessPct = total > 0 ? Math.round((clean.length / total) * 100) : 100

  // Flagged components: aggregate violations across all rows
  const componentViolations: Record<string, { count: number; worstSeverity: 'hard' | 'soft' }> = {}
  allEvaluated.forEach(r => {
    const ev = evaluationMap.get(r.id)
    ev?.violations.forEach(v => {
      const key = v.component
      if (!componentViolations[key]) componentViolations[key] = { count: 0, worstSeverity: 'soft' }
      componentViolations[key].count++
      if (v.severity === 'Hard') componentViolations[key].worstSeverity = 'hard'
    })
  })
  const flaggedComponents = Object.entries(componentViolations)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data]) => ({ name, severity: data.worstSeverity as 'hard' | 'soft' }))

  // Worst offenders: rows sorted by max deviation
  const offenders = allEvaluated
    .filter(r => (evaluationMap.get(r.id)?.violations.length || 0) > 0)
    .map(r => {
      const ev = evaluationMap.get(r.id)!
      const worstViolation = ev.violations.reduce((max, v) => v.deviationPct > max.deviationPct ? v : max, ev.violations[0])
      return {
        row: r,
        worstViolation,
        totalViolations: ev.violations.length,
      }
    })
    .sort((a, b) => b.worstViolation.deviationPct - a.worstViolation.deviationPct)
    .slice(0, 5)

  return {
    readinessPct,
    hardCount: hard.length,
    softCount: soft.length,
    cleanCount: clean.length,
    total,
    flaggedComponents,
    worstOffenders: offenders,
  }
}, [rows, evaluationMap])
```

**Step 2: Update QuoteBookExceptionAnalytics props**

Replace static data with props:
```typescript
interface QuoteBookExceptionAnalyticsProps {
  visible: boolean
  onSelectRow?: (id: number) => void
  analyticsData: {
    readinessPct: number
    hardCount: number
    softCount: number
    cleanCount: number
    total: number
    flaggedComponents: { name: string; severity: 'hard' | 'soft' }[]
    worstOffenders: { row: QuoteRow; worstViolation: ComponentViolation; totalViolations: number }[]
  }
}
```

**Step 3: Rewrite analytics component to use live data**

- Publish Readiness: use `analyticsData.readinessPct`, counts, flaggedComponents
- Worst Offenders: map `analyticsData.worstOffenders` → table rows with real deviation text, clickable drill-to-row using `row.id`
- Remove all hardcoded `worstOffenders` and `flaggedComponents` arrays

**Step 4: Pass analyticsData from QuoteBook.tsx**

```jsx
<QuoteBookExceptionAnalytics
  visible={showAnalytics}
  onSelectRow={handleSelectRowById}
  analyticsData={analyticsData}
/>
```

**Step 5: Verify + Commit**

```
feat(quotebook): live analytics computed from evaluation results
```

---

## Task 6: Live Footer Blocked Notice

**Files:**
- Modify: `components/QuoteBookFooter.tsx` (accept hardCount prop)
- Modify: `QuoteBook.tsx` (pass hardCount)

**Step 1: Add hardCount prop to footer**

```typescript
interface QuoteBookFooterProps {
  // ...existing...
  hardExceptionCount: number
}
```

**Step 2: Conditional blocked notice**

Replace the static pill with:
```tsx
{hardExceptionCount > 0 && (
  <span style={{ /* existing pill styles */ }}>
    <WarningOutlined style={{ fontSize: 11 }} />
    {hardExceptionCount} hard exception{hardExceptionCount !== 1 ? 's' : ''} block publishing
  </span>
)}
```

**Step 3: Pass from QuoteBook.tsx**

```jsx
<QuoteBookFooter hardExceptionCount={analyticsData.hardCount} ...otherProps />
```

**Step 4: Commit**

```
feat(quotebook): live footer blocked-notice pill from evaluation data
```

---

## Task 7: Publish Workflow Modal

**Files:**
- Modify: `QuoteBook.tsx` (add publish handler + modal state)
- Possibly modify: `components/QuoteBookFooter.tsx` (if needed)

**Step 1: Add publish workflow state**

```typescript
const [publishModal, setPublishModal] = useState<{
  visible: boolean
  type: 'hard' | 'soft' | 'clean' | null
  hardRows?: QuoteRow[]
}>({ visible: false, type: null })
```

**Step 2: Handle publish click**

Replace the existing `onPublish={() => setIsPublishDrawerOpen(true)}` with:

```typescript
const handlePublish = useCallback(() => {
  const hardRows = rows.filter(r => evaluationMap.get(r.id)?.exceptionType === 'hard')
  const softRows = rows.filter(r => evaluationMap.get(r.id)?.exceptionType === 'soft')

  if (hardRows.length > 0) {
    setPublishModal({ visible: true, type: 'hard', hardRows })
  } else if (softRows.length > 0) {
    setPublishModal({ visible: true, type: 'soft' })
  } else {
    // All clean — immediate publish
    message.success('All rows are clean. Published successfully!')
  }
}, [rows, evaluationMap])
```

**Step 3: Add Modal JSX in QuoteBook.tsx**

Use antd `Modal` with `visible` prop:

- **Hard modal:** "Cannot Publish — Hard Exceptions" header (red), scrollable list of hard rows with config ID + exception count, two buttons: Cancel + "Publish Clean/Soft Only"
- **Soft modal:** "{N} rows have soft (advisory) exceptions. Publish anyway?" — Cancel + Confirm
- On "Publish Clean/Soft Only": `message.success('Published N rows (excluding M with hard exceptions).')`
- On soft confirm: `message.success('Published! N rows submitted. M flagged with soft exceptions.')`

Import `{ Modal, message }` from antd.

**Step 4: Wire the modal close**

`setPublishModal({ visible: false, type: null })`

**Step 5: Verify + Commit**

```
feat(quotebook): publish workflow with hard-exception blocking modal
```

---

## Task 8: Profile CRUD

**Files:**
- Modify: `components/QuoteBookExceptionProfiles.tsx` (wire create/edit/delete/duplicate)
- Modify: `QuoteBook.tsx` (add profile mutation callbacks, pass to profiles component)

**Step 1: Add profile mutation callbacks in QuoteBook.tsx**

```typescript
// Create profile
const handleCreateProfile = useCallback((profile: ExceptionProfile) => {
  setProfiles(prev => [...prev, profile])
}, [])

// Update profile (edit)
const handleUpdateProfile = useCallback((updatedProfile: ExceptionProfile) => {
  setProfiles(prev => prev.map(p => p.key === updatedProfile.key ? updatedProfile : p))
  // Cascade: rows using this profile will auto-re-evaluate via evaluationMap memo
}, [])

// Delete profile
const handleDeleteProfile = useCallback((profileKey: string) => {
  setProfiles(prev => prev.filter(p => p.key !== profileKey))
  // Reassign rows to 'default'
  setRows(prev => prev.map(r =>
    r.profileKey === profileKey ? { ...r, profileKey: 'default', overrides: [] } : r
  ))
}, [])
```

**Step 2: Pass callbacks + profiles to QuoteBookExceptionProfiles**

```jsx
<QuoteBookExceptionProfiles
  profiles={profiles}
  onCreateProfile={handleCreateProfile}
  onUpdateProfile={handleUpdateProfile}
  onDeleteProfile={handleDeleteProfile}
/>
```

**Step 3: Wire QuoteBookExceptionProfiles**

Accept new props. Replace static `exceptionProfiles` import with `profiles` prop throughout.

- **Create:** On "Create Profile" click → validate name is non-empty, generate unique key (`custom-${Date.now()}`), construct `ExceptionProfile` from form, call `onCreateProfile()`, switch to view mode
- **Edit/Save:** On "Save Changes" → validate org limits, construct updated profile, call `onUpdateProfile()`, switch to view mode
- **Delete:** On "Delete" → show `Modal.confirm` ("Delete '{name}'? Rows using this profile will revert to Default."), on OK → `onDeleteProfile(key)`, select 'default' profile
- **Duplicate as Personal:** On click → create form pre-populated with org profile data, set name to `Copy of {name}`, set ownership to 'personal', switch to create mode

**Step 4: Org limit validation on save**

Before saving, check each threshold: `floor >= orgFloor && ceiling <= orgCeiling`. If violated, show `message.error('Threshold values must be within organization limits.')` and don't save.

**Step 5: Verify + Commit**

```
feat(quotebook): profile CRUD with cascade re-evaluation
```

---

## Task 9: Profile Indicator Chip + Minor Polish

**Files:**
- Modify: `components/QuoteBookProfileChip.tsx` (accept computed profile name)
- Modify: `QuoteBook.tsx` (compute most common profile, pass to chip)

**Step 1: Compute most common profile**

```typescript
const activeProfileName = useMemo(() => {
  const counts: Record<string, number> = {}
  rows.forEach(r => {
    const k = r.profileKey || 'default'
    counts[k] = (counts[k] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return 'Default'
  if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) return 'Mixed'
  return profileMap[sorted[0][0]]?.name || 'Default'
}, [rows, profileMap])
```

**Step 2: Update QuoteBookProfileChip**

Accept `profileName` prop, display it instead of static "Standard Day".

**Step 3: Commit**

```
feat(quotebook): live profile indicator chip shows most common profile
```

---

## Task 10: Final Verification + Context Update

**Step 1: Run full TypeScript check**

```bash
cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server
npx tsc --noEmit --project demo/tsconfig.json 2>&1 | grep -i "QuoteBook"
```

**Step 2: Run Vite build**

```bash
cd /Users/frankoverland/Documents/repos/excalibrr-mcp-server/demo && npx vite build
```

**Step 3: Update project-context.md**

Mark Phase 4 as complete. Add session log entry. Update "Next Actions" to reflect completion.

**Step 4: Update MEMORY.md**

Update phase status to reflect Phase 4 complete.

**Step 5: Final commit**

```
docs(quotebook): update project context for Phase 4 completion
```

---

## Dependency Graph

```
Task 1 (Evaluation Engine)
  ↓
Task 2 (Lift State)
  ↓
Task 3 (Wire Drawer)  ←──── depends on mutable state
  ↓
Task 4 (Grid Reactivity) ←── depends on evaluationMap
  ↓
Task 5 (Live Analytics) ←─── depends on evaluationMap + evaluatedRows
  ↓
Task 6 (Footer Pill) ←────── depends on analytics data
  ↓
Task 7 (Publish Modal) ←──── depends on evaluation data
  ↓
Task 8 (Profile CRUD) ←───── depends on profile state + evaluation cascade
  ↓
Task 9 (Chip Polish) ←────── depends on profile state
  ↓
Task 10 (Verification)
```

Tasks 1-2 are foundation. Tasks 3-6 can be partially parallelized (3+4 together, 5+6 together) but are listed sequentially for clarity. Tasks 7-9 are independent of each other once Tasks 1-6 are complete.
