/**
 * NothingMessage Component Examples Database
 *
 * This file contains production-tested examples of the NothingMessage component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality NothingMessage implementations.
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
    id: 'nothing_medium_01',
    name: 'Empty State with Icon',
    description: 'Empty state with custom icon and styling',
    complexity: 'medium',
    category: 'enhanced-empty',
    tags: ['icon', 'custom', 'styled'],
    code: `<NothingMessage
  title="No Data Available"
  message="Data will appear here when it's available."
  icon={<DatabaseOutlined style={{ fontSize: '48px', color: 'var(--theme-color-3)' }} />}
/>`,
    props: {
      title: '"No Data Available"',
      message: '"Data will appear here when it\'s available."',
      icon: 'Custom React icon component'
    },
    dependencies: ['@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Enhanced empty state with visual icon'
  },

  {
    id: 'nothing_medium_02',
    name: 'Loading State Variation',
    description: 'Empty message for loading states',
    complexity: 'medium',
    category: 'loading',
    tags: ['loading', 'pending', 'state'],
    code: `<NothingMessage
  title="Loading..."
  message="Please wait while we fetch your data."
  icon={<Spin size="large" />}
/>`,
    props: {
      title: '"Loading..."',
      message: '"Please wait while we fetch your data."',
      icon: 'Loading spinner component'
    },
    dependencies: ['@gravitate-js/excalibrr', 'antd'],
    notes: 'Loading state variant with spinner'
  },

  {
    id: 'nothing_medium_03',
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
    id: 'nothing_complex_01',
    name: 'Interactive Empty State with Actions',
    description: 'Empty state with action buttons and multiple options',
    complexity: 'complex',
    category: 'interactive',
    tags: ['actions', 'buttons', 'interactive', 'complex'],
    code: `<NothingMessage
  title="No Projects Yet"
  message="Create your first project to get started with managing your work."
  actions={[
    <GraviButton
      key="create"
      theme1
      buttonText="Create Project"
      icon={<PlusOutlined />}
      onClick={() => setShowCreateModal(true)}
    />,
    <GraviButton
      key="import"
      appearance="outline"
      buttonText="Import Project"
      icon={<UploadOutlined />}
      onClick={() => setShowImportModal(true)}
    />
  ]}
/>`,
    props: {
      title: '"No Projects Yet"',
      message: '"Create your first project to get started with managing your work."',
      actions: 'Array of action button components'
    },
    dependencies: ['@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Full interactive empty state with multiple action options'
  },

  {
    id: 'nothing_complex_02',
    name: 'Contextual Empty State with Dynamic Content',
    description: 'Dynamic empty state that changes based on context and user permissions',
    complexity: 'complex',
    category: 'dynamic',
    tags: ['dynamic', 'contextual', 'permissions', 'conditional'],
    code: `<NothingMessage
  title={userCanCreate ? "No Items Created" : "No Items Available"}
  message={
    userCanCreate
      ? "You haven't created any items yet. Click the button below to create your first item."
      : "There are no items available to view at this time."
  }
  icon={
    <EmptyStateIcon
      type={userCanCreate ? "create" : "empty"}
      style={{ fontSize: '64px' }}
    />
  }
  actions={
    userCanCreate ? [
      <GraviButton
        key="create"
        theme1
        size="large"
        buttonText="Create First Item"
        icon={<PlusOutlined />}
        onClick={handleCreateItem}
      />
    ] : undefined
  }
/>`,
    props: {
      title: 'Dynamic based on user permissions',
      message: 'Conditional message based on user context',
      icon: 'Dynamic icon based on state',
      actions: 'Conditional actions based on permissions'
    },
    dependencies: ['@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Advanced empty state with full context awareness and permission-based content'
  }
]

export default NothingMessageExamples