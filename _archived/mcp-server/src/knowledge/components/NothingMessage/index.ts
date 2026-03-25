/**
 * NothingMessage Component Examples Database
 *
 * This file contains production-tested examples of the NothingMessage component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality NothingMessage implementations.
 * 
 * COMPONENT API:
 * - title: string (required) - The main message title
 * - message: string (required) - The description text
 * - className?: string - Optional CSS class
 */

export interface NothingMessageExample {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  category?: string
  tags: string[]
  code: string
  props: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}

export const NothingMessageExamples: NothingMessageExample[] = [
  {
    id: 'nothing_simple_01',
    name: 'Basic No Data Message',
    description: 'Simple empty state message with title and description',
    complexity: 'simple',
    category: 'empty-state',
    tags: ['empty', 'no-data', 'basic'],
    code: `<NothingMessage
  title="No Alerts"
  message="You have not received any alerts."
/>`,
    props: {
      title: '"No Alerts"',
      message: '"You have not received any alerts."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/components/shared/Navigation/ControlPanel/ControlPanel.jsx',
    notes: 'Standard empty state for lists or notifications'
  },

  {
    id: 'nothing_simple_02',
    name: 'No Search Results',
    description: 'Empty state for search results',
    complexity: 'simple',
    category: 'search',
    tags: ['search', 'no-results', 'empty'],
    code: `<NothingMessage
  title="No Results Found"
  message="Try adjusting your search criteria or filters."
/>`,
    props: {
      title: '"No Results Found"',
      message: '"Try adjusting your search criteria or filters."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Helpful guidance for users with empty search results'
  },

  {
    id: 'nothing_simple_03',
    name: 'Empty Collection',
    description: 'Empty state for collections or lists',
    complexity: 'simple',
    category: 'collections',
    tags: ['collection', 'empty', 'list'],
    code: `<NothingMessage
  title="No Items"
  message="Get started by creating your first item."
/>`,
    props: {
      title: '"No Items"',
      message: '"Get started by creating your first item."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Encourages user action for empty collections'
  },

  {
    id: 'nothing_simple_04',
    name: 'No Data Available',
    description: 'Empty state when data has not loaded yet or is unavailable',
    complexity: 'simple',
    category: 'empty-state',
    tags: ['no-data', 'unavailable', 'basic'],
    code: `<NothingMessage
  title="No Data Available"
  message="Data will appear here when it's available."
/>`,
    props: {
      title: '"No Data Available"',
      message: '"Data will appear here when it\'s available."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Generic empty state for data display areas'
  },

  {
    id: 'nothing_medium_01',
    name: 'Conditional Empty State',
    description: 'Conditionally rendered empty state based on data and loading',
    complexity: 'medium',
    category: 'conditional',
    tags: ['conditional', 'loading', 'data-driven'],
    code: `{!loading && data?.length === 0 && (
  <NothingMessage
    title="No Records Found"
    message="No records match your current filters."
  />
)}`,
    props: {
      title: '"No Records Found"',
      message: '"No records match your current filters."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Proper conditional rendering with loading and data checks'
  },

  {
    id: 'nothing_medium_02',
    name: 'Empty State with Custom Styling',
    description: 'Empty state with additional className for custom positioning',
    complexity: 'medium',
    category: 'styled',
    tags: ['className', 'custom', 'styled'],
    code: `<NothingMessage
  title="No Pending Orders"
  message="All orders have been processed."
  className="mt-4 p-3"
/>`,
    props: {
      title: '"No Pending Orders"',
      message: '"All orders have been processed."',
      className: '"mt-4 p-3"'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Use className for spacing and positioning adjustments'
  },

  {
    id: 'nothing_medium_03',
    name: 'Empty State in Grid Context',
    description: 'NothingMessage displayed when a grid has no data',
    complexity: 'medium',
    category: 'grid',
    tags: ['grid', 'table', 'no-data'],
    code: `{rowData.length === 0 ? (
  <NothingMessage
    title="No Data to Display"
    message="Add items or adjust your filters to see data here."
  />
) : (
  <GraviGrid
    columnDefs={columnDefs}
    rowData={rowData}
    agPropOverrides={{}}
  />
)}`,
    props: {
      title: '"No Data to Display"',
      message: '"Add items or adjust your filters to see data here."'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    notes: 'Common pattern for showing empty state instead of empty grid'
  },

  {
    id: 'nothing_complex_01',
    name: 'Empty State with Adjacent Actions',
    description: 'NothingMessage with action buttons rendered as siblings',
    complexity: 'complex',
    category: 'interactive',
    tags: ['actions', 'buttons', 'interactive'],
    code: `<Vertical horizontalCenter className="p-4">
  <NothingMessage
    title="No Projects Yet"
    message="Create your first project to get started with managing your work."
  />
  <Horizontal className="mt-3 gap-12">
    <GraviButton
      theme1
      buttonText="Create Project"
      icon={<PlusOutlined />}
      onClick={() => setShowCreateModal(true)}
    />
    <GraviButton
      buttonText="Import Project"
      icon={<UploadOutlined />}
      onClick={() => setShowImportModal(true)}
    />
  </Horizontal>
</Vertical>`,
    props: {
      title: '"No Projects Yet"',
      message: '"Create your first project to get started with managing your work."'
    },
    dependencies: ['@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Actions are rendered as siblings, not as props (NothingMessage only accepts title, message, className)'
  },

  {
    id: 'nothing_complex_02',
    name: 'Dynamic Empty State Based on Context',
    description: 'Different messages based on user permissions or context',
    complexity: 'complex',
    category: 'dynamic',
    tags: ['dynamic', 'contextual', 'permissions', 'conditional'],
    code: `<Vertical horizontalCenter>
  <NothingMessage
    title={userCanCreate ? "No Items Created" : "No Items Available"}
    message={
      userCanCreate
        ? "You haven't created any items yet. Click the button below to create your first item."
        : "There are no items available to view at this time."
    }
  />
  {userCanCreate && (
    <GraviButton
      theme1
      className="mt-3"
      buttonText="Create First Item"
      icon={<PlusOutlined />}
      onClick={handleCreateItem}
    />
  )}
</Vertical>`,
    props: {
      title: 'Dynamic based on user permissions',
      message: 'Conditional message based on user context'
    },
    dependencies: ['@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Advanced empty state with full context awareness and permission-based content'
  }
]

export default NothingMessageExamples
