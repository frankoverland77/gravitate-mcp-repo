/**
 * Form Component Examples Database
 *
 * This file contains production-tested examples of the Form component
 * extracted from the Gravitate frontend codebase. These examples range from
 * simple to complex implementations, covering various use cases and patterns.
 *
 * Used by the MCP server to generate high-quality Form implementations.
 */

export interface FormExample {
  id?: string;
  name: string;
  description: string;
  complexity: "simple" | "medium" | "complex";
  category?: string;
  tags: string[];
  code: string;
  props?: Record<string, any>;
  dependencies?: string[];
  notes?: string;
  sourceFile?: string;
}

export const FormExamples: FormExample[] = [
  {
    id: "form_simple_01",
    name: "Basic Contact Form",
    description:
      "Simple form with validation, loading states, and notification feedback",
    complexity: "simple",
    category: "form-input",
    tags: ["basic", "validation", "notifications", "loading"],
    code: `import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { Vertical, Horizontal, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

export function BasicForm() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      NotificationMessage('Success', 'Form submitted successfully!', false)
      form.resetFields()
    } catch (error) {
      NotificationMessage('Error', 'Failed to submit form', true)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    NotificationMessage('Error', 'Please check the form fields', true)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Vertical style={{ gap: '1rem', maxWidth: '400px' }}>
        <Texto type="h3">Basic Form Example</Texto>
        
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please input your name!' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Submit
          </Button>
        </Form.Item>
      </Vertical>
    </Form>
  )
}`,
    props: {
      layout: '"vertical" for better mobile responsiveness',
      onFinish: "async form submission handler",
      onFinishFailed: "validation error handler",
      autoComplete: '"off" to disable browser autocomplete',
    },
    dependencies: ["react", "antd", "@gravitate-js/excalibrr"],
    sourceFile: "/src/components/forms/BasicContactForm.tsx",
    notes:
      "Perfect starting point for simple forms. Includes proper error handling, loading states, and form reset functionality.",
  },
  {
    id: "form_medium_01",
    name: "User Creation Form",
    description:
      "Complex user creation form with dynamic fields, multi-select, and conditional validation",
    complexity: "medium",
    category: "form-input",
    tags: [
      "user-management",
      "dynamic-fields",
      "multi-select",
      "conditional",
      "complex-validation",
    ],
    code: `import React, { useState, useMemo } from 'react'
import { Form, Input, Select, Button, Checkbox, Switch } from 'antd'
import { Vertical, Horizontal, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

// Use options prop instead of Select.Option children in antd v5

export function UserCreationForm({ metadata, onUserCreated }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)

  const roleOptions = useMemo(() => [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'Standard User' },
    { value: 'viewer', label: 'Viewer Only' }
  ], [])

  const departmentOptions = useMemo(() => [
    { value: 'trading', label: 'Trading' },
    { value: 'operations', label: 'Operations' },
    { value: 'finance', label: 'Finance' },
    { value: 'admin', label: 'Administration' }
  ], [])

  const createUser = async (formValues) => {
    setLoading(true)
    try {
      // Transform form data for API
      const payload = {
        ...formValues,
        roles: formValues.roles?.map(roleId => ({ id: roleId, name: roleOptions.find(r => r.value === roleId)?.label })),
        isActive: formValues.isActive ?? true
      }

      // Simulate API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ success: true, userId: Date.now() }), 1500)
      )

      if (response.success) {
        NotificationMessage(
          'User Created', 
          \`User \${formValues.firstName} \${formValues.lastName} has been created successfully\`, 
          false
        )
        form.resetFields()
        setShowAdditionalFields(false)
        onUserCreated?.(response)
      }
    } catch (error) {
      NotificationMessage('Error', 'Failed to create user. Please try again.', true)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    const firstError = errorInfo.errorFields[0]
    if (firstError) {
      NotificationMessage('Validation Error', firstError.errors[0], true)
    }
  }

  const onValuesChange = (changedValues) => {
    if ('roles' in changedValues) {
      const hasAdminRole = changedValues.roles?.includes('admin')
      setShowAdditionalFields(hasAdminRole)
      
      if (!hasAdminRole) {
        form.setFieldsValue({ permissions: [] })
      }
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={createUser}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      initialValues={{ isActive: true }}
    >
      <Vertical style={{ gap: '1rem', maxWidth: '500px' }}>
        <Texto type="h3">Create New User</Texto>
        
        {/* Basic Information */}
        <Horizontal style={{ gap: '1rem' }}>
          <Form.Item
            label="First Name"
            name="firstName"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          
          <Form.Item
            label="Last Name"
            name="lastName"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Last name is required' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </Horizontal>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input placeholder="user@company.com" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: 'Please select a department' }]}
        >
          <Select placeholder="Select department" options={departmentOptions} />
        </Form.Item>

        <Form.Item
          label="User Roles"
          name="roles"
          rules={[{ required: true, message: 'Please select at least one role' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select user roles"
            options={roleOptions}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Conditional Admin Fields */}
        {showAdditionalFields && (
          <>
            <Texto type="h4" style={{ marginTop: '1rem' }}>Administrator Settings</Texto>
            
            <Form.Item
              label="Admin Permissions"
              name="permissions"
            >
              <Checkbox.Group>
                <Vertical>
                  <Checkbox value="manage_users">Manage Users</Checkbox>
                  <Checkbox value="manage_system">System Configuration</Checkbox>
                  <Checkbox value="view_reports">View All Reports</Checkbox>
                  <Checkbox value="manage_data">Data Management</Checkbox>
                </Vertical>
              </Checkbox.Group>
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Account Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Horizontal style={{ gap: '1rem', marginTop: '2rem' }}>
          <Button 
            onClick={() => form.resetFields()} 
            style={{ flex: 1 }}
          >
            Reset
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ flex: 2 }}
          >
            Create User
          </Button>
        </Horizontal>
      </Vertical>
    </Form>
  )
}`,
    props: {
      layout: '"vertical" layout',
      onFinish: "async user creation handler",
      onValuesChange: "dynamic field visibility logic",
      initialValues: "default form values",
    },
    dependencies: ["react", "antd", "@gravitate-js/excalibrr"],
    sourceFile: "/src/modules/Admin/ManageUsers/components/CreateUserForm.tsx",
    notes:
      "Excellent for user management systems. Shows conditional field rendering, multi-select roles, and complex form state management.",
  },
  {
    id: "form_simple_02",
    name: "Login Form",
    description:
      "Professional login form with branding, error handling, and responsive design",
    complexity: "simple",
    category: "basic-usage",
    tags: ["login", "authentication", "branding", "responsive"],
    code: `import React, { useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Vertical, Horizontal, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

interface LoginValues {
  username: string
  password: string
  remember?: boolean
}

interface LoginFormProps {
  onLogin: (values: LoginValues) => void
  setShowResetDialog?: (show: boolean) => void
  loginLayout?: number
  loginLogoImage?: string
  errorMessage?: string
  poweredByLogo?: string
}

export function LoginForm({ 
  onLogin, 
  setShowResetDialog, 
  errorMessage,
  loginLogoImage,
  poweredByLogo 
}: LoginFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true)
    
    try {
      await onLogin(values)
      NotificationMessage('Success', 'Login successful!', false)
    } catch (error) {
      NotificationMessage('Error', errorMessage || 'Login failed', true)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = () => {
    NotificationMessage('Error', 'Please check your credentials', true)
  }

  return (
    <Vertical style={{ 
      minHeight: '100vh', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Vertical style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        minWidth: '400px',
        maxWidth: '450px'
      }}>
        {/* Logo Section */}
        {loginLogoImage && (
          <Horizontal style={{ justifyContent: 'center', marginBottom: '2rem' }}>
            <img 
              src={loginLogoImage} 
              alt="Company Logo" 
              style={{ maxHeight: '60px', maxWidth: '200px' }}
            />
          </Horizontal>
        )}

        <Texto type="h2" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome Back
        </Texto>

        {errorMessage && (
          <Vertical style={{ 
            padding: '1rem', 
            background: '#fee', 
            border: '1px solid #fcc',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <Texto color="red" size="small">{errorMessage}</Texto>
          </Vertical>
        )}

        <Form
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Vertical style={{ gap: '1.5rem' }}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 3, message: 'Username must be at least 3 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            <Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              {setShowResetDialog && (
                <Button 
                  type="link" 
                  onClick={() => setShowResetDialog(true)}
                  style={{ padding: 0 }}
                >
                  Forgot password?
                </Button>
              )}
            </Horizontal>

            <Form.Item style={{ margin: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={loading}
                style={{ width: '100%', height: '45px' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Vertical>
        </Form>

        {/* Powered By Logo */}
        {poweredByLogo && (
          <Horizontal style={{ justifyContent: 'center', marginTop: '2rem' }}>
            <img 
              src={poweredByLogo} 
              alt="Powered By" 
              style={{ maxHeight: '30px', opacity: 0.7 }}
            />
          </Horizontal>
        )}
      </Vertical>
    </Vertical>
  )
}`,
    props: {
      autoComplete: '"off" for security',
      size: '"large" for better mobile UX',
      prefix: "icon components for visual clarity",
      valuePropName: '"checked" for checkbox fields',
    },
    dependencies: [
      "react",
      "antd",
      "@ant-design/icons",
      "@gravitate-js/excalibrr",
    ],
    sourceFile: "/src/components/auth/LoginForm/LoginForm.tsx",
    notes:
      "Professional login form with full branding support, error messaging, and responsive design. Includes security best practices.",
  },
  {
    id: "form_complex_01",
    name: "Dynamic Filter Form",
    description:
      "Advanced dynamic form with repeatable fields, custom components, and real-time filtering",
    complexity: "complex",
    category: "advanced-config",
    tags: [
      "dynamic",
      "form-list",
      "repeatable-fields",
      "custom-components",
      "real-time",
    ],
    code: `import React, { useState, useEffect } from 'react'
import { Form, Select, Input, DatePicker, InputNumber, Button } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Vertical, Horizontal, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

// Use options prop instead of Select.Option children in antd v5
const { RangePicker } = DatePicker

export function DynamicFilterForm({ onFiltersChange, availableFields }) {
  const [form] = Form.useForm()
  const [filters, setFilters] = useState([])

  const filterTypes = [
    { value: 'equals', label: 'Equals', component: Input },
    { value: 'contains', label: 'Contains', component: Input },
    { value: 'greater_than', label: 'Greater Than', component: InputNumber },
    { value: 'less_than', label: 'Less Than', component: InputNumber },
    { value: 'between', label: 'Between', component: RangePicker },
    { value: 'in_list', label: 'In List', component: Select }
  ]

  const fieldOptions = availableFields || [
    { value: 'name', label: 'Name', type: 'text' },
    { value: 'email', label: 'Email', type: 'text' },
    { value: 'age', label: 'Age', type: 'number' },
    { value: 'created_date', label: 'Created Date', type: 'date' },
    { value: 'status', label: 'Status', type: 'select' }
  ]

  const getFilterComponent = (filterType, fieldType) => {
    switch (filterType) {
      case 'equals':
      case 'contains':
        return fieldType === 'select' ? Select : Input
      case 'greater_than':
      case 'less_than':
        return fieldType === 'date' ? DatePicker : InputNumber
      case 'between':
        return fieldType === 'date' ? RangePicker : Input
      case 'in_list':
        return Select
      default:
        return Input
    }
  }

  const onValuesChange = (_, allValues) => {
    const validFilters = allValues.filters?.filter(filter => 
      filter?.field && filter?.operator && (filter?.value !== undefined && filter?.value !== '')
    ) || []
    
    setFilters(validFilters)
    onFiltersChange?.(validFilters)
  }

  const addFilter = () => {
    const currentFilters = form.getFieldValue('filters') || []
    form.setFieldsValue({
      filters: [...currentFilters, { field: undefined, operator: undefined, value: undefined }]
    })
  }

  return (
    <Form
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{ filters: [{}] }}
    >
      <Vertical style={{ gap: '1rem' }}>
        <Horizontal style={{ alignItems: 'center', gap: '1rem' }}>
          <Texto type="h4">Dynamic Filters</Texto>
          <Button 
            type="dashed" 
            onClick={addFilter}
            icon={<PlusOutlined />}
          >
            Add Filter
          </Button>
        </Horizontal>

        <Form.List name="filters">
          {(fields, { add, remove }) => (
            <Vertical style={{ gap: '0.5rem' }}>
              {fields.map(({ key, name, ...restField }) => (
                <Horizontal key={key} style={{ gap: '0.5rem', alignItems: 'flex-start' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'field']}
                    style={{ flex: 1 }}
                  >
                    <Select placeholder="Select field" options={fieldOptions} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'operator']}
                    style={{ flex: 1 }}
                  >
                    <Select
                      placeholder="Select operator"
                      options={filterTypes.map(type => ({ value: type.value, label: type.label }))}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    style={{ flex: 2 }}
                  >
                    <DynamicFilterInput 
                      filterType={form.getFieldValue(['filters', name, 'operator'])}
                      fieldType={fieldOptions.find(f => 
                        f.value === form.getFieldValue(['filters', name, 'field'])
                      )?.type}
                    />
                  </Form.Item>

                  {fields.length > 1 && (
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      danger
                    />
                  )}
                </Horizontal>
              ))}
            </Vertical>
          )}
        </Form.List>

        {filters.length > 0 && (
          <Vertical style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <Texto type="subtitle">Active Filters:</Texto>
            {filters.map((filter, index) => (
              <Texto key={index} size="small">
                {fieldOptions.find(f => f.value === filter.field)?.label} {filter.operator} {String(filter.value)}
              </Texto>
            ))}
          </Vertical>
        )}
      </Vertical>
    </Form>
  )
}

// Helper component for dynamic filter inputs
function DynamicFilterInput({ filterType, fieldType, ...props }) {
  switch (filterType) {
    case 'equals':
    case 'contains':
      return fieldType === 'select' ? 
        <Select placeholder="Select value" {...props} /> : 
        <Input placeholder="Enter value" {...props} />
    
    case 'greater_than':
    case 'less_than':
      return fieldType === 'date' ? 
        <DatePicker style={{ width: '100%' }} {...props} /> : 
        <InputNumber style={{ width: '100%' }} placeholder="Enter number" {...props} />
    
    case 'between':
      return fieldType === 'date' ? 
        <RangePicker style={{ width: '100%' }} {...props} /> : 
        <Input placeholder="Enter range (e.g., 1-10)" {...props} />
    
    case 'in_list':
      return (
        <Select 
          mode="multiple" 
          placeholder="Select multiple values" 
          style={{ width: '100%' }}
          {...props} 
        />
      )
    
    default:
      return <Input placeholder="Enter value" {...props} />
  }
}`,
    props: {
      onValuesChange: "real-time form value monitoring",
      initialValues: "default filter configuration",
      "Form.List": "dynamic field management",
    },
    dependencies: [
      "react",
      "antd",
      "@ant-design/icons",
      "@gravitate-js/excalibrr",
    ],
    sourceFile:
      "/src/components/shared/DynamicFilterForm/DynamicFilterForm.tsx",
    notes:
      "Perfect for advanced filtering interfaces. Uses Form.List for dynamic field management and custom components for different filter types.",
  },
  {
    id: "form_complex_02",
    name: "Advanced Form with File Upload",
    description:
      "Complex form with file upload, progress tracking, custom validation, and advanced UX features",
    complexity: "complex",
    category: "data-management",
    tags: [
      "file-upload",
      "progress-tracking",
      "advanced-validation",
      "custom-ux",
    ],
    code: `import React, { useState, useRef } from 'react'
import { Form, Input, Upload, Button, Progress, Select } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Vertical, Horizontal, Texto, NotificationMessage } from '@gravitate-js/excalibrr'

const { TextArea } = Input
// Use options prop instead of Select.Option children in antd v5

export function AdvancedForm() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileList, setFileList] = useState([])
  const hiddenFileInput = useRef(null)

  const handleUploadClick = () => {
    hiddenFileInput.current?.click()
  }

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setLoading(true)
    
    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const newFiles = files.map(file => ({
        uid: Date.now() + Math.random(),
        name: file.name,
        status: 'done',
        size: file.size,
        type: file.type
      }))

      setFileList(prev => [...prev, ...newFiles])
      NotificationMessage('Success', \`\${files.length} file(s) uploaded successfully\`, false)
      
    } catch (error) {
      NotificationMessage('Error', 'Failed to upload files', true)
    } finally {
      setLoading(false)
      setUploadProgress(0)
      event.target.value = ''
    }
  }

  const removeFile = (fileToRemove) => {
    setFileList(prev => prev.filter(file => file.uid !== fileToRemove.uid))
  }

  const onFinish = async (values) => {
    setLoading(true)
    
    try {
      // Include file information in form submission
      const formData = {
        ...values,
        attachments: fileList.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      }

      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      NotificationMessage('Success', 'Form submitted successfully with attachments!', false)
      form.resetFields()
      setFileList([])
      
    } catch (error) {
      NotificationMessage('Error', 'Failed to submit form', true)
    } finally {
      setLoading(false)
    }
  }

  const validateFields = async () => {
    try {
      await form.validateFields()
      form.submit()
    } catch (errorInfo) {
      // Scroll to first error field
      const firstErrorField = form.getFieldsError().find(field => field.errors.length > 0)
      if (firstErrorField) {
        const fieldName = firstErrorField.name?.[0]
        const input = document.querySelector(\`[name="\${fieldName}"], [id="\${fieldName}"]\`) as HTMLElement
        if (input) {
          input.focus()
          input.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Vertical style={{ gap: '1.5rem', maxWidth: '600px' }}>
        <Texto type="h3">Advanced Form with File Upload</Texto>
        
        <Form.Item
          label="Project Title"
          name="title"
          rules={[
            { required: true, message: 'Project title is required' },
            { min: 5, message: 'Title must be at least 5 characters' },
            { max: 100, message: 'Title cannot exceed 100 characters' }
          ]}
        >
          <Input placeholder="Enter project title" showCount maxLength={100} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select project category"
            options={[
              { value: 'development', label: 'Development' },
              { value: 'design', label: 'Design' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'research', label: 'Research' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: 'Description is required' },
            { min: 20, message: 'Description must be at least 20 characters' }
          ]}
        >
          <TextArea 
            rows={4} 
            placeholder="Describe your project in detail..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Budget Range"
          name="budget"
          rules={[{ required: true, message: 'Please select a budget range' }]}
        >
          <Select
            placeholder="Select budget range"
            options={[
              { value: '0-1000', label: '$0 - $1,000' },
              { value: '1000-5000', label: '$1,000 - $5,000' },
              { value: '5000-10000', label: '$5,000 - $10,000' },
              { value: '10000+', label: '$10,000+' },
            ]}
          />
        </Form.Item>

        {/* File Upload Section */}
        <Vertical style={{ gap: '1rem' }}>
          <Texto type="subtitle">Project Attachments</Texto>
          
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            style={{ display: 'none' }}
          />
          
          <Button 
            icon={<UploadOutlined />}
            onClick={handleUploadClick}
            loading={loading}
            disabled={loading}
          >
            Upload Files
          </Button>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Progress percent={uploadProgress} status="active" />
          )}

          {fileList.length > 0 && (
            <Vertical style={{ gap: '0.5rem' }}>
              {fileList.map(file => (
                <Horizontal key={file.uid} style={{ 
                  padding: '0.5rem', 
                  background: '#f5f5f5', 
                  borderRadius: '4px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Vertical style={{ gap: '0.25rem' }}>
                    <Texto size="small" weight="bold">{file.name}</Texto>
                    <Texto size="tiny" color="gray">
                      {(file.size / 1024).toFixed(1)} KB
                    </Texto>
                  </Vertical>
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />}
                    onClick={() => removeFile(file)}
                    danger
                    size="small"
                  />
                </Horizontal>
              ))}
            </Vertical>
          )}
        </Vertical>

        <Horizontal style={{ gap: '1rem', marginTop: '2rem' }}>
          <Button 
            onClick={() => { form.resetFields(); setFileList([]) }}
            style={{ flex: 1 }}
          >
            Reset Form
          </Button>
          <Button 
            type="primary"
            onClick={validateFields}
            loading={loading}
            style={{ flex: 2 }}
          >
            Submit Project
          </Button>
        </Horizontal>
      </Vertical>
    </Form>
  )
}`,
    props: {
      scrollToFirstError: "automatically scroll to validation errors",
      showCount: "character count display",
      maxLength: "input length limits",
    },
    dependencies: [
      "react",
      "antd",
      "@ant-design/icons",
      "@gravitate-js/excalibrr",
    ],
    sourceFile: "/src/modules/Projects/components/CreateProjectForm.tsx",
    notes:
      "Comprehensive example showing file upload integration, progress tracking, and advanced form validation with custom error handling.",
  },
];

export default FormExamples;
