# OSP UI Component Library - UPDATED
*September 2025 - Post-Kickoff Integration*
*Covers Fixed-Price Day Deals + Index-Based Extended Deals + Template Workflows*

## COMPONENT HIERARCHY
```
App Shell
├── Navigation Bar
│   ├── Logo
│   ├── Menu Items
│   ├── User Menu
│   └── Notifications
├── Main Content Area
│   ├── Page Header
│   ├── Filters/Controls
│   ├── Data Grid/Form
│   └── Action Buttons
├── Modals/Overlays
└── Status Bar/Footer
```

## CORE COMPONENTS

### 1. DATA GRID
```javascript
<DataGrid>
  config: {
    columns: [
      { key: 'product', label: 'Product', sortable: true, width: '25%' },
      { key: 'location', label: 'Location', sortable: true, width: '20%' },
      { key: 'price', label: 'Price', sortable: true, format: 'currency', width: '15%' },
      { key: 'volume', label: 'Available', sortable: false, format: 'number', width: '15%' },
      { key: 'action', label: '', type: 'action', width: '10%' }
    ],
    pagination: { pageSize: 20, showSizeChanger: true },
    selection: 'single',
    hover: true,
    striped: true,
    dense: false
  }
  
  features: {
    - Sort by column click
    - Filter per column
    - Bulk actions
    - Export to Excel
    - Responsive collapse
    - Loading skeleton
    - Empty state message
    - Error state handling
  }
  
  states: {
    loading: Show skeleton rows
    empty: "No products available"
    error: "Unable to load products"
    success: Display data rows
  }
</DataGrid>
```

### 2. FORM INPUTS
```javascript
<FormInput>
  types: {
    text: Standard text input
    number: Numeric with formatting
    currency: $ prefix, comma separators
    select: Dropdown selection
    multiselect: Checkbox group
    date: Date picker
    search: With icon and clear
  }
  
  validation: {
    required: Red asterisk (*)
    error: Red border and message
    success: Green checkmark
    warning: Yellow alert icon
    info: Blue (i) icon
  }
  
  states: {
    default: Gray border
    focused: Blue border, shadow
    disabled: Gray background
    readonly: No border, gray text
    error: Red border
    success: Green border
  }
</FormInput>
```

### 3. BUTTONS
```javascript
<Button>
  variants: {
    primary: {
      bg: '#0066CC',
      color: 'white',
      hover: '#0052A3',
      disabled: '#B0B0B0'
    },
    secondary: {
      bg: 'white',
      color: '#0066CC',
      border: '1px solid #0066CC',
      hover: '#F0F7FF'
    },
    danger: {
      bg: '#DC3545',
      color: 'white',
      hover: '#C82333'
    },
    success: {
      bg: '#28A745',
      color: 'white', 
      hover: '#218838'
    }
  }
  
  sizes: {
    small: { height: '28px', fontSize: '12px' },
    medium: { height: '36px', fontSize: '14px' },
    large: { height: '44px', fontSize: '16px' }
  }
  
  states: {
    loading: Show spinner icon
    disabled: Opacity 0.5, no pointer
    active: Pressed appearance
  }
</Button>
```

### 4. MODALS
```javascript
<Modal>
  structure: {
    overlay: { bg: 'rgba(0,0,0,0.5)', zIndex: 1000 },
    container: { 
      maxWidth: '600px',
      bg: 'white',
      borderRadius: '8px',
      shadow: '0 4px 20px rgba(0,0,0,0.15)'
    },
    header: {
      padding: '20px',
      borderBottom: '1px solid #E0E0E0',
      title: { fontSize: '18px', fontWeight: 'bold' },
      closeButton: 'X icon top-right'
    },
    body: {
      padding: '20px',
      maxHeight: '60vh',
      overflow: 'auto'
    },
    footer: {
      padding: '20px',
      borderTop: '1px solid #E0E0E0',
      buttons: 'Right aligned'
    }
  }
  
  types: {
    confirmation: Title + Message + Cancel/Confirm
    error: Red icon + Error message + OK button
    warning: Yellow icon + Warning + Cancel/Proceed
    info: Blue icon + Information + OK button
    form: Title + Form fields + Cancel/Submit
  }
</Modal>
```

