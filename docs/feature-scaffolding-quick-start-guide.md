# Feature Scaffolding Quick Start Guide

> **Streamlined process for building new features efficiently**

## **🚀 30-Minute Feature Implementation**

### **Step 1: Developer Consultation (5 min)**

**Questions to ask:**

```
1. Where should this feature be placed?
   - Admin features → modules/Admin/{FeatureName}/
   - Business features → modules/{Category}/{FeatureName}/

2. What should the navigation title be?
   - Get exact wording for pageConfig

3. What user role will access this feature?
   - Determines permission scope
```

### **Step 2: Reference the Folder Structure (2 min)**

**See:** `The Anatomy Of A Feature.md` for full details.

```
modules/{Category}/{FeatureName}/
├── api/
│   ├── use{FeatureName}.ts       # API hooks
│   └── types.schema.ts           # Types & schemas
├── components/
│   └── Grid/
│       ├── ActionButtons.tsx     # Control bar actions
│       ├── Columns/
│       │   └── columnDefs.tsx    # Column definitions
│       ├── GridEvents.ts         # Event handlers
│       └── {FeatureName}Grid.tsx # Grid component
├── styles.css                    # Feature styles
├── {FeatureName}Page.tsx         # Main page component
└── utils/
    ├── Constants.ts              # Constants & config
    └── Utils.ts                  # Utility functions
```

---

## **⚡ Implementation Templates**

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

### **2. use{FeatureName}.ts**

```typescript
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { notification } from 'antd'

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
        notification.success({ message: 'Success', description: 'Created successfully' })
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => {
        notification.error({ message: 'Error', description: 'Failed to create' })
      },
    })

  const useDeleteMutation = () =>
    useMutation((request: any) => api.post(endpoints.delete, request), {
      onSuccess: () => {
        notification.success({ message: 'Success', description: 'Deleted successfully' })
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => {
        notification.error({ message: 'Error', description: 'Failed to delete' })
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

### **3. components/Grid/Columns/columnDefs.tsx**

```typescript
import { GraviButton } from '@gravitate-js/excalibrr'
import { DeleteOutlined } from '@ant-design/icons'
import { ColDef } from 'ag-grid-community'

import { FeatureData } from '../../../api/types.schema'

interface ColumnDefsProps {
  onDelete: (id: number) => void
}

export function getColumnDefs({ onDelete }: ColumnDefsProps): ColDef[] {
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
            icon={<DeleteOutlined />}
            onClick={() => onDelete(params.data.Id)}
            error
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

### **4. components/Grid/ActionButtons.tsx**

```typescript
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'

interface ActionButtonsProps {
  onCreate: () => void
}

export function ActionButtons({ onCreate }: ActionButtonsProps) {
  return (
    <Horizontal>
      <GraviButton
        buttonText='Create New'
        icon={<PlusOutlined />}
        onClick={onCreate}
        success
      />
    </Horizontal>
  )
}
```

### **5. components/Grid/{FeatureName}Grid.tsx**

```typescript
import { GraviGrid } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { useMemo, useRef } from 'react'

import { FeatureData } from '../../api/types.schema'
import { ActionButtons } from './ActionButtons'
import { getColumnDefs } from './Columns/columnDefs'

interface FeatureGridProps {
  data: FeatureData[]
  isLoading: boolean
  onDelete: (id: number) => void
  onCreate: () => void
}

export function FeatureNameGrid({ data, isLoading, onDelete, onCreate }: FeatureGridProps) {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>

  const columnDefs = useMemo(() => getColumnDefs({ onDelete }), [onDelete])

  const controlBarProps = useMemo(
    () => ({
      title: 'Feature Title',
      actionButtons: <ActionButtons onCreate={onCreate} />,
      hideActiveFilters: false,
    }),
    [onCreate]
  )

  return (
    <GraviGrid
      externalRef={gridAPIRef}
      controlBarProps={controlBarProps}
      columnDefs={columnDefs}
      rowData={data}
      storageKey='FeatureStorageKey'
      loading={isLoading}
      agPropOverrides={{}}
    />
  )
}
```

### **6. {FeatureName}Page.tsx**

```typescript
import { Vertical } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import { useState } from 'react'

import { useFeatureName } from './api/useFeatureName'
import { FeatureNameGrid } from './components/Grid/FeatureNameGrid'

export function FeatureNamePage() {
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

  const handleCreate = () => {
    // Open create modal or navigate
  }

  return (
    <Vertical>
      <Vertical flex='1'>
        <FeatureNameGrid
          data={data}
          isLoading={isLoading}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </Vertical>
    </Vertical>
  )
}
```

### **7. utils/Constants.ts**

```typescript
export const FEATURE_CONSTANTS = {
  STORAGE_KEY: 'FeatureStorageKey',
  DEFAULT_PAGE_SIZE: 50,
} as const
```

### **8. utils/Utils.ts**

```typescript
import { FeatureData } from '../api/types.schema'

export function formatFeatureData(data: FeatureData): string {
  return data.Name
}
```

### **9. styles.css**

```css
/* Feature-specific styles */
```

---

## **Step 3: Update pageConfig.tsx (3 min)**

### **Add Import**

```typescript
import { FeatureNamePage } from './{Category}/{FeatureName}/{FeatureName}Page'
```

### **Add Route (find appropriate section)**

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
```

---

## **⚠️ Critical Patterns**

### **✅ DO:**

- API folder **inside** feature folder
- Use `.schema.ts` suffix for types
- Page component name matches exported function
- Column defs in `components/Grid/Columns/columnDefs.tsx`
- Grid component in `components/Grid/{FeatureName}Grid.tsx`
- Action buttons in `components/Grid/ActionButtons.tsx`
- Use `notification.success()` / `notification.error()` from antd
- Use GraviButton theme props: `success`, `error`, `theme2`
- Add `agPropOverrides={{}}` to GraviGrid
- Include `styles.css` and `utils/` folder

### **❌ DON'T:**

- Put API in global `src/api/` folder
- Put column defs flat in `components/`
- Use deprecated `NotificationMessage`
- Use `type='primary'` or `danger` on GraviButton
- Use `open` prop on Modal (use `visible`)
- Forget linter fixes

---

## **🎯 Verification Checklist**

- [ ] Feature folder structure matches template
- [ ] Grid structure: `components/Grid/Columns/columnDefs.tsx`
- [ ] All imports use relative paths within feature
- [ ] Page component export matches filename
- [ ] pageConfig updated with import + route
- [ ] Using `notification` from antd (not NotificationMessage)
- [ ] Using GraviButton theme props (success/error/theme2)
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
