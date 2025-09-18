/**
 * BBDTag Component Usage Examples
 *
 * This file contains comprehensive examples of BBDTag component usage patterns
 * found in production applications. These examples demonstrate real-world
 * implementation scenarios and best practices.
 */

export const BBDTagUsageExamples = {
  // Basic theming examples
  basicTheming: {
    description: 'Basic theme variants for different visual styles',
    examples: [
      {
        title: 'Theme 1 - Primary',
        code: `<BBDTag theme1>Primary Tag</BBDTag>`,
        use_case: 'Primary information display'
      },
      {
        title: 'Theme 2 - Secondary',
        code: `<BBDTag theme2>Secondary Tag</BBDTag>`,
        use_case: 'Secondary or filtered information'
      },
      {
        title: 'Success State',
        code: `<BBDTag success>Completed</BBDTag>`,
        use_case: 'Positive status indicators'
      },
      {
        title: 'Warning State',
        code: `<BBDTag warning>Pending</BBDTag>`,
        use_case: 'Cautionary status indicators'
      },
      {
        title: 'Error State',
        code: `<BBDTag error>Failed</BBDTag>`,
        use_case: 'Error or failure states'
      }
    ]
  },

  // Form validation patterns
  formValidation: {
    description: 'Using BBDTag for form validation feedback',
    examples: [
      {
        title: 'Password Validation Success',
        code: `<BBDTag
  success={isValid}
  style={{ textTransform: 'capitalize' }}
>
  {validationMessage}
</BBDTag>`,
        use_case: 'Real-time form validation feedback'
      },
      {
        title: 'Multiple Validation Rules',
        code: `{validationRules.map(rule => (
  <BBDTag
    key={rule.type}
    success={rule.isValid}
    error={!rule.isValid}
    style={{ textTransform: 'capitalize' }}
  >
    {rule.message}
  </BBDTag>
))}`,
        use_case: 'Multiple validation criteria display'
      }
    ]
  },

  // Grid and data display patterns
  gridUsage: {
    description: 'BBDTag in data grids and tables',
    examples: [
      {
        title: 'Grid Cell Tag',
        code: `<Tooltip title={cellValue}>
  <BBDTag className="text-ellipsis">
    {cellValue}
  </BBDTag>
</Tooltip>`,
        use_case: 'Grid cell content with overflow handling'
      },
      {
        title: 'Status Column',
        code: `<BBDTag
  success={status === 'active'}
  error={status === 'inactive'}
  warning={status === 'pending'}
>
  {status.toUpperCase()}
</BBDTag>`,
        use_case: 'Status indicators in data tables'
      },
      {
        title: 'Numeric Display with Alignment',
        code: `<div className="flex items-end justify-end">
  <BBDTag success={isPositive} error={isNegative}>
    <span className="text-xs font-normal">
      {formattedValue}
    </span>
  </BBDTag>
</div>`,
        use_case: 'Right-aligned numeric values with conditional coloring'
      }
    ]
  },

  // Filter and search patterns
  filterTags: {
    description: 'Interactive filter tags with removal functionality',
    examples: [
      {
        title: 'Removable Filter Tag',
        code: `<BBDTag theme2 className="filter-tag my-2">
  <span className="filter-tag-label">
    {filterLabel}
  </span>
  <CloseOutlined
    className="filter-tag-close ml-2"
    onClick={() => removeFilter(filterId)}
  />
</BBDTag>`,
        use_case: 'Active filter indicators with removal capability'
      },
      {
        title: 'Search Result Tags',
        code: `{searchResults.map(result => (
  <BBDTag
    key={result.id}
    theme1
    className="search-result-tag"
    onClick={() => selectResult(result)}
  >
    {result.name}
  </BBDTag>
))}`,
        use_case: 'Clickable search result tags'
      }
    ]
  },

  // Advanced styling and customization
  customStyling: {
    description: 'Custom styling and advanced BBDTag configurations',
    examples: [
      {
        title: 'Text Transform Styling',
        code: `<BBDTag
  textTransform="uppercase"
  className="font-bold"
  style={{ letterSpacing: '0.5px' }}
>
  Important Notice
</BBDTag>`,
        use_case: 'Emphasized content with custom typography'
      },
      {
        title: 'Conditional Theme Application',
        code: `<BBDTag
  {...(priority === 'high' ? { error: true } :
      priority === 'medium' ? { warning: true } :
      { success: true })}
  className={cn('priority-tag', priorityClass)}
>
  {priority} Priority
</BBDTag>`,
        use_case: 'Dynamic theme application based on data conditions'
      }
    ]
  },

  // Component composition patterns
  composition: {
    description: 'BBDTag used within other components',
    examples: [
      {
        title: 'With Delta Component',
        code: `<BBDTag success={showGreen} error={showRed}>
  <DeltaContents
    threshold={threshold}
    value={value}
    {...deltaProps}
  />
</BBDTag>`,
        use_case: 'Wrapping complex child components'
      },
      {
        title: 'Multiple Tags Container',
        code: `<div className="tags-container">
  {tagItems.slice(0, maxVisible).map((item, index) => (
    <BBDTag key={index} className="text-ellipsis">
      {item}
    </BBDTag>
  ))}
  {hasMore && (
    <Tooltip title={remainingItems.join(', ')}>
      <BBDTag theme2>+{remainingCount} more</BBDTag>
    </Tooltip>
  )}
</div>`,
        use_case: 'Tag collections with overflow handling'
      }
    ]
  }
}

export const BBDTagBestPractices = {
  theming: [
    'Use theme1-4 for different information hierarchies',
    'Reserve success/warning/error for status-based content',
    'Combine themes with custom styling for brand consistency'
  ],
  accessibility: [
    'Include meaningful text content for screen readers',
    'Use appropriate color contrast ratios',
    'Provide alternative text for icon-only content'
  ],
  performance: [
    'Use React.memo for frequently re-rendered tag lists',
    'Optimize map operations with proper key props',
    'Consider virtualization for large tag collections'
  ],
  styling: [
    'Use textTransform prop instead of CSS for text casing',
    'Leverage CSS variables for theme consistency',
    'Use utility classes for common spacing and sizing'
  ]
}

export const BBDTagProps = {
  theme1: 'boolean - Applies theme 1 styling',
  theme2: 'boolean - Applies theme 2 styling',
  theme3: 'boolean - Applies theme 3 styling',
  theme4: 'boolean - Applies theme 4 styling',
  success: 'boolean - Applies success state styling (green)',
  warning: 'boolean - Applies warning state styling (yellow/orange)',
  error: 'boolean - Applies error state styling (red)',
  textTransform: "CSSProperties['textTransform'] - Text transformation (uppercase, lowercase, capitalize, etc.)",
  className: 'string - Additional CSS class names',
  style: 'CSSProperties - Inline styles object',
  children: 'ReactNode - Tag content (text, elements, components)',
  // Inherits all TagProps from Ant Design
  closable: 'boolean - Whether tag can be closed',
  onClose: '(e: MouseEvent) => void - Close event handler',
  color: 'string - Custom color for the tag',
  bordered: 'boolean - Whether to show border'
}

export default {
  BBDTagUsageExamples,
  BBDTagBestPractices,
  BBDTagProps
}