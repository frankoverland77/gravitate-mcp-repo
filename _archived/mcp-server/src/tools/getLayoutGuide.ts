/**
 * Layout Guide Tool - Phase 2 Specialized Skill
 * 
 * Provides comprehensive guidance for layouts with Horizontal/Vertical,
 * spacing patterns, and typography with Texto.
 */

export interface GetLayoutGuideRequest {
  /** Get a specific topic */
  topic?: 'basics' | 'spacing' | 'typography' | 'composition' | 'patterns' | 'all';
  /** Return raw JSON instead of formatted markdown */
  raw?: boolean;
  /** Get condensed summary for quick reference */
  summary?: boolean;
}

export interface GetLayoutGuideResponse {
  content: Array<{ type: string; text: string }>;
}

function getLayoutSummary(): string {
  return `# Layout Quick Reference

## Core Components (NEVER use raw HTML)
- \`<Horizontal>\` instead of \`<div style={{display:'flex'}}>\`
- \`<Vertical>\` instead of \`<div style={{display:'flex',flexDirection:'column'}}>\`
- \`<Texto>\` instead of \`<p>\`, \`<h1>\`, \`<span>\`, etc.

## Horizontal
\`\`\`tsx
<Horizontal 
  justifyContent="space-between"  // flex alignment
  alignItems="center"
  className="gap-12 p-2"          // spacing via utility classes
>
  {children}
</Horizontal>
\`\`\`

## Vertical
\`\`\`tsx
<Vertical 
  justifyContent="flex-start"
  alignItems="stretch"
  className="gap-8 p-3"
>
  {children}
</Vertical>
\`\`\`

## Texto Typography
\`\`\`tsx
// Heading
<Texto category="h6" weight="600">Section Title</Texto>

// Body text
<Texto category="p1">Main content</Texto>

// Secondary/gray text (use "medium" NOT "secondary")
<Texto category="p2" appearance="medium">Helper text</Texto>

// Label
<Texto category="label" appearance="medium" style={{ textTransform: 'uppercase' }}>
  Field Label
</Texto>
\`\`\`

## Critical Gotchas
❌ \`appearance="secondary"\` → ✅ \`appearance="medium"\` (for gray text)
❌ \`gap={12}\` → ✅ \`className="gap-12"\`
❌ \`style={{display:'flex'}}\` → ✅ \`<Horizontal>\`
❌ \`<p>\`, \`<span>\` → ✅ \`<Texto>\`

## Utility Classes
\`\`\`
// Spacing
gap-8, gap-10, gap-12, gap-16   // between children
p-1, p-2, p-3, p-4              // padding
mb-1, mb-2, mb-4                // margin-bottom
mt-1, mt-2, mt-4                // margin-top
ml-2, mr-2                      // margin left/right

// Other
border-radius-5                  // rounded corners
\`\`\`
`;
}

function getSpacingGuide(): string {
  return `# Spacing Guide

## Utility Classes (Preferred Method)

### Gap (Space Between Children)
\`\`\`tsx
<Horizontal className="gap-8">   // 8px between items
<Horizontal className="gap-10">  // 10px
<Horizontal className="gap-12">  // 12px (common for buttons)
<Horizontal className="gap-16">  // 16px
\`\`\`

### Padding
\`\`\`tsx
<Vertical className="p-1">  // 4px padding all around
<Vertical className="p-2">  // 8px
<Vertical className="p-3">  // 12px (common for cards/forms)
<Vertical className="p-4">  // 16px
\`\`\`

### Margin
\`\`\`tsx
// Margin bottom
<Texto className="mb-1">  // 4px
<Texto className="mb-2">  // 8px
<Texto className="mb-4">  // 16px

// Margin top
<Texto className="mt-1">  // 4px
<Texto className="mt-2">  // 8px

// Margin left/right
<Horizontal className="ml-2 mr-2">
\`\`\`

### Border Radius
\`\`\`tsx
<Vertical className="border-radius-5">  // 5px radius
\`\`\`

## Combining Multiple Classes
\`\`\`tsx
<Vertical className="p-3 gap-12 mb-2">
  <Texto category="h6" className="mb-1">Title</Texto>
  <Horizontal className="gap-8">
    <GraviButton buttonText="Cancel" />
    <GraviButton success buttonText="Save" />
  </Horizontal>
</Vertical>
\`\`\`

## Inline Styles (Last Resort)
When utility classes aren't available, use inline styles with theme variables:

\`\`\`tsx
// Only when utility class doesn't exist
<Vertical style={{ 
  gap: '24px',  // No gap-24 utility class
  padding: 'var(--theme-spacing-large)',
}}>
\`\`\`

## Common Patterns

### Card Layout
\`\`\`tsx
<Vertical className="p-3 border-radius-5" style={{ backgroundColor: 'var(--theme-bg-secondary)' }}>
  <Texto category="h6" weight="600" className="mb-2">Card Title</Texto>
  <Texto category="p1">Card content here</Texto>
</Vertical>
\`\`\`

### Button Row
\`\`\`tsx
<Horizontal justifyContent="flex-end" className="gap-12 mt-2">
  <GraviButton buttonText="Cancel" />
  <GraviButton success buttonText="Save" />
</Horizontal>
\`\`\`

### Header with Actions
\`\`\`tsx
<Horizontal justifyContent="space-between" alignItems="center" className="mb-2">
  <Texto category="h6" weight="600">Page Title</Texto>
  <Horizontal className="gap-8">
    <GraviButton theme1 buttonText="Export" />
    <GraviButton success buttonText="Add New" />
  </Horizontal>
</Horizontal>
\`\`\`
`;
}

