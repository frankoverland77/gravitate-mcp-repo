/**
 * Texto Component Examples Database
 *
 * This file contains production-tested examples of the Texto component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality Texto implementations.
 */

export interface TextoExample {
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

export const TextoExamples: TextoExample[] = [
  {
    id: 'texto_simple_01',
    name: 'Basic Text',
    description: 'Simple text with category only',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['basic', 'minimal', 'heading'],
    code: `<Texto category='h6'>{title}</Texto>`,
    props: {
      category: 'h6',
      children: 'Dynamic title content',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile:
      'src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/AnalysisView/CardDisplayContainer.tsx',
    notes: 'Perfect for simple headings and titles',
  },

  {
    id: 'texto_simple_02',
    name: 'Paragraph Text',
    description: 'Basic paragraph text with category p1/p2',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['paragraph', 'basic', 'content'],
    code: `<Texto category='p1' appearance='default'>
  {currentCounterParty}
</Texto>`,
    props: {
      category: 'p1',
      appearance: 'default',
      children: 'Content text',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile:
      'src/modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/ExternalCounterpartyDisplay.tsx',
    notes: 'Standard pattern for body text and content display',
  },

  {
    id: 'texto_simple_03',
    name: 'Label Text',
    description: 'Label category for form labels and descriptions',
    complexity: 'simple',
    category: 'basic-usage',
    tags: ['label', 'form', 'description'],
    code: `<Texto category='label' appearance='medium'>
  Select a Price Instrument
</Texto>`,
    props: {
      category: 'label',
      appearance: 'medium',
      children: 'Label text',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile: 'src/examples/components/Popover/index.ts',
    notes: 'Ideal for form labels and input descriptions',
  },

  {
    id: 'texto_styled_01',
    name: 'Styled Text with Theme Colors',
    description: 'Text with custom styling using CSS variables',
    complexity: 'simple',
    category: 'styled',
    tags: ['styled', 'theme-colors', 'css-variables'],
    code: `<Texto style={{ color: 'var(--theme-option)' }} category='p2'>
  Counterparty
</Texto>`,
    props: {
      style: 'CSS variables for theme colors',
      category: 'p2',
      children: 'Label text',
    },
    sourceFile:
      'src/modules/SellingPlatform/BuyNow/Prompt/components/CreateOrder/components/ExternalCounterpartyDisplay.tsx',
    notes: 'Shows how to use theme CSS variables for consistent colors',
  },

  {
    id: 'texto_styled_02',
    name: 'Bold Weight Text',
    description: 'Text with bold weight for emphasis',
    complexity: 'simple',
    category: 'styled',
    tags: ['bold', 'weight', 'emphasis'],
    code: `<Texto weight='bold' category='p2'>
  {data[0].value}
</Texto>`,
    props: {
      weight: 'bold',
      category: 'p2',
      children: 'Dynamic value',
    },
    sourceFile:
      'src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/AnalysisView/CardDisplayContainer.tsx',
    notes: 'Common pattern for emphasizing values and important text',
  },

  {
    id: 'texto_styled_03',
    name: 'Aligned Text',
    description: 'Text with alignment and appearance props',
    complexity: 'simple',
    category: 'styled',
    tags: ['alignment', 'appearance', 'center'],
    code: `<Texto align='center' category='label' style={{ textTransform: 'uppercase' }} appearance='medium' weight='bold'>
  Date
</Texto>`,
    props: {
      align: 'center',
      category: 'label',
      style: 'textTransform uppercase',
      appearance: 'medium',
      weight: 'bold',
    },
    sourceFile: 'src/modules/Analytics/PricePerformance/components/Comparison/ComparisonGridHeader.tsx',
    notes: 'Complex styling example for table headers and emphasized labels',
  },

  {
    id: 'texto_medium_01',
    name: 'Text with Class and Transform',
    description: 'Text with custom class and text transformation',
    complexity: 'medium',
    category: 'styled',
    tags: ['className', 'textTransform', 'conditional'],
    code: `<Texto className='display-card-lighter-text' textTransform='capitalize'>
  {data[3].label}
</Texto>`,
    props: {
      className: 'display-card-lighter-text',
      textTransform: 'capitalize',
      children: 'Dynamic label',
    },
    sourceFile:
      'src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/AnalysisView/CardDisplayContainer.tsx',
    notes: 'Shows text transformation and custom CSS classes for styling',
  },

  {
    id: 'texto_medium_02',
    name: 'Grid Header Text',
    description: 'Complex styling for data grid headers',
    complexity: 'medium',
    category: 'data-display',
    tags: ['grid-header', 'weight', 'appearance', 'uppercase'],
    code: `<Texto category='label' appearance='medium' weight='bold' align='right'>
  SYSTEM AVG
</Texto>`,
    props: {
      category: 'label',
      appearance: 'medium',
      weight: 'bold',
      align: 'right',
    },
    sourceFile: 'src/modules/Analytics/PricePerformance/components/Comparison/ComparisonGridHeader.tsx',
    notes: 'Standard pattern for grid column headers with professional styling',
  },

  {
    id: 'texto_medium_03',
    name: 'Conditional Appearance Text',
    description: 'Text with conditional appearance based on data',
    complexity: 'medium',
    category: 'conditional',
    tags: ['conditional', 'appearance', 'data-driven'],
    code: `<Texto align='right' appearance={value > 0 ? 'success' : value < 0 ? 'error' : 'default'}>
  {value.toFixed(2)}
</Texto>`,
    props: {
      align: 'right',
      appearance: 'Conditional based on value (success/error/default)',
      children: 'Formatted decimal value',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile: 'src/modules/Dashboard/AdminDashboard/Tabs/PendingOrders/columnDefs.tsx',
    notes: 'Dynamic appearance based on data values - common for financial data',
  },

  {
    id: 'texto_medium_04',
    name: 'White Appearance Text',
    description: 'Text with white appearance for dark backgrounds',
    complexity: 'medium',
    category: 'themed',
    tags: ['white', 'appearance', 'dark-background'],
    code: `<Texto weight='bold' category='h3' appearance='white'>
  {selectedItemMeta?.ProductName}
</Texto>`,
    props: {
      weight: 'bold',
      category: 'h3',
      appearance: 'white',
      children: 'Dynamic product name',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile: 'src/modules/SellingPlatform/BuyNow/Prompt/components/OrderDetail/OrderHeader.tsx',
    notes: 'Essential for text on dark backgrounds and overlays',
  },

  {
    id: 'texto_complex_01',
    name: 'Multi-styled Display Text',
    description: 'Complex text with multiple style properties and formatting',
    complexity: 'complex',
    category: 'data-display',
    tags: ['complex-styling', 'formatting', 'financial'],
    code: `<Texto align='right' appearance='white' category='h1' style={{ whiteSpace: 'nowrap', fontSize: '2.5em' }}>
  {totalVolume.toLocaleString()}
</Texto>`,
    props: {
      align: 'right',
      appearance: 'white',
      category: 'h1',
      style: 'Custom fontSize and whitespace control',
      children: 'Formatted large number with locale formatting',
    },
    dependencies: ['react', '@gravitate-js/excalibrr'],
    sourceFile:
      'src/modules/SellingPlatform/BuyNow/Forwards/components/Modal/components/SecondStep/components/OrderDisplay.tsx',
    notes: 'Used for prominent data display with custom sizing and formatting',
  },

  {
    id: 'texto_complex_02',
    name: 'HTML Content Text',
    description: 'Text containing HTML markup like superscript',
    complexity: 'complex',
    category: 'formatted-content',
    tags: ['html', 'superscript', 'mathematical'],
    code: `<Texto className='display-card-lighter-text'>
  R<sup>2</sup> (explained)
</Texto>`,
    props: {
      className: 'display-card-lighter-text',
      children: 'HTML with superscript notation',
    },
    sourceFile:
      'src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/AnalysisView/CardDisplayContainer.tsx',
    notes: 'Shows how to include HTML markup for mathematical and scientific notation',
  },

  {
    id: 'texto_complex_03',
    name: 'Status Color Text',
    description: 'Text with complex status-based styling and inline formatting',
    complexity: 'complex',
    category: 'status-display',
    tags: ['status', 'inline-style', 'conditional-color'],
    code: `<Texto style={{ gap: '0.5rem', textDecoration: 'underline' }} className='flex items-center'>
  <LinkOutlined />
  {\`\${cost >= 0 ? '+' : ''}\$\${Math.abs(cost).toFixed(2)}\`}
</Texto>`,
    props: {
      style: 'Complex inline styling with gap and decoration',
      className: 'Flexbox utility classes',
      children: 'Icon and formatted currency with dynamic sign',
    },
    dependencies: ['react', '@gravitate-js/excalibrr', '@ant-design/icons'],
    sourceFile: 'src/modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/ProposedColumns.tsx',
    notes:
      'Advanced pattern for interactive elements with icons and complex formatting. Note: Original uses global fmt utility for currency formatting.',
  },

  {
    id: 'texto_complex_04',
    name: 'Themed Header Text',
    description: 'Complex header text with uppercase transformation and multiple style props',
    complexity: 'complex',
    category: 'headers',
    tags: ['header', 'uppercase', 'weight', 'appearance'],
    code: `<Texto category='label' appearance='medium' weight='bold' textTransform='uppercase'>
  {selectedMetricType === 'AverageMargin' ? 'Margin' : selectedMetricType}
</Texto>`,
    props: {
      category: 'label',
      appearance: 'medium',
      weight: 'bold',
      textTransform: 'uppercase',
      children: 'Conditional text based on metric type',
    },
    sourceFile: 'src/modules/Analytics/PricePerformance/components/Comparison/ComparisonGridHeader.tsx',
    notes: 'Professional header pattern with conditional content and consistent styling',
  },

  {
    id: 'texto_complex_05',
    name: 'Interactive Link Text',
    description: 'Text used within interactive elements with complex state styling',
    complexity: 'complex',
    category: 'interactive',
    tags: ['interactive', 'link', 'status-styling', 'grid-cell'],
    code: `<Texto style={{ ...statusStyle }} className='mx-1'>
  ({params?.data?.CostStatusSymbol})
</Texto>`,
    props: {
      style: 'Dynamic status-based styling spread',
      className: 'Margin utility classes',
      children: 'Status symbol with parentheses',
    },
    sourceFile: 'src/modules/PricingEngine/QuoteBook/components/Grid/components/columns/sections/ProposedColumns.tsx',
    notes: 'Used in grid cells for status indicators with dynamic theming',
  },
]

export default TextoExamples
