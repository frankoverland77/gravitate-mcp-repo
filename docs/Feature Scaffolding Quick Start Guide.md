# Feature Scaffolding Quick Start Guide

> **Streamlined process for building new features efficiently**

## **🚀 30-Minute Feature Implementation**

### **Step 1: Developer Consultation (5 min)**

**Questions to ask:**

```
1. Where should this feature be placed?
   - Admin features → src/modules/Admin/FeatureName/
   - Business features → src/modules/FeatureName/

2. What should the navigation title be?
   - Get exact wording for pageConfig

3. What user role will access this feature?
   - Determines permission scope
```

### **Step 2: Examine Reference Pattern (2 min)**

**Reference Implementation:** `src/modules/CommandCenter/`

```
CommandCenter/
├── api/                      # ✅ API inside feature folder
│   ├── types.schema.ts      # ✅ .schema.ts suffix
│   └── useCommandCenter.ts  # ✅ Matches folder name
├── CommandCenterPage.tsx    # ✅ Matches export function
└── components/              # ✅ All components here
```

---

## **⚡ Implementation Templates**

### **File Structure Template**

```
src/modules/Admin/FeatureName/
├── api/
│   ├── types.schema.ts
│   └── useFeatureName.ts
├── FeatureNamePage.tsx
└── components/
    └── FeatureNameColumnDefs.tsx
```

### **1. types.schema.ts**

```typescript
import { APIResponse } from '@api/globalTypes'

export interface FeatureData {
  Id: number
  Name: string
  // Add fields from backend spec
}

export interface FeatureResponse {
  TotalRecords: number
  Data: FeatureData[]
}

export interface FeatureMetadata {
  // Metadata from backend
}

export interface FeatureFilters {
  // Filter parameters
}

export type FeatureAPIResponse = APIResponse<FeatureResponse>
export type FeatureMetadataAPIResponse = APIResponse<FeatureMetadata>
```

### **2. useFeatureName.ts**

```typescript
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'

import { FeatureAPIResponse, FeatureMetadataAPIResponse, FeatureFilters } from './types.schema'

const endpoints = {
  metadata: 'api/controller/metadata',
  read: 'api/controller/read',
  create: 'api/controller/create',
  update: 'api/controller/update',
  delete: 'api/controller/delete',
} as const

export function useFeatureName() {
  const api = useApi()
  const queryClient = useQueryClient()

  const getMetadata = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata, {})) as UseQueryResult<
      FeatureMetadataAPIResponse,
      Error
    >

  const getFeatureData = (filters: FeatureFilters) =>
    useQuery([endpoints.read, filters], () => api.post(endpoints.read, filters), {
      enabled: !!filters,
    }) as UseQueryResult<FeatureAPIResponse, Error>

  const useCreateMutation = () =>
    useMutation((request: any) => api.post(endpoints.create, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Created successfully', false)
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to create', true)
      },
    })

  const useDeleteMutation = () =>
    useMutation((request: any) => api.post(endpoints.delete, request), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Deleted successfully', false)
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => {
        NotificationMessage('Error.', 'Failed to delete', true)
      },
    })

  return {
    getMetadata,
    getFeatureData,
    useCreateMutation,
    useDeleteMutation,
  }
}
```

### **3. FeatureNameColumnDefs.tsx**

```typescript
import { GraviButton } from '@gravitate-js/excalibrr'
import { DeleteOutlined } from '@ant-design/icons'
import { ColDef } from 'ag-grid-community'
import { FeatureData } from '../api/types.schema'

interface ColumnDefsProps {
  onDelete: (id: number) => void
}

export function FeatureNameColumnDefs({ onDelete }: ColumnDefsProps): ColDef[] {
  return [
    {
      headerName: 'Name',
      field: 'Name',
      sortable: true,
      filter: true,
      minWidth: 200,
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params: { data: FeatureData }) => {
        return (
          <GraviButton
            type='text'
            size='small'
            icon={<DeleteOutlined />}
            onClick={() => onDelete(params.data.Id)}
            danger
          />
        )
      },
      minWidth: 100,
      sortable: false,
      filter: false,
    },
  ]
}
```