function getTypographyGuide(): string {
  return `# Typography Guide with Texto

## Basic Usage
\`\`\`tsx
import { Texto } from '@gravitate-js/excalibrr';

<Texto category="p1">Default body text</Texto>
\`\`\`

## Category (Font Size)

| Category | Use Case | Approx Size |
|----------|----------|-------------|
| \`h1\` | Main page title | 32px |
| \`h2\` | Section header | 28px |
| \`h3\` | Subsection | 24px |
| \`h4\` | Card title | 20px |
| \`h5\` | Small header | 18px |
| \`h6\` | Mini header | 16px |
| \`p1\` | Body text (default) | 14px |
| \`p2\` | Small/helper text | 12px |
| \`label\` | Form labels | 12px |

## Appearance (Color)

| Value | Color | Use Case |
|-------|-------|----------|
| (none) | Default text | Primary content |
| \`medium\` | Gray | Secondary text, labels |
| \`secondary\` | **BLUE** (not gray!) | Links, emphasis |
| \`link\` | Blue link | Clickable text |
| \`success\` | Green | Positive status |
| \`danger\` | Red | Error, warning |
| \`warning\` | Orange | Caution |

### ⚠️ CRITICAL: Gray Text
\`\`\`tsx
// ❌ WRONG - "secondary" is BLUE, not gray!
<Texto appearance="secondary">This is blue text</Texto>

// ✅ CORRECT - use "medium" for gray
<Texto appearance="medium">This is gray text</Texto>
\`\`\`

## Weight

\`\`\`tsx
<Texto weight="400">Normal weight</Texto>
<Texto weight="500">Medium weight</Texto>
<Texto weight="600">Semi-bold (common for headers)</Texto>
<Texto weight="700">Bold</Texto>
\`\`\`

## Common Patterns

### Page Title
\`\`\`tsx
<Texto category="h4" weight="600">Products Management</Texto>
\`\`\`

### Section Header
\`\`\`tsx
<Texto 
  category="h6" 
  appearance="medium" 
  weight="600" 
  style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
>
  Basic Information
</Texto>
\`\`\`

### Form Field Label
\`\`\`tsx
<Texto 
  category="p2" 
  appearance="medium" 
  style={{ textTransform: 'uppercase' }}
>
  Product Name
</Texto>
\`\`\`

### Field Value (Read-only Display)
\`\`\`tsx
<Texto category="p1" weight="600">$1,234.56</Texto>
\`\`\`

### Helper Text
\`\`\`tsx
<Texto category="p2" appearance="medium">
  Enter the product SKU code
</Texto>
\`\`\`

### Status Text
\`\`\`tsx
<Texto appearance="success">Active</Texto>
<Texto appearance="danger">Inactive</Texto>
\`\`\`

### Link Text
\`\`\`tsx
<a onClick={handleClick}>
  <Texto appearance="link">View Details</Texto>
</a>
\`\`\`

## Display Details Pattern
\`\`\`tsx
// Common pattern for showing field/value pairs
function FieldDisplay({ label, value }) {
  return (
    <Vertical className="mb-2">
      <Texto 
        category="p2" 
        appearance="medium" 
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </Texto>
      <Texto category="p1" weight="600">{value}</Texto>
    </Vertical>
  );
}

// Usage
<FieldDisplay label="Customer Name" value="Acme Corp" />
<FieldDisplay label="Order Total" value="$5,432.00" />
\`\`\`
`;
}

