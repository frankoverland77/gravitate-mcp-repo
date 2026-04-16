# Price Management - PRD

## Overview

Price Management provides a unified interface for managing price instruments across two views:

- **All Prices** - Grid of all price instruments with inline price upload via shared drawer
- **Contract Values** - Contract-level view with formula variable breakdown and stacked price entry

Both views share a common price entry drawer pattern with upload type selection, effective date handling, conflict checking, price history with date range filtering, and save & revalue flow.

## Current State

- All Prices grid with edit drawer (price entry form + price history)
- Contract Values grid with valuation drawer (variable breakdown + stacked price entry)
- Resizable drawers (drag left edge to expand, minimum width enforced)
- Price history grids flex to fill remaining drawer height
- Effective date fields (From/To) shown conditionally based on upload type
- RangePicker for price history date filtering

## Price Conflict Checking

### Context

The conflict checking logic here is closely related to the existing "upload prices from spreadsheet" flow, but simplified. In the spreadsheet upload, a single instrument and publisher can support four different price types, so conflicts must be checked across all of them. In Price Management, uploads are contextual to where they appear in valuation results — a user can only change a single price type at a time. This means only one price type conflict needs to be checked and displayed.

### Behavior

When a user clicks **Check Conflicts**, the lower grid should return a list of saved prices that conflict with the price being uploaded. The conflict grid should show the same columns present in the price history grid. The key columns are:

- Effective From
- Effective To
- Price
- Type

### Open Design Question

**How should conflict checking interact with the price history grid?**

When the user hits Check Conflicts, the results need to be displayed in the lower portion of the drawer where the price history grid currently lives. There are a few possible approaches:

1. **Transform the existing grid in-place** — The price history grid title changes to "Price Conflicts", the date picker / RangePicker filter is removed or visually disabled so that conflicts are shown regardless of the current date range, and the grid data is replaced with the conflict results. When conflicts are dismissed or the user changes the price form, it reverts to the normal price history view.

2. **Separate conflict display** — Conflicts appear in a distinct section (e.g., an alert banner above the price history, or a split view) while the price history grid remains unchanged underneath.

3. **Tabbed approach** — The lower section gets tabs: "Price History" and "Conflicts", where the Conflicts tab is enabled/populated after Check Conflicts is clicked.

The first option keeps the UI simple and avoids adding new layout sections, but temporarily repurposes the grid. The second and third options preserve price history context while showing conflicts, but add layout complexity.

**Decision needed before implementation.**

## TODO

1. Resolve conflict checking UX (see open design question above)
2. Define hook UX for contract revaluation
3. UI polish
4. Cards / componentization?
