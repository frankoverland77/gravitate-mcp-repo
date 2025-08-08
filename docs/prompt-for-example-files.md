# Excalibrr Component Example Finder

## Prompt Template

```
Find 5-10 high-quality examples of the **{COMPONENT_NAME}** component from our production codebase. I need examples that range from simple to complex.

**Requirements:**
- Include variety: 2-3 simple examples, 3-4 medium complexity, 2-3 highly complex
- All examples should be error-free (no TypeScript errors if possible)
- Show the full component usage with surrounding context
- Include the file path where each example was found

**Complexity Levels:**
- **Simple**: Minimal props, basic usage, few or no children
- **Medium**: Multiple props, some children, event handlers, moderate configuration
- **Complex**: Many props, complex children structure, advanced features, extensive configuration, business logic

**For each example, provide:**
1. **File path** where found
2. **Complexity level** (Simple/Medium/Complex)
3. **Code snippet** (include surrounding context)
4. **What makes it complex** (for medium/complex examples)

**Component to analyze:** `{COMPONENT_NAME}`

**Search locations:**
- `/Users/rebecca.hirai/repos/excalibrr` (component library)
- Production usage examples in your main project

**Avoid:**
- Examples with obvious TypeScript errors
- Broken or commented-out code
- Test files unless they show good usage patterns

**Focus on:**
- **Real production usage patterns** with actual business logic
- **Complete prop configurations** including agPropOverrides, controlBarProps
- **Various use cases and contexts** from different modules
- **Advanced features** that showcase the component's full capabilities
- **Source file attribution** for future reference and updates
```

## Usage Examples:

### For GraviGrid:

```
Find 5-10 high-quality examples of the **GraviGrid** component from our production codebase...
```

### For GraviButton:

```
Find 5-10 high-quality examples of the **GraviButton** component from our production codebase...
```

### For Horizontal/Vertical layouts:

```
Find 5-10 high-quality examples of the **Horizontal** component from our production codebase...
```

## Sample Response Format:

### Example 1: Simple GraviGrid

**File:** `/src/pages/contracts/BasicList.tsx`  
**Complexity:** Simple  
**Code:**

```tsx
<GraviGrid
  columns={basicColumns}
  rows={contractData}
  getRowId={(row) => row.id}
  agPropOverrides={{}}
/>
```

### Example 2: Complex GraviGrid

**File:** `/src/modules/ContractManagement/components/DetailsSection/AllDetailsGrid/AllDetailsGrid.tsx`  
**Complexity:** Complex  
**What makes it complex:** Master-detail view, selection handling, action buttons, grid view management
**Code:**

```tsx
<GraviGrid
  externalRef={gridAPIRef}
  agPropOverrides={{
    getRowId: (row) =>
      row?.data?.TradeEntryDetailId || row?.data?.LocalTradeEntryDetailId,
    suppressRowClickSelection: true,
    suppressCellSelection: true,
    rowSelection: "multiple",
  }}
  columnDefs={columnDefs}
  controlBarProps={{
    title: "All Contract Details",
    hideActiveFilters: false,
    actionButtons: canWrite && (
      <ActionButtons
        selectedDetails={selectedDetails}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    ),
  }}
  rowData={rowData}
  onSelectionChanged={handleSelectionChanged}
  masterDetail
  detailRowAutoHeight
  detailCellRenderer={DetailRenderer}
  storageKey="contract-details-grid"
  gridViewManager={gridViewManager}
/>
```
