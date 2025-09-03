// GraviButton Component Examples
// This file contains comprehensive examples of various GraviButton configurations and patterns

import type { ComponentExample } from "../../index.js";

export const GRAVIBUTTON_EXAMPLES: ComponentExample[] = [
  {
    name: "Basic GraviButton",
    description: "Simple buttons with text and basic click handlers",
    category: "interactive",
    complexity: "simple",
    tags: ["button", "basic", "text", "click"],
    code: `// Basic button with just text
<GraviButton buttonText='Cancel' />

// Button with click handler
<GraviButton 
  buttonText='Save' 
  onClick={() => console.log('Save clicked')}
/>

// Button with custom styling
<GraviButton 
  buttonText='Create Contract' 
  onClick={() => console.log('Navigate to create')}
  className='mr-3'
/>`,
  },

  {
    name: "Themed Buttons",
    description: "Buttons with different color themes and appearances",
    category: "interactive",
    complexity: "medium",
    tags: ["theme", "success", "error", "appearance"],
    code: `// Success theme (green)
<GraviButton 
  buttonText='Create Contract' 
  success 
  onClick={() => console.log('Navigate to contract/create')}
/>

// Error theme (red)
<GraviButton 
  buttonText='Delete Selected' 
  error 
  onClick={() => console.log('Delete action')}
/>

// Theme1 (primary theme)
<GraviButton 
  buttonText='Edit Products' 
  theme1 
  onClick={() => console.log('Edit products')}
/>

// Theme2 (secondary theme)
<GraviButton 
  buttonText='Create Order' 
  theme2 
  onClick={() => console.log('Show modal')}
/>

// Ghost appearance (subtle)
<GraviButton 
  buttonText='Cancel' 
  ghost 
  onClick={() => console.log('Hide modal')}
/>

// Outline appearance
<GraviButton 
  buttonText='View Conflicts' 
  appearance='outline' 
  onClick={() => console.log('Show conflicts')}
/>`,
  },

  {
    name: "Buttons with Icons",
    description: "Buttons featuring icons with or without text",
    category: "interactive",
    complexity: "medium",
    tags: ["icons", "visual", "actions"],
    code: `import { DownloadOutlined, SettingOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

// Icon with text
<GraviButton 
  buttonText='Export to CSV' 
  onClick={() => console.log('Export CSV')} 
  icon={<DownloadOutlined />}
/>

// Icon only button
<GraviButton 
  onClick={() => console.log('Open settings')} 
  icon={<SettingOutlined />} 
  className='ghost-gravi-button'
/>

// Success icon button
<GraviButton 
  success 
  htmlType='submit' 
  icon={<CheckOutlined />} 
  disabled={false}
/>

// Close button with styled icon
<GraviButton 
  icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />} 
  onClick={() => console.log('Cancel action')}
/>

// Icon button with size
<GraviButton 
  size='large' 
  icon={<CheckOutlined />} 
  success 
  htmlType='submit'
/>`,
  },

  {
    name: "Loading and Disabled States",
    description: "Buttons with loading spinners and disabled states",
    category: "interactive",
    complexity: "complex",
    tags: ["loading", "disabled", "state", "feedback"],
    code: `// Mock state variables for examples
const isFetchingData = false
const selectedItems = [{ id: 1 }, { id: 2 }]
const selectedPeriods = [{ id: 1 }]
const canWrite = true
const isFetching = false
const hasEdits = false
const isDeleting = false

// Loading button
<GraviButton 
  buttonText='Duplicate' 
  loading={isFetchingData} 
  disabled={isFetchingData || !selectedItems?.length}
  onClick={() => console.log('Duplicate items')}
/>

// Disabled button
<GraviButton 
  buttonText='Create Order' 
  theme2 
  disabled={!selectedPeriods?.length || !canWrite}
  onClick={() => console.log('Show modal')}
/>

// Conditional disabled styling
<GraviButton 
  buttonText='Refresh Values' 
  loading={isFetching} 
  onClick={() => {
    if (!hasEdits) return console.log('Retrieve data')
  }} 
  className={hasEdits ? 'disabled-gravi-button' : ''}
/>

// Dynamic button text with loading
<GraviButton 
  buttonText={selectedItems?.length ? \`Delete (\${selectedItems.length})\` : 'Delete'} 
  error 
  loading={isDeleting} 
  disabled={isDeleting || !selectedItems?.length}
  onClick={() => console.log('Delete items:', selectedItems)}
/>`,
  },

  {
    name: "Button Sizes and Forms",
    description: "Buttons with different sizes and form integration",
    category: "interactive",
    complexity: "medium",
    tags: ["size", "form", "submit", "small", "large"],
    code: `import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'

// Small size buttons
<GraviButton 
  buttonText='Activate All' 
  success 
  size='small' 
  onClick={() => console.log('Activate all')}
/>

// Large size button
<GraviButton 
  size='large' 
  icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />} 
  onClick={() => console.log('Cancel')}
/>

// Form submit button
<GraviButton 
  success 
  htmlType='submit' 
  icon={<CheckOutlined />} 
  disabled={false}
/>

// Button group with different sizes
<Horizontal style={{ gap: '8px' }}>
  <GraviButton buttonText='Activate All' success size='small' onClick={() => console.log('Activate all')} />
  <GraviButton buttonText='Deactivate All' size='small' onClick={() => console.log('Deactivate all')} />
  <GraviButton buttonText='Edit Products' theme1 size='small' onClick={() => console.log('Edit products')} />
  <GraviButton buttonText='Cancel' size='small' onClick={() => console.log('Cancel')} />
</Horizontal>`,
  },

  {
    name: "Custom Styling and Classes",
    description: "Buttons with custom styles, classes, and CSS customization",
    category: "styling",
    complexity: "medium",
    tags: ["styling", "classes", "custom", "css"],
    code: `import { CheckOutlined, SettingOutlined } from '@ant-design/icons'

// Mock state for examples
const isFetching = false
const hasEdits = false

// Custom inline styles
<GraviButton 
  style={{ borderRadius: 0, minWidth: 125 }} 
  success 
  htmlType='submit' 
  icon={<CheckOutlined />}
/>

// CSS class styling
<GraviButton 
  buttonText='Create Contract' 
  success 
  className='mr-3' 
  onClick={() => console.log('Navigate to create')}
/>

// Ghost gravi button class
<GraviButton 
  className='ghost-gravi-button' 
  icon={<SettingOutlined />} 
  onClick={() => console.log('Open settings')}
/>

// Conditional styling
<GraviButton 
  buttonText='Refresh Values' 
  loading={isFetching} 
  className={hasEdits ? 'disabled-gravi-button' : ''}
  onClick={() => console.log('Refresh data')}
/>

// Multiple classes with spacing
<GraviButton 
  buttonText='Cancel' 
  size='small' 
  onClick={() => console.log('Cancel action')} 
  className='mr-5'
/>`,
  },

  {
    name: "Modal and Dropdown Buttons",
    description: "Buttons integrated with modals, tooltips, and dropdowns",
    category: "interactive",
    complexity: "complex",
    tags: ["modal", "tooltip", "dropdown", "integration"],
    code: `import { Popconfirm, Tooltip, Dropdown, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

// Mock state for examples
const selectedDetails = [{ id: 1 }, { id: 2 }]
const isDeleting = false
const hasEdits = false
const isFetching = false

// Button with confirmation modal
<Popconfirm
  title="Are you sure you want to delete the selected details?"
  okText="Delete"
  cancelText="Cancel"
  onConfirm={() => console.log('Delete details:', selectedDetails)}
>
  <GraviButton
    buttonText={selectedDetails?.length ? \`Delete (\${selectedDetails.length})\` : 'Delete'}
    error
    loading={isDeleting}
    disabled={isDeleting || !selectedDetails?.length}
  />
</Popconfirm>

// Button with tooltip
<Tooltip title={hasEdits ? 'Please save changes to enable refresh.' : ''}>
  <GraviButton
    buttonText='Refresh Values'
    loading={isFetching}
    onClick={() => {
      if (!hasEdits) return console.log('Retrieve data')
    }}
    className={hasEdits ? 'disabled-gravi-button' : ''}
  />
</Tooltip>

// Dropdown menu button
const menu = (
  <Menu>
    <Menu.Item key="edit" onClick={() => console.log('Edit')}>Edit</Menu.Item>
    <Menu.Item key="duplicate" onClick={() => console.log('Duplicate')}>Duplicate</Menu.Item>
    <Menu.Item key="delete" danger onClick={() => console.log('Delete')}>Delete</Menu.Item>
  </Menu>
)

<Dropdown overlay={menu} trigger={['click']}>
  <GraviButton icon={<MoreOutlined />} />
</Dropdown>`,
  },

  {
    name: "Dynamic Button Content",
    description: "Buttons with dynamic text, icons, and conditional rendering",
    category: "interactive",
    complexity: "complex",
    tags: ["dynamic", "conditional", "computed", "responsive"],
    code: `import { PlusCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'

// Mock state for examples
const selectedItems = [{ id: 1 }, { id: 2 }]
const isProcessing = false
const isBulkEditMode = false
const conflictCount = 3
const conflicts = [{ id: 1 }, { id: 2 }, { id: 3 }]
const hasBadSelection = false
const canWrite = true

// Dynamic button text based on selection
<GraviButton
  buttonText={selectedItems?.length ? \`Duplicate (\${selectedItems.length})\` : 'Duplicate'}
  loading={isProcessing}
  disabled={isProcessing || !selectedItems?.length}
  onClick={() => console.log('Duplicate items:', selectedItems)}
/>

// Conditional button rendering
{isBulkEditMode ? (
  <Horizontal style={{ gap: 2 }}>
    <GraviButton buttonText='Activate All' success size='small' onClick={() => console.log('Activate all')} />
    <GraviButton buttonText='Deactivate All' size='small' onClick={() => console.log('Deactivate all')} />
    <GraviButton buttonText='Cancel' size='small' onClick={() => console.log('Cancel')} />
  </Horizontal>
) : (
  <GraviButton 
    buttonText='Create' 
    success 
    icon={<PlusCircleOutlined />} 
    onClick={() => console.log('Open create modal')} 
  />
)}

// Conflict button with dynamic count
<GraviButton
  buttonText={\`View \${conflictCount} Conflict\${conflictCount !== 1 ? 's' : ''}\`}
  onClick={() => console.log('Show conflicts:', conflicts)}
  appearance='outline'
  size='small'
/>

// Conditional icon and disabled state
<GraviButton
  buttonText='Create Order'
  theme2
  disabled={hasBadSelection || !canWrite}
  onClick={hasBadSelection ? undefined : () => console.log('Show modal')}
  icon={hasBadSelection ? <WarningOutlined /> : undefined}
/>`,
  },

  {
    name: "Testing and Accessibility",
    description: "Buttons with test attributes and accessibility features",
    category: "testing",
    complexity: "complex",
    tags: ["testing", "accessibility", "data-testid", "a11y"],
    code: `import { DownloadOutlined, SettingOutlined } from '@ant-design/icons'
import { useRef } from 'react'

// Mock state for examples
const selectedPeriods = [{ id: 1 }]
const canWrite = true
const csvResultsRef = useRef(null)

// Buttons with test data attributes
<GraviButton 
  data-testid='clearSelectionButton' 
  buttonText='Clear Selection' 
  onClick={() => console.log('Clear selection')}
/>

<GraviButton 
  data-testid='exportToCsvButton' 
  buttonText='Export to CSV' 
  onClick={() => console.log('Export CSV')} 
  icon={<DownloadOutlined />}
/>

<div data-testid='createOrderButton'>
  <GraviButton 
    buttonText='Create Order' 
    theme2 
    disabled={!selectedPeriods?.length || !canWrite}
    onClick={() => console.log('Show modal')}
  />
</div>

// Button with aria labels and accessibility
<GraviButton 
  buttonText='Settings' 
  icon={<SettingOutlined />} 
  aria-label='Open grid settings' 
  onClick={() => console.log('Open settings')}
/>

// Hidden results container for testing
<div data-testid='csvResults' style={{ display: 'none' }} ref={csvResultsRef} />`,
  },

  {
    name: "Complete Real-World Button Implementation",
    description:
      "Comprehensive example showing all GraviButton patterns in a production component",
    category: "complete",
    complexity: "complex",
    tags: ["complete", "real-world", "production", "comprehensive"],
    code: `import React, { useState } from 'react'
import { 
  DownloadOutlined, 
  SettingOutlined, 
  PlusCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Popconfirm, Tooltip, Dropdown, Menu } from 'antd'

// Complete button implementation component
function ContractManagementActions({
  selectedContracts,
  isLoading,
  canWrite,
  hasUnsavedChanges,
  onCreateContract,
  onEditSelected,
  onDeleteSelected,
  onExportData,
  onRefreshData,
  onSaveChanges,
  onCancelChanges
}) {
  // Helper functions for the example
  const handleDuplicate = (contracts) => console.log('Duplicate contracts:', contracts)
  const handleArchive = (contracts) => console.log('Archive contracts:', contracts)
  const openSettings = () => console.log('Open settings')
  const clearSelection = () => console.log('Clear selection')
  const showValidationErrors = (contracts) => console.log('Show validation errors:', contracts)

  const menu = (
    <Menu>
      <Menu.Item key="duplicate">
        <GraviButton 
          buttonText="Duplicate Selected" 
          size="small" 
          onClick={() => handleDuplicate(selectedContracts)}
        />
      </Menu.Item>
      <Menu.Item key="archive">
        <GraviButton 
          buttonText="Archive Selected" 
          size="small" 
          onClick={() => handleArchive(selectedContracts)}
        />
      </Menu.Item>
    </Menu>
  )

  return (
    <Vertical style={{ gap: '16px' }}>
      {/* Primary Actions Row */}
      <Horizontal style={{ gap: '8px', justifyContent: 'space-between' }}>
        {/* Left side - Create and Edit */}
        <Horizontal style={{ gap: '8px' }}>
          <GraviButton
            buttonText="Create Contract"
            success
            icon={<PlusCircleOutlined />}
            onClick={onCreateContract}
            disabled={!canWrite}
            data-testid="create-contract-button"
          />
          
          <GraviButton
            buttonText={\`Edit (\${selectedContracts?.length || 0})\`}
            theme1
            icon={<EditOutlined />}
            onClick={() => onEditSelected(selectedContracts)}
            disabled={!canWrite || !selectedContracts?.length}
            loading={isLoading}
          />
        </Horizontal>

        {/* Right side - Utility Actions */}
        <Horizontal style={{ gap: '8px' }}>
          <GraviButton
            buttonText="Export CSV"
            icon={<DownloadOutlined />}
            onClick={onExportData}
            size="small"
            data-testid="export-button"
          />
          
          <GraviButton
            icon={<SettingOutlined />}
            className="ghost-gravi-button"
            onClick={() => openSettings()}
            aria-label="Open grid settings"
          />
          
          <Dropdown overlay={menu} trigger={['click']}>
            <GraviButton 
              icon={<MoreOutlined />} 
              className="ghost-gravi-button"
            />
          </Dropdown>
        </Horizontal>
      </Horizontal>

      {/* Secondary Actions Row - Bulk Operations */}
      {selectedContracts?.length > 0 && (
        <Horizontal style={{ gap: '8px' }}>
          <Popconfirm
            title={\`Are you sure you want to delete \${selectedContracts.length} contract(s)?\`}
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => onDeleteSelected(selectedContracts)}
          >
            <GraviButton
              buttonText={\`Delete (\${selectedContracts.length})\`}
              error
              icon={<DeleteOutlined />}
              loading={isLoading}
              disabled={!canWrite || isLoading}
              size="small"
            />
          </Popconfirm>

          <GraviButton
            buttonText="Clear Selection"
            size="small"
            onClick={() => clearSelection()}
            data-testid="clear-selection-button"
          />
        </Horizontal>
      )}

      {/* Save/Cancel Row - Conditional */}
      {hasUnsavedChanges && (
        <Horizontal style={{ gap: '8px', justifyContent: 'flex-end' }}>
          <GraviButton
            buttonText="Cancel Changes"
            ghost
            icon={<CloseOutlined style={{ color: 'var(--gray-500)' }} />}
            onClick={onCancelChanges}
          />
          
          <GraviButton
            buttonText="Save Changes"
            success
            icon={<CheckOutlined />}
            onClick={onSaveChanges}
            loading={isLoading}
            disabled={isLoading}
          />
        </Horizontal>
      )}

      {/* Status Actions Row */}
      <Horizontal style={{ gap: '8px' }}>
        <Tooltip title={hasUnsavedChanges ? 'Save changes before refreshing data' : ''}>
          <GraviButton
            buttonText="Refresh Data"
            onClick={() => {
              if (!hasUnsavedChanges) onRefreshData()
            }}
            loading={isLoading}
            className={hasUnsavedChanges ? 'disabled-gravi-button' : ''}
            size="small"
          />
        </Tooltip>

        {selectedContracts?.some(c => c.hasValidationErrors) && (
          <GraviButton
            buttonText={\`View \${selectedContracts.filter(c => c.hasValidationErrors).length} Error(s)\`}
            appearance="outline"
            icon={<WarningOutlined />}
            onClick={() => showValidationErrors(selectedContracts)}
            size="small"
          />
        )}
      </Horizontal>
    </Vertical>
  )
}

// Usage in main component
function ContractManagementPage() {
  const [selectedContracts, setSelectedContracts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const canWrite = true // Mock permission for example

  // Mock functions for the example
  const handleEdit = (contracts) => console.log('Edit contracts:', contracts)
  const handleDelete = (contracts) => console.log('Delete contracts:', contracts)
  const exportToCSV = (contracts) => console.log('Export CSV:', contracts)
  const refetchData = () => console.log('Refetch data')
  const saveAll = () => console.log('Save all changes')
  const revertChanges = () => console.log('Revert changes')

  return (
    <div>
      <ContractManagementActions
        selectedContracts={selectedContracts}
        isLoading={isLoading}
        canWrite={canWrite}
        hasUnsavedChanges={hasUnsavedChanges}
        onCreateContract={() => console.log('Navigate to /contracts/create')}
        onEditSelected={(contracts) => handleEdit(contracts)}
        onDeleteSelected={(contracts) => handleDelete(contracts)}
        onExportData={() => exportToCSV(selectedContracts)}
        onRefreshData={() => refetchData()}
        onSaveChanges={() => saveAll()}
        onCancelChanges={() => revertChanges()}
      />
      
      {/* Grid component would go here */}
    </div>
  )
}`,
  },
];
