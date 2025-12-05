/**
 * feature_builder_wizard - Guided multi-step feature creation
 * 
 * Interactive workflow that:
 * 1. Gathers feature requirements
 * 2. Suggests field types and structure
 * 3. Generates scaffolding
 * 4. Sets up navigation
 * 5. Creates API stubs
 */

import * as fs from 'fs'
import * as path from 'path'

interface FeatureBuilderArgs {
  // Step control
  step?: 'start' | 'fields' | 'options' | 'generate' | 'complete'
  
  // Feature basics
  name?: string
  description?: string
  
  // Fields (for step 2+)
  fields?: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'date' | 'select'
    required?: boolean
    options?: string[] // for select type
  }>
  
  // Options (for step 3+)
  includeGrid?: boolean
  includeForm?: boolean
  includeDetailPanel?: boolean
  includeFilters?: boolean
  
  // API config
  apiPrefix?: string
  
  // State from previous steps (for multi-turn)
  wizardState?: WizardState
}

interface WizardState {
  name: string
  description: string
  fields: FeatureBuilderArgs['fields']
  options: {
    includeGrid: boolean
    includeForm: boolean
    includeDetailPanel: boolean
    includeFilters: boolean
    apiPrefix: string
  }
  currentStep: number
}

export async function featureBuilderWizard(args: FeatureBuilderArgs) {
  const { step = 'start', wizardState } = args

  try {
    switch (step) {
      case 'start':
        return startWizard(args)
      case 'fields':
        return configureFields(args)
      case 'options':
        return configureOptions(args)
      case 'generate':
        return generateFeature(args)
      case 'complete':
        return completeWizard(args)
      default:
        return startWizard(args)
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error in feature builder: ${error}` }],
      isError: true,
    }
  }
}

function startWizard(args: FeatureBuilderArgs) {
  const { name, description } = args

  if (!name) {
    return {
      content: [{
        type: 'text',
        text: `# 🧙 Feature Builder Wizard

Welcome! Let's create a new feature step by step.

## Step 1: Basic Information

Please provide:
- **name**: Feature name in PascalCase (e.g., "ProductManagement", "UserList")
- **description**: Brief description of what this feature does

Example:
\`\`\`json
{
  "step": "start",
  "name": "ProductManagement",
  "description": "Manage product catalog with CRUD operations"
}
\`\`\`

Or just tell me naturally: "Create a feature called ProductManagement for managing products"`
      }],
    }
  }

  // Name provided, move to fields step
  const state: WizardState = {
    name,
    description: description || `${name} feature`,
    fields: [],
    options: {
      includeGrid: true,
      includeForm: true,
      includeDetailPanel: false,
      includeFilters: false,
      apiPrefix: `api/${name.toLowerCase()}`,
    },
    currentStep: 1,
  }

  // Suggest common fields based on name
  const suggestedFields = suggestFields(name)

  return {
    content: [{
      type: 'text',
      text: `# 🧙 Feature Builder - Step 2: Define Fields

**Feature:** ${name}
**Description:** ${state.description}

## Suggested Fields

Based on your feature name, here are suggested fields:

${suggestedFields.map(f => `- \`${f.name}\`: ${f.type}${f.required ? ' (required)' : ''}`).join('\n')}

## Step 2: Configure Fields

Provide your field definitions, or use the suggestions above:

\`\`\`json
{
  "step": "fields",
  "name": "${name}",
  "fields": [
    { "name": "Id", "type": "number", "required": true },
    { "name": "Name", "type": "string", "required": true },
    { "name": "Status", "type": "select", "options": ["Active", "Inactive"] },
    { "name": "CreatedAt", "type": "date" }
  ]
}
\`\`\`

### Available Field Types
- \`string\` - Text input
- \`number\` - Numeric input
- \`boolean\` - Switch/toggle
- \`date\` - Date picker
- \`select\` - Dropdown (include \`options\` array)

**Tip:** Just say "use the suggested fields" to accept the defaults.`
    }],
  }
}

