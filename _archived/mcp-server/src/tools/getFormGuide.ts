/**
 * Form Guide Tool - Phase 2 Specialized Skill
 * 
 * Provides comprehensive guidance for creating forms with Excalibrr
 * and Ant Design, including validation, submission, and patterns.
 */

export interface GetFormGuideRequest {
  /** Get a specific topic */
  topic?: 'basics' | 'fields' | 'validation' | 'submission' | 'patterns' | 'all';
  /** Return raw JSON instead of formatted markdown */
  raw?: boolean;
  /** Get condensed summary for quick reference */
  summary?: boolean;
}

export interface GetFormGuideResponse {
  content: Array<{ type: string; text: string }>;
}

function getFormSummary(): string {
  return `# Form Quick Reference

## Basic Form Structure
\`\`\`tsx
import { Form, Input, Select } from 'antd';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';

function MyForm() {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Vertical className="p-3">
      <Texto category="h6" weight="600">Form Title</Texto>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item 
          name="name" 
          label={<Texto category="p2" appearance="medium">Name</Texto>}
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        
        <Horizontal gap={12}>
          <GraviButton buttonText="Cancel" onClick={() => form.resetFields()} />
          <GraviButton success buttonText="Save" onClick={() => form.submit()} />
        </Horizontal>
      </Form>
    </Vertical>
  );
}
\`\`\`

## Key Components
- **Form**: Ant Design \`<Form>\` with \`form={form}\` and \`layout="vertical"\`
- **Labels**: Use \`<Texto category="p2" appearance="medium">\`
- **Layout**: Wrap in \`<Vertical>\` with \`className="p-3"\`
- **Buttons**: Use \`<GraviButton success buttonText="Save">\`

## Critical Patterns
✅ \`form.submit()\` in onClick, NOT \`htmlType="submit"\`
✅ \`<GraviButton success>\` NOT \`<GraviButton theme="success">\`
✅ Labels inside Form.Item \`label\` prop
✅ Use \`gap={12}\` for spacing between buttons

## Common Field Types
\`\`\`tsx
// Text Input
<Form.Item name="email" label="Email">
  <Input placeholder="Enter email" />
</Form.Item>

// Number Input
<Form.Item name="quantity" label="Quantity">
  <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>

// Select
<Form.Item name="category" label="Category">
  <Select placeholder="Select category" options={categoryOptions} />
</Form.Item>

// Date Picker
<Form.Item name="date" label="Date">
  <DatePicker style={{ width: '100%' }} />
</Form.Item>

// Switch
<Form.Item name="active" valuePropName="checked">
  <Switch />
</Form.Item>
\`\`\`
`;
}

