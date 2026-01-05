# OSP Create Order Design Pattern

## Overview
This document describes how to recreate the Gravitate OSP (Online Selling Platform) "Create Order" drawer pattern using Excalibrr components. This pattern is used in the Buy Now Prompt page and can be applied to similar order creation flows in Buy Now and Market Platform demos.

**Source Reference**: `/Users/frankoverland/Documents/Gravitate Repo/Gravitate.Dotnet.Next/frontend/src/modules/SellingPlatform/BuyNow/Prompt/`

---

## High-Level Structure

### Layout Pattern
```
┌─────────────────────────────────────────┐
│ Drawer (Right-side, 600px width)       │
│ ┌─────────────────────────────────────┐ │
│ │ Header: "Create New Order"          │ │
│ ├─────────────────────────────────────┤ │
│ │ Form (Ant Design Form component)   │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Quantity Input (Dark Header)    │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Purchase Type Radio Buttons     │ │ │
│ │ ├─────────────────────────────────┤ │ │
│ │ │ Scrollable Content Area         │ │ │
│ │ │ ┌─────────────────────────────┐ │ │ │
│ │ │ │ Margin Display (if internal)│ │ │ │
│ │ │ ├─────────────────────────────┤ │ │ │
│ │ │ │ Price Override Input        │ │ │ │
│ │ │ ├─────────────────────────────┤ │ │ │
│ │ │ │ Conditional Fields          │ │ │ │
│ │ │ │ - Index Override            │ │ │ │
│ │ │ │ - Bid Expiration            │ │ │ │
│ │ │ │ - Futures Month             │ │ │ │
│ │ │ │ - Lifting Days              │ │ │ │
│ │ │ │ - Additional Products       │ │ │ │
│ │ │ ├─────────────────────────────┤ │ │ │
│ │ │ │ Collapse Panel:             │ │ │ │
│ │ │ │ "Additional Options"        │ │ │ │
│ │ │ │ - Preferred Carriers        │ │ │ │
│ │ │ │ - Preferred Terminals       │ │ │ │
│ │ │ │ - Loading Numbers           │ │ │ │
│ │ │ │ - Notes                     │ │ │ │
│ │ │ ├─────────────────────────────┤ │ │ │
│ │ │ │ Divider                     │ │ │ │
│ │ │ ├─────────────────────────────┤ │ │ │
│ │ │ │ Counterparty Selection      │ │ │ │
│ │ │ │ (if internal user)          │ │ │ │
│ │ │ └─────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Container: Drawer Component

**Ant Design Drawer** (right-side placement, 600px width)

```tsx
<Drawer
  title="Create New Order"
  placement="right"
  width={600}
  destroyOnClose
  onClose={handleClose}
  visible={drawerVisible}
  className="buy-now-drawer"
>
  <Vertical style={{ width: '100%', margin: 0 }}>
    <Form
      name="orderForm"
      form={form}
      onFieldsChange={handleFieldsChange}
      onFinish={handleFinish}
      scrollToFirstError
    >
      {/* Form content here */}
    </Form>
  </Vertical>
</Drawer>
```

**Key Props**:
- `destroyOnClose`: Clears form state when closed
- `width={600}`: Standard width for order creation
- `placement="right"`: Slides in from right side
- Confirm navigation if there are unsaved changes

---

### 2. Section 1: Quantity Input (Prominent Header)

**Visual Design**:
- Dark background (`--gray-800` theme variable)
- White text for high contrast
- Large heading text ("Quantity")
- Input field aligned to the right (50% width)
- Validation with error/warning states

**Excalibrr Components**:
```tsx
<Horizontal
  verticalCenter
  style={{
    backgroundColor: 'var(--gray-800)',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  }}
>
  <Texto category="heading-small" appearance="white">
    Quantity
  </Texto>
  <Form.Item
    name="Quantity"
    rules={[/* validation rules */]}
    style={{ width: '50%' }}
    validateStatus={getFieldStatus()}
    help={getFieldErrorMessage()}
  >
    <InputNumber
      autoFocus
      controls={false}
      bordered
      className="round-border"
      size="middle"
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
      style={{
        backgroundColor: 'transparent',
        minWidth: '100%',
        opacity: 0.8,
        color: 'white',
        textAlign: 'right',
      }}
      placeholder="Enter Deal Quantity"
    />
  </Form.Item>
