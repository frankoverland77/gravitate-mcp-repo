/**
 * scaffold_feature - Create complete feature folder structure
 * 
 * Generates:
 * - FeatureName/
 *   ├── api/
 *   │   ├── types.schema.ts
 *   │   └── useFeatureName.ts
 *   ├── FeatureNamePage.tsx
 *   └── components/
 *       └── FeatureNameColumnDefs.tsx
 */

import * as fs from 'fs'
import * as path from 'path'

interface ScaffoldFeatureArgs {
  name: string
  basePath?: string
  includeGrid?: boolean
  includeForm?: boolean
  fields?: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'date'
    required?: boolean
  }>
  endpoints?: {
    read?: string
    create?: string
    update?: string
    delete?: string
  }
}

export async function scaffoldFeatureTool(args: ScaffoldFeatureArgs) {
  const {
    name,
    basePath = '/Users/rebecca/repos/excalibrr-mcp-server/demo/src/pages/demos',
    includeGrid = true,
    includeForm = true,
    fields = [
      { name: 'Id', type: 'number', required: true },
      { name: 'Name', type: 'string', required: true },
      { name: 'Status', type: 'string', required: false },
      { name: 'CreatedAt', type: 'date', required: false },
    ],
    endpoints = {}
  } = args

  const featurePath = path.join(basePath, name)
  const apiPath = path.join(featurePath, 'api')
  const componentsPath = path.join(featurePath, 'components')

  // Derive names
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1)
  const camelName = name.charAt(0).toLowerCase() + name.slice(1)
  const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  const defaultEndpoints = {
    read: `api/${kebabName}/read`,
    create: `api/${kebabName}/create`,
    update: `api/${kebabName}/update`,
    delete: `api/${kebabName}/delete`,
    ...endpoints
  }

  const createdFiles: string[] = []

  try {
    // Create directories
    fs.mkdirSync(featurePath, { recursive: true })
    fs.mkdirSync(apiPath, { recursive: true })
    fs.mkdirSync(componentsPath, { recursive: true })

    // 1. Generate types.schema.ts
    const typesContent = generateTypesSchema(pascalName, fields)
    fs.writeFileSync(path.join(apiPath, 'types.schema.ts'), typesContent)
    createdFiles.push(`${name}/api/types.schema.ts`)

    // 2. Generate useFeatureName.ts
    const hookContent = generateApiHook(pascalName, camelName, defaultEndpoints)
    fs.writeFileSync(path.join(apiPath, `use${pascalName}.ts`), hookContent)
    createdFiles.push(`${name}/api/use${pascalName}.ts`)

    // 3. Generate FeatureNamePage.tsx
    const pageContent = generatePageComponent(pascalName, camelName, includeGrid, includeForm)
    fs.writeFileSync(path.join(featurePath, `${pascalName}Page.tsx`), pageContent)
    createdFiles.push(`${name}/${pascalName}Page.tsx`)

    // 4. Generate ColumnDefs if grid included
    if (includeGrid) {
      const columnDefsContent = generateColumnDefs(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}ColumnDefs.tsx`), columnDefsContent)
      createdFiles.push(`${name}/components/${pascalName}ColumnDefs.tsx`)
    }

    // 5. Generate FormModal if form included
    if (includeForm) {
      const formContent = generateFormModal(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}FormModal.tsx`), formContent)
      createdFiles.push(`${name}/components/${pascalName}FormModal.tsx`)
    }

    const result = `# Feature Scaffolded: ${pascalName}

## Created Files
${createdFiles.map(f => `- \`${f}\``).join('\n')}

## Next Steps

