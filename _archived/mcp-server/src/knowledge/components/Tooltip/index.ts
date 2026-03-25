/**
 * Tooltip Component Examples Database
 *
 * This file contains production-tested examples of the Tooltip component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality Tooltip implementations.
 */

export interface TooltipExample {
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

export const TooltipExamples: TooltipExample[] = [
  {
    id: 'tooltip_simple_01',
    name: 'Basic Text Tooltip',
    description: 'Simple tooltip with text content on hover',
    complexity: 'simple',
    category: 'basic',
    tags: ['basic', 'text', 'hover'],
    code: `<Tooltip title="This is a helpful tooltip">
  <Button>Hover me</Button>
</Tooltip>`,
    props: {
      title: '"This is a helpful tooltip"',
      children: 'Button or any React element'
    },
    dependencies: ['antd'],
    notes: 'Standard tooltip pattern for simple help text'
  },

  {
    id: 'tooltip_simple_02',
    name: 'Icon with Tooltip',
    description: 'Tooltip on icon for additional information',
    complexity: 'simple',
    category: 'icons',
    tags: ['icon', 'info', 'help'],
    code: `<Tooltip title="Click to edit this field">
  <EditOutlined style={{ cursor: 'pointer', color: 'var(--theme-color-2)' }} />
</Tooltip>`,
    props: {
      title: '"Click to edit this field"',
      children: 'Icon component with styling'
    },
    dependencies: ['antd', '@ant-design/icons'],
    notes: 'Common pattern for interactive icons with explanatory tooltips'
  },

  {
    id: 'tooltip_simple_03',
    name: 'Tag with Tooltip',
    description: 'Tooltip for truncated content in tags',
    complexity: 'simple',
    category: 'content',
    tags: ['truncation', 'tag', 'overflow'],
    code: `<Tooltip title={fullValue}>
  <div>
    <BBDTag
      className="text-ellipsis"
      style={{ maxWidth: "150px" }}
    >
      {truncatedValue}
    </BBDTag>
  </div>
</Tooltip>`,
    props: {
      title: 'Full content string',
      children: 'Truncated content element'
    },
    dependencies: ['antd', '@gravitate-js/excalibrr'],
    sourceFile: 'src/pages/WelcomePages/Examples/BBDTagExample.tsx',
    notes: 'Essential pattern for showing full content when space is limited'
  },

  {
    id: 'tooltip_medium_01',
    name: 'Positioned Tooltip',
    description: 'Tooltip with custom positioning',
    complexity: 'medium',
    category: 'positioning',
    tags: ['positioning', 'placement', 'custom'],
    code: `<Tooltip
  title="This tooltip appears on the right"
  placement="right"
  arrow={true}
>
  <Button>Right tooltip</Button>
</Tooltip>`,
    props: {
      title: '"This tooltip appears on the right"',
      placement: '"right" (top, bottom, left, right, etc.)',
      arrow: 'true (shows arrow pointing to element)'
    },
    dependencies: ['antd'],
    notes: 'Custom positioning for optimal tooltip placement'
  },

  {
    id: 'tooltip_medium_02',
    name: 'Delayed Tooltip',
    description: 'Tooltip with custom show/hide delays',
    complexity: 'medium',
    category: 'timing',
    tags: ['delay', 'timing', 'ux'],
    code: `<Tooltip
  title="This tooltip has a delay"
  mouseEnterDelay={0.5}
  mouseLeaveDelay={0.1}
>
  <Button>Delayed tooltip</Button>
</Tooltip>`,
    props: {
      title: '"This tooltip has a delay"',
      mouseEnterDelay: '0.5 (seconds before showing)',
      mouseLeaveDelay: '0.1 (seconds before hiding)'
    },
    dependencies: ['antd'],
    notes: 'Fine-tuned timing for better user experience'
  },

  {
    id: 'tooltip_medium_03',
    name: 'Conditional Tooltip',
    description: 'Tooltip that only appears under certain conditions',
    complexity: 'medium',
    category: 'conditional',
    tags: ['conditional', 'dynamic', 'state-based'],
    code: `<Tooltip title={hasError ? errorMessage : undefined}>
  <Input
    status={hasError ? 'error' : undefined}
    placeholder="Enter value"
  />
</Tooltip>`,
    props: {
      title: 'Conditional content or undefined',
      children: 'Input with conditional error state'
    },
    dependencies: ['antd'],
    notes: 'Tooltip appears only when needed, useful for validation feedback'
  },

  {
    id: 'tooltip_complex_01',
    name: 'Rich Content Tooltip',
    description: 'Tooltip with complex JSX content including formatting',
    complexity: 'complex',
    category: 'rich-content',
    tags: ['rich-content', 'jsx', 'formatted'],
    code: `<Tooltip
  title={
    <div>
      <Texto category="p2" style={{ color: 'white', fontWeight: 'bold' }}>
        Complex nested content with calculation
      </Texto>
      <div style={{ marginTop: '4px' }}>
        <span style={{ color: '#91d5ff' }}>Value: </span>
        <span style={{ color: '#fff' }}>{formattedValue}</span>
      </div>
    </div>
  }
  overlayStyle={{ maxWidth: '300px' }}
>
  <BBDTag warning className="text-center">
    <span className="text-xs font-normal">
      <WarningOutlined className="mr-1" />
      Threshold: 85%
    </span>
  </BBDTag>
</Tooltip>`,
    props: {
      title: 'Complex JSX content with styling',
      overlayStyle: 'Custom styling for tooltip container',
      children: 'Complex trigger element'
    },
    dependencies: ['antd', '@gravitate-js/excalibrr', '@ant-design/icons'],
    sourceFile: 'src/pages/WelcomePages/Examples/BBDTagExample.tsx',
    notes: 'Advanced tooltip with rich formatting and custom styling'
  },

  {
    id: 'tooltip_complex_02',
    name: 'Data Table Tooltip with Multiple Values',
    description: 'Comprehensive tooltip showing multiple data points in table format',
    complexity: 'complex',
    category: 'data-display',
    tags: ['data', 'table', 'multiple-values', 'formatted'],
    code: `<Tooltip
  title={
    <div style={{ minWidth: '200px' }}>
      <Texto category="p2" style={{ color: 'white', marginBottom: '8px' }}>
        Item Details
      </Texto>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        <span style={{ color: '#91d5ff' }}>Name:</span>
        <span style={{ color: '#fff' }}>{item.name}</span>
        <span style={{ color: '#91d5ff' }}>Value:</span>
        <span style={{ color: '#fff' }}>{item.formattedValue}</span>
        <span style={{ color: '#91d5ff' }}>Status:</span>
        <span style={{ color: item.isActive ? '#52c41a' : '#ff4d4f' }}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
        <span style={{ color: '#91d5ff' }}>Last Updated:</span>
        <span style={{ color: '#fff' }}>{item.lastUpdated}</span>
      </div>
    </div>
  }
  placement="topLeft"
  overlayStyle={{ maxWidth: '350px' }}
>
  <div style={{ cursor: 'help' }}>
    <BBDTag theme1 className="text-ellipsis" style={{ maxWidth: "120px" }}>
      {item.displayName}
    </BBDTag>
  </div>
</Tooltip>`,
    props: {
      title: 'Complex grid layout with multiple data points',
      placement: '"topLeft" for optimal positioning',
      overlayStyle: 'Custom width and styling',
      children: 'Data display element with help cursor'
    },
    dependencies: ['antd', '@gravitate-js/excalibrr'],
    notes: 'Professional data tooltip with structured layout and conditional styling'
  },

  {
    id: 'tooltip_complex_03',
    name: 'Interactive Tooltip with Actions',
    description: 'Advanced tooltip with clickable actions and state management',
    complexity: 'complex',
    category: 'interactive',
    tags: ['interactive', 'actions', 'clickable', 'state'],
    code: `const [tooltipVisible, setTooltipVisible] = useState(false)

<Tooltip
  title={
    <div onClick={(e) => e.stopPropagation()}>
      <Texto category="p2" style={{ color: 'white', marginBottom: '8px' }}>
        Quick Actions
      </Texto>
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            handleEdit(item.id)
            setTooltipVisible(false)
          }}
        >
          Edit Item
        </Button>
        <Button
          size="small"
          danger
          onClick={() => {
            handleDelete(item.id)
            setTooltipVisible(false)
          }}
        >
          Delete Item
        </Button>
      </div>
    </div>
  }
  trigger="click"
  open={tooltipVisible}
  onOpenChange={setTooltipVisible}
  placement="bottomRight"
>
  <Button
    type="text"
    icon={<MoreOutlined />}
    style={{ padding: '4px' }}
  />
</Tooltip>`,
    props: {
      title: 'Interactive content with buttons and actions',
      trigger: '"click" for click-to-open behavior',
      open: 'Controlled visibility state',
      onOpenChange: 'State setter for visibility control',
      placement: '"bottomRight" positioning'
    },
    dependencies: ['antd', '@gravitate-js/excalibrr', '@ant-design/icons'],
    notes: 'Advanced interactive tooltip acting as a mini-popover with actions'
  }
]

export default TooltipExamples