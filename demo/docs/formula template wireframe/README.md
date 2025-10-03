# Formula Templates v4 - Component Selection Model

## Overview
Version 4 introduces a **component-based selection model** where users can pick and choose individual formula components rather than selecting from pre-defined variations. This gives users maximum flexibility to customize their pricing formulas.

## 🎯 Key Changes from Previous Versions

### **Component Selection Model**
- **No variation dropdowns** - removed the "choose variation" selector
- **All components visible** - each template family shows all available components
- **Pick and choose** - users can toggle components on/off with checkboxes
- **All selected by default** - components start in selected state
- **Real-time preview** - formula updates instantly as components are toggled

### **Optimized Card Layout**
- **Fixed card height** (550px) - consistent, predictable layout
- **Centered "Select Template" button** - improved visual hierarchy
- **Scrollable components area** - dedicated scrollable region with clear indicators
- **Visual scroll cues** - gradient fade and "Scroll for more ↓" text with bounce animation
- **Tighter spacing** - optimized for maximum content density

### **Enhanced UX**
- **Checkbox interactions** - clear visual feedback on hover and selection
- **Selected count** - shows "X selected" at the top of each card
- **Custom scrollbar** - blue-themed scrollbar matches brand colors
- **Responsive checkboxes** - work seamlessly on desktop and mobile

## 🚀 How to Use

### **Opening v4**
1. Navigate to the `/v4/` folder
2. Double-click on `index.html` to open in your browser
3. Works best in Chrome, Safari, or Firefox

### **Component Selection Workflow**

#### **Cards View**
1. **Browse template families** using arrow buttons or keyboard arrows (left/right)
2. **Review components** - scroll through the components list in each card
3. **Toggle components** - click checkboxes to select/deselect components
4. **Watch the preview** - formula updates in real-time below the components
5. **Select template** - click the centered "Select Template" button when ready

#### **List View**
1. Toggle to **List view** using the header button
2. **See all families** at once in a vertical layout
3. **Components displayed in grid** - more compact horizontal layout
4. **Same checkbox functionality** - toggle components on/off
5. **Select from any family** - click "Select Template" on the right

### **Key Features to Try**

#### **Component Toggling**
- Click any checkbox to deselect a component
- Watch the formula preview update immediately
- See the "selected count" change at the top
- Re-check to add the component back

#### **Scrollable Components**
- Cards with many components (5-6+) will show a scrollbar
- Look for the **"Scroll for more ↓"** indicator at the bottom
- Scroll using mouse wheel, trackpad, or drag the blue scrollbar
- Smooth scrolling with custom-styled scrollbar

#### **Navigation**
- **Arrow buttons**: Click < > to navigate between families
- **Keyboard**: Use arrow keys (left/right) to slide
- **Mobile swipe**: Swipe left/right on touch devices
- **Position indicator**: Shows "X of 5" below the slider

#### **Search & Filter**
- **Quick Search**: Filters families by name, category, or contract type
- **Context banner**: Auto-applied filters (Product: 87 GHL, Location: Columbus Terminal)
- **Clear/Adjust**: Manage your context filters

## 📊 Template Family Structure

Each template family now contains:
- **Family metadata**: Name, contract type, product, location
- **Component pool**: 4-6 selectable components
- **Component details**:
  - Percentage or fixed dollar amount
  - Operator (+ or -)
  - Source (Argus, OPIS, Platts, Fixed, Formula)
  - Instrument (CBOB USGC, RIN, etc.)
  - Date rule (Prior Day, Current, Friday Close)
  - Type (Settle, Average, Spot, Fixed, Variable)
  - Usage count

### **Example: Standard Columbus Index**
```
Components (all selected by default):
☑ 90% + Argus CBOB USGC (Prior Day, Settle)
☑ 10% + OPIS CBOB USGC (Current, Average)
☑ 5% + Platts CBOB (Prior Day, High)
☑ $0.025 + Fixed Differential (Current, Fixed)
☑ $0.015 - Fixed Discount (Current, Fixed)
```

Users can deselect any combination to customize the formula.

## 🎨 UI/UX Improvements

### **Fixed Card Height**
- **Consistent layout**: All cards are exactly 550px tall
- **Predictable scrolling**: Users know what to expect
- **Better alignment**: Cards line up perfectly in the slider

### **Centered Button**
- **Visual hierarchy**: Button draws attention to primary action
- **Balanced design**: Centered placement feels more professional
- **Easier to find**: No hunting for button in corner

### **Scrollable Components Area**
- **Dedicated scroll region**: Only components scroll, not entire card
- **Visual indicators**:
  - Custom blue scrollbar on the right
  - "Scroll for more ↓" text with bounce animation
  - Gradient fade at bottom suggests more content