### 5. PRICE DISPLAY
```javascript
<PriceDisplay>
  formats: {
    basis: "+0.0325" or "-0.0150"
    absolute: "$2.4567"
    live: "◉ $2.4567 LIVE" (with pulse animation)
    fixed: "$2.4567 FIXED"
  }
  
  colors: {
    positive: Green (#28A745) for advantageous
    negative: Red (#DC3545) for disadvantageous  
    neutral: Black (#212529) for standard
    live: Blue (#0066CC) with pulse
  }
  
  animations: {
    pulse: CSS animation for live prices
    flash: Brief highlight on change
    trend: ↑ or ↓ arrow for direction
  }
</PriceDisplay>
```

### 6. VOLUME INDICATOR
```javascript
<VolumeIndicator>
  display: {
    text: "25,000 gallons"
    bar: Progress bar showing % remaining
    color: Based on availability level
  }
  
  thresholds: {
    high: > 50% remaining (green)
    medium: 20-50% remaining (yellow)
    low: < 20% remaining (red)
    depleted: 0% (gray, disabled)
  }
  
  format: {
    thousands: Comma separator
    suffix: "gallons" or "g"
    percentage: Show as tooltip
  }
</VolumeIndicator>
```

### 7. NOTIFICATION TOAST
```javascript
<Toast>
  position: 'top-right'
  duration: 5000ms (auto-dismiss)
  
  types: {
    success: {
      icon: '✓',
      bg: '#D4EDDA',
      border: '#C3E6CB',
      color: '#155724'
    },
    error: {
      icon: '✗',
      bg: '#F8D7DA',
      border: '#F5C6CB',
      color: '#721C24'
    },
    warning: {
      icon: '⚠',
      bg: '#FFF3CD',
      border: '#FFEEBA',
      color: '#856404'
    },
    info: {
      icon: 'ℹ',
      bg: '#D1ECF1',
      border: '#BEE5EB',
      color: '#0C5460'
    }
  }
  
  actions: {
    dismiss: X button
    action: Optional action link
    expand: Show more details
  }
</Toast>
```

## **NEW** INDEX PRICING COMPONENTS

### 8. PRICING TYPE INDICATOR
```javascript
<PricingTypeIndicator>
  variants: {
    fixed: {
      icon: '💲',
      label: 'Fixed Price',
      color: '#28A745', // Green
      tooltip: 'Price locked at order time'
    },
    index: {
      icon: '📊',
      label: 'Index Formula',
      color: '#007BFF', // Blue
      tooltip: 'Price calculated at lifting'
    },
    live: {
      icon: '⚡',
      label: 'Live Price',
      color: '#FFC107', // Amber
      tooltip: 'Updates every 30 seconds'
    }
  }
  
  display: {
    compact: 'Icon only',
    standard: 'Icon + label',
    detailed: 'Icon + label + tooltip'
  }
  
  states: {
    active: 'Full opacity',
    inactive: '50% opacity',
    pulse: 'Animated for live prices'
  }
</PricingTypeIndicator>
```

### 9. FORMULA DISPLAY
```javascript
<FormulaDisplay>
  modes: {
    business: {
      text: "90% Platts RBOB + 10% Ethanol + 3.25¢",
      style: 'Human-readable, plain English'
    },
    technical: {
      text: "(0.9×PLATTS_GC_RBOB) + (0.1×PLATTS_CHI_ETH) + 0.0325",
      style: 'System calculation format'
    },
    preview: {
      text: "Sample: $2.405 + $0.050 = $2.455/gal",
      style: 'Example calculation with real data'
    }
  }
  
  interactive: {
    tooltip: 'Hover for component breakdown',
    expandable: 'Click to see full details',
    copyable: 'Copy formula string'
  }
  
  validation: {
    valid: 'Green checkmark',
    invalid: 'Red warning icon',
    pending: 'Loading spinner',
    stale: 'Yellow warning (old data)'
  }
</FormulaDisplay>
```

