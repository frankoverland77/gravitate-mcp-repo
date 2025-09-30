# Bakery Demo Project Context
## For Claude AI - Project Understanding

---

## Project Overview

This is a **bakery management demo** built to showcase the **Excalibrr design system** and demonstrate how to build sophisticated business applications with formula-based calculations. The project serves as both a working example and a template for building similar applications in other domains.

### The Bakery Concept

The demo simulates a **modern bakery business** that needs to:
- Calculate product pricing using complex formulas
- Manage different pricing strategies (cost-plus, markup, seasonal adjustments)
- Apply formulas to multiple products efficiently
- Track which products use which pricing formulas
- Test different approaches to formula management (A/B testing)

### Core Business Problem

Traditional bakeries often struggle with:
- **Inconsistent pricing** across products
- **Manual calculations** that are error-prone
- **Difficulty updating prices** when costs change
- **No systematic approach** to seasonal or promotional pricing
- **Complex relationships** between ingredients, labor, and final prices

This demo solves these problems with a **formula-based pricing system**.

---

## The Formula Manager

### Primary Purpose

The **Formula Manager** is the heart of the application. It allows bakery managers to:

1. **Create mathematical formulas** for pricing (e.g., `(base_cost * 1.4) + (ingredients_cost * 1.1)`)
2. **Use variables** like `base_cost`, `ingredients_cost`, `labor_rate`, `markup_percent`
3. **Organize formulas** into folders (Basic Pricing, Seasonal Adjustments, etc.)
4. **Apply formulas to products** and see real-time price calculations
5. **Create and manage templates** for common pricing patterns
6. **Test different approaches** with A/B versions

### Key Components

#### Three-Column Layout
- **Left (20%)**: Formula library with folders and organizational tools
- **Middle (60%)**: Formula editor workspace with validation and variables
- **Right (20%)**: Product mapping - which products use which formulas

#### Formula Editor Features
- **Dark theme code editor** with syntax highlighting
- **Mathematical operators** as clickable buttons
- **Real-time validation** of formula syntax
- **Variable insertion** by clicking from a grid
- **Live preview** of calculated results

#### Template System (A/B Testing)
- **Version A**: Table-based template management with inline editing
- **Version B**: Dropdown-based templates with drawer editing
- **Custom templates** that users can create, edit, and delete
- **Built-in templates** that are read-only examples

---

## Technical Implementation Highlights

### Design System Usage

Built entirely with the **Excalibrr design system**:
- `Horizontal` and `Vertical` for layout
- `GraviGrid` for data tables
- `GraviButton` for actions
- `Texto` for typography
- Integration with **Ant Design** for complex components

### State Management

Uses **React Context** (`ProductFormulaContext`) to manage:
- Product data and pricing
- Formula calculations and applications
- Real-time price updates when formulas change

### Advanced Features Implemented

1. **Drag & Drop**: Move formulas between folders
2. **Inline Editing**: Edit templates directly in tables
3. **Drawer Interface**: Side-panel editing for Version B
4. **Real-time Validation**: Formula syntax checking
5. **Confirmation Dialogs**: Prevent accidental deletions
6. **A/B Testing UI**: Floating action button to switch versions

### Key Design Decisions

#### Why A/B Testing?
The user wanted to **test different approaches** to template management:
- **Version A**: More traditional table-based editing
- **Version B**: Modern dropdown with side-panel editing

#### Why Formula-Based Pricing?
- **Flexibility**: Easy to adjust when costs change
- **Consistency**: Same logic applied across products
- **Transparency**: Clear understanding of how prices are calculated
- **Scalability**: Can handle complex pricing strategies

#### Why Three-Column Layout?
- **Separation of concerns**: Library, editing, and application are distinct
- **Workflow optimization**: Natural left-to-right flow for formula creation
- **Information density**: Maximum use of screen real estate

---

## Business Value Demonstrated

### For Bakeries
- **Faster price updates** when ingredient costs change
- **Consistent profit margins** across product lines
- **Easy seasonal/promotional pricing** adjustments
- **Audit trail** of pricing changes and formulas used

### For Excalibrr Design System
- **Complex application pattern** that can be replicated
- **Integration showcase** with third-party libraries
- **Advanced interaction patterns** (drag/drop, inline editing)
- **Responsive design** implementation

### For Developers
- **Reusable patterns** for formula/rule management
- **Domain-agnostic approach** (works for pricing, scoring, risk assessment, etc.)
- **Modern React patterns** with hooks and context
- **TypeScript best practices** throughout

---

## Key User Stories Implemented

### Bakery Manager
- "I want to create a new pricing formula for seasonal items"
- "I need to apply a 20% markup to all bread products"
- "When flour costs increase, I want to update prices automatically"
- "I want to test different pricing strategies before implementing"

### Operations Staff
- "I need to see which products use which pricing formulas"
- "I want to quickly apply a promotional discount formula"
- "I need to understand how our prices are calculated"

### Business Owner
- "I want consistent pricing across all locations"
- "I need to analyze the impact of different pricing strategies"
- "I want to ensure we maintain target profit margins"

---

## Evolution of the Project

### Initial Concept
Started as a simple formula editor for bakery pricing.

### Added Complexity
- **Template management** for reusable formulas
- **A/B testing** to compare different UX approaches
- **Drag & drop** for better organization
- **Real-time validation** for error prevention

### Final State
A **comprehensive formula management system** that demonstrates:
- Advanced UI patterns with Excalibrr
- Complex state management
- Real-world business logic
- Multiple interaction paradigms

---

## Lessons Learned & Patterns

### UI/UX Insights
- **Drawer interfaces** work better than popovers for complex forms
- **Inline editing** provides better user experience than modals
- **Real-time feedback** is crucial for formula validation
- **Grouped organization** (folders, categories) improves usability

### Technical Patterns
- **Context providers** scale well for complex state
- **Validation patterns** should be immediate and clear
- **Component composition** with Excalibrr is highly flexible
- **TypeScript interfaces** should model business domains clearly

### Business Application
- **Formula-based systems** are powerful for many domains
- **A/B testing** helps validate design decisions
- **Template systems** reduce user effort and errors
- **Real-time calculations** provide immediate feedback

---

## Future Potential

This pattern could be extended to:
- **Manufacturing cost calculations**
- **Insurance risk scoring**
- **Employee performance metrics**
- **Energy usage formulas**
- **Financial modeling tools**

The core architecture is **domain-agnostic** and can be adapted for any application requiring mathematical formulas, business rules, or calculated values.

---

## For Future Claude Sessions

When working on this project or similar ones:

1. **The bakery context** is just an example - the real value is the formula management pattern
2. **A/B testing** was specifically requested to compare different UX approaches
3. **Template management** has two implementations (table vs dropdown) - both are intentional
4. **The three-column layout** is the core architectural decision that makes everything work
5. **Excalibrr components** should be used primarily, with Ant Design for specific complex widgets
6. **Real-time validation** and **immediate feedback** are key UX principles followed
7. **The ProductFormulaContext** manages all the business logic and state

The goal was to create a **production-quality demo** that showcases advanced patterns while being reusable for other domains.