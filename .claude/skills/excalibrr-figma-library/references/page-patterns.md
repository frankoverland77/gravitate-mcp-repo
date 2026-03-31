# Excalibrr Page-Level Design Patterns

## Spacing Convention Reference
| Token | Size | Usage |
|-------|------|-------|
| gap-0 | 0px | Grid pages (grid fills entire space) |
| gap-4 | 4px | Icon + text micro spacing |
| gap-8 | 8px | Small component groups, button rows |
| gap-12 | 12px | Header elements, common button spacing |
| gap-16 | 16px | Card gaps, section dividers, modal padding |
| gap-20 | 20px | Card grid gaps |
| gap-24 | 24px | Page section spacing |
| p-32 | 32px | Detail page outer padding |

## Card Styling
- Background: bg/surface variable
- Border: 1px solid, border color variable (gray/200 light, gray/600 dark)
- Border-radius: 8px
- Box-shadow: shadow/default effect style
- Padding: 24px internal
- Gap between cards: 20px

---

## PATTERN 1: Simple Grid Page
**Examples**: Supplier Analysis, Contract Measurement Grid
```
┌─────────────────────────────────────────┐
│ Vertical (height:100%, gap:0)           │
│ ┌─────────────────────────────────────┐ │
│ │ GraviGrid (fills entire space)      │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ ControlBar: Title | Actions     │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Column Headers (UPPERCASE)      │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Row Data (fills remaining)      │ │ │
│ │ │                                 │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
- Outer: Vertical, height 100%, gap 0
- Grid fills entire space, no extra padding
- Actions in grid controlBar (top-right)

---

## PATTERN 2: Tabbed Page with Grid Content
**Examples**: Subscription Management, OSP Home
```
┌─────────────────────────────────────────┐
│ Vertical (height:100%)                  │
│ ┌─────────────────────────────────────┐ │
│ │ Tabs                                │ │
│ │ ┌──────┬──────┬──────┬──────┐      │ │
│ │ │ Tab1 │ Tab2 │ Tab3 │ Tab4 │      │ │
│ │ └──────┴──────┴──────┴──────┘      │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Tab Content (GraviGrid or Form) │ │ │
│ │ │                                 │ │ │
│ │ │                                 │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
- Outer: Vertical, height 100%
- Tabs items array (antd v5 pattern)
- Each tab child: full-height component
- No gap between container and tabs

---

## PATTERN 3: Grid + Side Drawers
**Examples**: Index Offer Management, Manage Offers
```
┌─────────────────────────────────────────┐
│ Vertical (height:100%, gap:0)           │
│ ┌─────────────────────────────────────┐ │
│ │ Segmented Control (view modes)      │ │
│ ├─────────────────────────────────────┤ │
│ │ GraviGrid (primary)                 │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ ControlBar + ViewMode toggles   │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Data rows                       │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
│                          ┌─────────────┐│
│                          │ Right Drawer ││
│                          │ (CRUD form)  ││
│                          │              ││
│                          └─────────────┘│
└─────────────────────────────────────────┘
```
- Grid dominates page
- Drawers float above (z-index overlay)
- View mode switching via Segmented control
- Bulk action bar appears when rows selected

---

## PATTERN 4: Master-Detail Grid
**Examples**: Contract Management
```
┌─────────────────────────────────────────┐
│ Vertical (height:100%, gap:0)           │
│ ┌─────────────────────────────────────┐ │
│ │ GraviGrid (masterDetail: true)      │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ ControlBar: Title | [+Create]   │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ ▶ Row 1  | data | [Edit][Del]  │ │ │
│ │ │ ▼ Row 2  | data | [Edit][Del]  │ │ │
│ │ │   ┌───────────────────────────┐ │ │ │
│ │ │   │ Detail Grid (400px)       │ │ │ │
│ │ │   │ Nested line items         │ │ │ │
│ │ │   └───────────────────────────┘ │ │ │
│ │ │ ▶ Row 3  | data | [Edit][Del]  │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
- agGroupCellRenderer in first column
- Action column pinned right (Edit, Delete icons)
- Detail row: 400px height, read-only nested grid
- Create button in controlBar (top-right)

---

## PATTERN 5: Multi-Section Detail Page
**Examples**: Supplier Details, Contract Measurement Details
```
┌─────────────────────────────────────────┐
│ Vertical (gap:24, padding:32)           │
│ ┌─────────────────────────────────────┐ │
│ │ ← Back to [List]   Page Title (h3) │ │
│ ├─────────────────────────────────────┤ │
│ │ KPI Card Grid (3-4 columns)         │ │
│ │ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│ │ │ Icon   │ │ Icon   │ │ Icon   │   │ │
│ │ │ $1.2M  │ │ 94%    │ │ 12     │   │ │
│ │ │ Revenue│ │ Fill   │ │ Active │   │ │
│ │ └────────┘ └────────┘ └────────┘   │ │
│ ├─────────────────────────────────────┤ │
│ │ Section Header (h5, 600)            │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Chart / Visualization           │ │ │
│ │ └─────────────────────────────────┘ │ │
│ ├─────────────────────────────────────┤ │
│ │ Period Selector [90d] [365d] [All]  │ │
│ └─────────────────────────────────────┘ │
│                              ┌──────────┐│
│                              │ ⚙ FAB    ││
│                              └──────────┘│
└─────────────────────────────────────────┘
```
- Back link: LeftOutlined icon + blue text
- KPI Cards: CSS Grid repeat(3-4, 1fr), gap 20px
- Cards: padding 24px, border-radius 8px, border 1px
- Sections separated by 24px gap
- Floating settings button: fixed, bottom-right, 48x48 circle

---

## PATTERN 6: Segmented Entry Flow
**Examples**: Create Contract (Quick/Full/Day Deal)
```
┌─────────────────────────────────────────┐
│ Vertical                                │
│ ┌─────────────────────────────────────┐ │
│ │ ← Back | Create Contract (h3)      │ │
│ │         subtitle                    │ │
│ ├─────────────────────────────────────┤ │
│ │ Segmented: [Quick] [Full] [DayDeal]│ │
│ ├─────────────────────────────────────┤ │
│ │ ┌───────────────────────────────┐   │ │
│ │ │ Active Flow Component         │   │ │
│ │ │ (conditional rendering)       │   │ │
│ │ │                               │   │ │
│ │ └───────────────────────────────┘   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
- Back button + dynamic title (Create/Edit/View)
- Segmented control switches mode
- Only one flow visible at a time

