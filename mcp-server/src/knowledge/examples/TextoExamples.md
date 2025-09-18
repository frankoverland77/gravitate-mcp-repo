# Texto Component Examples

## Overview

The **Texto** component is the foundational typography component in Excalibrr, providing consistent text styling throughout the application. It supports various categories, appearances, and styling options while maintaining theme consistency.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `category` | `string` | Text size/hierarchy: h1, h2, h3, h4, h5, h6, heading, heading-small, p1, p2 |
| `appearance` | `string` | Visual styling: primary, secondary, light, medium, error, success, warning |
| `weight` | `string` | Font weight: normal, bold, or numeric values |
| `align` | `string` | Text alignment: left, center, right, justify |
| `className` | `string` | Additional CSS classes |
| `style` | `CSSProperties` | Inline styles |
| `children` | `ReactNode` | Text content |

## Typography Hierarchy

### Headings

```tsx
// Large headings
<Texto category="h1">Main Page Title</Texto>
<Texto category="h2">Section Heading</Texto>
<Texto category="h3">Subsection Heading</Texto>

// Medium headings
<Texto category="h4">Component Title</Texto>
<Texto category="h5">Card Header</Texto>
<Texto category="h6">Small Header</Texto>

// Semantic headings
<Texto category="heading">Primary Heading</Texto>
<Texto category="heading-small">Secondary Heading</Texto>
```

### Body Text

```tsx
// Paragraph text
<Texto category="p1">Main body text with good readability</Texto>
<Texto category="p2">Secondary text, smaller and lighter</Texto>

// No category (default)
<Texto>Default text styling</Texto>
```

## Appearance Variations

### Semantic Appearances
```tsx
// Standard appearances
<Texto appearance="primary">Primary text emphasis</Texto>
<Texto appearance="secondary">Secondary text, less prominent</Texto>
<Texto appearance="light">Light text for subtle content</Texto>
<Texto appearance="medium">Medium emphasis text</Texto>

// Status appearances
<Texto appearance="error">Error message text</Texto>
<Texto appearance="success">Success message text</Texto>
<Texto appearance="warning">Warning message text</Texto>
```

### Visual Examples by Category and Appearance
```tsx
// Error states
<Texto category="p1" appearance="error">Critical error message</Texto>
<Texto category="p2" appearance="error">Field validation error</Texto>

// Success states
<Texto category="h5" appearance="success">Operation Completed</Texto>
<Texto category="p2" appearance="success">All validations passed</Texto>

// Secondary information
<Texto category="p2" appearance="secondary">Additional details</Texto>
<Texto category="heading-small" appearance="medium">Section Label</Texto>
```

## Styling and Formatting

### Font Weight
```tsx
// Using weight prop
<Texto weight="bold">Bold text emphasis</Texto>
<Texto weight="normal">Normal weight text</Texto>

// Using style prop
<Texto style={{ fontWeight: 600 }}>Semi-bold text</Texto>
<Texto style={{ fontWeight: 'bold' }}>Bold via style</Texto>
```

### Text Alignment
```tsx
<Texto align="center">Centered text</Texto>
<Texto align="right">Right-aligned text</Texto>
<Texto align="justify">Justified text content</Texto>

// Using style prop
<Texto style={{ textAlign: 'center' }}>Centered with style</Texto>
```

### Text Transform
```tsx
<Texto style={{ textTransform: 'uppercase' }}>UPPERCASE TEXT</Texto>
<Texto style={{ textTransform: 'lowercase' }}>lowercase text</Texto>
<Texto style={{ textTransform: 'capitalize' }}>Capitalize Each Word</Texto>
```

## Color and Theming

### Theme Colors
```tsx
// Using theme CSS variables
<Texto style={{ color: 'var(--theme-color-2)' }}>Themed color text</Texto>
<Texto style={{ color: 'var(--theme-error)' }}>Error theme color</Texto>
<Texto style={{ color: 'var(--theme-success)' }}>Success theme color</Texto>
<Texto style={{ color: 'var(--theme-warning)' }}>Warning theme color</Texto>
```

### Custom Colors
```tsx
<Texto style={{ color: '#666' }}>Custom gray text</Texto>
<Texto style={{ color: '#1890ff' }}>Custom blue text</Texto>
```

## Layout and Spacing

### Margins and Padding
```tsx
// Using className
<Texto className="mb-3" category="h3">Heading with bottom margin</Texto>
<Texto className="mt-2" category="p2">Paragraph with top margin</Texto>

// Using style prop
<Texto style={{ marginBottom: '16px' }}>Text with custom margin</Texto>
<Texto style={{ padding: '8px 12px' }}>Text with padding</Texto>
```

### Line Height and Spacing
```tsx
<Texto style={{ lineHeight: '1.6' }}>Text with custom line height</Texto>
<Texto style={{ letterSpacing: '0.5px' }}>Text with letter spacing</Texto>
<Texto style={{ wordSpacing: '2px' }}>Text with word spacing</Texto>
```

