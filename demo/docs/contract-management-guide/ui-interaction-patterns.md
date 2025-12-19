# PE Contract Measurement - UI Interaction Patterns

## Visual Design System

### Color Coding Standards
- **Success/Positive**: Green variants for positive financial impact, good performance
- **Warning/Caution**: Yellow/amber for approaching deadlines, moderate risk
- **Danger/Critical**: Red variants for at-risk contracts, critical issues
- **Neutral**: Gray variants for completed, cancelled, or neutral states
- **Primary**: Blue variants for interactive elements, primary actions

### Typography Hierarchy
- **Level 1 Headers**: Page titles, major sections
- **Level 2 Headers**: Tab titles, subsection headers
- **Level 3 Headers**: Card titles, component headers
- **Body Text**: Standard content, table cells
- **Caption Text**: Subtle information, metadata
- **Monospace**: Contract IDs, numerical data

## Interactive Element Patterns

### Button Interactions
**Primary Actions**:
- Solid background with hover state darkening
- Scale animation on click (scaleOnClick prop)
- Ripple effect for tactile feedback
- Loading states with spinner replacement
- Disabled states with reduced opacity

**Secondary Actions**:
- Outline style with fill on hover
- Same animation patterns as primary
- Icon + text combinations
- Size variants: sm, default, lg

**Danger Actions**:
- Red color scheme
- Confirmation dialogs before execution
- Extra visual weight to prevent accidents

### Table Interactions
**Row Selection**:
- Checkbox in first column
- Row highlight on hover
- Multi-select with Ctrl/Cmd click
- Select all/none toggle in header
- Bulk actions bar appears when items selected

**Column Sorting**:
- Click column header to sort
- Visual sort indicators (arrows)
- Toggle between asc/desc/no sort
- Multi-column sorting (future capability)

**Row Actions**:
- Hover reveals action menu button
- Dropdown menu with contextual actions
- Keyboard accessible (Tab navigation)
- Icons with text labels for clarity

### Form Interactions
**Input Fields**:
- Focus states with border highlighting
- Real-time validation with error messages
- Success states with check icons
- Placeholder text with helpful examples
- Auto-complete and suggestions where appropriate

**Search Fields**:
- Magnifying glass icon
- Clear button when content exists
- Debounced input (300ms delay)
- Recent searches dropdown (future feature)
- Keyboard shortcuts (Ctrl+K global search)

### Modal and Dialog Patterns
**Modal Behavior**:
- Backdrop blur with click-outside-to-close
- Focus trapping within modal content
- Escape key to close
- Smooth fade-in/out animations
- Mobile-responsive sizing

**Confirmation Dialogs**:
- Clear action description
- Danger actions prominently styled
- Cancel as default action (escape key)
- Required confirmation for destructive actions

## Navigation Patterns

### Tab Navigation
**Visual States**:
- Active tab with underline and bold text
- Inactive tabs with subtle hover states
- Keyboard navigation with arrow keys
- URL synchronization for deep linking

**Tab Content**:
- Smooth transitions between tab changes
- Lazy loading of tab content
- Loading states while switching
- Error boundaries per tab

### Breadcrumb Navigation
**Structure**: Home → Section → Page → Subsection
**Interactions**:
- Clickable parent levels
- Current page non-clickable
- Hover states for clickable items
- Responsive collapse on mobile

### Back Navigation
**Context-Aware**: "Back to Dashboard", "Back to Overview"
**State Preservation**: Maintains filters and scroll position
**Keyboard Shortcut**: Alt+Left Arrow
**Visual**: Left arrow + descriptive text

## Data Visualization Patterns

### Progress Indicators
**Progress Bars**:
- Smooth fill animations
- Color coding based on progress level
- Percentage labels
- Accessible with proper ARIA labels

**Loading States**:
- Skeleton placeholders matching final content structure
- Shimmer animations for visual appeal
- Progressive loading (critical data first)
- Loading delays to prevent flashing (200ms minimum)

### Chart Interactions
**Hover States**:
- Tooltip with detailed information
- Data point highlighting
- Crosshair cursors on line charts
- Color changes on interactive elements