function getFieldsGuide(): string {
  return `# Form Fields Guide

## Text Fields

### Basic Input
\`\`\`tsx
<Form.Item 
  name="firstName" 
  label={<Texto category="p2" appearance="medium">First Name</Texto>}
  rules={[{ required: true, message: 'First name is required' }]}
>
  <Input placeholder="Enter first name" />
</Form.Item>
\`\`\`

### Email Input
\`\`\`tsx
<Form.Item 
  name="email" 
  label={<Texto category="p2" appearance="medium">Email</Texto>}
  rules={[
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' },
  ]}
>
  <Input placeholder="Enter email" />
</Form.Item>
\`\`\`

### Password Input
\`\`\`tsx
<Form.Item 
  name="password" 
  label={<Texto category="p2" appearance="medium">Password</Texto>}
  rules={[{ required: true, min: 8 }]}
>
  <Input.Password placeholder="Enter password" />
</Form.Item>
\`\`\`

### Text Area
\`\`\`tsx
<Form.Item 
  name="description" 
  label={<Texto category="p2" appearance="medium">Description</Texto>}
>
  <Input.TextArea rows={4} placeholder="Enter description" />
</Form.Item>
\`\`\`

## Number Fields

### Basic Number
\`\`\`tsx
<Form.Item 
  name="quantity" 
  label={<Texto category="p2" appearance="medium">Quantity</Texto>}
>
  <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>
\`\`\`

### Currency
\`\`\`tsx
<Form.Item 
  name="price" 
  label={<Texto category="p2" appearance="medium">Price</Texto>}
>
  <InputNumber
    min={0}
    precision={2}
    prefix="$"
    style={{ width: '100%' }}
  />
</Form.Item>
\`\`\`

## Selection Fields

### Select Dropdown
\`\`\`tsx
<Form.Item 
  name="category" 
  label={<Texto category="p2" appearance="medium">Category</Texto>}
  rules={[{ required: true }]}
>
  <Select 
    placeholder="Select category"
    options={[
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
    ]}
    allowClear
    showSearch
  />
</Form.Item>
\`\`\`

### Multi-Select
\`\`\`tsx
<Form.Item 
  name="tags" 
  label={<Texto category="p2" appearance="medium">Tags</Texto>}
>
  <Select 
    mode="multiple"
    placeholder="Select tags"
    options={tagOptions}
  />
</Form.Item>
\`\`\`

## Date Fields

### Date Picker
\`\`\`tsx
<Form.Item 
  name="startDate" 
  label={<Texto category="p2" appearance="medium">Start Date</Texto>}
>
  <DatePicker style={{ width: '100%' }} />
</Form.Item>
\`\`\`

### Date Range
\`\`\`tsx
<Form.Item 
  name="dateRange" 
  label={<Texto category="p2" appearance="medium">Date Range</Texto>}
>
  <RangePicker style={{ width: '100%' }} />
</Form.Item>
\`\`\`

## Boolean Fields

### Switch
\`\`\`tsx
<Form.Item 
  name="isActive" 
  valuePropName="checked"  // IMPORTANT for boolean
  label={<Texto category="p2" appearance="medium">Active</Texto>}
>
  <Switch />
</Form.Item>
\`\`\`

### Checkbox
\`\`\`tsx
<Form.Item 
  name="acceptTerms" 
  valuePropName="checked"
>
  <Checkbox>I accept the terms and conditions</Checkbox>
</Form.Item>
\`\`\`
`;
}

function getValidationGuide(): string {
  return `# Form Validation Guide

## Built-in Rules

### Required Field
\`\`\`tsx
rules={[{ required: true, message: 'This field is required' }]}
\`\`\`

### Type Validation
\`\`\`tsx
// Email
rules={[{ type: 'email', message: 'Invalid email' }]}

// URL
rules={[{ type: 'url', message: 'Invalid URL' }]}

// Number
rules={[{ type: 'number', message: 'Must be a number' }]}
\`\`\`

### Length Validation
\`\`\`tsx
// Minimum length
rules={[{ min: 3, message: 'Minimum 3 characters' }]}

// Maximum length
rules={[{ max: 50, message: 'Maximum 50 characters' }]}

// Exact length
rules={[{ len: 10, message: 'Must be exactly 10 characters' }]}
\`\`\`

### Pattern Validation
\`\`\`tsx
rules={[{ 
  pattern: /^[A-Z]{3}\\d{4}$/, 
  message: 'Format: ABC1234' 
}]}
\`\`\`

## Multiple Rules
\`\`\`tsx
<Form.Item
  name="email"
  rules={[
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' },
    { max: 100, message: 'Email too long' },
  ]}
>
  <Input />
</Form.Item>
\`\`\`

## Custom Validation
\`\`\`tsx
<Form.Item
  name="confirmPassword"
  dependencies={['password']}
  rules={[
    { required: true, message: 'Please confirm password' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match'));
      },
    }),
  ]}
>
  <Input.Password />
</Form.Item>
\`\`\`

## Async Validation
\`\`\`tsx
<Form.Item
  name="username"
  rules={[
    { required: true },
    {
      validator: async (_, value) => {
        const exists = await checkUsernameExists(value);
        if (exists) {
          return Promise.reject('Username already taken');
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <Input />
</Form.Item>
\`\`\`

## Form-Level Validation
\`\`\`tsx
const [form] = Form.useForm();

const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    // All valid, proceed with submission
    await saveData(values);
  } catch (errorInfo) {
    // Validation failed
    console.log('Validation failed:', errorInfo);
  }
};
\`\`\`
`;
}