---

## PATTERN 7: Analytics Dashboard
**Examples**: QuoteBook, Delivered Pricing
```
┌─────────────────────────────────────────┐
│ Vertical (height:100%)                  │
│ ┌─────────────────────────────────────┐ │
│ │ Group Tabs [Wholesale][Retail][Other]│ │
│ ├─────────────────────────────────────┤ │
│ │ GraviGrid                           │ │
│ │ ControlBar: Mode | Toggles | Publish│ │
│ │ Rows with exception coloring:       │ │
│ │   🔴 Hard exception (red bg)        │ │
│ │   🟡 Soft exception (yellow bg)     │ │
│ │   🟢 Clean (default bg)             │ │
│ ├─────────────────────────────────────┤ │
│ │ Analytics Panel (collapsible 0-400) │ │
│ │ ┌────────┐ ┌────────┐ ┌────────┐   │ │
│ │ │Readines│ │Exceptns│ │Flagged │   │ │
│ │ │ 87%    │ │ 3 hard │ │ 5 comp │   │ │
│ │ └────────┘ └────────┘ └────────┘   │ │
│ │ Progress bar ████████░░ 87%         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
- Group tabs filter grid content
- Row coloring by exception severity
- Collapsible analytics: height transition 0→400px
- Progress bar: 8px height, border-radius 4, gray bg + colored fill

---

## PATTERN 8: Left Sidebar + Content
**Examples**: Quick Entry Flow, Full Entry Flow
```
┌─────────────────────────────────────────┐
│ Horizontal (flex:1)                     │
│ ┌──────────┐ ┌──────────────────────┐   │
│ │ Sidebar  │ │ Main Content         │   │
│ │ (fixed   │ │ (flex:1)             │   │
│ │  width)  │ │                      │   │
│ │ Contract │ │ Grid or Form         │   │
│ │ Header   │ │                      │   │
│ │ Info     │ │                      │   │
│ │          │ │                      │   │
│ │ Nav      │ │                      │   │
│ │ Items    │ │                      │   │
│ └──────────┘ └──────────────────────┘   │
└─────────────────────────────────────────┘
```
- Horizontal split: fixed sidebar + flex main
- Sidebar: contextual info, navigation
- Main: grid, form, or conditional content

---

## SUB-PATTERN A: Page Header Bar
```
┌─────────────────────────────────────────┐
│ Horizontal (justifyContent:space-between)│
│ │ Texto h5 weight:600 │    [Export][+Add]│
│ │ "Page Title"         │                 │
└─────────────────────────────────────────┘
```
Height: auto, margin-bottom: 12px (mb-3)

## SUB-PATTERN B: Stat/KPI Card
```
┌────────────────┐
│ p:24, r:8      │
│ 📊 Label (p2)  │
│ $1.2M (h3,600) │
│ ▲ +12% (p2)    │
└────────────────┘
```
Grid: repeat(3, minmax(0,300px)), gap:20px
Card: bg surface, border 1px, shadow/default

## SUB-PATTERN C: Form Section Card
```
┌─────────────────────────────────────────┐
│ ┌───────────────────────────────────────┐│
│ │ bg-2: Section Title (h5, normal)      ││
│ ├───────────────────────────────────────┤│
│ │ ┌─────────────┐ ┌─────────────┐      ││
│ │ │ Label       │ │ Label       │      ││
│ │ │ [Input    ] │ │ [Select  ▼] │      ││
│ │ └─────────────┘ └─────────────┘      ││
│ └───────────────────────────────────────┘│
└─────────────────────────────────────────┘
```
Header: bg-2, p-4, border-bottom
Content: px-4, py-3, two columns (flex:1 each)

## SUB-PATTERN D: Footer Action Bar
```
┌─────────────────────────────────────────┐
│ border-top 1px                          │
│            [Cancel]  [Save ✓]           │
└─────────────────────────────────────────┘
```
justifyContent: flex-end, gap-12, mt-2

## SUB-PATTERN E: Empty State
```
┌─────────────────────────────────────────┐
│              (centered, 300px)           │
│                 📋                       │
│           No Data Found (h5)            │
│      Try adjusting filters (p1,med)     │
│          [Reset Filters]                │
└─────────────────────────────────────────┘
```
Vertical, justifyContent:center, alignItems:center, p-4

## SUB-PATTERN F: Floating Settings FAB
Position: fixed, right:24px, bottom:96px
Button: 48x48, shape:circle, theme1
Opens: Right-side drawer

## SUB-PATTERN G: Active Filter Tags
Horizontal row of small BBDTags
Each: label + X remove icon
Color: theme/2 background
Max 5 visible, then "+N more"

## SUB-PATTERN H: Collapsible Panel
Height transitions: 0px ↔ 400px
Transition: height 0.3s ease
overflow: hidden
