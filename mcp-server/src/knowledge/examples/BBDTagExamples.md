# BBDTag Component Examples

## Overview

The BBDTag component is a versatile tag component built on top of Ant Design's Tag component, providing themed styling and consistent visual patterns across the application.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `theme1` | `boolean` | Applies theme 1 styling |
| `theme2` | `boolean` | Applies theme 2 styling |
| `theme3` | `boolean` | Applies theme 3 styling |
| `theme4` | `boolean` | Applies theme 4 styling |
| `success` | `boolean` | Applies success state styling (green) |
| `warning` | `boolean` | Applies warning state styling (yellow/orange) |
| `error` | `boolean` | Applies error state styling (red) |
| `textTransform` | `CSSProperties['textTransform']` | Text transformation |
| `className` | `string` | Additional CSS class names |
| `style` | `CSSProperties` | Inline styles object |
| `children` | `ReactNode` | Tag content |

## Basic Usage

### Simple Theme Tags
```tsx
<BBDTag theme1>Theme 1 Tag</BBDTag>
<BBDTag theme2>Theme 2 Tag</BBDTag>
<BBDTag theme3>Theme 3 Tag</BBDTag>
<BBDTag theme4>Theme 4 Tag</BBDTag>
```

### Status Tags
```tsx
<BBDTag success>Success State</BBDTag>
<BBDTag warning>Warning State</BBDTag>
<BBDTag error>Error State</BBDTag>
```

## Form Validation

### Password Validation Example
```tsx
<BBDTag
  success={!policyErrors?.some((e) => e.type === 'length')}
  style={{ textTransform: 'capitalize' }}
>
  At least {passwordPolicy?.length} {passwordPolicy?.length > 1 ? 'characters' : 'character'}
</BBDTag>
```

### Multiple Validation Rules
```tsx
{validationRules.map(rule => (
  <BBDTag
    key={rule.type}
    success={rule.isValid}
    error={!rule.isValid}
    style={{ textTransform: 'capitalize' }}
  >
    {rule.message}
  </BBDTag>
))}
```

## Filter Tags

### Removable Filter
```tsx
<BBDTag theme2 className='filter-tag my-2'>
  <span className='filter-tag-label'>
    {filterName}
  </span>
  <CloseOutlined
    className='filter-tag-close ml-2'
    onClick={() => handleRemoveFilter(filterId)}
  />
</BBDTag>
```

## Grid Cell Usage

### Basic Grid Cell Tag
```tsx
<Tooltip title={cellValue}>
  <div>
    <BBDTag
      {...tagTheme}
      className={classNames('text-ellipsis', className)}
    >
      {cellValue}
    </BBDTag>
  </div>
</Tooltip>
```

### Right-Aligned Numeric Tag
```tsx
<div className='flex items-end justify-end'>
  <BBDTag
    success={isPositive}
    error={isNegative}
  >
    <span className='text-xs font-normal'>
      {formattedValue}
    </span>
  </BBDTag>
</div>
```

## Multiple Tags

### Tag Array Display
```tsx
{tagItems.map((item, index) => (
  <BBDTag className='text-ellipsis' key={index}>
    {item}
  </BBDTag>
))}
```

### Tag Collection with Overflow
```tsx
<div className="tags-container">
  {visibleItems.map((item, index) => (
    <BBDTag key={index} className="text-ellipsis">
      {item}
    </BBDTag>
  ))}
  {hasMore && (
    <Tooltip title={hiddenItems.join(', ')}>
      <BBDTag theme2>+{hiddenCount} more</BBDTag>
    </Tooltip>
  )}
</div>
```

## Advanced Usage

### Conditional Theming
```tsx
<BBDTag
  {...(priority === 'high' ? { error: true } :
      priority === 'medium' ? { warning: true } :
      { success: true })}
  className={cn('priority-tag', priorityClass)}
>
  {priority} Priority
</BBDTag>
```

### Custom Styling
```tsx
<BBDTag
  textTransform="uppercase"
  className="font-bold"
  style={{
    letterSpacing: '0.5px',
    margin: '4px'
  }}
>
  Custom Styled Tag
</BBDTag>
```

### Complex Child Components
```tsx
<BBDTag success={showGreen} error={showRed}>
  <DeltaContents
    threshold={threshold}
    value={value}
    {...deltaProps}
  />
</BBDTag>
```

## Best Practices

### Theme Usage
- Use `theme1-4` for different information hierarchies
- Reserve `success/warning/error` for status-based content
- Combine themes with custom styling for brand consistency

### Performance
- Use `React.memo` for frequently re-rendered tag lists
- Optimize map operations with proper key props
- Consider virtualization for large tag collections

### Accessibility
- Include meaningful text content for screen readers
- Use appropriate color contrast ratios
- Provide alternative text for icon-only content

### Styling
- Use `textTransform` prop instead of CSS for text casing
- Leverage CSS variables for theme consistency
- Use utility classes for common spacing and sizing

## Common Patterns

### Status Indicators
```tsx
<BBDTag
  success={status === 'active'}
  error={status === 'inactive'}
  warning={status === 'pending'}
>
  {status.toUpperCase()}
</BBDTag>
```

### Interactive Tags
```tsx
<BBDTag
  theme1
  className="cursor-pointer hover:opacity-80"
  onClick={() => handleTagClick(tagData)}
>
  {tagLabel}
</BBDTag>
```

### Loading States
```tsx
<BBDTag success={!isLoading && isValid} error={!isLoading && !isValid}>
  {isLoading ? 'Validating...' : validationResult}
</BBDTag>
```