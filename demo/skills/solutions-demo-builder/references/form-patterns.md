# Form Patterns

Patterns for building forms in demos. Core principle: **AntD inputs + Excalibrr layout + Excalibrr buttons.**

## Table of Contents
- [Basic Form](#basic-form)
- [Input Types](#input-types)
- [Validation](#validation)
- [Form in Modal (Create/Edit)](#form-in-modal)
- [Form in Drawer](#form-in-drawer)
- [Filter Forms](#filter-forms)
- [Multi-Step Forms](#multi-step-forms)
- [Gotchas](#gotchas)

---

## Basic Form

```tsx
import React from 'react'
import { Form, Input, Select, DatePicker, InputNumber } from 'antd'
import { GraviButton, Horizontal, Vertical, Texto } from '@gravitate-js/excalibrr'

export function ContractForm({ onSubmit, onCancel }) {
  const [form] = Form.useForm()

  const handleFinish = (values) => {
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Form form={form} onFinish={handleFinish} layout='vertical'>
      <Form.Item name='contractName' label='Contract Name' rules={[{ required: true }]}>
        <Input placeholder='Enter contract name' />
      </Form.Item>

      <Form.Item name='type' label='Contract Type' rules={[{ required: true }]}>
        <Select
          placeholder='Select type'
          options={[
            { value: 'fixed', label: 'Fixed Price' },
            { value: 'index', label: 'Index Based' },
            { value: 'formula', label: 'Formula' },
          ]}
        />
      </Form.Item>

      <Horizontal gap={16}>
        <Form.Item name='volume' label='Volume' style={{ flex: 1 }}>
          <InputNumber style={{ width: '100%' }} placeholder='0' min={0} />
        </Form.Item>
        <Form.Item name='startDate' label='Start Date' style={{ flex: 1 }}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Horizontal>

      <Horizontal justifyContent='flex-end' gap={12} className='mt-2'>
        <GraviButton buttonText='Cancel' onClick={onCancel} />
        <GraviButton buttonText='Save' theme1 onClick={() => form.submit()} />
      </Horizontal>
    </Form>
  )
}
```

---

## Input Types

### Text Input
```tsx
<Form.Item name='name' label='Name'>
  <Input placeholder='Enter name' />
</Form.Item>
```

### Text Area
```tsx
<Form.Item name='notes' label='Notes'>
  <Input.TextArea rows={4} placeholder='Enter notes...' />
</Form.Item>
```

### Number Input
```tsx
<Form.Item name='price' label='Price'>
  <InputNumber
    style={{ width: '100%' }}
    min={0}
    precision={2}
    prefix='$'
    placeholder='0.00'
  />
</Form.Item>
```

### Select Dropdown
```tsx
<Form.Item name='status' label='Status'>
  <Select
    placeholder='Select status'
    options={[
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'closed', label: 'Closed' },
    ]}
  />
</Form.Item>
```

### Multi-Select
```tsx
<Form.Item name='products' label='Products'>
  <Select
    mode='multiple'
    placeholder='Select products'
    options={productOptions}
  />
</Form.Item>
```

### Date Picker
```tsx
<Form.Item name='effectiveDate' label='Effective Date'>
  <DatePicker style={{ width: '100%' }} />
</Form.Item>
```

### Date Range
```tsx
<Form.Item name='dateRange' label='Date Range'>
  <DatePicker.RangePicker style={{ width: '100%' }} />
</Form.Item>
```

### Switch (Boolean)
```tsx
<Form.Item name='isActive' label='Active' valuePropName='checked'>
  <Switch />
</Form.Item>
```

### Checkbox
```tsx
<Form.Item name='agreeToTerms' valuePropName='checked'>
  <Checkbox>I agree to the terms</Checkbox>
</Form.Item>
```

### Radio Group
```tsx
<Form.Item name='pricingModel' label='Pricing Model'>
  <Radio.Group>
    <Radio value='fixed'>Fixed</Radio>
    <Radio value='floating'>Floating</Radio>
    <Radio value='formula'>Formula</Radio>
  </Radio.Group>
</Form.Item>
```

---

## Validation

### Required Field
```tsx
rules={[{ required: true, message: 'This field is required' }]}
```

### Email
```tsx
rules={[
  { required: true, message: 'Email is required' },
  { type: 'email', message: 'Enter a valid email' },
]}
```

### Min/Max Length
```tsx
rules={[
  { min: 3, message: 'Minimum 3 characters' },
  { max: 100, message: 'Maximum 100 characters' },
]}
```

### Pattern (Regex)
```tsx
rules={[{ pattern: /^[A-Z]{2}-\d{4}$/, message: 'Format: XX-0000' }]}
```

### Custom Validator
```tsx
rules={[{
  validator: (_, value) => {
    if (value && value < 0) return Promise.reject('Must be positive')
    return Promise.resolve()
  },
}]}
```

### Dependent Validation
```tsx
<Form.Item
  name='endDate'
  label='End Date'
  dependencies={['startDate']}
  rules={[{
    validator: (_, value) => {
      const startDate = form.getFieldValue('startDate')
      if (value && startDate && value.isBefore(startDate)) {
        return Promise.reject('End date must be after start date')
      }
      return Promise.resolve()
    },
  }]}
>
  <DatePicker style={{ width: '100%' }} />
</Form.Item>
```

---

## Form in Modal

The standard create/edit pattern. One component handles both modes.

```tsx
import React, { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

export function ContractModal({ open, onClose, editRecord, onSave }) {
  const [form] = Form.useForm()
  const isEditing = !!editRecord

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue(editRecord)
    } else {
      form.resetFields()
    }
  }, [editRecord, form])

  const handleFinish = (values) => {
    onSave({
      ...values,
      id: editRecord?.id ?? crypto.randomUUID(),
    })
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={isEditing ? 'Edit Contract' : 'New Contract'}
      onCancel={onClose}
      destroyOnHidden
      width={600}
      footer={
        <Horizontal justifyContent='flex-end' gap={12}>
          <GraviButton buttonText='Cancel' onClick={onClose} />
          <GraviButton buttonText={isEditing ? 'Update' : 'Create'} theme1 onClick={() => form.submit()} />
        </Horizontal>
      }
    >
      <Form form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item name='name' label='Contract Name' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name='type' label='Type' rules={[{ required: true }]}>
          <Select options={contractTypeOptions} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

### Usage from Parent Page
```tsx
const [modalOpen, setModalOpen] = useState(false)
const [editRecord, setEditRecord] = useState(null)

const handleEdit = (record) => {
  setEditRecord(record)
  setModalOpen(true)
}

const handleCreate = () => {
  setEditRecord(null)
  setModalOpen(true)
}

const handleSave = (record) => {
  setData(prev => {
    const exists = prev.find(r => r.id === record.id)
    if (exists) return prev.map(r => r.id === record.id ? record : r)
    return [...prev, record]
  })
}

<ContractModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  editRecord={editRecord}
  onSave={handleSave}
/>
```

---

## Form in Drawer

Same pattern as modal but with a side panel. Good for detail editing.

```tsx
<Drawer
  open={drawerOpen}
  title='Contract Details'
  onClose={() => setDrawerOpen(false)}
  width={480}
  destroyOnHidden
  extra={
    <Horizontal gap={8}>
      <GraviButton buttonText='Cancel' size='small' onClick={() => setDrawerOpen(false)} />
      <GraviButton buttonText='Save' size='small' theme1 onClick={() => form.submit()} />
    </Horizontal>
  }
>
  <Form form={form} layout='vertical' onFinish={handleFinish}>
    {/* Form items */}
  </Form>
</Drawer>
```

---

## Filter Forms

Inline filter bars above grids.

```tsx
<Form form={filterForm} layout='inline' onValuesChange={handleFilterChange}>
  <Form.Item name='search'>
    <Input placeholder='Search...' prefix={<SearchOutlined />} allowClear />
  </Form.Item>
  <Form.Item name='status'>
    <Select
      placeholder='All Statuses'
      allowClear
      style={{ width: 160 }}
      options={statusOptions}
    />
  </Form.Item>
  <Form.Item name='dateRange'>
    <DatePicker.RangePicker />
  </Form.Item>
</Form>
```

---

## Multi-Step Forms

Using AntD Steps component.

```tsx
import { Steps } from 'antd'

const [currentStep, setCurrentStep] = useState(0)

const steps = [
  { title: 'Basic Info', content: <BasicInfoForm form={form} /> },
  { title: 'Pricing', content: <PricingForm form={form} /> },
  { title: 'Review', content: <ReviewStep form={form} /> },
]

<Vertical gap={24}>
  <Steps current={currentStep} items={steps.map(s => ({ title: s.title }))} />

  <Form form={form} layout='vertical'>
    {steps[currentStep].content}
  </Form>

  <Horizontal justifyContent='flex-end' gap={12}>
    {currentStep > 0 && (
      <GraviButton buttonText='Previous' onClick={() => setCurrentStep(s => s - 1)} />
    )}
    {currentStep < steps.length - 1 ? (
      <GraviButton buttonText='Next' theme1 onClick={() => setCurrentStep(s => s + 1)} />
    ) : (
      <GraviButton buttonText='Submit' theme1 onClick={() => form.submit()} />
    )}
  </Horizontal>
</Vertical>
```

---

## Gotchas

1. **No `htmlType="submit"` on GraviButton.** Use `onClick={() => form.submit()}` instead.

2. **`valuePropName="checked"` for Switch/Checkbox.** Without this, the form won't read the boolean value correctly.

3. **Don't use controlled inputs with Form.** AntD Form manages state internally. Don't combine `value={state}` with `Form.Item name="..."` — let the form handle it.

4. **`form.resetFields()` on close.** Always reset when closing a create/edit modal to prevent stale data.

5. **`form.setFieldsValue()` for edit mode.** Call this in a `useEffect` when the edit record changes.

6. **Form.Item `style={{ flex: 1 }}`** works for controlling width in horizontal layouts. Wrap side-by-side fields in `<Horizontal gap={16}>`.

7. **Type your form.** Always provide a type parameter: `const [form] = Form.useForm<ContractFormValues>()`. Define a `FormValues` interface matching your form field names.

8. **Use `Form.useWatch` for reactive field dependencies.** When one field's visibility or options depend on another field's value, use `Form.useWatch` — not `form.getFieldValue()` in the render body (it doesn't trigger re-renders):
   ```tsx
   const contractType = Form.useWatch('type', form)
   // contractType updates reactively when the user changes the Type field
   {contractType === 'formula' && <FormulaFields />}
   ```

9. **Reset on close AND after submit.** `form.resetFields()` must be called in both `onCancel`/`onClose` and after a successful save in `handleFinish`. The "Form in Modal" example above shows this correctly — but it's the most commonly forgotten step.

10. **Disable submit button during save.** When the save handler is async (even simulated), set both `loading` and `disabled` on the submit button to prevent double-submission:
    ```tsx
    <GraviButton buttonText='Save' theme1 loading={saving} disabled={saving} onClick={() => form.submit()} />
    ```
