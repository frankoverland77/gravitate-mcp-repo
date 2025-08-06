// Texto Component Examples for @gravitate-js/excalibrr
// This file contains comprehensive examples of various Texto component usage patterns

import type { ComponentExample } from "../../index.js";

export const TEXTO_EXAMPLES: ComponentExample[] = [
  {
    name: "Basic Texto Usage",
    description: "Simple text display without any props",
    category: "text",
    complexity: "basic",
    tags: ["text", "basic", "simple"],
    code: `// Basic Texto component with just text content
import { Texto } from '@gravitate-js/excalibrr'

// Simple text display
<Texto>Hello World</Texto>

// With dynamic content
<Texto>{user.name}</Texto>

// With conditional content
<Texto>{params?.value || '(Blanks)'}</Texto>`,
  },

  {
    name: "Text Categories",
    description:
      "Using category prop for semantic heading and paragraph levels",
    category: "text",
    complexity: "basic",
    tags: ["category", "headings", "paragraphs", "semantic"],
    code: `// Heading categories
<Texto category='h1'>Main Page Title</Texto>
<Texto category='h2'>Section Title</Texto>
<Texto category='h3'>Subsection Title</Texto>
<Texto category='h4'>Component Title</Texto>
<Texto category='h5'>Small Title</Texto>
<Texto category='h6'>Micro Title</Texto>

// Paragraph categories
<Texto category='p1'>Large paragraph text</Texto>
<Texto category='p2'>Standard paragraph text</Texto>

// Special categories
<Texto category='label'>Form Label</Texto>
<Texto category='heading-small'>Small Heading</Texto>`,
  },

  {
    name: "Text Weight Variations",
    description: "Different font weight options for emphasis",
    category: "text",
    complexity: "basic",
    tags: ["weight", "bold", "emphasis", "typography"],
    code: `// Named weight values
<Texto weight='normal'>Normal weight text</Texto>
<Texto weight='bold'>Bold text</Texto>
<Texto weight='bolder'>Extra bold text</Texto>
<Texto weight='lighter'>Light weight text</Texto>

// Numeric weight values
<Texto weight={600}>Semi-bold text (600)</Texto>
<Texto weight={900}>Heavy text (900)</Texto>

// Common usage patterns
<Texto weight='bold' category='p2'>
  {data.value}
</Texto>

<Texto category='h6' weight={500}>
  {section.title}
</Texto>`,
  },

  {
    name: "Appearance Themes",
    description: "Using appearance prop for different color themes and states",
    category: "text",
    complexity: "intermediate",
    tags: ["appearance", "theme", "colors", "states"],
    code: `// Basic appearances
<Texto appearance='default'>Default text color</Texto>
<Texto appearance='primary'>Primary theme color</Texto>
<Texto appearance='secondary'>Secondary theme color</Texto>
<Texto appearance='white'>White text (for dark backgrounds)</Texto>

// Status appearances
<Texto appearance='success'>Success message</Texto>
<Texto appearance='error'>Error message</Texto>
<Texto appearance='warning'>Warning message</Texto>

// Contextual appearances
<Texto appearance='medium'>Medium emphasis text</Texto>
<Texto appearance='hint'>Hint or placeholder text</Texto>

// Conditional appearance based on state
<Texto appearance={isSelected ? 'white' : 'default'}>
  {item.name}
</Texto>

<Texto appearance={isPositive ? 'success' : 'error'}>
  {formatValue(difference)}
</Texto>`,
  },

  {
    name: "Text Alignment",
    description: "Controlling text alignment with the align prop",
    category: "text",
    complexity: "basic",
    tags: ["align", "alignment", "positioning"],
    code: `// Text alignment options
<Texto align='left'>Left aligned text (default)</Texto>
<Texto align='center'>Center aligned text</Texto>
<Texto align='right'>Right aligned text</Texto>

// Common use case in grids
<Texto align='right'>{formatCurrency(value)}</Texto>

// In card layouts
<Texto align='center' category='h5'>
  Card Title
</Texto>`,
  },

  {
    name: "Text Transformation",
    description: "Using textTransform for case conversion",
    category: "text",
    complexity: "basic",
    tags: ["transform", "case", "uppercase", "capitalize"],
    code: `// Text transformation options
<Texto textTransform='uppercase'>UPPERCASE TEXT</Texto>
<Texto textTransform='lowercase'>lowercase text</Texto>
<Texto textTransform='capitalize'>Capitalize Each Word</Texto>

// Common usage with labels
<Texto textTransform='uppercase' category='label'>
  Product Groups
</Texto>

// With other props
<Texto 
  className='display-card-lighter-text' 
  textTransform='capitalize'
>
  {data.label}
</Texto>`,
  },

  {
    name: "Styling with className and Inline Styles",
    description: "Custom styling through CSS classes and inline styles",
    category: "text",
    complexity: "intermediate",
    tags: ["styling", "className", "style", "css"],
    code: `// Using CSS classes
<Texto className='custom-text-class'>Styled text</Texto>
<Texto className='display-card-lighter-text'>{label}</Texto>
<Texto className='mb-2'>Text with margin bottom</Texto>

// Inline styles
<Texto style={{ color: 'var(--theme-option)' }}>
  Themed color text
</Texto>

<Texto style={{ fontSize: '.8rem', fontWeight: 600 }}>
  Custom sized bold text
</Texto>

<Texto style={{ 
  marginTop: null, 
  whiteSpace: 'nowrap' 
}}>
  No-wrap text
</Texto>

// Combined styling
<Texto 
  className='mr-2' 
  style={{ color: 'var(--theme-color-2)' }}
  weight='bold'
>
  Styled label
</Texto>`,
  },

  {
    name: "Texto with Layout Components",
    description: "Using Texto within Horizontal and Vertical layout components",
    category: "layout",
    complexity: "intermediate",
    tags: ["layout", "horizontal", "vertical", "composition"],
    code: `import { Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr'

// In horizontal layouts
<Horizontal verticalCenter className='mb-2' justifyContent='space-between'>
  <Texto category='h6'>Title</Texto>
  <Texto appearance='medium'>Value</Texto>
</Horizontal>

// In vertical layouts
<Vertical flex={1}>
  <Texto weight='bold' category='p2'>
    {data.value}
  </Texto>
  <Texto className='lighter-text'>{data.label}</Texto>
</Vertical>

// Card-style layout
<Horizontal flex={1} justifyContent='center' className='my-1 mx-2'>
  <Vertical flex={1} className='p-2 bordered bg-1'>
    <Horizontal className='mb-2' justifyContent='space-between'>
      <Texto category='h6'>{title}</Texto>
    </Horizontal>
    <Texto appearance='hint'>{description}</Texto>
  </Vertical>
</Horizontal>`,
  },

  {
    name: "Texto in Grid Column Definitions",
    description: "Using Texto components in GraviGrid cell renderers",
    category: "grid",
    complexity: "intermediate",
    tags: ["grid", "columns", "cellRenderer", "gravigrid"],
    code: `// Basic cell renderer with Texto
const columns = [
  {
    field: 'name',
    headerName: 'Name',
    cellRenderer: (params) => <Texto>{params.data.name}</Texto>
  },
  
  // Conditional styling in cells
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params) => (
      <Texto appearance={params.value ? 'warning' : 'medium'} weight={600}>
        {params.value || 'N/A'}
      </Texto>
    )
  },
  
  // Success/error indication
  {
    field: 'difference',
    headerName: 'Change',
    cellRenderer: (params) => (
      <Texto align='right' appearance={params.value > 0 ? 'success' : 'error'}>
        {formatValue(params.value)}
      </Texto>
    )
  },
  
  // Complex cell with multiple Texto components
  {
    field: 'details',
    headerName: 'Details',
    cellRenderer: (params) => (
      <Vertical>
        <Texto weight='bold'>{params.data.productName}</Texto>
        <Texto appearance='medium'>{params.data.category}</Texto>
      </Vertical>
    )
  }
];`,
  },

  {
    name: "Texto with GraviButton",
    description: "Using Texto as button text content",
    category: "buttons",
    complexity: "intermediate",
    tags: ["button", "gravibutton", "interactive"],
    code: `import { GraviButton, Texto } from '@gravitate-js/excalibrr'

// Simple button with Texto
<GraviButton 
  buttonText={<Texto weight='normal'>Click Me</Texto>} 
  onClick={handleClick}
/>

// Styled button text
<GraviButton 
  className='ghost-gravi-button' 
  buttonText={<Texto weight='normal'>- - -</Texto>}
/>

// Button with appearance
<GraviButton
  buttonText={
    <Texto category='h6' appearance='white'>
      Save Changes
    </Texto>
  }
  theme2
  onClick={handleSave}
/>`,
  },

  {
    name: "Conditional Texto Rendering",
    description: "Conditional rendering and dynamic content patterns",
    category: "conditional",
    complexity: "intermediate",
    tags: ["conditional", "dynamic", "state", "rendering"],
    code: `// Conditional appearance
<Texto weight='bold' appearance={isSelected ? 'white' : 'default'}>
  {group.name}
</Texto>

// Conditional rendering with fallback
{data.label !== 'R-Squared' && data.label}
{data.label === 'R-Squared' && (
  <Texto className='display-card-lighter-text'>
    R<sup>2</sup> (explained)
  </Texto>
)}

// Dynamic styling based on state
<Texto 
  category='p2' 
  weight={600} 
  style={{ color: group?.selected ? 'var(--theme-color-2)' : '' }}
>
  {group.name}
</Texto>

// Status-based appearance
<Texto appearance={getStatusColor(status)}>
  {status.message}
</Texto>`,
  },

  {
    name: "Form Labels and Input Layouts",
    description: "Using Texto for form labels and field layouts",
    category: "forms",
    complexity: "intermediate",
    tags: ["forms", "labels", "inputs", "layout"],
    code: `import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Input } from 'antd'

// Form field with label
<Horizontal className='justify-sb mt-1'>
  <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
    Notes
  </Texto>
  <Form.Item name='Notes'>
    <Input placeholder='Enter notes' />
  </Form.Item>
</Horizontal>

// Field groups
<Horizontal verticalCenter>
  <Texto category='p2'>Property:</Texto>
  <Form.Item name='Property' noStyle>
    <Select placeholder='Select a property' />
  </Form.Item>
</Horizontal>

// Form sections
<Vertical>
  <Texto category='h6' className='ml-3'>
    Section Title
  </Texto>
  <Texto appearance='secondary' className='mt-2'>
    Section description
  </Texto>
</Vertical>`,
  },

  {
    name: "Modal and Drawer Headers",
    description: "Using Texto in modal titles and drawer headers",
    category: "modals",
    complexity: "intermediate",
    tags: ["modal", "drawer", "headers", "titles"],
    code: `import { Modal, Drawer } from 'antd'
import { Texto } from '@gravitate-js/excalibrr'

// Modal title
<Modal
  title={
    <Texto category='h6'>Create New User</Texto>
  }
  visible={visible}
>
  Modal content
</Modal>

// Drawer with styled title
<Drawer
  title={
    <div className='flex justify-sb'>
      <Texto category='h6'>Settings</Texto>
    </div>
  }
  placement='right'
>
  Drawer content
</Drawer>

// Modal with colored header
<Modal
  title={
    <Texto category='h4' appearance='white'>
      UPDATE PLATFORM SETUPS
    </Texto>
  }
>
  Content
</Modal>`,
  },

  {
    name: "Error and Warning Messages",
    description: "Using Texto for error states and warning messages",
    category: "messages",
    complexity: "intermediate",
    tags: ["error", "warning", "messages", "alerts"],
    code: `// Error messages
<Texto appearance='error'>Warning: Issues Detected</Texto>
<Texto appearance='error'>• Some prices have zero customer count</Texto>

// Warning states
<Texto category='p2' className='text-warning' weight={500}>
  Price expires soon
</Texto>

// Success messages
<Texto appearance='success'>Operation completed successfully</Texto>

// Multiple message types
<Vertical className='p-2 issues-detected'>
  <Texto appearance='error'>Warning: Issues Detected</Texto>
  {hasNoCustomers && (
    <Texto appearance='error'>• Some prices have zero customer count</Texto>
  )}
  {hasMissingPrices && (
    <Texto appearance='error'>• Some prices have missing values</Texto>
  )}
</Vertical>`,
  },

  {
    name: "Dashboard and Analytics Display",
    description: "Using Texto for metrics, charts, and dashboard content",
    category: "dashboard",
    complexity: "advanced",
    tags: ["dashboard", "metrics", "analytics", "charts"],
    code: `// Metric display
<Horizontal verticalCenter className='metric-card p-2'>
  <Icon style={{ fontSize: '1.5rem', color: 'var(--theme-color-2)' }} />
  <Vertical>
    <Texto appearance='medium'>{label}</Texto>
    <Texto weight='bold'>{formatValue(value)}</Texto>
  </Vertical>
</Horizontal>

// Chart headers
<Horizontal className='justify-sb p-4' verticalCenter>
  <Texto weight={600}>DELIVERY PERIOD</Texto>
  <Texto weight={600}>PROCESSED (GALS)</Texto>
</Horizontal>

// Summary statistics
<Vertical className='summary-section'>
  <Texto category='h6'>Summary</Texto>
  <Texto>• Total Items: {addCommasToNumber(total)}</Texto>
  <Texto>• Active: {activeCount}</Texto>
  <Texto>• Last Updated: {formatDate(lastUpdate)}</Texto>
</Vertical>

// Status indicators
<Texto category='p2' weight={900}>
  {chartData?.length > 0 ? 'Data Available' : 'No Data'}
</Texto>`,
  },

  {
    name: "Complete Usage Example",
    description:
      "Comprehensive example showing multiple Texto patterns together",
    category: "complete",
    complexity: "advanced",
    tags: ["complete", "comprehensive", "patterns", "example"],
    code: `import { Horizontal, Vertical, Texto, GraviGrid, GraviButton } from '@gravitate-js/excalibrr'

// Complete component example
export function ProductCard({ product, isSelected, onSelect }) {
  return (
    <Vertical className='product-card p-4 bordered'>
      {/* Header */}
      <Horizontal justifyContent='space-between' className='mb-3'>
        <Texto category='h5' weight='bold'>
          {product.name}
        </Texto>
        <Texto 
          appearance={product.status === 'active' ? 'success' : 'error'}
          weight={600}
          textTransform='uppercase'
        >
          {product.status}
        </Texto>
      </Horizontal>
      
      {/* Content */}
      <Vertical className='mb-3'>
        <Horizontal className='mb-2' justifyContent='space-between'>
          <Texto appearance='medium'>Price:</Texto>
          <Texto weight='bold' align='right'>
            {fmt.currency(product.price)}
          </Texto>
        </Horizontal>
        
        <Horizontal className='mb-2' justifyContent='space-between'>
          <Texto appearance='medium'>Category:</Texto>
          <Texto className='category-badge' textTransform='capitalize'>
            {product.category}
          </Texto>
        </Horizontal>
        
        {product.description && (
          <Texto 
            appearance='hint' 
            style={{ fontSize: '.9em' }}
            className='mt-2'
          >
            {product.description}
          </Texto>
        )}
      </Vertical>
      
      {/* Actions */}
      <Horizontal justifyContent='flex-end' style={{ gap: '8px' }}>
        <GraviButton
          buttonText={
            <Texto weight='normal' appearance={isSelected ? 'white' : 'default'}>
              {isSelected ? 'Selected' : 'Select'}
            </Texto>
          }
          theme2={isSelected}
          onClick={() => onSelect(product.id)}
        />
      </Horizontal>
    </Vertical>
  )
}`,
  },
];