function suggestFields(name: string): Array<{ name: string; type: string; required: boolean }> {
  const baseName = name.replace(/Management|List|Grid|Page$/i, '')
  
  // Always include these
  const fields = [
    { name: 'Id', type: 'number', required: true },
    { name: 'Name', type: 'string', required: true },
  ]

  // Add contextual fields based on name patterns
  if (/product|item|inventory/i.test(name)) {
    fields.push(
      { name: 'SKU', type: 'string', required: false },
      { name: 'Price', type: 'number', required: false },
      { name: 'Quantity', type: 'number', required: false },
    )
  }

  if (/user|employee|staff|person/i.test(name)) {
    fields.push(
      { name: 'Email', type: 'string', required: true },
      { name: 'Role', type: 'string', required: false },
    )
  }

  if (/order|transaction/i.test(name)) {
    fields.push(
      { name: 'Total', type: 'number', required: false },
      { name: 'OrderDate', type: 'date', required: false },
    )
  }

  // Always end with status and dates
  fields.push(
    { name: 'Status', type: 'select', required: false },
    { name: 'CreatedAt', type: 'date', required: false },
  )

  return fields
}

function configureFields(args: FeatureBuilderArgs) {
  const { name, fields } = args

  if (!name) {
    return startWizard(args)
  }

  if (!fields || fields.length === 0) {
    // Use suggested fields
    const suggested = suggestFields(name)
    return configureOptions({ ...args, fields: suggested as any })
  }

  return configureOptions(args)
}

function configureOptions(args: FeatureBuilderArgs) {
  const { name, fields = [], description } = args

  const fieldSummary = fields.map(f => 
    `- \`${f.name}\`: ${f.type}${f.required ? ' ✓' : ''}${f.options ? ` [${f.options.join(', ')}]` : ''}`
  ).join('\n')

  return {
    content: [{
      type: 'text',
      text: `# 🧙 Feature Builder - Step 3: Options

**Feature:** ${name}
**Description:** ${description || `${name} feature`}

## Fields Configured
${fieldSummary}

## Step 3: Feature Options

What components should be included?

\`\`\`json
{
  "step": "generate",
  "name": "${name}",
  "fields": ${JSON.stringify(fields, null, 2)},
  "includeGrid": true,
  "includeForm": true,
  "includeDetailPanel": false,
  "includeFilters": false,
  "apiPrefix": "api/${name?.toLowerCase() ?? 'feature'}"
}
\`\`\`

### Options Explained
- **includeGrid**: Data table with sorting/filtering (default: true)
- **includeForm**: Modal form for create/edit (default: true)
- **includeDetailPanel**: Side panel for viewing details (default: false)
- **includeFilters**: Filter bar above grid (default: false)
- **apiPrefix**: Base path for API endpoints

**Tip:** Say "generate with defaults" to use standard options, or specify what you want.`
    }],
  }
}