function getCompositionGuide(): string {
  return `# Layout Composition Guide

## Basic Flex Alignment

### Horizontal Props
\`\`\`tsx
<Horizontal
  justifyContent="flex-start"      // left align (default)
  justifyContent="center"          // center
  justifyContent="flex-end"        // right align
  justifyContent="space-between"   // spread with space between
  justifyContent="space-around"    // spread with space around
  
  alignItems="flex-start"          // top align
  alignItems="center"              // vertical center (default)
  alignItems="flex-end"            // bottom align
  alignItems="stretch"             // fill height
>
\`\`\`

### Vertical Props
\`\`\`tsx
<Vertical
  justifyContent="flex-start"      // top align (default)
  justifyContent="center"          // vertical center
  justifyContent="flex-end"        // bottom align
  justifyContent="space-between"   // spread vertically
  
  alignItems="flex-start"          // left align
  alignItems="center"              // horizontal center
  alignItems="flex-end"            // right align
  alignItems="stretch"             // fill width (default)
>
\`\`\`

## Common Compositions

### Header Bar
\`\`\`tsx
<Horizontal 
  justifyContent="space-between" 
  alignItems="center" 
  className="p-2 mb-2"
>
  <Texto category="h6" weight="600">Page Title</Texto>
  <Horizontal className="gap-8">
    <GraviButton buttonText="Export" />
    <GraviButton success buttonText="Add New" />
  </Horizontal>
</Horizontal>
\`\`\`

### Card with Header and Body
\`\`\`tsx
<Vertical 
  className="p-3 border-radius-5" 
  style={{ backgroundColor: 'var(--theme-bg-secondary)' }}
>
  <Horizontal justifyContent="space-between" className="mb-2">
    <Texto category="h6" weight="600">Card Title</Texto>
    <GraviButton theme1 buttonText="Edit" />
  </Horizontal>
  <Vertical className="gap-8">
    <Texto category="p1">Card content goes here</Texto>
  </Vertical>
</Vertical>
\`\`\`

### Two-Column Layout
\`\`\`tsx
<Horizontal className="gap-16">
  <Vertical style={{ flex: 1 }}>
    {/* Left column content */}
  </Vertical>
  <Vertical style={{ flex: 1 }}>
    {/* Right column content */}
  </Vertical>
</Horizontal>
\`\`\`

### Main + Sidebar
\`\`\`tsx
<Horizontal className="gap-16">
  <Vertical style={{ flex: 3 }}>
    {/* Main content - 75% */}
  </Vertical>
  <Vertical style={{ flex: 1 }}>
    {/* Sidebar - 25% */}
  </Vertical>
</Horizontal>
\`\`\`

### Centered Content
\`\`\`tsx
<Horizontal justifyContent="center" alignItems="center" style={{ height: '100%' }}>
  <Vertical alignItems="center" className="gap-12">
    <Texto category="h4">No Data Found</Texto>
    <Texto appearance="medium">Try adjusting your filters</Texto>
    <GraviButton theme1 buttonText="Reset Filters" />
  </Vertical>
</Horizontal>
\`\`\`

### Footer Actions
\`\`\`tsx
<Horizontal justifyContent="flex-end" className="gap-12 mt-2 pt-2" 
  style={{ borderTop: '1px solid var(--theme-border)' }}
>
  <GraviButton buttonText="Cancel" onClick={onCancel} />
  <GraviButton success buttonText="Save" onClick={onSave} />
</Horizontal>
\`\`\`

## Nesting Guidelines

1. **Keep nesting shallow** - Max 3-4 levels deep
2. **Extract complex layouts** - Make reusable components
3. **Use semantic naming** - \`<HeaderBar>\`, \`<ActionButtons>\`, etc.

\`\`\`tsx
// ❌ Too deeply nested
<Vertical>
  <Horizontal>
    <Vertical>
      <Horizontal>
        <Vertical>...</Vertical>
      </Horizontal>
    </Vertical>
  </Horizontal>
</Vertical>

// ✅ Extract components
function PageHeader({ title, actions }) {
  return (
    <Horizontal justifyContent="space-between" className="mb-2">
      <Texto category="h6" weight="600">{title}</Texto>
      <Horizontal className="gap-8">{actions}</Horizontal>
    </Horizontal>
  );
}
\`\`\`
`;
}

