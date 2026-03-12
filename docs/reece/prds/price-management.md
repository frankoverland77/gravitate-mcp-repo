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

## TODO

1. Define price conflict checking rules and UX
2. Define hook UX for contract revaluation
3. UI polish
4. Cards / componentization?
