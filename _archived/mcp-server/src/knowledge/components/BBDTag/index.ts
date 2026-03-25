/**
 * BBDTag Component Examples Database
 *
 * This file contains production-tested examples of the BBDTag component
 * extracted from the Excalibrr component library. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality BBDTag implementations.
 */

export interface BBDTagExample {
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

export const BBDTagExamples: BBDTagExample[] = [
  {
    id: 'bbd_tag_simple_01',
    name: 'Basic Theme Tag',
    description: 'Simple BBDTag with theme2 styling',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['theme2', 'basic', 'filter'],
    code: `<BBDTag theme2 className='filter-tag my-2'>
  <span className='filter-tag-label'>
    {name.includes('.')
      ? name.split('.')[1]
      : name}
  </span>
  <CloseOutlined
    className='filter-tag-close ml-2'
    onClick={() => handleRemoveFilter(name)}
  />
</BBDTag>`,
    props: {
      theme2: true,
      className: 'filter-tag my-2',
      children: 'Dynamic content with close icon'
    },
    dependencies: ['@ant-design/icons'],
    sourceFile: 'src/components/Grid/SearchGridHeader/FilterTags.tsx',
    notes: 'Common pattern for removable filter tags'
  },

  {
    id: 'bbd_tag_simple_02',
    name: 'Success State Tag',
    description: 'BBDTag with success state for validation',
    complexity: 'simple',
    category: 'validation',
    tags: ['success', 'validation', 'form'],
    code: `<BBDTag
  style={{ textTransform: 'capitalize' }}
  success={!policyErrors?.some((e) => e.type === 'length')}
>
  At least {passwordPolicy?.length}{' '}
  {passwordPolicy?.length > 1 ? 'characters' : 'character'}
</BBDTag>`,
    props: {
      style: { textTransform: 'capitalize' },
      success: 'boolean condition based on validation',
      children: 'Dynamic validation message'
    },
    sourceFile: 'src/components/Login/Forms/PasswordResetForm.tsx',
    notes: 'Perfect for form validation feedback with success/error states'
  },

  {
    id: 'bbd_tag_simple_03',
    name: 'Error State Tag',
    description: 'BBDTag with error state for form validation',
    complexity: 'simple',
    category: 'validation',
    tags: ['error', 'validation', 'form'],
    code: `<BBDTag
  style={{ textTransform: 'capitalize' }}
  success={!policyErrors?.some((e) => e.type === 'uppercase')}
>
  At least {passwordPolicy?.uppercase}{' '}
  {passwordPolicy?.uppercase > 1 ? 'uppercase characters' : 'uppercase character'}
</BBDTag>`,
    props: {
      style: { textTransform: 'capitalize' },
      success: 'boolean condition for validation state',
      children: 'Dynamic validation text'
    },
    sourceFile: 'src/components/Login/Forms/PasswordResetForm.tsx',
    notes: 'Shows conditional success/error styling based on validation rules'
  },

  {
    id: 'bbd_tag_simple_04',
    name: 'Plain Text Tag',
    description: 'Simple BBDTag with just text content',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['plain', 'text-transform', 'simple'],
    code: `<BBDTag style={{ textTransform: 'capitalize' }}>
  Password Too Common
</BBDTag>`,
    props: {
      style: { textTransform: 'capitalize' },
      children: 'Password Too Common'
    },
    sourceFile: 'src/components/Login/Forms/PasswordResetForm.tsx',
    notes: 'Minimal usage for simple text display with styling'
  },

  {
    id: 'bbd_tag_medium_01',
    name: 'Grid Cell Tag with Theme',
    description: 'BBDTag used in grid cells with theme props and tooltip',
    complexity: 'medium',
    category: 'grid-usage',
    tags: ['grid', 'tooltip', 'theme', 'ellipsis'],
    code: `<Tooltip title={value}>
  <div>
    <BBDTag
      {...tagTheme}
      className={classNames('text-ellipsis', className)}
    >
      {value}
    </BBDTag>
  </div>
</Tooltip>`,
    props: {
      '...tagTheme': 'Spread theme props object',
      className: 'Combined utility classes',
      children: 'Cell value'
    },
    dependencies: ['antd', 'classnames'],
    sourceFile: 'src/components/GraviGrid/DefaultCellRenderers/DefaultCellRenderers.tsx',
    notes: 'Common pattern for grid cell tags with tooltips and theme spreading'
  },

  {
    id: 'bbd_tag_medium_02',
    name: 'Right-Aligned Tag in Container',
    description: 'BBDTag aligned right using wrapper container',
    complexity: 'medium',
    category: 'alignment',
    tags: ['right-align', 'numeric', 'container'],
    code: `// Use a flex container to right-align BBDTag
<div className='flex items-end justify-end'>
  <BBDTag
    success={!!data.is_best}
    error={!data.is_best}
  >
    <span className='text-xs font-normal'>
      {formattedValue}
    </span>
  </BBDTag>
</div>`,
    props: {
      success: 'boolean condition',
      error: 'opposite boolean condition',
      children: 'Formatted numeric content'
    },
    sourceFile: 'src/components/GraviGrid/DefaultCellRenderers/DefaultCellRenderers.tsx',
    notes: 'BBDTag does not have an align prop - use a flex container to control alignment'
  },

  {
    id: 'bbd_tag_medium_03',
    name: 'Multiple Tags Display',
    description: 'Multiple BBDTags in a grid for displaying tag arrays',
    complexity: 'medium',
    category: 'multiple-tags',
    tags: ['array', 'multiple', 'grid', 'ellipsis'],
    code: `{tagItems.map((item, index) => (
  <BBDTag className='text-ellipsis' key={index}>
    {item}
  </BBDTag>
))}`,
    props: {
      className: 'text-ellipsis',
      children: 'Array item value',
      key: 'Array index'
    },
    sourceFile: 'src/components/DataDisplay/ManyTag.tsx',
    notes: 'Pattern for displaying multiple tags from an array'
  },

  {
    id: 'bbd_tag_complex_01',
    name: 'Conditional Success/Error Tag',
    description: 'BBDTag with complex conditional theming based on data state',
    complexity: 'complex',
    category: 'conditional',
    tags: ['conditional', 'success', 'error', 'data-driven'],
    code: `<BBDTag success={showGreen} error={showRed}>
  <DeltaContents threshold={threshold} value={value} {...others} />
</BBDTag>`,
    props: {
      success: 'Computed boolean for positive state',
      error: 'Computed boolean for negative state',
      children: 'Complex child component with props'
    },
    sourceFile: 'src/components/DataDisplay/DeltaTag.tsx',
    notes: 'Shows complex conditional theming with computed boolean states'
  },

  {
    id: 'bbd_tag_complex_02',
    name: 'Theme Variants Pattern',
    description: 'BBDTag demonstrating all theme variant props',
    complexity: 'complex',
    category: 'theming',
    tags: ['themes', 'variants', 'all-props', 'conditional'],
    code: `// Example showing all theme variants available
<BBDTag theme1>Theme 1 Tag</BBDTag>
<BBDTag theme2>Theme 2 Tag</BBDTag>
<BBDTag theme3>Theme 3 Tag</BBDTag>
<BBDTag theme4>Theme 4 Tag</BBDTag>
<BBDTag success>Success Tag</BBDTag>
<BBDTag warning>Warning Tag</BBDTag>
<BBDTag error>Error Tag</BBDTag>

// With custom styling and text transform
<BBDTag
  theme2
  textTransform="uppercase"
  className="custom-tag"
  style={{ margin: '4px' }}
>
  Custom Styled Tag
</BBDTag>`,
    props: {
      theme1: 'boolean - Theme 1 styling',
      theme2: 'boolean - Theme 2 styling',
      theme3: 'boolean - Theme 3 styling',
      theme4: 'boolean - Theme 4 styling',
      success: 'boolean - Success state styling',
      warning: 'boolean - Warning state styling',
      error: 'boolean - Error state styling',
      textTransform: 'CSS textTransform property',
      className: 'Additional CSS classes',
      style: 'Inline styles object'
    },
    sourceFile: 'src/components/DataDisplay/BBDTag.tsx',
    notes: 'Complete reference showing all available theme variants and styling options'
  }
]

export default BBDTagExamples