**Click Interactions**:
- Drill-down capabilities where applicable
- Legend toggling for data series
- Export options in chart context menus
- Zoom and pan for detailed views

### Metric Cards
**Animation Patterns**:
- Count-up animations for numerical values (1000ms duration)
- Stagger animations when multiple cards load
- Hover lift effects (subtle shadow increase)
- Click feedback for interactive cards

**Content Structure**:
- Large numerical value prominently displayed
- Subtitle with context information
- Icon representing the metric type
- Trend indicators with arrows and percentages

## Filter and Search Patterns

### Filter Panel
**Slide-in Behavior**:
- Right-side drawer with smooth transition
- Backdrop with reduced opacity
- Panel aligns with control bar height
- Scrollable content area

**Filter Categories**:
- Accordion-style expansion
- Clear category titles
- Active filter count badges
- Individual filter clear buttons

**Filter States**:
- Active filters highlighted
- Clear all option when filters applied
- Filter persistence across navigation
- URL parameter synchronization

### Search Experience
**Real-time Results**:
- Instant filtering as user types
- Debounced to prevent excessive API calls
- Search term highlighting in results
- No results state with suggestions

**Search Scope**:
- Global search across all contract data
- Scoped search within current view
- Advanced search options (future feature)
- Search history and suggestions

## Responsive Design Patterns

### Breakpoint Behaviors
**Mobile (< 768px)**:
- Sidebar collapses to overlay
- Table becomes horizontally scrollable
- Cards stack vertically
- Touch-optimized button sizes

**Tablet (768px - 1024px)**:
- Sidebar remains visible but narrower
- Table columns may be hidden
- Charts adapt to smaller width
- Modal dialogs use more screen space

**Desktop (> 1024px)**:
- Full feature set available
- Multi-column layouts
- Hover states active
- Keyboard shortcuts available

### Touch Interactions
**Mobile Optimizations**:
- Larger touch targets (44px minimum)
- Swipe gestures for table actions
- Pull-to-refresh on data views
- Bottom sheet modals for mobile

## Accessibility Patterns

### Keyboard Navigation
**Tab Order**:
- Logical flow through interactive elements
- Skip links for screen readers
- Focus indicators clearly visible
- Trapped focus in modals

**Keyboard Shortcuts**:
- Ctrl+A: Select all
- Delete: Delete selected items
- Escape: Close modals, clear selection
- Enter/Space: Activate buttons, select rows
- Arrow keys: Navigate table rows, tab between tabs

### Screen Reader Support
**ARIA Labels**:
- Descriptive labels for all interactive elements
- Live regions for dynamic content updates
- Table headers properly associated
- Progress bars with descriptive text

**Content Structure**:
- Semantic HTML elements (nav, main, article)
- Heading hierarchy properly maintained
- Lists for grouped content
- Landmark roles for major sections

### Visual Accessibility
**Color Contrast**:
- WCAG AA compliant contrast ratios
- Color not the only indicator of state
- High contrast mode support
- Focus indicators with sufficient contrast

**Text Scaling**:
- Responsive to browser zoom
- Maintains layout integrity at 200% zoom
- Readable at all supported sizes
- Icon scaling with text size

## Animation and Transition Patterns

### Micro-interactions
**Button Feedback**:
- Scale down on click (scaleOnClick)
- Ripple effect from click point
- Color transitions on hover
- Loading state transitions

**Form Feedback**:
- Error shake animation
- Success check mark appearance
- Field focus animations
- Validation state transitions

### Page Transitions
**Route Changes**:
- Fade-in new content
- Slide transitions for related pages
- Loading states during navigation
- Smooth tab switching

**Component Animations**:
- Cards slide up on appear
- Lists stagger item animations
- Modal fade-in/out with scale
- Drawer slide-in from appropriate edge

### Performance Considerations
**Animation Optimization**:
- Use transform and opacity for smooth animations
- Avoid animating layout properties
- Respect prefers-reduced-motion setting
- 60fps target for all animations

**Loading Performance**:
- Skeleton screens prevent layout shift
- Progressive enhancement approach
- Critical content loads first
- Non-critical content lazy loaded

This comprehensive interaction guide ensures Claude Code can recreate the exact user experience and interaction patterns when rebuilding with your company's design system.