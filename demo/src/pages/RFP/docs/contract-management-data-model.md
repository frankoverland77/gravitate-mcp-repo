# Contract Management Data Model Reference

This document provides a comprehensive reference for the Contract Management module's data model, specifically focused on provisions and price formulas. Use this as a reference when building RFP bid editing features, as awarded RFPs become contracts.

---

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Data Hierarchy](#data-hierarchy)
3. [Core Entities](#core-entities)
4. [Provision Types](#provision-types)
5. [Formula Variables](#formula-variables)
6. [Edit Provisions Workflow](#edit-provisions-workflow)
7. [Component Patterns](#component-patterns)
8. [Code Snippets](#code-snippets)

---

## Entity Relationship Diagram

```
+---------------------------+
|     ContractDetails       |
|     (TradeEntry)          |
+---------------------------+
| TradeEntryId (PK)         |
| InternalCounterPartyId    |
| ExternalCounterPartyId    |
| FromDateTime              |
| ToDateTime                |
| TradeInstrumentId         |
| OrderStatusCvId           |
| MovementTypeCvId          |
| BookId                    |
| ValuationCalendarId       |
+---------------------------+
            |
            | 1:N
            v
+---------------------------+
|         Detail            |
|    (TradeEntryDetail)     |
+---------------------------+
| TradeEntryDetailId (PK)   |
| LocalTradeEntryDetailId   |  <-- Client-side UUID for new items
| FromDateTime              |
| ToDateTime                |
| ProductId / ProductName   |
| FromLocationId/Name       |  <-- Origin
| ToLocationId/Name         |  <-- Destination
| FrequencyCvId             |
| UnitOfMeasureId           |
| Quantity                  |
| MinimumAllocation         |
| MaximumAllocation         |
| NetOrGrossCvId            |
| ValuationCalendarId       |
| PricePeriodStartOffset    |
+---------------------------+
            |
            | 1:N
            v
+---------------------------+
|         Price             |
|    (TradeEntryPrice)      |
+---------------------------+
| TradeEntryPriceId (PK)    |
| LocalTradeEntryPriceId    |  <-- Client-side UUID for new items
| FromDate                  |
| ToDate                    |
| CurrencyId / CurrencyName |
| UnitOfMeasureId / Name    |
| PayOrReceiveCvId          |
| NetOrGrossCvId            |
| ProvisionType             |  <-- "Fixed" | "Formula" | "Lesser Of 2" | "Lesser Of 3"
| FixedValue                |  <-- Only for Fixed type
| Status                    |  <-- "Valid" | "Needs Configuration" | "Needs Price" | etc.
| FormulaId                 |
| Formula (object)          |
+---------------------------+
            |
            | 1:1 (for non-Fixed)
            v
+---------------------------+
|        Formula            |
+---------------------------+
| FormulaId (PK)            |
| Name                      |
| Formula (string)          |  <-- e.g., "var_1_group_1"
| ParserType                |
| IsActive                  |
| FormulaVariables[]        |
+---------------------------+
            |
            | 1:N
            v
+---------------------------+
|    FormulaVariable        |
+---------------------------+
| FormulaVariableId (PK)    |
| FormulaId (FK)            |
| VariableName              |  <-- e.g., "var_1_group_1"
| DisplayName               |
| Percentage                |  <-- Default 100
| Differential              |  <-- Price adjustment (+/-)
| PricePublisherId/Name     |
| PriceInstrumentId/Name    |
| PriceTypeCvId/DisplayName |
| PriceValuationRuleId/Name |
| IsRequired                |
| MissingOptionalPriceBehaviorCvId |
| UOMConversionOverride     |
| FixedValue                |  <-- For fixed-value variables
| ValueSourceCvId           |  <-- 7203 = fixed value
+---------------------------+
```

---

## Data Hierarchy

### Overview
```
Contract (Header)
    |
    +-- Detail 1 (Product/Location/Dates)
    |       |
    |       +-- Price/Provision A (Fixed @ $2.50)
    |       |
    |       +-- Price/Provision B (Formula)
    |               |
    |               +-- Formula Group 1
    |                       +-- Variable 1 (100% OPIS, Gulf Coast ULSD, Low)
    |                       +-- Variable 2 (Add $0.05 differential)
    |
    +-- Detail 2 (Different Product/Location)
            |
            +-- Price/Provision C (Lesser Of 2)
                    |
                    +-- Formula Group 1 (OPIS pricing)
                    +-- Formula Group 2 (Platts pricing)
```

### Key Relationships
| Parent | Child | Cardinality | Description |
|--------|-------|-------------|-------------|
| Contract | Detail | 1:N | One contract has many line items |
| Detail | Price | 1:N | Each detail can have multiple price provisions |
| Price | Formula | 1:1 | Non-fixed prices have one formula |
| Formula | FormulaVariable | 1:N | Formulas contain multiple variables |

---

## Core Entities

### ContractDetails (Contract Header)

```typescript
interface ContractDetails {
  TradeEntryId: number
  Description: string
  Comments: string

  // Parties
  InternalCounterPartyId: number
  InternalCounterPartyName: string
  ExternalCounterPartyId: number
  ExternalCounterPartyName: string
  InternalColleagueId: number
  ExternalColleagueId: number

  // Dates
  FromDateTime: Date
  ToDateTime: Date
  TradeEntryDateTime: Date
  CreatedDateTime: Date
  EffectiveDates?: (string | Date)[]  // Convenience array [from, to]

  // Classification
  TradeInstrumentId: number
  TradeInstrumentName: string
  TradeEntryTypeCvId: number
  OrderStatusCvId: number
  OrderStatusCodeValueDisplay: string  // "Draft" | "Active" | etc.
  MovementTypeCvId: number
  BookId: number
  ValuationCalendarId: number

  // Flags
  IsExtracted: boolean
  ContractManagementRequiresQuantities?: boolean

  // Children
  Details: Detail[]
}
```

### Detail (Contract Line Item)

```typescript
interface Detail {
  // Identifiers
  TradeEntryDetailId: number | undefined     // Server-assigned ID
  LocalTradeEntryDetailId: string            // Client UUID for new items
  Id?: string

  // Dates
  FromDateTime: Date | Moment
  ToDateTime: Date | Moment
  EffectiveDates: (Moment | Date)[]

  // Product & Location
  ProductId: number
  ProductName: string
  FromLocationId: number          // Origin
  FromLocationName: string
  ToLocationId: number            // Destination (optional)
  ToLocationName: string

  // Quantity
  Quantity: number
  MinimumAllocation: number
  MaximumAllocation: number
  Quantities?: Quantity[] | null  // Detailed quantity breakdown

  // Units & Frequency
  UnitOfMeasureId: number
  UnitOfMeasureName: string
  FrequencyCvId: number
  FrequencyCodeValueDisplay: string  // "Per Month" | "Per Day" | etc.

  // Volume Basis
  NetOrGrossCvId: number
  NetOrGrossCodeValueDisplay: string

  // Pricing
  PricePeriodStartOffset: string
  ValuationCalendarId: number

  // Children
  Prices: Price[]

  // UI State
  isOpen: boolean
}
```

### Price (Provision)

```typescript
interface Price {
  // Identifiers
  TradeEntryPriceId?: number          // Server-assigned ID
  LocalTradeEntryPriceId: number      // Client UUID for new items
  FormulaId?: number

  // Effective Period
  FromDate: Date | Moment
  ToDate: Date | Moment

  // Currency & UOM
  CurrencyId: number
  CurrencyName: string
  UnitOfMeasureId: number
  UnitOfMeasureName: string

  // Direction
  PayOrReceiveCvId: number
  PayOrReceiveCodeValueDisplay: string  // "Pay" | "Receive"

  // Volume Basis (optional override)
  NetOrGrossCvId?: number
  NetOrGrossCodeValueDisplay?: string

  // Price Type
  ProvisionType: string      // "Fixed" | "Formula" | "Lesser Of 2" | "Lesser Of 3"
  FixedValue: number | null  // Only populated for Fixed type

  // Formula (for non-Fixed types)
  Formula?: Formula

  // Status
  Status: string            // "Valid" | "Needs Configuration" | "Needs Price" | etc.
  IsActive?: boolean
}
```

### Formula

```typescript
interface Formula {
  FormulaId: number
  Name: string
  Formula: string              // e.g., "var_1_group_1 + var_2_group_1"
  ParserType: string
  IsActive: boolean
  FormulaVariables: FormulaVariable[]

  // Optional metadata
  CreatedByCredentialId?: null | number
  CreatedDateTime?: Date
  IsSystemCalculation?: boolean
  IsVisible?: boolean
  MarkerId?: null | number
  MarkerName?: null | string
}
```

### FormulaVariable

```typescript
interface FormulaVariable {
  // Identifiers
  FormulaVariableId: number
  FormulaId: number
  FormulaVariableTemplateId: null | number

  // Naming
  VariableName: string       // Pattern: "var_{index}_group_{groupNum}"
  DisplayName: null | string // User-friendly name

  // Price Source
  PricePublisherId: string   // e.g., OPIS, Platts
  PricePublisherName: string
  PriceInstrumentId: string  // Specific index/product
  PriceInstrumentName: string
  PriceTypeCvId: number      // Low, High, Mean, etc.
  PriceTypeDisplayName: string

  // Valuation Rules
  PriceValuationRuleId: number
  PriceValuationRuleName: string           // "Average", "Specific Day", etc.
  PriceValuationRuleImplementation: string
  TradeDateRuleCvId: null | number
  ValueEffectiveDateRuleCvId: null | number

  // Calculation Parameters
  Percentage: number         // Default 100, can be partial
  Differential: number       // Price adjustment (+/- value)
  IsCost: boolean

  // Optional Handling
  IsRequired: boolean
  MissingOptionalPriceBehaviorCvId: null | number

  // Value Override
  FixedValue: null | string | number
  ValueSourceCvId: null | number   // 7203 = use fixed value

  // UOM Conversion
  UOMConversionOverride: null | number

  // Metadata
  CreatedDateTime: Date
  CreatedByCredentialId?: null | number
  IsSystemVariable: boolean
  IsTemplateVariable: null | boolean
  IsVisible: boolean
  SystemDataType: string

  // Location/Product Specifics
  SpecificCounterPartyId: null | number
  SpecificCounterPartyName: null | string
  SpecificLocationId: null | number
  SpecificProductId: null | number
  AllowMultiOrigin?: null | boolean
  CounterPartyMatchTypeCvId?: null | number
}
```

---

## Provision Types

### Enum Definition

```typescript
enum ProvisionTypes {
  FIXED = 'Fixed',
  FORMULA = 'Formula',
  LESSEROF2 = 'Lesser Of 2',
  LESSEROF3 = 'Lesser Of 3',
  INTEGRATED = 'Integrated',  // For extracted contracts
}
```

### Type Comparison

| Type | Groups | Description | Use Case |
|------|--------|-------------|----------|
| Fixed | 0 | Single fixed price value | Spot purchases, locked prices |
| Formula | 1 | One formula with multiple variables | Index-based pricing |
| Lesser Of 2 | 2 | Two formulas, system picks lower | Price protection |
| Lesser Of 3 | 3 | Three formulas, system picks lowest | Maximum flexibility |
| Integrated | N | Imported from external system | Legacy/extracted data |

### Variable Naming Convention

Variables follow pattern: `var_{variableIndex}_group_{groupNumber}`

Examples:
- `var_1_group_1` - First variable in formula group 1
- `var_2_group_1` - Second variable in formula group 1
- `var_1_group_2` - First variable in formula group 2 (Lesser Of 2)

---

## Formula Variables

### Variable Row Fields

The provision editor displays variables as rows with these columns:

| Column | Field | Type | Description |
|--------|-------|------|-------------|
| % | Percentage | number | Weight of this variable (default 100) |
| Publisher | PricePublisherId | select | Price data source (OPIS, Platts, etc.) |
| Instrument | PriceInstrumentId | select | Specific index (cascaded from Publisher) |
| Type | PriceTypeCvId | select | Price type (Low, High, Mean, etc.) |
| Diff | Differential | number | Price adjustment (+/-) |
| Date Rule | PriceValuationRuleName | select | Averaging/specific day rule |
| Required | MissingOptionalPriceBehaviorCvId | select | Optional variable behavior |
| Display | DisplayName | text | User-friendly label |
| UOM/Currency | (derived) | text | From selected instrument |
| Actions | - | buttons | Options modal, Delete |

### Cascading Dependencies

```
Publisher Selection
       |
       +---> Filters available Instruments
       |
       +---> Filters available Price Types
```

When Publisher changes:
1. Clear selected Instrument
2. Clear selected Price Type
3. Repopulate dropdowns with filtered options

---

## Edit Provisions Workflow

### UI Components

```
+---------------------------------------------------------------+
|  DRAWER (Bottom, 85vh height)                                 |
+---------------------------------------------------------------+
|  Title: "Edit Provision"                            [Save]    |
+---------------------------------------------------------------+
|                                                               |
|  +-----------------------------------------------------------+|
|  | PRICE DISPLAY (Header - Blue/Theme background)            ||
|  | Effective Dates | Currency | UOM | Pay/Receive | Vol Basis||
|  +-----------------------------------------------------------+|
|                                                               |
|  +-----------------------------------------------------------+|
|  | FORMULA HEADER: "Price Formulas"         Type: [Formula]  ||
|  |                                                           ||
|  | Name: [_________________________________]                 ||
|  +-----------------------------------------------------------+|
|                                                               |
|  +-----------------------------------------------------------+|
|  | COLUMN HEADERS                                            ||
|  | % | Publisher | Instrument | Type | Diff | Rule | Req |..||
|  +-----------------------------------------------------------+|
|                                                               |
|  +-----------------------------------------------------------+|
|  | FORMULA 1                              [+ Add Row]        ||
|  +-----------------------------------------------------------+|
|  | [100] | [OPIS  v] | [Gulf Coast v] | [Low v] | [0.00]... ||
|  | [100] | [Platts v]| [USGC v]       | [Mean v]| [0.05]... ||
|  +-----------------------------------------------------------+|
|                                                               |
|  (For Lesser Of 2/3, additional formula groups appear)        |
|                                                               |
+---------------------------------------------------------------+
```

### Data Flow

```
1. User clicks "Edit" on a Price row
        |
        v
2. setProvisionToEdit(price) - opens drawer
        |
        v
3. ProvisionEditor receives price data
        |
        v
4. useProvisionGroups(price) - organizes variables by group
        |
        v
5. Form.List renders variable rows
        |
        v
6. User edits variables (cascading dropdowns)
        |
        v
7. Form submit -> handleSaveProvision()
        |
        v
8. Variables normalized with VariableName pattern
        |
        v
9. updateManagedDetail(updatedPrice) - updates parent state
        |
        v
10. Drawer closes
```

### State Management

```typescript
// Parent State (DetailManager)
const [managedDetail, setManagedDetail] = useState<Detail>(null)

// Provision State (ProvisionManager)
const [provisionToEdit, setProvisionToEdit] = useState<Price>()

// Form State
const [provisionForm] = Form.useForm()

// Group State (useProvisionGroups hook)
const [groups, setGroups] = useState([])  // [[var1, var2], [var3]]
```

---

## Component Patterns

### Provision Manager (Container)

```tsx
// Key patterns from ProvisionManager.tsx

export function ProvisionManager({ managedDetail, setManagedDetail }) {
  const { metadata } = useContractManagementContext()
  const [provisionToEdit, setProvisionToEdit] = useState<Price>()
  const [provisionForm] = Form.useForm()

  const provisionEditorVisible = !!provisionToEdit
  const clearProvisionToEdit = () => setProvisionToEdit(undefined)

  // CRUD operations
  const createProvision = () => {
    const newProvision = blankFixedProvision(managedDetail, metadata)
    setManagedDetail((prev) => ({
      ...prev,
      Prices: [...prev.Prices, newProvision],
    }))
  }

  const deleteProvision = (provision: Price) => {
    const id = provision.TradeEntryPriceId || provision.LocalTradeEntryPriceId
    const filtered = managedDetail.Prices.filter(
      (p) => p.TradeEntryPriceId !== id && p.LocalTradeEntryPriceId !== id
    )
    setManagedDetail((prev) => ({ ...prev, Prices: filtered }))
  }

  const handleSaveProvision = (values) => {
    // Normalize variable names
    const variables = values.Groups.flat().map((v, i) => ({
      ...v,
      VariableName: `var_${i + 1}_group_${groupIndex + 1}`,
    }))

    const updated = {
      ...provisionToEdit,
      Formula: { ...provisionToEdit.Formula, FormulaVariables: variables },
    }
    updateManagedDetail(updated)
    clearProvisionToEdit()
  }

  return (
    <>
      <GraviGrid
        columnDefs={columnDefs}
        rowData={managedDetail?.Prices}
        masterDetail
        detailCellRenderer={PriceProvisionDisplay}
      />
      <Drawer
        height="85vh"
        placement="bottom"
        visible={provisionEditorVisible}
        onClose={clearProvisionToEdit}
        extra={<GraviButton success buttonText="Save" onClick={provisionForm.submit} />}
      >
        <ProvisionEditor
          form={provisionForm}
          data={provisionToEdit}
          metadata={metadata}
          onSave={handleSaveProvision}
        />
      </Drawer>
    </>
  )
}
```

### Provision Editor (Form)

```tsx
// Key patterns from ProvisionEditor.tsx

export function ProvisionEditor({ form, data, onSave, metadata }) {
  const provisionGroupManager = useProvisionGroups(data)

  useEffect(() => {
    form.setFieldsValue({
      Groups: [...provisionGroupManager.groups],
      Name: data?.Formula?.Name,
    })
  }, [provisionGroupManager.groups])

  return (
    <Form form={form} onFinish={onSave}>
      <PriceDisplay data={data} />

      <Form.Item name="Name">
        <Input placeholder="Enter Name" maxLength={255} />
      </Form.Item>

      <VariableColumnHeader />

      <Form.List name="Groups">
        {(formulaGroups) =>
          formulaGroups.map((group) => (
            <FormulaGroup group={group} metadata={metadata} form={form} />
          ))
        }
      </Form.List>
    </Form>
  )
}

function FormulaGroup({ group, metadata, form }) {
  return (
    <Form.List name={group.name}>
      {(variables, { add, remove }) => (
        <>
          <FormulaHeader
            index={group.name}
            addFormula={() => add(blankFormulaPrice())}
          />
          {variables.map((variable, index) => (
            <VariableRowForm
              form={form}
              metadata={metadata}
              variable={variable}
              remove={() => remove(variable.name)}
              name={variable.name}
              groupName={group.name}
            />
          ))}
        </>
      )}
    </Form.List>
  )
}
```

### Variable Row Form (Edit Mode)

```tsx
// Key patterns from VariableRowForm in ProvisionEditor.tsx

function VariableRowForm({ variable, metadata, name, remove, form, groupName }) {
  const [selectedPublisherId, setSelectedPublisherId] = useState(variable?.PricePublisherId)
  const [viewingAOModal, setViewingAOModal] = useState(false)

  // Cascading options based on publisher
  const instrumentOptions = useMemo(() => {
    if (selectedPublisherId) {
      return metadata?.PublisherPriceInstruments[+selectedPublisherId] || []
    }
    return []
  }, [selectedPublisherId])

  const priceTypeOptions = useMemo(() => {
    if (selectedPublisherId) {
      return metadata?.PublisherPriceTypes[+selectedPublisherId] || []
    }
    return []
  }, [selectedPublisherId])

  const handlePublisherChange = (value, option) => {
    setSelectedPublisherId(option?.key)
    // Clear dependent fields
    const groups = form.getFieldsValue().Groups
    groups[groupName][variableIndex].PriceInstrumentId = null
    groups[groupName][variableIndex].PriceTypeCvId = null
    form.setFieldsValue({ Groups: groups })
  }

  return (
    <Horizontal>
      {/* Percentage */}
      <Form.Item name={[name, 'Percentage']} rules={[{ required: true }]}>
        <InputNumber placeholder="Percentage" step={0.1} />
      </Form.Item>

      {/* Publisher */}
      <Form.Item name={[name, 'PricePublisherId']} rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Publisher"
          onChange={handlePublisherChange}
          options={metadata?.PricePublisherList?.map((t) => ({
            key: t.Value,
            value: t.Value,
            label: t.Text,
          }))}
        />
      </Form.Item>

      {/* Instrument (cascaded) */}
      <Form.Item name={[name, 'PriceInstrumentId']} rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Instrument"
          options={instrumentOptions.map((t) => ({
            key: t.Value,
            value: t.Value,
            label: t.Text,
          }))}
        />
      </Form.Item>

      {/* Price Type (cascaded) */}
      <Form.Item name={[name, 'PriceTypeDisplayName']} rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Type"
          options={priceTypeOptions.map((t) => ({
            key: t.Value,
            value: t.Text,
            label: t.Text,
          }))}
        />
      </Form.Item>

      {/* Differential */}
      <Form.Item name={[name, 'Differential']}>
        <InputNumber placeholder="0" step={0.1} />
      </Form.Item>

      {/* Date Rule */}
      <Form.Item name={[name, 'PriceValuationRuleName']} rules={[{ required: true }]}>
        <Select
          showSearch
          placeholder="Rule"
          options={metadata?.TradePriceValuationRuleList?.map((t) => ({
            value: t.Text,
            label: t.Text,
          }))}
        />
      </Form.Item>

      {/* Actions */}
      <Button onClick={() => setViewingAOModal(true)}>Options</Button>
      <Button danger onClick={remove} icon={<DeleteOutlined />} />

      {/* Additional Options Modal */}
      <Modal visible={viewingAOModal}>
        <AdditionalOptionsModalContent
          variable={form.getFieldValue(['Groups', groupName, name])}
          metadata={metadata}
          submit={handleAOSave}
        />
      </Modal>
    </Horizontal>
  )
}
```

---

## Code Snippets

### Blank Provision Factory

```typescript
// For creating new Fixed provisions
export const blankFixedProvision = (managedDetail: Detail, metadata) => {
  const defaultCurrency = metadata?.CurrencyList?.find(
    (o) => o.Text.toLowerCase().includes('us dollar')
  )
  const defaultUOM = metadata?.UnitOfMeasureList?.find(
    (o) => o.Text.toLowerCase().includes('gal')
  )
  const defaultPay = metadata?.PayOrReceiveTypeList?.find(
    (o) => o.Text.toLowerCase().includes('pay')
  )

  return {
    CurrencyId: defaultCurrency?.Value,
    CurrencyName: defaultCurrency?.Text,
    FromDate: managedDetail?.EffectiveDates?.[0],
    ToDate: managedDetail?.EffectiveDates?.[1],
    PayOrReceiveCodeValueDisplay: defaultPay?.Text,
    PayOrReceiveCvId: defaultPay?.PayOrReceiveCvId,
    UnitOfMeasureId: defaultUOM?.Value,
    UnitOfMeasureName: defaultUOM?.Text,
    LocalTradeEntryPriceId: crypto.randomUUID(),
    FixedValue: 0,
    Status: 'Needs Price',
    ProvisionType: 'Fixed',
    Formula: {
      FormulaId: 0,
      FormulaVariables: [{
        DisplayName: 'Fixed Price',
        FixedValue: 'Needs Price',
        PriceTypeCvId: 704,
        ValueSourceCvId: 7203,  // Fixed value indicator
        VariableName: 'var_1',
      }],
      Formula: 'var_1',
      Name: '',
      ParserType: '',
    },
  }
}
```

### Blank Formula Variable Factory

```typescript
// For adding new variables to a formula
export const blankFormulaPrice = (varName?: string) => ({
  FormulaId: 0,
  FormulaVariableId: 0,
  FormulaVariableTemplateId: 0,

  // Calculation
  Percentage: 100,
  Differential: null,
  FixedValue: null,

  // Required fields (user must fill)
  PricePublisherId: null,
  PricePublisherName: null,
  PriceInstrumentId: null,
  PriceInstrumentName: null,
  PriceTypeCvId: null,
  PriceValuationRuleId: null,
  PriceValuationRuleName: null,

  // Optional
  DisplayName: '',
  IsRequired: true,
  MissingOptionalPriceBehaviorCvId: null,
  UOMConversionOverride: null,
  VariableName: varName ?? '',

  // Metadata
  CreatedDateTime: new Date(),
  IsSystemVariable: true,
  IsVisible: false,
})
```

### Status Calculation

```typescript
export function getPriceStatus(
  provision: Price,
  type: string,
  price: number | null,
  detailFromDate?: Date,
  detailToDate?: Date
): string {
  // Check required fields
  if (!provision.CurrencyId || !provision.UnitOfMeasureId ||
      !provision.PayOrReceiveCodeValueDisplay) {
    return 'Needs Configuration'
  }

  // Fixed type needs a price value
  if (type === ProvisionTypes.FIXED) {
    const value = price || provision.FixedValue
    if (value === null || value === undefined || value === 0) {
      return 'Needs Price'
    }
  }

  // Formula types need enough groups
  const groups = groupInList(provision?.Formula?.FormulaVariables)
  const requiredGroups = {
    [ProvisionTypes.FORMULA]: 1,
    [ProvisionTypes.LESSEROF2]: 2,
    [ProvisionTypes.LESSEROF3]: 3,
  }
  if (groups.length < requiredGroups[type] && type !== ProvisionTypes.FIXED) {
    return 'Needs Formula(s)'
  }

  // Date validation
  if (detailFromDate && detailToDate) {
    const priceFrom = moment(provision.FromDate)
    const priceTo = moment(provision.ToDate)
    if (priceFrom < moment(detailFromDate) || priceTo > moment(detailToDate)) {
      return 'Invalid Date(s)'
    }
  }

  return 'Valid'
}
```

### Provision Type Icon Renderer

```typescript
function ProvisionType({ value }) {
  const displayIcon = () => {
    switch (value) {
      case ProvisionTypes.FIXED:
        return <LockFilled />
      case ProvisionTypes.FORMULA:
        return <ExperimentOutlined />
      case ProvisionTypes.LESSEROF2:
      case ProvisionTypes.LESSEROF3:
        return <VerticalAlignBottomOutlined />
      default:
        return null
    }
  }

  return (
    <BBDTag theme1={value !== 'Fixed'}>
      {displayIcon()} {value}
    </BBDTag>
  )
}
```

---

## RFP Application Notes

When implementing bid editing for RFP:

### Mapping Concepts

| Contract Management | RFP Equivalent |
|---------------------|----------------|
| Contract | RFP Award |
| Detail | Bid Line Item |
| Price/Provision | Bid Pricing |
| Formula | Price Formula |
| FormulaVariable | Formula Component |

### Key Differences to Consider

1. **Status Flow**: RFP bids may have different statuses (Submitted, Under Review, Accepted, Rejected) vs. contract provisions (Valid, Needs Configuration)

2. **Comparison**: RFP needs to compare bids across suppliers, while contract provisions are singular

3. **History**: RFP may need to track bid history/revisions within rounds

4. **Validation**: RFP bids may have supplier-specific validation rules

### Reusable Patterns

1. **Drawer-based editing** - Same UX pattern works well for bid details
2. **Form.List for dynamic items** - Works for multiple price components per bid
3. **Cascading dropdowns** - Publisher -> Instrument pattern applies to bid pricing
4. **Status indicators** - Visual status tags transfer directly
5. **Master-detail grid** - Expandable rows for formula details

---

## File References

Source files in the Contract Management module:

```
/modules/ContractManagement/
  api/
    types.schema.ts           # Core interfaces
    useContracts.ts           # API hooks
  components/
    DetailManager/
      index.tsx               # Detail editing container
      DetailForm.tsx          # Detail header form
      PriceManagement/
        ProvisionManager.tsx  # Price/Provision CRUD
        ProvisionEditor.tsx   # Formula editing form
        priceColDefs.tsx      # Grid columns for prices
        useProvisionGroups.tsx # Group organization hook
        PriceProvisionDisplay.tsx # Read-only formula display
        VariableRowDisplay.tsx # Read-only variable row
        AdditionalOptionsModalContent.tsx # UOM override modal
  utils/
    index.ts                  # ProvisionTypes enum, helpers
    blankItems/
      index.ts                # Factory functions
```