### 1. Add to pageConfig.tsx
\`\`\`tsx
import { ${pascalName}Page } from './demos/${name}/${pascalName}Page'

// In createPageConfig:
{
  hasPermission: (scopes) => scopes?.Admin?.${pascalName},
  key: '${pascalName}',
  title: '${pascalName.replace(/([A-Z])/g, ' $1').trim()}',
  element: <${pascalName}Page />,
}
\`\`\`

### 2. Add to AuthenticatedRoute.jsx scopes
\`\`\`javascript
const scopes = {
  // ...existing scopes
  ${pascalName}: true,
}
\`\`\`

### 3. Update API endpoints in use${pascalName}.ts
Current endpoints:
- read: \`${defaultEndpoints.read}\`
- create: \`${defaultEndpoints.create}\`
- update: \`${defaultEndpoints.update}\`
- delete: \`${defaultEndpoints.delete}\`

### 4. Run the dev server
\`\`\`bash
cd demo && npm run dev
\`\`\`

## Feature Structure
\`\`\`
${name}/
├── api/
│   ├── types.schema.ts
│   └── use${pascalName}.ts
├── ${pascalName}Page.tsx
└── components/
    ${includeGrid ? `├── ${pascalName}ColumnDefs.tsx\n    ` : ''}${includeForm ? `└── ${pascalName}FormModal.tsx` : ''}
\`\`\`
`

    return {
      content: [{ type: 'text', text: result }],
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error scaffolding feature: ${error}` }],
      isError: true,
    }
  }
}

function generateTypesSchema(name: string, fields: ScaffoldFeatureArgs['fields']): string {
  const fieldDefs = fields!.map(f => {
    const tsType = f.type === 'date' ? 'string' : f.type
    return `  ${f.name}${f.required ? '' : '?'}: ${tsType}`
  }).join('\n')

  return `import { APIResponse } from '@api/globalTypes'

export interface ${name}Data {
${fieldDefs}
}

export interface ${name}Response {
  TotalRecords: number
  Data: ${name}Data[]
}

export interface ${name}Filters {
  page?: number
  pageSize?: number
  search?: string
}

export interface ${name}CreateRequest {
${fields!.filter(f => f.name !== 'Id' && f.name !== 'CreatedAt').map(f => {
  const tsType = f.type === 'date' ? 'string' : f.type
  return `  ${f.name}${f.required ? '' : '?'}: ${tsType}`
}).join('\n')}
}

export interface ${name}UpdateRequest extends ${name}CreateRequest {
  Id: number
}

export type ${name}APIResponse = APIResponse<${name}Response>
`
}

function generateApiHook(pascalName: string, camelName: string, endpoints: Record<string, string>): string {
  return `import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import {
  ${pascalName}APIResponse,
  ${pascalName}Filters,
  ${pascalName}CreateRequest,
  ${pascalName}UpdateRequest,
} from './types.schema'

const endpoints = {
  read: '${endpoints.read}',
  create: '${endpoints.create}',
  update: '${endpoints.update}',
  delete: '${endpoints.delete}',
} as const

export function use${pascalName}() {
  const api = useApi()
  const queryClient = useQueryClient()

  const get${pascalName}Data = (filters: ${pascalName}Filters) =>
    useQuery(
      [endpoints.read, filters],
      () => api.post(endpoints.read, filters),
      { enabled: true }
    ) as UseQueryResult<${pascalName}APIResponse, Error>

  const useCreateMutation = () =>
    useMutation(
      (request: ${pascalName}CreateRequest) => api.post(endpoints.create, request),
      {
        onSuccess: () => {
          NotificationMessage('Success.', 'Created successfully', false)
          queryClient.invalidateQueries([endpoints.read])
        },
        onError: () => {
          NotificationMessage('Error.', 'Failed to create', true)
        },
      }
    )

  const useUpdateMutation = () =>
    useMutation(
      (request: ${pascalName}UpdateRequest) => api.post(endpoints.update, request),
      {
        onSuccess: () => {
          NotificationMessage('Success.', 'Updated successfully', false)
          queryClient.invalidateQueries([endpoints.read])
        },
        onError: () => {
          NotificationMessage('Error.', 'Failed to update', true)
        },
      }
    )

  const useDeleteMutation = () =>
    useMutation(
      (request: { Id: number }) => api.post(endpoints.delete, request),
      {
        onSuccess: () => {
          NotificationMessage('Success.', 'Deleted successfully', false)
          queryClient.invalidateQueries([endpoints.read])
        },
        onError: () => {
          NotificationMessage('Error.', 'Failed to delete', true)
        },
      }
    )

  return {
    get${pascalName}Data,
    useCreateMutation,
    useUpdateMutation,
    useDeleteMutation,
  }
}
`
}

function generatePageComponent(pascalName: string, camelName: string, includeGrid: boolean, includeForm: boolean): string {
  return `import React, { useMemo, useRef, useState } from 'react'
import { GridApi } from 'ag-grid-community'
import { Modal } from 'antd'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'

import { use${pascalName} } from './api/use${pascalName}'
import { ${pascalName}Data } from './api/types.schema'
${includeGrid ? `import { ${pascalName}ColumnDefs } from './components/${pascalName}ColumnDefs'` : ''}
${includeForm ? `import { ${pascalName}FormModal } from './components/${pascalName}FormModal'` : ''}

export function ${pascalName}Page() {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const [filters, setFilters] = useState({})
  ${includeForm ? `const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<${pascalName}Data | undefined>(undefined)` : ''}

  const { get${pascalName}Data, useDeleteMutation${includeForm ? ', useCreateMutation, useUpdateMutation' : ''} } = use${pascalName}()
  const { data: ${camelName}Data, isLoading } = get${pascalName}Data(filters)
  const deleteMutation = useDeleteMutation()
  ${includeForm ? `const createMutation = useCreateMutation()
  const updateMutation = useUpdateMutation()` : ''}

  const data = ${camelName}Data?.Data?.Data || []

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?',
      onOk: () => deleteMutation.mutate({ Id: id }),
    })
  }

  ${includeForm ? `const handleEdit = (item: ${pascalName}Data) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(undefined)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ ...values, Id: editingItem.Id })
    } else {
      await createMutation.mutateAsync(values)
    }
    setIsModalOpen(false)
  }` : ''}

  const columnDefs = useMemo(
    () => ${pascalName}ColumnDefs({
      onDelete: handleDelete,
      ${includeForm ? 'onEdit: handleEdit,' : ''}
    }),
    [deleteMutation${includeForm ? ', editingItem' : ''}]
  )

  const controlBarProps = useMemo(
    () => ({
      title: '${pascalName.replace(/([A-Z])/g, ' $1').trim()}',
      actionButtons: (
        <Horizontal>
          <GraviButton
            buttonText='Create New'
            theme1
            icon={<PlusOutlined />}
            onClick={${includeForm ? 'handleCreate' : '() => {}'}}
          />
        </Horizontal>
      ),
    }),
    []
  )

  return (
    <Vertical flex='1'>
      <GraviGrid
        externalRef={gridAPIRef}
        controlBarProps={controlBarProps}
        columnDefs={columnDefs}
        rowData={data}
        storageKey='${pascalName}Grid'
        loading={isLoading}
        agPropOverrides={{}}
        sideBar={false}
      />
      ${includeForm ? `
      <${pascalName}FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingItem}
        isSubmitting={createMutation.isLoading || updateMutation.isLoading}
      />` : ''}
    </Vertical>
  )
}
`
}

function generateColumnDefs(pascalName: string, fields: ScaffoldFeatureArgs['fields']): string {
  const columnDefs = fields!.map(f => {
    if (f.name === 'Id') {
      return `    {
      headerName: 'ID',
      field: 'Id',
      sortable: true,
      filter: 'agNumberColumnFilter',
      minWidth: 80,
      maxWidth: 100,
    }`
    }
    
    if (f.type === 'date' || f.name.toLowerCase().includes('date') || f.name.toLowerCase().includes('at')) {
      return `    {
      headerName: '${f.name.replace(/([A-Z])/g, ' $1').trim()}',
      field: '${f.name}',
      sortable: true,
      filter: 'agDateColumnFilter',
      minWidth: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
    }`
    }
    
    if (f.type === 'number') {
      return `    {
      headerName: '${f.name.replace(/([A-Z])/g, ' $1').trim()}',
      field: '${f.name}',
      sortable: true,
      filter: 'agNumberColumnFilter',
      minWidth: 120,
    }`
    }
    
    if (f.name.toLowerCase() === 'status') {
      return `    {
      headerName: 'Status',
      field: 'Status',
      sortable: true,
      filter: true,
      minWidth: 120,
      cellRenderer: (params: { value: string }) => {
        const appearance = params.value === 'Active' ? 'success'
          : params.value === 'Inactive' ? 'error'
          : 'primary'
        return <Texto category='p2' appearance={appearance}>{params.value}</Texto>
      },
    }`
    }
    
    return `    {
      headerName: '${f.name.replace(/([A-Z])/g, ' $1').trim()}',
      field: '${f.name}',
      sortable: true,
      filter: true,
      minWidth: 150,
    }`
  }).join(',\n')

  return `import { ColDef } from 'ag-grid-community'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ${pascalName}Data } from '../api/types.schema'

