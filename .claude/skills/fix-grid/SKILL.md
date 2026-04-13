# Fix AG Grid Issue
1. Read the target component file completely
2. We use AG Grid v30 — do NOT use setGridOption(), use setRowData() or api methods
3. Test ALL template/variant combinations, not just the first one
4. Verify the grid renders with data by checking rowData binding
5. Run `npx tsc --noEmit` after changes