</Horizontal>
```

**Validation Rules**:
- Required field
- Cannot be 0
- Must be >= MinVolume
- Must be <= MaxVolume
- Must be in increments of VolumeIncrement
- Warning if > WarningVolume

---

### 3. Section 2: Purchase Type (Radio Button Group)

**Visual Design**:
- Horizontal layout with label on left, buttons on right
- Radio Button Group with icons
- Market and Bid options

**Excalibrr Components**:
```tsx
<Horizontal className="px-4 py-3 justify-sb" verticalCenter>
  <Texto category="h6" appearance="default">
    Purchase Type
  </Texto>
  <Form.Item name="Type" noStyle>
    <Radio.Group onChange={handleTypeChange}>
      <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value="market">
        <BarChartOutlined /> Market
      </Radio.Button>
      <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value="bid">
        <LineChartOutlined /> Bid
      </Radio.Button>
    </Radio.Group>
  </Form.Item>
</Horizontal>
```

**Icons**:
- Market: `<BarChartOutlined />`
- Bid: `<LineChartOutlined />`

---

### 4. Section 3: Scrollable Content Area

**Purpose**: Contains all remaining form fields with vertical scroll

```tsx
<div style={{ overflowY: 'scroll' }}>
  {/* All remaining sections go here */}
</div>
```

---

### 5. Field Pattern: Label-Value Pairs

**Standard Pattern** for most fields in the scrollable area:

```tsx
<Horizontal className="mt-3 mb-2 mx-4 justify-sb" verticalCenter>
  <Texto style={{ color: 'var(--theme-option)' }} category="p2">
    Field Label
  </Texto>
  <Form.Item name="FieldName" style={{ minWidth: '50%' }}>
    <InputNumber
      controls={false}
      style={{ textAlign: 'right', minWidth: '100%' }}
      prefix="$"
      precision={4}
    />
  </Form.Item>
</Horizontal>
```

**Key CSS Classes**:
- `mt-3 mb-2 mx-4`: Margin spacing (top: 3, bottom: 2, horizontal: 4)
- `justify-sb`: Space-between justification
- `px-4 py-3`: Padding (horizontal: 4, vertical: 3)

**Layout**:
- Label on left with theme color (`--theme-option`)
- Input on right (50% width minimum)
- Right-aligned text for numeric inputs

---

### 6. Conditional Fields Pattern

Fields appear/disappear based on:
- User type (internal vs external)
- Purchase type (market vs bid)
- TAS mode
- Available options in metadata

**Example**:
```tsx
{isInternalUser && <MarginDisplay margin={calculatedMargin} />}
{isInternalUser && !tasMode && purchaseType !== 'bid' && <IndexOverride />}
{purchaseType === 'bid' && !tasMode && <BidExpiration form={form} />}
{tasMode && <FuturesMonth form={form} />}
```

---

### 7. Collapsible Section: Additional Options

**Ant Design Collapse** with ghost style (no border):

```tsx
<Horizontal className="test-AdditionalOptions mt-4">
  <Collapse ghost style={{ minWidth: '100%' }} defaultActiveKey="1">
    <Panel
      className="bg-3 mx-3"
      header={<Texto category="h6">Additional Options</Texto>}
      key="1"
    >
      <div className="mx-3">
        {/* Optional fields based on metadata */}
        {hasPreferredCarriers && <PreferredCarriers />}
        {hasPreferredTerminals && <PreferredTerminals />}
        {hasLoadingNumbers && <LoadingNumbers />}
        {allowNotes && <Notes form={form} />}
      </div>
    </Panel>
  </Collapse>
</Horizontal>
```

**Styling**:
- `ghost`: No border on collapse
- `defaultActiveKey="1"`: Expanded by default
- `bg-3`: Background color class
- Header uses `Texto category="h6"`

---

### 8. Dividers

Use horizontal dividers to separate sections:

```tsx
<Horizontal className="border-bottom" />
<Horizontal className="border-bottom my-3" />
```

**Classes**:
- `border-bottom`: Adds bottom border
- `my-3`: Vertical margin of 3

---

### 9. Section 8: Counterparty Selection (Internal Users)

**Conditional Section** (only for internal users):

```tsx
{isInternalUser && (
  <Horizontal className="mt-1 mx-4">
    <Vertical>
      <Horizontal>
        <Texto category="p1" appearance="primary" weight={900}>
          Choose Counterparty & User
        </Texto>
      </Horizontal>
      <Horizontal className="border-bottom mt-2" />
      {currentCounterParty && (
        <ExternalCounterpartyDisplay currentCounterParty={currentCounterParty} />
      )}
      <ContactSelect />
      <InternalCounterparty />
      <Horizontal className="mt-2" />
    </Vertical>
  </Horizontal>
)}
```

---

## Form State Management

### 1. Form Instance
```tsx
const [form] = Form.useForm()
```

### 2. Watching Form Values
```tsx
const enteredPrice = Form.useWatch('Price', form)
const purchaseType = form.getFieldValue('Type')
```

### 3. Setting Initial Values
```tsx
useEffect(() => {
  form.setFieldsValue({ ...selectedItemMeta })
}, [selectedItemMeta])
```

### 4. Tracking Pending Changes
```tsx
<Form
  onFieldsChange={() => setPendingChanges(true)}
  onFinish={handleSubmit}