interface ColumnDefsProps {
  onDelete: (id: number) => void
  onEdit?: (data: ${pascalName}Data) => void
}

export function ${pascalName}ColumnDefs({ onDelete, onEdit }: ColumnDefsProps): ColDef[] {
  return [
${columnDefs},
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      minWidth: 100,
      maxWidth: 120,
      cellRenderer: (params: { data: ${pascalName}Data }) => (
        <Horizontal gap={8}>
          {onEdit && (
            <GraviButton
              type='text'
              size='small'
              icon={<EditOutlined />}
              onClick={() => onEdit(params.data)}
            />
          )}
          <GraviButton
            type='text'
            size='small'
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(params.data.Id)}
          />
        </Horizontal>
      ),
    },
  ]
}
`
}

function generateFormModal(pascalName: string, fields: ScaffoldFeatureArgs['fields']): string {
  const formFields = fields!
    .filter(f => f.name !== 'Id' && f.name !== 'CreatedAt')
    .map(f => {
      const label = f.name.replace(/([A-Z])/g, ' $1').trim()
      
      if (f.name.toLowerCase() === 'status') {
        return `        <Form.Item name='${f.name}' label='${label}'${f.required ? " rules={[{ required: true, message: '${label} is required' }]}" : ''}>
          <Select placeholder='Select ${label.toLowerCase()}' options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
        </Form.Item>`
      }
      
      if (f.type === 'number') {
        return `        <Form.Item name='${f.name}' label='${label}'${f.required ? " rules={[{ required: true, message: '${label} is required' }]}" : ''}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>`
      }
      
      if (f.type === 'boolean') {
        return `        <Form.Item name='${f.name}' label='${label}' valuePropName='checked'>
          <Switch />
        </Form.Item>`
      }
      
      if (f.type === 'date') {
        return `        <Form.Item name='${f.name}' label='${label}'${f.required ? " rules={[{ required: true, message: '${label} is required' }]}" : ''}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>`
      }
      
      return `        <Form.Item name='${f.name}' label='${label}'${f.required ? ` rules={[{ required: true, message: '${label} is required' }]}` : ''}>
          <Input placeholder='Enter ${label.toLowerCase()}' />
        </Form.Item>`
    }).join('\n\n')

  return `import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Select, Switch, DatePicker, Modal } from 'antd'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { ${pascalName}Data } from '../api/types.schema'

interface ${pascalName}FormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  initialValues?: ${pascalName}Data
  isSubmitting?: boolean
}

export function ${pascalName}FormModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting = false,
}: ${pascalName}FormModalProps) {
  const [form] = Form.useForm()
  const isEdit = !!initialValues?.Id

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues)
      } else {
        form.resetFields()
      }
    }
  }, [open, initialValues, form])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit ${pascalName.replace(/([A-Z])/g, ' $1').trim()}' : 'Create ${pascalName.replace(/([A-Z])/g, ' $1').trim()}'}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={500}
    >
      <Form form={form} layout='vertical'>
${formFields}

        <Horizontal justifyContent='flex-end' gap={12} style={{ marginTop: '24px' }}>
          <GraviButton buttonText='Cancel' onClick={handleCancel} />
          <GraviButton
            buttonText={isEdit ? 'Update' : 'Create'}
            theme1
            loading={isSubmitting}
            onClick={handleSubmit}
          />
        </Horizontal>
      </Form>
    </Modal>
  )
}
`
}