function getSubmissionGuide(): string {
  return `# Form Submission Guide

## Basic Submission Pattern
\`\`\`tsx
import { Form, message } from 'antd';
import { GraviButton } from '@gravitate-js/excalibrr';

function MyForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await saveData(values);
      message.success('Saved successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      {/* fields */}
      <Horizontal gap={12}>
        <GraviButton 
          buttonText="Cancel" 
          onClick={() => form.resetFields()} 
        />
        <GraviButton 
          success 
          buttonText="Save"
          loading={loading}
          onClick={() => form.submit()} 
        />
      </Horizontal>
    </Form>
  );
}
\`\`\`

## With React Query Mutation
\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function ProductForm({ onClose }) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => api.post('products/create', values),
    onSuccess: () => {
      message.success('Product created');
      queryClient.invalidateQueries(['products']);
      form.resetFields();
      onClose?.();
    },
    onError: (error) => {
      message.error(\`Failed: \${error.message}\`);
    },
  });

  return (
    <Form form={form} onFinish={mutation.mutate}>
      {/* fields */}
      <Horizontal gap={12}>
        <GraviButton buttonText="Cancel" onClick={onClose} />
        <GraviButton 
          success 
          buttonText="Save"
          loading={mutation.isPending}
          onClick={() => form.submit()} 
        />
      </Horizontal>
    </Form>
  );
}
\`\`\`

## Edit Mode (Pre-populated Form)
\`\`\`tsx
function EditForm({ item, onClose }) {
  const [form] = Form.useForm();

  // Pre-populate form
  useEffect(() => {
    if (item) {
      form.setFieldsValue(item);
    }
  }, [item, form]);

  const mutation = useMutation({
    mutationFn: (values) => api.put(\`items/\${item.id}\`, values),
    // ...
  });

  return (
    <Form form={form} onFinish={mutation.mutate}>
      {/* fields */}
    </Form>
  );
}
\`\`\`

## Button Patterns

### Submit Button (CORRECT)
\`\`\`tsx
// ✅ CORRECT - use onClick with form.submit()
<GraviButton 
  success 
  buttonText="Save" 
  onClick={() => form.submit()} 
/>

// ❌ WRONG - htmlType doesn't work with GraviButton
<GraviButton 
  success 
  buttonText="Save" 
  htmlType="submit"  // This won't work!
/>
\`\`\`

### Cancel Button
\`\`\`tsx
<GraviButton 
  buttonText="Cancel" 
  onClick={() => {
    form.resetFields();
    onClose?.();
  }} 
/>
\`\`\`

### Reset Button
\`\`\`tsx
<GraviButton 
  buttonText="Reset" 
  onClick={() => form.resetFields()} 
/>
\`\`\`
`;
}