## Interactive Text

### Clickable Text
```tsx
<Texto
  style={{ cursor: 'pointer', textDecoration: 'underline' }}
  onClick={() => handleClick()}
>
  Clickable text link
</Texto>

// Link-style text
<Texto
  style={{
    color: 'var(--theme-primary)',
    cursor: 'pointer',
    textDecoration: 'underline'
  }}
  onClick={handleNavigate}
>
  Navigate to page
</Texto>
```

### Hover States
```tsx
<Texto
  className="hover:text-blue-600 cursor-pointer"
  style={{ transition: 'color 0.2s' }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
  Hover-interactive text
</Texto>
```

## Common Patterns

### Card Headers
```tsx
<div className="card">
  <Texto category="h5" className="mb-2" style={{ color: 'var(--theme-color-2)' }}>
    Card Title
  </Texto>
  <Texto category="p2" appearance="secondary">
    Card description or subtitle
  </Texto>
</div>
```

### Form Labels and Descriptions
```tsx
// Form field label
<Texto category="p1" style={{ fontWeight: '600', marginBottom: '4px' }}>
  Field Label
</Texto>

// Field description
<Texto category="p2" appearance="secondary" style={{ marginTop: '4px' }}>
  Additional field information or validation hints
</Texto>

// Error message
<Texto category="p2" appearance="error" style={{ marginTop: '4px' }}>
  Field is required
</Texto>
```

### Navigation and Menu Items
```tsx
// Active menu item
<Texto
  category="p1"
  style={{
    fontWeight: 'bold',
    color: 'var(--theme-primary)'
  }}
>
  Active Menu Item
</Texto>

// Inactive menu item
<Texto
  category="p1"
  appearance="secondary"
  style={{ cursor: 'pointer' }}
  onClick={handleMenuClick}
>
  Menu Item
</Texto>
```

### Status and Badge Text
```tsx
// Status indicators
<Texto
  category="p2"
  appearance="success"
  style={{
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  }}
>
  Active
</Texto>

<Texto
  category="p2"
  appearance="error"
  style={{
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  }}
>
  Inactive
</Texto>
```

### Data Display
```tsx
// Label-value pairs
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <Texto category="p2" appearance="secondary">Label:</Texto>
  <Texto category="p2" weight="bold">Value</Texto>
</div>

// Numeric data
<Texto
  category="h4"
  align="right"
  style={{
    fontFamily: 'monospace',
    color: 'var(--theme-success)'
  }}
>
  $1,234.56
</Texto>
```

### List and Description Items
```tsx
// Description list
<div>
  <Texto category="p1" weight="bold" className="mb-1">
    Item Name
  </Texto>
  <Texto category="p2" appearance="secondary" className="mb-2">
    Item description with additional details about functionality
  </Texto>
  <Texto category="p2" style={{ color: 'var(--theme-color-3)' }}>
    Last updated: {formatDate(item.updatedAt)}
  </Texto>
</div>
```

## Responsive Typography

### Mobile Considerations
```tsx
// Responsive sizing
<Texto
  category="h3"
  style={{
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    lineHeight: '1.4'
  }}
>
  Responsive heading
</Texto>

// Responsive spacing
<Texto
  category="p1"
  style={{
    marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
    lineHeight: 'clamp(1.4, 1.6, 1.8)'
  }}
>
  Responsive paragraph
</Texto>
```

## Accessibility

### Semantic Usage
```tsx
// Use appropriate categories for semantic meaning
<Texto category="h1">Main Page Title</Texto> {/* Should be the main heading */}
<Texto category="h2">Section Title</Texto>   {/* Section headings */}
<Texto category="p1">Main content</Texto>    {/* Primary content */}
<Texto category="p2">Supporting text</Texto> {/* Secondary content */}
```

### Screen Reader Considerations
```tsx
// Provide context for important text
<Texto category="p2" style={{ color: 'var(--theme-error)' }}>
  <span className="sr-only">Error: </span>
  Field is required
</Texto>

// Use aria-label for interactive text
<Texto
  onClick={handleEdit}
  style={{ cursor: 'pointer' }}
  aria-label="Edit item"
>
  ✏️ Edit
</Texto>
```

## Best Practices

### Hierarchy and Consistency
- Use heading categories (h1-h6) for proper document structure
- Maintain consistent spacing between text elements
- Use appearance props for semantic meaning (error, success, warning)
- Combine category and appearance for optimal readability

### Performance and Styling
- Prefer CSS classes over inline styles when possible
- Use theme CSS variables for consistent coloring
- Avoid excessive nesting of styled components
- Use appropriate font weights for emphasis without overuse

### Accessibility and UX
- Ensure sufficient color contrast for all text
- Use semantic categories for proper screen reader navigation
- Provide clear visual hierarchy with appropriate sizing
- Test text scaling and responsive behavior

### Integration with Components
- Use Texto consistently within other components
- Maintain theme alignment across all text usage
- Consider text content length and truncation needs
- Integrate properly with form validation and feedback systems