function generateFeature(args: FeatureBuilderArgs) {
  const {
    name,
    description,
    fields = [],
    includeGrid = true,
    includeForm = true,
    includeDetailPanel = false,
    includeFilters = false,
    apiPrefix,
  } = args

  if (!name) {
    return startWizard(args)
  }

  const basePath = '/Users/rebecca/repos/excalibrr-mcp-server/demo/src/pages/demos'
  const featurePath = path.join(basePath, name)
  const apiPath = path.join(featurePath, 'api')
  const componentsPath = path.join(featurePath, 'components')

  const pascalName = name
  const camelName = name.charAt(0).toLowerCase() + name.slice(1)
  const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  const endpoints = {
    read: apiPrefix ? `${apiPrefix}/read` : `api/${kebabName}/read`,
    create: apiPrefix ? `${apiPrefix}/create` : `api/${kebabName}/create`,
    update: apiPrefix ? `${apiPrefix}/update` : `api/${kebabName}/update`,
    delete: apiPrefix ? `${apiPrefix}/delete` : `api/${kebabName}/delete`,
  }

  const createdFiles: string[] = []

  try {
    // Create directories
    fs.mkdirSync(featurePath, { recursive: true })
    fs.mkdirSync(apiPath, { recursive: true })
    fs.mkdirSync(componentsPath, { recursive: true })

    // Generate types
    const typesContent = generateTypes(pascalName, fields)
    fs.writeFileSync(path.join(apiPath, 'types.schema.ts'), typesContent)
    createdFiles.push('types.schema.ts')

    // Generate API hook
    const hookContent = generateHook(pascalName, endpoints)
    fs.writeFileSync(path.join(apiPath, `use${pascalName}.ts`), hookContent)
    createdFiles.push(`use${pascalName}.ts`)

    // Generate page
    const pageContent = generatePage(pascalName, camelName, {
      includeGrid,
      includeForm,
      includeDetailPanel,
      includeFilters,
    })
    fs.writeFileSync(path.join(featurePath, `${pascalName}Page.tsx`), pageContent)
    createdFiles.push(`${pascalName}Page.tsx`)

    // Generate column defs
    if (includeGrid) {
      const colDefsContent = generateColDefs(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}ColumnDefs.tsx`), colDefsContent)
      createdFiles.push(`${pascalName}ColumnDefs.tsx`)
    }

    // Generate form modal
    if (includeForm) {
      const formContent = generateForm(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}FormModal.tsx`), formContent)
      createdFiles.push(`${pascalName}FormModal.tsx`)
    }

    // Generate detail panel
    if (includeDetailPanel) {
      const detailContent = generateDetailPanel(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}DetailPanel.tsx`), detailContent)
      createdFiles.push(`${pascalName}DetailPanel.tsx`)
    }

    // Generate filter bar
    if (includeFilters) {
      const filterContent = generateFilterBar(pascalName, fields)
      fs.writeFileSync(path.join(componentsPath, `${pascalName}FilterBar.tsx`), filterContent)
      createdFiles.push(`${pascalName}FilterBar.tsx`)
    }

    return {
      content: [{
        type: 'text',
        text: `# 🎉 Feature Generated: ${pascalName}

## Files Created

\`\`\`
${name}/
├── api/
│   ├── types.schema.ts
│   └── use${pascalName}.ts
├── ${pascalName}Page.tsx
└── components/
${createdFiles.filter(f => !f.includes('Page') && !f.includes('types') && !f.includes('use')).map(f => `    └── ${f}`).join('\n')}
\`\`\`

## Next Steps

### 1. Add to pageConfig.tsx

\`\`\`tsx
import { ${pascalName}Page } from './demos/${name}/${pascalName}Page'

// In createPageConfig array:
{
  hasPermission: (scopes) => scopes?.Admin?.${pascalName},
  key: '${pascalName}',
  title: '${pascalName.replace(/([A-Z])/g, ' $1').trim()}',
  element: <${pascalName}Page />,
}
\`\`\`

### 2. Add scope to AuthenticatedRoute.jsx

\`\`\`javascript
const scopes = {
  // ... existing
  ${pascalName}: true,
}
\`\`\`

### 3. Update API endpoints

Current endpoints in \`use${pascalName}.ts\`:
- POST \`${endpoints.read}\`
- POST \`${endpoints.create}\`
- POST \`${endpoints.update}\`
- POST \`${endpoints.delete}\`

### 4. Test it

\`\`\`bash
cd demo && npm run dev
\`\`\`

Navigate to your new feature in the app!

---

**Want to run \`check_navigation_sync\` to verify the setup?**`
      }],
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error generating feature: ${error}` }],
      isError: true,
    }
  }
}

// Helper generators (simplified versions)
function generateTypes(name: string, fields: FeatureBuilderArgs['fields']): string {
  const fieldDefs = fields!.map(f => {
    const tsType = f.type === 'date' ? 'string' : f.type === 'select' ? 'string' : f.type
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

export type ${name}APIResponse = APIResponse<${name}Response>
`
}

function generateHook(name: string, endpoints: Record<string, string>): string {
  return `import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import { ${name}APIResponse, ${name}Filters } from './types.schema'

const endpoints = {
  read: '${endpoints.read}',
  create: '${endpoints.create}',
  update: '${endpoints.update}',
  delete: '${endpoints.delete}',
} as const

export function use${name}() {
  const api = useApi()
  const queryClient = useQueryClient()

  const get${name}Data = (filters: ${name}Filters) =>
    useQuery([endpoints.read, filters], () => api.post(endpoints.read, filters))

  const useCreateMutation = () =>
    useMutation((data: any) => api.post(endpoints.create, data), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Created successfully', false)
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => NotificationMessage('Error.', 'Failed to create', true),
    })

  const useUpdateMutation = () =>
    useMutation((data: any) => api.post(endpoints.update, data), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Updated successfully', false)
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => NotificationMessage('Error.', 'Failed to update', true),
    })

  const useDeleteMutation = () =>
    useMutation((data: any) => api.post(endpoints.delete, data), {
      onSuccess: () => {
        NotificationMessage('Success.', 'Deleted successfully', false)
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: () => NotificationMessage('Error.', 'Failed to delete', true),
    })

  return { get${name}Data, useCreateMutation, useUpdateMutation, useDeleteMutation }
}
`
}

