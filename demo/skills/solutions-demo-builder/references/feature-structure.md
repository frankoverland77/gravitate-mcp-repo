# Feature Structure

How to organize a demo feature — folder structure, file naming, state management, and the standard page scaffold.

## Table of Contents
- [Folder Structure](#folder-structure)
- [Page Scaffold](#page-scaffold)
- [Mock Data Files](#mock-data-files)
- [Column Definition Files](#column-definition-files)
- [Type Definitions](#type-definitions)
- [Sub-Components](#sub-components)
- [State Management in Demos](#state-management-in-demos)

---

## Folder Structure

Every demo lives under `src/pages/demos/{category}/`. Categories: `grids`, `forms`, `dashboards`, `delivery`, or a custom category.

### Simple Demo (Grid or Form Only)
```
src/pages/demos/grids/ContractGrid/
├── ContractGrid.tsx              # Page component (named export)
├── ContractGrid.columnDefs.tsx   # Column definitions
├── ContractGrid.data.ts          # Mock data
└── types.ts                      # TypeScript interfaces
```

### Full Feature (CRUD with Modal)
```
src/pages/demos/grids/ContractManagement/
├── ContractManagementPage.tsx    # Main page component
├── ContractManagement.columnDefs.tsx
├── ContractManagement.data.ts
├── types.ts
└── components/
    ├── ContractModal.tsx         # Create/edit modal
    └── ContractDetailPanel.tsx   # Optional detail panel
```

### Complex Feature (Multiple Views)
```
src/pages/demos/delivery/DeliveryManager/
├── DeliveryManagerPage.tsx       # Main page (tab container)
├── types.ts
├── data/
│   ├── routes.data.ts
│   ├── drivers.data.ts
│   └── deliveries.data.ts
└── components/
    ├── RoutePlanning/
    │   ├── RoutePlanning.tsx
    │   └── RoutePlanning.columnDefs.tsx
    ├── DriverManagement/
    │   ├── DriverManagement.tsx
    │   └── DriverModal.tsx
    └── Analytics/
        └── AnalyticsDashboard.tsx
```

### Naming Conventions

| File Type | Pattern | Example |
|-----------|---------|---------|
| Page component | `{FeatureName}Page.tsx` or `{FeatureName}.tsx` | `ContractManagementPage.tsx` |
| Column defs | `{FeatureName}.columnDefs.tsx` | `ContractManagement.columnDefs.tsx` |
| Mock data | `{FeatureName}.data.ts` | `ContractManagement.data.ts` |
| Types | `types.ts` | `types.ts` |
| Modal component | `{Entity}Modal.tsx` | `ContractModal.tsx` |
| Detail panel | `{Entity}DetailPanel.tsx` | `ContractDetailPanel.tsx` |

---

## Page Scaffold

The standard page component for a grid-based feature with CRUD.

```tsx
import React, { useState, useMemo } from 'react'
import { GraviGrid, Vertical, Horizontal, Texto, GraviButton, NotificationMessage } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getColumnDefs } from './ContractManagement.columnDefs'
import { initialContracts } from './ContractManagement.data'
import { ContractModal } from './components/ContractModal'
import { Contract } from './types'

export function ContractManagementPage() {
  // 1. State (useState)
  const [data, setData] = useState<Contract[]>(initialContracts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<Contract | null>(null)

  // 2. Derived/computed values (useMemo) — see below for columnDefs and controlBarProps

  // 3. Event handlers
  const handleCreate = () => {
    setEditRecord(null)
    setModalOpen(true)
  }

  const handleEdit = (record: Contract) => {
    setEditRecord(record)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Contract',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this contract?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setData(prev => prev.filter(r => r.id !== id))
        NotificationMessage('Success.', 'Contract deleted', false)
      },
    })
  }

  const handleSave = (record: Contract) => {
    setData(prev => {
      const exists = prev.find(r => r.id === record.id)
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r)
      }
      return [...prev, record]
    })
    NotificationMessage('Success.', `Contract ${editRecord ? 'updated' : 'created'}`, false)
  }

  // Column defs — pass handlers for action buttons
  const columnDefs = useMemo(() => getColumnDefs({ onEdit: handleEdit, onDelete: handleDelete }), [])

  const controlBarProps = useMemo(() => ({
    title: 'Contracts',
    actionButtons: (
      <GraviButton
        buttonText='New Contract'
        theme1
        icon={<PlusOutlined />}
        onClick={handleCreate}
      />
    ),
  }), [])

  return (
    <Vertical flex='1'>
      <GraviGrid
        rowData={data}
        columnDefs={columnDefs}
        agPropOverrides={{}}
        storageKey='contract-management-grid'
        controlBarProps={controlBarProps}
      />

      <ContractModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editRecord={editRecord}
        onSave={handleSave}
      />
    </Vertical>
  )
}
```

---

## Mock Data Files

Mock data should be realistic. Use energy industry terminology — commodity names, locations, contract terms, pricing, etc.

```tsx
// ContractManagement.data.ts
import { Contract } from './types'

export const initialContracts: Contract[] = [
  {
    id: '1',
    name: 'Gulf Coast Supply Agreement',
    type: 'Fixed Price',
    status: 'Active',
    counterparty: 'Valero Energy',
    commodity: 'ULSD',
    volume: 50000,
    unit: 'BBL',
    price: 2.45,
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    location: 'Houston, TX',
  },
  {
    id: '2',
    name: 'Northeast Heating Oil',
    type: 'Index',
    status: 'Active',
    counterparty: 'Sprague Resources',
    commodity: 'Heating Oil',
    volume: 25000,
    unit: 'GAL',
    price: 3.12,
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    location: 'Albany, NY',
  },
  {
    id: '3',
    name: 'Midwest Ethanol Blend',
    type: 'Formula',
    status: 'Pending',
    counterparty: 'Marathon Petroleum',
    commodity: 'E85',
    volume: 100000,
    unit: 'GAL',
    price: 2.89,
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    location: 'Chicago, IL',
  },
  // Add 10-20 records for a realistic grid. Vary statuses, types, and values.
]
```

### Mock Data Guidelines
- Use **realistic names** — real company names, real locations, real commodity types
- Include **variety** — mix of statuses, types, date ranges
- Use **realistic numbers** — fuel prices ($2-4/gal), volumes in thousands, dates within recent years
- Generate **10-20 records** minimum for grids to look populated
- Include an `id` field (string UUID or incrementing number) on every record

---

## Column Definition Files

Separate file keeps the page component clean. Accept handler functions as parameters.

```tsx
// ContractManagement.columnDefs.tsx
import { ColDef } from 'ag-grid-community'
import { BBDTag, Horizontal } from '@gravitate-js/excalibrr'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Contract } from './types'

interface ColumnDefHandlers {
  onEdit: (record: Contract) => void
  onDelete: (id: string) => void
}

export const getColumnDefs = ({ onEdit, onDelete }: ColumnDefHandlers): ColDef[] => [
  { field: 'name', headerName: 'Contract Name', flex: 1, sortable: true, filter: true },
  { field: 'counterparty', headerName: 'Counterparty', width: 180, sortable: true },
  { field: 'commodity', headerName: 'Commodity', width: 140 },
  { field: 'type', headerName: 'Type', width: 120 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    cellRenderer: (params) => {
      const s = params.value
      return <BBDTag success={s === 'Active'} warning={s === 'Pending'} error={s === 'Expired'}>{s}</BBDTag>
    },
  },
  {
    field: 'volume',
    headerName: 'Volume',
    width: 120,
    type: 'numericColumn',
    valueFormatter: (p) => p.value?.toLocaleString() ?? '',
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    type: 'numericColumn',
    valueFormatter: (p) => p.value != null ? `$${p.value.toFixed(2)}` : '',
  },
  {
    // Virtual column — no field
    headerName: 'Actions',
    width: 90,
    pinned: 'right',
    sortable: false,
    filter: false,
    cellRenderer: (params) => (
      <Horizontal gap={8} alignItems='center'>
        <EditOutlined onClick={() => onEdit(params.data)} style={{ cursor: 'pointer' }} />
        <DeleteOutlined onClick={() => onDelete(params.data.id)} style={{ cursor: 'pointer', color: '#dc2626' }} />
      </Horizontal>
    ),
  },
]
```

---

## Type Definitions

Keep types in a `types.ts` file.

```tsx
// types.ts
export interface Contract {
  id: string
  name: string
  type: 'Fixed Price' | 'Index' | 'Formula'
  status: 'Active' | 'Pending' | 'Expired'
  counterparty: string
  commodity: string
  volume: number
  unit: string
  price: number
  startDate: string
  endDate: string
  location: string
}
```

---

## Sub-Components

### Modal Component
See `form-patterns.md` — "Form in Modal" section.

### Detail Panel Component
See `layout-patterns.md` — "Detail Panels" section.

---

## State Management in Demos

Demos don't use APIs — all state is local.

### Simple: useState with Mock Data
```tsx
const [data, setData] = useState(initialMockData)
```

This is the default pattern. CRUD operations just manipulate the state array.

### Adding a Record
```tsx
const handleAdd = (newRecord) => {
  setData(prev => [...prev, { ...newRecord, id: crypto.randomUUID() }])
}
```

### Updating a Record
```tsx
const handleUpdate = (updated) => {
  setData(prev => prev.map(r => r.id === updated.id ? updated : r))
}
```

### Deleting a Record
```tsx
const handleDelete = (id) => {
  setData(prev => prev.filter(r => r.id !== id))
}
```

### Combined Create/Update (for modals)
```tsx
const handleSave = (record) => {
  setData(prev => {
    const exists = prev.find(r => r.id === record.id)
    if (exists) return prev.map(r => r.id === record.id ? record : r)
    return [...prev, { ...record, id: record.id ?? crypto.randomUUID() }]
  })
}
```

### Filter State
```tsx
const [filters, setFilters] = useState({ search: '', status: null })

const filteredData = useMemo(() => {
  return data.filter(row => {
    if (filters.search && !row.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.status && row.status !== filters.status) return false
    return true
  })
}, [data, filters])
```