### 10. TERMS ACCEPTANCE MODAL
```javascript
<TermsAcceptanceModal>
  structure: {
    header: {
      title: 'Index Pricing Terms',
      subtitle: 'Please review before ordering'
    },
    content: {
      sections: [
        'Formula Explanation',
        'Sample Calculation',
        'Risk Disclosure',
        'Timing Information'
      ]
    },
    footer: {
      checkbox: 'I understand index pricing terms',
      buttons: ['Cancel', 'Accept Terms']
    }
  }
  
  validation: {
    required: 'Checkbox must be checked',
    logged: 'Acceptance timestamp recorded',
    binding: 'Legal agreement created'
  }
  
  responsive: {
    desktop: 'Modal dialog',
    mobile: 'Full screen overlay'
  }
</TermsAcceptanceModal>
```

### 11. TEMPLATE SELECTOR
```javascript
<TemplateSelector>
  layout: {
    search: {
      placeholder: 'Search templates...',
      filters: ['Product', 'Terminal', 'Type', 'Complexity'],
      autocomplete: true
    },
    grid: {
      columns: 3, // Desktop
      responsive: 'Single column on mobile'
    },
    preview: {
      modal: 'Detailed template information',
      inline: 'Quick preview card'
    }
  }
  
  templateCard: {
    header: {
      name: 'Gulf Coast 90/10 Blend',
      popularity: '★ Used 47 times',
      recency: 'Last: Yesterday'
    },
    body: {
      description: '90% Platts RBOB + 10% Ethanol',
      tags: ['Gasoline', 'Spot', 'Common'],
      preview: 'Sample calculation'
    },
    actions: ['Preview', 'Select', 'Favorite']
  }
  
  states: {
    loading: 'Skeleton cards',
    empty: 'No templates found message',
    selected: 'Highlighted border',
    favorited: 'Star icon filled'
  }
</TemplateSelector>
```

### 12. FORMULA BUILDER INTERFACE
```javascript
<FormulaBuilder>
  modes: {
    template: {
      title: '⚡ Quick Template',
      time: '15 seconds',
      flow: ['Select', 'Customize', 'Apply']
    },
    manual: {
      title: '📝 Build from Scratch',
      time: '3 minutes',
      flow: ['Components', 'Weights', 'Test', 'Save']
    }
  }
  
  components: {
    modeSelector: {
      tabs: ['Template', 'Manual'],
      switcher: 'Seamless transition'
    },
    templateSection: {
      selector: '<TemplateSelector>',
      customizer: 'Differential adjustment',
      preview: '<FormulaDisplay>'
    },
    manualSection: {
      componentBuilder: 'Multi-step wizard',
      validation: 'Real-time feedback',
      testing: 'Live calculation test'
    }
  }
  
  validation: {
    realTime: 'Components must sum to 100%',
    submit: 'Complete validation check',
    feedback: 'Clear error messages'
  }
</FormulaBuilder>
```

### 13. VOLUME MANAGEMENT (ENHANCED)
```javascript
<VolumeManagement>
  display: {
    totalPool: {
      value: '500,000 gallons',
      visual: 'Large progress bar'
    },
    allocation: {
      fixed: {
        amount: '275,000g (55%)',
        color: '#28A745', // Green
        type: 'Hard decrements'
      },
      index: {
        amount: '165,000g (33%)',
        color: '#007BFF', // Blue
        type: 'Soft holds'
      },
      available: {
        amount: '60,000g (12%)',
        color: '#6C757D', // Gray
        type: 'Unallocated'
      }
    }
  }
  
  interactions: {
    drillDown: 'Click segment for details',
    alerts: 'Threshold warnings',
    reallocation: 'Drag to adjust splits'
  }
  
  monitoring: {
    realTime: 'Updates every 5 minutes',
    alerts: ['50%', '80%', '100%'] thresholds,
    reconciliation: 'TABS sync status'
  }
</VolumeManagement>
```