function generatePage(name: string, camelName: string, options: any): string {
  return `import React, { useMemo, useRef, useState } from 'react'
import { GridApi } from 'ag-grid-community'
import { Modal } from 'antd'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { PlusOutlined } from '@ant-design/icons'
import { use${name} } from './api/use${name}'
import { ${name}Data } from './api/types.schema'
import { ${name}ColumnDefs } from './components/${name}ColumnDefs'
${options.includeForm ? `import { ${name}FormModal } from './components/${name}FormModal'` : ''}

export function ${name}Page() {
  const gridRef = useRef<GridApi>(null)
  const [filters, setFilters] = useState({})
  ${options.includeForm ? `const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<${name}Data | undefined>()` : ''}

  const { get${name}Data, useDeleteMutation${options.includeForm ? ', useCreateMutation, useUpdateMutation' : ''} } = use${name}()
  const { data: responseData, isLoading } = get${name}Data(filters)
  const deleteMutation = useDeleteMutation()
  ${options.includeForm ? `const createMutation = useCreateMutation()
  const updateMutation = useUpdateMutation()` : ''}

  const data = responseData?.Data?.Data || []

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete',
      content: 'Are you sure?',
      onOk: () => deleteMutation.mutate({ Id: id }),
    })
  }

  ${options.includeForm ? `const handleEdit = (item: ${name}Data) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ ...values, Id: editingItem.Id })
    } else {
      await createMutation.mutateAsync(values)
    }
    setIsModalOpen(false)
    setEditingItem(undefined)
  }` : ''}

  const columnDefs = useMemo(() => ${name}ColumnDefs({
    onDelete: handleDelete,
    ${options.includeForm ? 'onEdit: handleEdit,' : ''}
  }), [])

  const controlBarProps = useMemo(() => ({
    title: '${name.replace(/([A-Z])/g, ' $1').trim()}',
    actionButtons: (
      <GraviButton
        buttonText='Create'
        theme1
        icon={<PlusOutlined />}
        onClick={() => ${options.includeForm ? 'setIsModalOpen(true)' : '{}'}}
      />
    ),
  }), [])

  return (
    <Vertical flex='1'>
      <GraviGrid
        externalRef={gridRef}
        columnDefs={columnDefs}
        rowData={data}
        storageKey='${name}Grid'
        controlBarProps={controlBarProps}
        loading={isLoading}
        agPropOverrides={{}}
      />
      ${options.includeForm ? `<${name}FormModal
        visible={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(undefined) }}
        onSubmit={handleSubmit}
        initialValues={editingItem}
      />` : ''}
    </Vertical>
  )
}
`
}

function generateColDefs(name: string, fields: FeatureBuilderArgs['fields']): string {
  const cols = fields!.map(f => {
    if (f.name === 'Id') {
      return `    { headerName: 'ID', field: 'Id', minWidth: 80, maxWidth: 100 }`
    }
    if (f.type === 'date' || f.name.includes('At') || f.name.includes('Date')) {
      return `    { headerName: '${f.name}', field: '${f.name}', minWidth: 150, valueFormatter: (p) => p.value ? new Date(p.value).toLocaleDateString() : '' }`
    }
    if (f.name === 'Status' || f.type === 'select') {
      return `    { headerName: '${f.name}', field: '${f.name}', minWidth: 120, cellRenderer: (p: any) => <Texto category='p2' appearance={p.value === 'Active' ? 'success' : 'medium'}>{p.value}</Texto> }`
    }
    return `    { headerName: '${f.name}', field: '${f.name}', sortable: true, filter: true, minWidth: 150 }`
  }).join(',\n')

  return `import { ColDef } from 'ag-grid-community'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { ${name}Data } from '../api/types.schema'

interface Props {
  onDelete: (id: number) => void
  onEdit?: (data: ${name}Data) => void
}

export function ${name}ColumnDefs({ onDelete, onEdit }: Props): ColDef[] {
  return [
${cols},
    {
      headerName: 'Actions',
      field: 'actions',
      minWidth: 100,
      cellRenderer: (p: { data: ${name}Data }) => (
        <Horizontal style={{ gap: '8px' }}>
          {onEdit && <GraviButton type='text' size='small' icon={<EditOutlined />} onClick={() => onEdit(p.data)} />}
          <GraviButton type='text' size='small' icon={<DeleteOutlined />} danger onClick={() => onDelete(p.data.Id)} />
        </Horizontal>
      ),
    },
  ]
}
`
}