### **4. FeatureNamePage.tsx**

```typescript
import { useFeatureName } from './api/useFeatureName'
import { FeatureData } from './api/types.schema'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { GridApi } from 'ag-grid-community'
import React, { useMemo, useRef, useState } from 'react'

import { FeatureNameColumnDefs } from './components/FeatureNameColumnDefs'

export function FeatureNamePage() {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const [filters, setFilters] = useState({})

  const { getMetadata, getFeatureData, useDeleteMutation } = useFeatureName()

  const { data: metadata } = getMetadata()
  const { data: featureData, isLoading } = getFeatureData(filters)
  const deleteMutation = useDeleteMutation()

  const data = featureData?.Data?.Data || []

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?',
      onOk: () => deleteMutation.mutate({ id }),
    })
  }

  const columnDefs = useMemo(() => FeatureNameColumnDefs({ onDelete: handleDelete }), [deleteMutation])

  const controlBarProps = useMemo(
    () => ({
      title: 'Feature Title',
      actionButtons: (
        <Horizontal>
          <GraviButton
            buttonText='Create New'
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => {
              /* handle create */
            }}
          />
        </Horizontal>
      ),
      hideActiveFilters: false,
    }),
    []
  )

  return (
    <Vertical>
      <Vertical flex='1'>
        <GraviGrid
          externalRef={gridAPIRef}
          controlBarProps={controlBarProps}
          columnDefs={columnDefs}
          rowData={data}
          storageKey='FeatureStorageKey'
          loading={isLoading}
          agPropOverrides={{}}
        />
      </Vertical>
    </Vertical>
  )
}
```

---

## **Step 3: Update pageConfig.tsx (3 min)**

### **Add Import**

```typescript
import { FeatureNamePage } from './Admin/FeatureName/FeatureNamePage'
```

### **Add Route (find appropriate Admin section)**

```typescript
{
  hasPermission: (scopes) => scopes?.Admin?.SectionName,
  key: 'FeatureKey',
  title: 'Navigation Title', // From developer
  element: <FeatureNamePage />,
},
```

---

## **Step 4: Fix Linter Errors (5 min)**

### **Common Fixes**

```bash
# Sort imports
npx eslint --fix src/modules/pageConfig.tsx
```

### **Required Props**

```typescript
// ✅ Always include
<GraviGrid agPropOverrides={{}} />

// ✅ Use visible, not open
<Modal visible={isOpen} />

// ✅ Remove gap prop
<Horizontal> {/* no gap prop */}
```

---

## **⚠️ Critical Patterns**

### **✅ DO:**

- API folder **inside** feature folder
- Use `.schema.ts` suffix for types
- Page component name matches exported function
- Column defs in `components/` folder
- Include success/error notifications
- Add `agPropOverrides={{}}` to GraviGrid

### **❌ DON'T:**

- Put API in global `src/api/` folder
- Create separate grid folders
- Add styles.css initially
- Use `gap` prop on Horizontal
- Use `open` prop on Modal
- Forget linter fixes

---

## **🎯 Verification Checklist**

- [ ] Feature folder structure matches template
- [ ] All imports use relative paths within feature
- [ ] Page component export matches filename
- [ ] pageConfig updated with import + route
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Navigation works in browser
- [ ] Grid renders without crashes

**Total Time: ~30 minutes for complete feature scaffold**

---

## **📋 Backend Integration**

### **Endpoint Mapping**

```typescript
// Update endpoints to match backend routes
const endpoints = {
  metadata: 'BackendController/GetMetadata',
  read: 'BackendController/Read',
  create: 'BackendController/Create',
  update: 'BackendController/Update',
  delete: 'BackendController/Delete',
}
```

### **Type Alignment**

```typescript
// Match backend DTO structure exactly
export interface FeatureData {
  // Copy field names and types from backend DTOs
}
```

**This guide ensures rapid, consistent feature development following exact codebase patterns.**