### 14. LIFTING SCHEDULE INTERFACE
```javascript
<LiftingSchedule>
  calendar: {
    view: 'Month view with available dates',
    selection: 'Date range picker',
    constraints: 'Gray out unavailable dates'
  }
  
  scheduling: {
    planned: {
      date: 'User-selected target date',
      window: 'Available lifting window',
      flexibility: 'Can change within window'
    },
    actual: {
      date: 'Terminal-reported lifting',
      trigger: 'BOL generation',
      calculation: 'Price determination'
    }
  }
  
  status: {
    planned: 'Blue - scheduled',
    active: 'Green - in window',
    completed: 'Gray - lifted',
    expired: 'Red - window passed'
  }
</LiftingSchedule>
```

## **NEW** TEMPLATE SYSTEM COMPONENTS

### 15. TEMPLATE LIBRARY MANAGER
```javascript
<TemplateLibraryManager>
  navigation: {
    tabs: ['All Templates', 'My Templates', 'Shared', 'Archives'],
    search: 'Global search across templates',
    filters: 'Product, type, usage filters'
  }
  
  templateGrid: {
    sorting: ['Most Used', 'Recent', 'Name', 'Created'],
    grouping: 'By category or type',
    pagination: '20 templates per page'
  }
  
  actions: {
    create: '+ Create Template button',
    import: 'Import from file',
    export: 'Export selections',
    bulk: 'Bulk operations'
  }
  
  analytics: {
    usage: 'Template popularity metrics',
    performance: 'Time savings statistics',
    trends: 'Usage over time'
  }
</TemplateLibraryManager>
```

### 16. TIME SAVINGS INDICATOR
```javascript
<TimeSavingsIndicator>
  display: {
    primary: 'Time to Create: 15 seconds',
    comparison: 'Saved 2 min 45 sec!',
    percentage: '92% time reduction',
    visual: 'Animated clock or progress bar'
  }
  
  variants: {
    success: 'Green with checkmark',
    milestone: 'Gold with achievement badge',
    target: 'Blue with target icon'
  }
  
  context: {
    template: 'Show during template use',
    summary: 'Display in completion screens',
    analytics: 'Aggregate in reporting'
  }
</TimeSavingsIndicator>
```

### 17. PROGRESSIVE DISCLOSURE INTERFACE
```javascript
<ProgressiveDisclosure>
  levels: {
    basic: {
      visible: ['Essential options'],
      pattern: 'Simple, clean interface'
    },
    intermediate: {
      visible: ['Basic + common advanced'],
      trigger: 'Show more options link'
    },
    expert: {
      visible: ['All available options'],
      trigger: 'Expert mode toggle'
    }
  }
  
  transitions: {
    animation: 'Smooth expand/collapse',
    preservation: 'Maintain form state',
    context: 'Contextual help text'
  }
  
  principles: {
    businessFirst: 'Lead with business concepts',
    technicalSecond: 'Technical details on demand',
    noDisruption: 'Seamless mode switching'
  }
</ProgressiveDisclosure>
```

## LAYOUT PATTERNS