>
```

### 5. Close Confirmation with Unsaved Changes
```tsx
const handleClose = (event) => {
  if (pendingChanges) {
    Modal.confirm({
      title: 'Are you sure you want to navigate away?',
      content: 'There are unsaved changes...',
      onOk: () => {
        clearForm()
        closeDrawer()
      },
      onCancel: () => event.stopPropagation()
    })
  } else {
    closeDrawer()
  }
}
```

---

## Grid Integration Pattern

### Grid with "Create Order" Button

**Column Definition** for action button:

```tsx
{
  suppressMovable: true,
  enableColumnResizing: false,
  maxWidth: 200,
  editable: false,
  headerName: 'Actions',
  cellRenderer: ({ data }) => {
    return (
      <GraviButton
        theme3
        icon={<PlusOutlined style={{ fontSize: 16 }} />}
        buttonText="Create Order"
        disabled={!data.Price}
        onClick={() => {
          setSelectedItem({ ...data })
          setCreatingOrder(true)
        }}
        style={{ borderRadius: 10 }}
      />
    )
  },
}
```

**Key Points**:
- `theme3`: OSP button theme
- `PlusOutlined` icon
- Disabled if no price available
- Sets selected row data and opens drawer

---

## Styling Patterns

### CSS Custom Properties (OSP Theme)
```css
--gray-800: Dark background color
--theme-option: Theme accent color
--theme-color-2: Primary theme color
--theme-color-2-dim: Dimmed theme color
```

### Common CSS Classes
```css
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.mt-3 { margin-top: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mx-4 { margin-left: 1rem; margin-right: 1rem; }
.my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
.justify-sb { justify-content: space-between; }
.border-bottom { border-bottom: 1px solid var(--border-color); }
.bg-3 { background-color: var(--background-3); }
```

---

## Responsive Behaviors

### 1. Field Visibility
- Fields appear/disappear based on context
- Smooth transitions when fields change

### 2. Validation Feedback
- Inline validation on blur
- Real-time validation for numeric constraints
- Error messages below inputs
- Warning states for high values

### 3. Scroll Behavior
- Header (Quantity) is fixed
- Content scrolls independently
- Footer actions remain accessible

---

## Component Library Mapping

| Gravitate Component | Excalibrr Equivalent | Notes |
|---------------------|----------------------|-------|
| `Horizontal` | `Horizontal` | Same component |
| `Vertical` | `Vertical` | Same component |
| `Texto` | `Texto` | Same component with categories |
| `GraviButton` | `GraviButton` | Same component |
| `GraviGrid` | `GraviGrid` | Same component |
| `Form` | Ant Design `Form` | Same from antd |
| `InputNumber` | Ant Design `InputNumber` | Same from antd |
| `Radio` | Ant Design `Radio` | Same from antd |
| `Collapse` | Ant Design `Collapse` | Same from antd |
| `Drawer` | Ant Design `Drawer` | Same from antd |

---

## Implementation Checklist

### For Buy Now "Create Order" Drawer:
- [ ] Create drawer with 600px width, right placement
- [ ] Add dark header section with Quantity input
- [ ] Add Purchase Type radio button group (Market/Bid)
- [ ] Create scrollable content area
- [ ] Add Price Override field (label-value pattern)
- [ ] Add conditional fields based on purchase type
- [ ] Add "Additional Options" collapsible section
- [ ] Add dividers between major sections
- [ ] Add Counterparty selection (for internal users)
- [ ] Implement form validation with real-time feedback
- [ ] Add unsaved changes confirmation on close
- [ ] Wire up "Create Order" button in grid
- [ ] Set selected row data when opening drawer
- [ ] Add form submission handler

### For Market Platform "Create/Edit Offer" Drawer:
- [ ] Reuse same drawer pattern
- [ ] Change title to "Create New Offer" / "Edit Offer"
- [ ] Replace Quantity with Terminal selection
- [ ] Add Product selection
- [ ] Add Formula Template picker (select from library)
- [ ] Add Differential input
- [ ] Add Status toggle (Active/Inactive)
- [ ] Keep "Additional Options" section for notes
- [ ] Wire up "Create" button in control bar
- [ ] Wire up "Edit" button in grid actions column

---

## Example: Simplified Create Order Form

```tsx
import { Horizontal, Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Drawer, Form, InputNumber, Radio, Collapse } from 'antd'
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons'

const { Panel } = Collapse

export function CreateOrderDrawer({ visible, onClose, selectedOffer, form }) {
  const [pendingChanges, setPendingChanges] = useState(false)

  const handleClose = () => {
    if (pendingChanges) {
      // Show confirmation modal
      Modal.confirm({
        title: 'Unsaved changes',
        content: 'Are you sure you want to close?',
        onOk: () => {
          form.resetFields()
          setPendingChanges(false)
          onClose()
        }
      })
    } else {
      onClose()
    }
  }

  return (
    <Drawer
      title="Create New Order"
      placement="right"
      width={600}
      visible={visible}
      onClose={handleClose}
      destroyOnClose
    >
      <Vertical style={{ width: '100%' }}>
        <Form form={form} onFieldsChange={() => setPendingChanges(true)}>
          {/* Quantity Section - Dark Header */}
          <Horizontal
            verticalCenter
            style={{
              backgroundColor: 'var(--gray-800)',
              justifyContent: 'space-between',
              padding: '20px 10px',
            }}
          >
            <Texto category="heading-small" appearance="white">
              Quantity
            </Texto>
            <Form.Item name="quantity" style={{ width: '50%', margin: 0 }}>
              <InputNumber
                autoFocus
                controls={false}
                placeholder="Enter Quantity"
                style={{
                  width: '100%',
                  textAlign: 'right',
                  backgroundColor: 'transparent',
                  color: 'white',
                }}
              />
            </Form.Item>
          </Horizontal>

          {/* Purchase Type */}
          <Horizontal className="px-4 py-3" verticalCenter style={{ justifyContent: 'space-between' }}>
            <Texto category="h6">Purchase Type</Texto>
            <Form.Item name="type" noStyle>
              <Radio.Group>
                <Radio.Button value="market">
                  <BarChartOutlined /> Market
                </Radio.Button>
                <Radio.Button value="bid">
                  <LineChartOutlined /> Bid
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Horizontal>

          {/* Scrollable Content */}
          <div style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 300px)' }}>
            {/* Price Field */}
            <Horizontal className="mt-3 mb-2 mx-4" verticalCenter style={{ justifyContent: 'space-between' }}>
              <Texto style={{ color: 'var(--theme-option)' }} category="p2">
                Sale Price
              </Texto>
              <Form.Item name="price" style={{ minWidth: '50%', margin: 0 }}>
                <InputNumber
                  controls={false}
                  prefix="$"
                  precision={4}
                  style={{ textAlign: 'right', width: '100%' }}
                />
              </Form.Item>
            </Horizontal>

            {/* Additional Options Collapse */}
            <Horizontal className="mt-4">
              <Collapse ghost style={{ width: '100%' }} defaultActiveKey="1">
                <Panel header={<Texto category="h6">Additional Options</Texto>} key="1">
                  <div className="mx-3">
                    <Texto category="p2">Additional fields go here...</Texto>
                  </div>
                </Panel>
              </Collapse>
            </Horizontal>

            {/* Divider */}
            <Horizontal className="border-bottom my-3" />

            {/* Footer Actions */}
            <Horizontal className="mx-4" style={{ justifyContent: 'flex-end', gap: '12px' }}>
              <GraviButton buttonText="Cancel" onClick={handleClose} />
              <GraviButton buttonText="Submit Order" theme3 onClick={() => form.submit()} />
            </Horizontal>
          </div>
        </Form>
      </Vertical>
    </Drawer>
  )
}
```

---

## Notes

1. **Always use Excalibrr components** (`Horizontal`, `Vertical`, `Texto`, `GraviButton`) for consistency
2. **Use Ant Design Form** for form state management and validation
3. **Dark header pattern** creates visual hierarchy and draws attention to primary action (Quantity)
4. **Label-value pairs** should maintain 50% width minimum for inputs, right-aligned
5. **Collapsible sections** reduce visual clutter for optional fields
6. **Dividers** separate major functional sections
7. **Conditional rendering** keeps UI relevant to current context
8. **Unsaved changes prompt** prevents accidental data loss
9. **Form validation** provides real-time feedback
10. **Right-side drawer** (600px) is standard for order creation flows

---

## Testing Checklist

- [ ] Drawer opens when "Create Order" clicked
- [ ] Form fields populate with selected row data
- [ ] Validation works for all required fields
- [ ] Conditional fields appear/disappear correctly
- [ ] Collapsible sections expand/collapse
- [ ] Unsaved changes prompt appears when closing with changes
- [ ] Form resets when drawer closes
- [ ] Submit handler fires correctly
- [ ] Scroll works in content area
- [ ] All fields are accessible via keyboard
- [ ] Field labels are aligned correctly
- [ ] Inputs are right-aligned for numeric values
- [ ] Theme colors apply correctly