function getPatternsGuide(): string {
  return `# Form Patterns

## 1. Simple Data Entry Form
\`\`\`tsx
import { Form, Input, Select, message } from 'antd';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';

function ProductForm({ onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.createProduct(values);
      message.success('Product created');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Vertical className="p-3">
      <Texto category="h6" weight="600" className="mb-2">
        Add New Product
      </Texto>
      
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label={<Texto category="p2" appearance="medium">Product Name</Texto>}
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="price"
          label={<Texto category="p2" appearance="medium">Price</Texto>}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="category"
          label={<Texto category="p2" appearance="medium">Category</Texto>}
        >
          <Select placeholder="Select category" options={categoryOptions} />
        </Form.Item>

        <Horizontal justifyContent="flex-end" gap={12} className="mt-2">
          <GraviButton buttonText="Cancel" onClick={() => form.resetFields()} />
          <GraviButton 
            success 
            buttonText="Create Product" 
            loading={loading}
            onClick={() => form.submit()} 
          />
        </Horizontal>
      </Form>
    </Vertical>
  );
}
\`\`\`

## 2. Modal Form
\`\`\`tsx
function EditProductModal({ open, product, onClose }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (values) => api.updateProduct(product.id, values),
    onSuccess: () => {
      message.success('Product updated');
      handleClose();
    },
  });

  return (
    <Modal
      open={open}  // antd v5: use "open" not "visible"
      title="Edit Product"
      onCancel={handleClose}
      footer={
        <Horizontal justifyContent="flex-end" gap={12}>
          <GraviButton buttonText="Cancel" onClick={handleClose} />
          <GraviButton 
            success 
            buttonText="Save Changes"
            loading={mutation.isPending}
            onClick={() => form.submit()} 
          />
        </Horizontal>
      }
    >
      <Form form={form} layout="vertical" onFinish={mutation.mutate}>
        {/* form fields */}
      </Form>
    </Modal>
  );
}
\`\`\`

## 3. Filter Form
\`\`\`tsx
function FilterForm({ onFilter }) {
  const [form] = Form.useForm();

  const handleFilter = (values) => {
    // Remove empty values
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null && v !== '')
    );
    onFilter(cleanedValues);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Form form={form} layout="inline" onFinish={handleFilter}>
      <Form.Item name="search">
        <Input placeholder="Search..." />
      </Form.Item>
      
      <Form.Item name="category">
        <Select placeholder="Category" options={categoryOptions} allowClear />
      </Form.Item>
      
      <Form.Item name="dateRange">
        <RangePicker />
      </Form.Item>
      
      <Horizontal gap={8}>
        <GraviButton buttonText="Reset" onClick={handleReset} />
        <GraviButton theme1 buttonText="Apply" onClick={() => form.submit()} />
      </Horizontal>
    </Form>
  );
}
\`\`\`

## 4. Multi-Step Form
\`\`\`tsx
function MultiStepForm() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Basic Info', fields: ['name', 'email'] },
    { title: 'Details', fields: ['address', 'phone'] },
    { title: 'Review', fields: [] },
  ];

  const next = async () => {
    try {
      await form.validateFields(steps[step].fields);
      setStep(step + 1);
    } catch (error) {
      // Validation failed
    }
  };

  const prev = () => setStep(step - 1);

  return (
    <Vertical className="p-3">
      <Steps current={step} items={steps} className="mb-3" />
      
      <Form form={form} layout="vertical">
        {step === 0 && (
          <>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Email" />
            </Form.Item>
          </>
        )}
        
        {step === 1 && (
          <>
            <Form.Item name="address">
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </>
        )}
        
        {step === 2 && (
          <ReviewStep values={form.getFieldsValue()} />
        )}
      </Form>
      
      <Horizontal justifyContent="flex-end" gap={12} className="mt-2">
        {step > 0 && <GraviButton buttonText="Previous" onClick={prev} />}
        {step < steps.length - 1 && (
          <GraviButton theme1 buttonText="Next" onClick={next} />
        )}
        {step === steps.length - 1 && (
          <GraviButton success buttonText="Submit" onClick={() => form.submit()} />
        )}
      </Horizontal>
    </Vertical>
  );
}
\`\`\`

## File Organization
\`\`\`
MyFeature/
├── components/
│   └── Form/
│       ├── index.tsx         # Main form component
│       ├── FormFields.tsx    # Reusable field components
│       └── validation.ts     # Custom validation rules
├── page.tsx
└── types.ts
\`\`\`
`;
}

export async function getFormGuideTool(args: GetFormGuideRequest): Promise<GetFormGuideResponse> {
  const { topic = 'all', raw = false, summary = false } = args;
  
  try {
    if (summary) {
      return {
        content: [{ type: 'text', text: getFormSummary() }]
      };
    }
    
    let output = '';
    
    switch (topic) {
      case 'basics':
        output = getFormSummary();
        break;
      case 'fields':
        output = getFieldsGuide();
        break;
      case 'validation':
        output = getValidationGuide();
        break;
      case 'submission':
        output = getSubmissionGuide();
        break;
      case 'patterns':
        output = getPatternsGuide();
        break;
      case 'all':
      default:
        output = [
          getFormSummary(),
          getFieldsGuide(),
          getValidationGuide(),
          getSubmissionGuide(),
          getPatternsGuide(),
        ].join('\n\n---\n\n');
    }
    
    if (raw) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ topic, content: output }, null, 2) }]
      };
    }
    
    return {
      content: [{ type: 'text', text: output }]
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error getting form guide: ${errorMessage}` }]
    };
  }
}