### Grid System
```css
.container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }
.row { display: flex; flex-wrap: wrap; margin: 0 -10px; }
.col-* { padding: 0 10px; }
.col-1 { width: 8.333%; }
.col-2 { width: 16.666%; }
.col-3 { width: 25%; }
.col-4 { width: 33.333%; }
.col-6 { width: 50%; }
.col-8 { width: 66.666%; }
.col-12 { width: 100%; }

/* Responsive breakpoints */
@media (max-width: 768px) { /* Mobile */ }
@media (min-width: 769px) and (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

### Card Layout
```javascript
<Card>
  structure: {
    container: {
      bg: 'white',
      border: '1px solid #E0E0E0',
      borderRadius: '8px',
      shadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    header: {
      padding: '16px 20px',
      borderBottom: '1px solid #E0E0E0',
      title: { fontSize: '16px', fontWeight: '600' }
    },
    body: {
      padding: '20px'
    },
    footer: {
      padding: '16px 20px',
      borderTop: '1px solid #E0E0E0',
      bg: '#F8F9FA'
    }
  }
</Card>
```

## INTERACTION PATTERNS

### Loading States
```javascript
LoadingStates = {
  skeleton: {
    // Gray animated bars mimicking content
    display: 'For initial page loads',
    duration: '1-3 seconds typical'
  },
  spinner: {
    // Rotating circle icon
    display: 'For actions and updates',
    position: 'Centered or inline'
  },
  progress: {
    // Percentage bar
    display: 'For long operations',
    showPercentage: true
  },
  shimmer: {
    // Animated gradient overlay
    display: 'For content refresh',
    direction: 'left-to-right'
  }
}
```

### Validation Feedback
```javascript
ValidationFeedback = {
  instant: {
    trigger: 'onBlur or onChange',
    display: 'Below field',
    color: 'Red for error, green for success'
  },
  submit: {
    trigger: 'onSubmit',
    display: 'Top of form summary',
    scroll: 'Auto-scroll to first error'
  },
  inline: {
    trigger: 'As typing',
    display: 'Icon in field',
    tooltip: 'Hover for details'
  }
}
```

### Tooltips
```javascript
<Tooltip>
  trigger: 'hover' | 'click' | 'focus'
  placement: 'top' | 'bottom' | 'left' | 'right'
  delay: 500ms
  maxWidth: 250px
  
  content: {
    text: Simple text message
    html: Rich formatted content
    component: Custom React component
  }
  
  style: {
    bg: '#333',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px'
  }
</Tooltip>
```

## ANIMATION LIBRARY

### Transitions
```css
/* Standard timing functions */
.transition-fast { transition: all 0.15s ease; }
.transition-base { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }

/* Common animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance
```javascript
Accessibility = {
  contrast: {
    normal: '4.5:1 minimum',
    large: '3:1 minimum for 18pt+',
    check: 'Use Chrome DevTools'
  },
  keyboard: {
    navigation: 'All interactive elements',
    focus: 'Visible focus indicators',
    skip: 'Skip to main content link'
  },
  screen_reader: {
    labels: 'Aria-label all icons',
    roles: 'Proper ARIA roles',
    announcements: 'Live regions for updates'
  },
  forms: {
    labels: 'Associated with inputs',
    errors: 'Aria-describedby for errors',
    required: 'Aria-required attribute'
  }
}
```

## COLOR PALETTE

```javascript
Colors = {
  primary: {
    main: '#0066CC',
    light: '#4D94FF',
    dark: '#004C99',
    contrast: '#FFFFFF'
  },
  secondary: {
    main: '#6C757D',
    light: '#ADB5BD',
    dark: '#495057',
    contrast: '#FFFFFF'
  },
  success: {
    main: '#28A745',
    light: '#71DD88',
    dark: '#1E7E34',
    contrast: '#FFFFFF'
  },
  warning: {
    main: '#FFC107',
    light: '#FFDD57',
    dark: '#D39E00',
    contrast: '#212529'
  },
  danger: {
    main: '#DC3545',
    light: '#F56E7A',
    dark: '#BD2130',
    contrast: '#FFFFFF'
  },
  neutral: {
    white: '#FFFFFF',
    gray100: '#F8F9FA',
    gray300: '#DEE2E6',
    gray500: '#ADB5BD',
    gray700: '#495057',
    gray900: '#212529',
    black: '#000000'
  }
}
```

## TYPOGRAPHY

```javascript
Typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px'
  },
  
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75
  }
}
```