function generateForm(name: string, fields: FeatureBuilderArgs['fields']): string {
  const formFields = fields!.filter(f => f.name !== 'Id' && !f.name.includes('At')).map(f => {
    if (f.type === 'select' && f.options) {
      return `        <Form.Item name='${f.name}' label='${f.name}'${f.required ? " rules={[{ required: true }]}" : ''}>
          <Select placeholder='Select ${f.name}'>${f.options.map(o => `\n            <Select.Option value='${o}'>${o}</Select.Option>`).join('')}
          </Select>
        </Form.Item>`
    }
    if (f.type === 'number') {
      return `        <Form.Item name='${f.name}' label='${f.name}'${f.required ? " rules={[{ required: true }]}" : ''}><InputNumber style={{ width: '100%' }} /></Form.Item>`
    }
    if (f.type === 'boolean') {
      return `        <Form.Item name='${f.name}' label='${f.name}' valuePropName='checked'><Switch /></Form.Item>`
    }
    if (f.type === 'date') {
      return `        <Form.Item name='${f.name}' label='${f.name}'><DatePicker style={{ width: '100%' }} /></Form.Item>`
    }
    return `        <Form.Item name='${f.name}' label='${f.name}'${f.required ? " rules={[{ required: true }]}" : ''}><Input /></Form.Item>`
  }).join('\n')

  return `import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Select, Switch, DatePicker, Modal } from 'antd'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { ${name}Data } from '../api/types.schema'

interface Props {
  visible: boolean
  onClose: () => void
  onSubmit: (values: any) => void
  initialValues?: ${name}Data
}

export function ${name}FormModal({ visible, onClose, onSubmit, initialValues }: Props) {
  const [form] = Form.useForm()
  const isEdit = !!initialValues?.Id

  useEffect(() => {
    if (visible && initialValues) form.setFieldsValue(initialValues)
    else if (visible) form.resetFields()
  }, [visible, initialValues])

  const handleSubmit = async () => {
    const values = await form.validateFields()
    await onSubmit(values)
  }

  return (
    <Modal visible={visible} title={isEdit ? 'Edit' : 'Create'} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout='vertical'>
${formFields}
        <Horizontal justifyContent='flex-end' style={{ gap: '12px', marginTop: '24px' }}>
          <GraviButton buttonText='Cancel' onClick={onClose} />
          <GraviButton buttonText={isEdit ? 'Update' : 'Create'} theme1 onClick={handleSubmit} />
        </Horizontal>
      </Form>
    </Modal>
  )
}
`
}

function generateDetailPanel(name: string, fields: FeatureBuilderArgs['fields']): string {
  const fieldDisplay = fields!.map(f => `        <Vertical>
          <Texto category='p2' appearance='medium' style={{ textTransform: 'uppercase' }}>${f.name}</Texto>
          <Texto category='p1' weight='600'>{data.${f.name}${f.type === 'date' ? ' ? new Date(data.' + f.name + ').toLocaleDateString() : "-"' : ' || "-"'}}</Texto>
        </Vertical>`).join('\n')

  return `import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { ${name}Data } from '../api/types.schema'

export function ${name}DetailPanel({ data }: { data: ${name}Data }) {
  return (
    <Vertical className='p-3' style={{ backgroundColor: 'var(--theme-bg-elevated)', gap: '16px' }}>
      <Texto category='h6' appearance='medium' weight='600' style={{ textTransform: 'uppercase' }}>Details</Texto>
${fieldDisplay}
    </Vertical>
  )
}
`
}

function generateFilterBar(name: string, fields: FeatureBuilderArgs['fields']): string {
  return `import { Form, Input, Select } from 'antd'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { SearchOutlined } from '@ant-design/icons'

interface Props {
  onFilter: (values: any) => void
  onReset: () => void
}

export function ${name}FilterBar({ onFilter, onReset }: Props) {
  const [form] = Form.useForm()

  return (
    <Form form={form} layout='inline' className='mb-3'>
      <Form.Item name='search'>
        <Input placeholder='Search...' prefix={<SearchOutlined />} style={{ width: 200 }} />
      </Form.Item>
      <Form.Item name='status'>
        <Select placeholder='Status' style={{ width: 150 }} allowClear>
          <Select.Option value='Active'>Active</Select.Option>
          <Select.Option value='Inactive'>Inactive</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Horizontal style={{ gap: '8px' }}>
          <GraviButton buttonText='Filter' theme1 onClick={() => onFilter(form.getFieldsValue())} />
          <GraviButton buttonText='Reset' onClick={() => { form.resetFields(); onReset() }} />
        </Horizontal>
      </Form.Item>
    </Form>
  )
}
`
}

function completeWizard(args: FeatureBuilderArgs) {
  return generateFeature(args)
}
