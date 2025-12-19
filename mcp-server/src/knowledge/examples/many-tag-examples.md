# ManyTag Component Examples

## Overview

The ManyTag component is designed for displaying collections of tags with intelligent overflow handling. When the number of tags exceeds the specified `maxCount`, it shows a "+N more" indicator, making it perfect for space-constrained interfaces like grid cells, user profiles, and cards.

## Props

| Prop | Type | Description |
|------|------|-------------|
| `tagItems` | `string[]` \| `any[]` | Array of items to display as tags. Can be strings or objects (will use display property) |
| `maxCount` | `number` | Maximum number of tags to show before displaying "+N more" overflow indicator |
| `theme` | `string` | Optional theme for styling the tags (inherits from BBDTag themes) |
| `className` | `string` | Additional CSS class names |
| `style` | `CSSProperties` | Inline styles object |

## Basic Usage

### Simple String Array
```tsx
const skills = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker']

<ManyTag tagItems={skills} maxCount={3} />
// Displays: [React] [TypeScript] [Node.js] +2 more
```

### User Roles Display
```tsx
<ManyTag tagItems={securityContext.Roles} maxCount={2} />
// Common pattern in user profiles and navigation
```

## Grid Integration

### Cell Renderer for Multi-Select Data
```tsx
{
  field: "ProductIds",
  headerName: "Products",
  cellRenderer: ({ value }) => {
    const tagItems = value?.map((id) => {
      return metadata?.Products.find((p) => p.Value === id)?.Text
    })
    return <ManyTag tagItems={tagItems} maxCount={5} />
  }
}
```

### Complex Data Transformation
```tsx
cellRenderer: (props) => (
  <ManyTag
    tagItems={props?.value
      ?.map((v) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === v?.PriceTypeCvId)?.Display)
      .sort()}
    maxCount={5}
  />
)
```

## Interactive Patterns

### Dynamic Tag Management
```tsx
const [skills, setSkills] = useState(['React', 'TypeScript'])
const [newSkill, setNewSkill] = useState('')

const addSkill = () => {
  if (newSkill && !skills.includes(newSkill)) {
    setSkills([...skills, newSkill])
    setNewSkill('')
  }
}

const removeSkill = (skillToRemove) => {
  setSkills(skills.filter(skill => skill !== skillToRemove))
}

<div>
  <ManyTag tagItems={skills} maxCount={4} />
  <Input
    value={newSkill}
    onChange={(e) => setNewSkill(e.target.value)}
    onPressEnter={addSkill}
    placeholder="Add new skill"
  />
  <Button onClick={addSkill}>Add Skill</Button>
</div>
```

### Search and Filter
```tsx
const [searchTerm, setSearchTerm] = useState('')
const allTags = ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript']

const filteredTags = useMemo(() => {
  if (!searchTerm) return allTags
  return allTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [searchTerm, allTags])

<div>
  <Input
    placeholder="Search technologies..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <ManyTag
    tagItems={filteredTags}
    maxCount={searchTerm ? 10 : 5}
  />
</div>
```

## Advanced Usage

### Categorized Tags with Different Themes
```tsx
const categorizedSkills = {
  frontend: ['React', 'Vue', 'Angular'],
  backend: ['Node.js', 'Python', 'Java'],
  database: ['MongoDB', 'PostgreSQL', 'Redis']
}

<div>
  {Object.entries(categorizedSkills).map(([category, skills]) => (
    <div key={category} className="mb-3">
      <Texto category="h6">{category.toUpperCase()}</Texto>
      <ManyTag
        tagItems={skills}
        maxCount={3}
        theme={category === 'frontend' ? 'success' :
              category === 'backend' ? 'warning' : 'error'}
      />
    </div>
  ))}
</div>
```

### Object Array Transformation
```tsx
const users = [
  { id: 1, Name: 'John Doe', Role: 'Admin' },
  { id: 2, Name: 'Jane Smith', Role: 'User' },
  { id: 3, Name: 'Bob Johnson', Role: 'Editor' }
]

// Extract names for display
<ManyTag tagItems={users.map(user => user.Name)} maxCount={2} />

// Extract roles for display
<ManyTag tagItems={users.map(user => user.Role)} maxCount={3} />
```

## Overflow Behavior

The ManyTag component automatically handles overflow by:

1. **Displaying visible tags**: Shows up to `maxCount` tags
2. **Overflow indicator**: Shows "+N more" when items exceed maxCount
3. **Responsive sizing**: Adjusts based on available space
4. **Tooltip support**: Can show full list on hover (implementation dependent)

### MaxCount Guidelines

| Use Case | Recommended maxCount | Reason |
|----------|---------------------|---------|
| User profiles | 2-3 | Limited space, focus on key roles |
| Grid cells | 3-5 | Balance between info and readability |
| Card components | 4-6 | More space available |
| Search results | 8-10 | User wants to see more options |
| Full-width displays | No limit or 10+ | Ample space available |

## Performance Considerations

### Large Arrays
```tsx
// For large arrays, consider memoization
const displayTags = useMemo(() => {
  return largeTagArray.slice(0, maxCount + 5) // Only process what might be shown
}, [largeTagArray, maxCount])

<ManyTag tagItems={displayTags} maxCount={maxCount} />
```

### Dynamic Data
```tsx
// Use React.memo for components with frequently changing tag data
const MemoizedTagDisplay = React.memo(({ tags, count }) => (
  <ManyTag tagItems={tags} maxCount={count} />
))
```

## Integration with Forms

### Multi-Select Integration
```tsx
const [selectedItems, setSelectedItems] = useState([])

<div>
  <Select
    mode="multiple"
    value={selectedItems}
    onChange={setSelectedItems}
    options={allOptions}
    placeholder="Select items"
  />

  <div className="mt-2">
    <ManyTag tagItems={selectedItems} maxCount={5} />
  </div>
</div>
```

## Best Practices

### Data Management
- Always validate `tagItems` array before rendering
- Handle null/undefined gracefully
- Consider data transformation performance for large datasets

### User Experience
- Use consistent `maxCount` values within the same interface
- Provide tooltips or expandable views for overflow items
- Consider user's screen size and available space

### Accessibility
- Ensure tag content is meaningful for screen readers
- Use appropriate ARIA labels for overflow indicators
- Maintain good color contrast for all tag themes

### Styling
- Use theme props consistently across your application
- Consider responsive design for different screen sizes
- Test overflow behavior with various data lengths

## Common Patterns

### Status Indicators
```tsx
const statusTags = user.permissions.map(permission => ({
  text: permission.name,
  theme: permission.active ? 'success' : 'error'
}))

<ManyTag
  tagItems={statusTags.map(tag => tag.text)}
  maxCount={4}
  theme="dynamic" // Implement custom logic for mixed themes
/>
```

### Category Filters
```tsx
const activeFilters = filters.filter(f => f.active).map(f => f.label)

<div className="filter-display">
  <Texto category="p2">Active Filters:</Texto>
  <ManyTag tagItems={activeFilters} maxCount={6} />
</div>
```

### Progress Tracking
```tsx
const completedSteps = workflow.steps
  .filter(step => step.completed)
  .map(step => step.name)

<div>
  <Texto category="h6">Completed Steps:</Texto>
  <ManyTag tagItems={completedSteps} maxCount={5} />
</div>
```