function getPatternsGuide(): string {
  return `# Layout Patterns

## 1. Page Layout
\`\`\`tsx
function MyPage() {
  return (
    <Vertical className="p-3" style={{ height: '100%' }}>
      {/* Header */}
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-3">
        <Texto category="h5" weight="600">Page Title</Texto>
        <Horizontal className="gap-8">
          <GraviButton buttonText="Export" />
          <GraviButton success buttonText="Add New" />
        </Horizontal>
      </Horizontal>

      {/* Filters */}
      <Horizontal className="gap-12 mb-2">
        <Input placeholder="Search..." style={{ width: 200 }} />
        <Select placeholder="Category" options={categoryOptions} />
      </Horizontal>

      {/* Content (grid fills remaining space) */}
      <Vertical style={{ flex: 1 }}>
        <GraviGrid rowData={data} columnDefs={columnDefs} />
      </Vertical>
    </Vertical>
  );
}
\`\`\`

## 2. Details Panel
\`\`\`tsx
function DetailsPanel({ item }) {
  return (
    <Vertical className="p-3 gap-16">
      {/* Section 1 */}
      <Vertical>
        <Texto 
          category="h6" 
          appearance="medium" 
          weight="600" 
          className="mb-2"
          style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Basic Information
        </Texto>
        
        <Horizontal className="gap-16">
          <FieldDisplay label="Name" value={item.name} />
          <FieldDisplay label="Category" value={item.category} />
        </Horizontal>
        
        <Horizontal className="gap-16">
          <FieldDisplay label="Price" value={\`$\${item.price}\`} />
          <FieldDisplay label="Status" value={item.status} />
        </Horizontal>
      </Vertical>

      {/* Section 2 */}
      <Vertical>
        <Texto 
          category="h6" 
          appearance="medium" 
          weight="600" 
          className="mb-2"
          style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Additional Details
        </Texto>
        <Texto category="p1">{item.description}</Texto>
      </Vertical>
    </Vertical>
  );
}

function FieldDisplay({ label, value }) {
  return (
    <Vertical style={{ flex: 1 }}>
      <Texto 
        category="p2" 
        appearance="medium" 
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </Texto>
      <Texto category="p1" weight="600">{value || '—'}</Texto>
    </Vertical>
  );
}
\`\`\`

## 3. Empty State
\`\`\`tsx
function EmptyState({ message, actionText, onAction }) {
  return (
    <Vertical 
      justifyContent="center" 
      alignItems="center" 
      className="p-4"
      style={{ height: 300 }}
    >
      <Texto category="h5" className="mb-2">No Data Found</Texto>
      <Texto category="p1" appearance="medium" className="mb-3">
        {message || 'Try adjusting your search or filters'}
      </Texto>
      {onAction && (
        <GraviButton theme1 buttonText={actionText || 'Reset'} onClick={onAction} />
      )}
    </Vertical>
  );
}
\`\`\`

## 4. Loading State
\`\`\`tsx
function LoadingState({ message }) {
  return (
    <Horizontal justifyContent="center" alignItems="center" style={{ height: 200 }}>
      <Spin size="large" />
      {message && (
        <Texto category="p1" appearance="medium" className="ml-2">
          {message}
        </Texto>
      )}
    </Horizontal>
  );
}
\`\`\`

## 5. Stats Row
\`\`\`tsx
function StatsRow({ stats }) {
  return (
    <Horizontal className="gap-16 mb-3">
      {stats.map((stat, index) => (
        <Vertical 
          key={index}
          className="p-2 border-radius-5"
          style={{ 
            flex: 1, 
            backgroundColor: 'var(--theme-bg-secondary)' 
          }}
        >
          <Texto category="p2" appearance="medium">
            {stat.label}
          </Texto>
          <Texto category="h5" weight="600">
            {stat.value}
          </Texto>
        </Vertical>
      ))}
    </Horizontal>
  );
}

// Usage
<StatsRow stats={[
  { label: 'Total Orders', value: '1,234' },
  { label: 'Revenue', value: '$45,678' },
  { label: 'Active Users', value: '567' },
]} />
\`\`\`

## 6. Tabs Layout
\`\`\`tsx
function TabbedContent() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Vertical className="p-3">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          { key: 'overview', label: 'Overview' },
          { key: 'details', label: 'Details' },
          { key: 'history', label: 'History' },
        ]}
      />
      
      <Vertical className="mt-2">
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'details' && <DetailsPanel />}
        {activeTab === 'history' && <HistoryPanel />}
      </Vertical>
    </Vertical>
  );
}
\`\`\`
`;
}

export async function getLayoutGuideTool(args: GetLayoutGuideRequest): Promise<GetLayoutGuideResponse> {
  const { topic = 'all', raw = false, summary = false } = args;
  
  try {
    if (summary) {
      return {
        content: [{ type: 'text', text: getLayoutSummary() }]
      };
    }
    
    let output = '';
    
    switch (topic) {
      case 'basics':
        output = getLayoutSummary();
        break;
      case 'spacing':
        output = getSpacingGuide();
        break;
      case 'typography':
        output = getTypographyGuide();
        break;
      case 'composition':
        output = getCompositionGuide();
        break;
      case 'patterns':
        output = getPatternsGuide();
        break;
      case 'all':
      default:
        output = [
          getLayoutSummary(),
          getSpacingGuide(),
          getTypographyGuide(),
          getCompositionGuide(),
          getPatternsGuide(),
        ].join('\n\n---\n\n');
    }
    
    if (raw) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ topic, content: output }, null, 2) }]
      };
    }
    
    return {
      content: [{ type: 'text', text: output }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error getting layout guide: ${errorMessage}` }]
    };
  }
}