- **Smooth scrolling**: Native browser scrolling with custom styling

### **Component Checkboxes**
- **Clear interaction**: Hover shows blue border and background
- **Selected state**: Blue background when checked
- **Large touch targets**: Easy to click on desktop and mobile
- **Organized layout**: Percentage, operator, source, instrument in clear hierarchy

## 🛠️ Technical Implementation

### **Files**
- `index.html` - Main structure with card templates
- `styles.css` - Fixed heights, scrollable areas, checkbox styling
- `script.js` - Component toggle logic, real-time preview updates
- `data.js` - Flattened data model with selection state
- `README.md` - This documentation

### **Key CSS Features**
- **Fixed card height**: `.family-card { height: 550px; }`
- **Flexbox layout**: Proper distribution of header, content, footer
- **Scrollable area**: `.components-scroll-container { overflow-y: auto; }`
- **Custom scrollbar**: WebKit scrollbar styling in blue
- **Scroll indicator**: Sticky positioning with gradient background
- **Checkbox states**: `:hover` and `:has(:checked)` pseudo-classes

### **Key JavaScript Features**
- **Component toggle**: Updates data model and refreshes UI
- **Real-time preview**: Rebuilds formula string on every change
- **Selected count**: Tracks number of checked components
- **State management**: Maintains selection state per family
- **Validation**: Prevents selection with zero components

### **Data Model**
```javascript
{
    id: 'family-id',
    name: 'Family Name',
    components: [
        {
            id: 'comp-1',
            percentage: 90,
            operator: '+',
            source: 'Argus',
            selected: true,  // ← Selection state
            // ... other properties
        }
    ]
}
```

## 📱 Responsive Behavior

### **Desktop (>1024px)**
- Card width: 420px, height: 550px
- Multiple cards visible in slider
- Full component details shown
- Grid layout for list view (3-4 columns)

### **Tablet (768-1024px)**
- Card width: 380px, height: 520px
- Single card per view
- Compressed component grid (2-3 columns)

### **Mobile (<768px)**
- Card width: 320px, height: 500px
- Sidebar becomes horizontal
- Header stacks vertically
- Single column component grid
- Touch-optimized checkboxes

## 🔧 Advantages of v4

### **Flexibility**
- Users aren't limited to pre-defined variations
- Can create custom combinations on the fly
- Mix and match any components

### **Transparency**
- All options visible upfront
- No hidden variations in dropdowns
- Clear usage statistics per component

### **Efficiency**
- No need to switch between variations to compare
- Real-time preview shows exact formula
- Faster decision-making

### **Scalability**
- Easy to add new components to families
- No need to create variation combinations
- Components can be shared across families

## 💡 Use Cases

### **Scenario 1: Standard Selection**
1. User opens "Standard Columbus Index"
2. All 5 components are pre-selected
3. User clicks "Select Template" immediately
4. Gets the full standard formula

### **Scenario 2: Custom Formula**
1. User opens "Complex Multi-Variable"
2. Deselects the RIN adjustment component (not needed today)
3. Deselects the Platts hybrid components
4. Keeps only Argus base components + premium
5. Sees simplified formula in preview
6. Clicks "Select Template" with custom configuration

### **Scenario 3: Minimal Formula**
1. User opens "Shell Negotiated Rates"
2. Deselects all discount components
3. Keeps only the base 100% Argus component
4. Gets pure index pricing without adjustments

### **Scenario 4: Discovery**
1. User browses through families
2. Scrolls through component options in each card
3. Learns what components are available
4. Compares usage statistics
5. Makes informed selection based on industry usage

## 📈 Future Enhancements

Potential additions for future versions:
1. **Save custom combinations** - Save frequently used component selections
2. **Component recommendations** - Suggest components based on context
3. **Bulk operations** - Select/deselect all, invert selection
4. **Component filtering** - Filter by source, type, or usage
5. **Advanced preview** - Show calculated price based on sample data
6. **Component dependencies** - Show which components work well together
7. **Usage analytics** - Track which component combinations are most popular

## 🎨 Design Philosophy

Version 4 embodies:

1. **User Control**: Maximum flexibility in formula creation
2. **Visual Clarity**: Fixed heights and clear scrolling indicators
3. **Immediate Feedback**: Real-time preview of selections
4. **Progressive Disclosure**: Scroll for more content without overwhelming
5. **Centered Focus**: Primary action (Select) in prominent position
6. **Space Optimization**: Tight layout maximizes content density
7. **Accessibility**: Large checkboxes and clear labels

---

**v4 transforms formula selection from choosing pre-made variations to building custom formulas from component building blocks.**
