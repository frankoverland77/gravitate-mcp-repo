/**
 * NotificationMessage Component Examples Database
 *
 * ⚠️ DEPRECATED: This component is marked as deprecated in the excalibrr source.
 * Do not use NotificationMessage in new code. Use Ant Design's notification API directly:
 * 
 * import { notification } from 'antd';
 * notification.success({ message: 'Title', description: 'Details' });
 * notification.error({ message: 'Error', description: 'What went wrong' });
 * 
 * This file is kept for reference only.
 */

export interface NotificationMessageExample {
  id: string
  name: string
  description: string
  complexity: 'simple' | 'medium' | 'complex'
  category?: string
  tags: string[]
  code: string
  props: Record<string, any>
  dependencies?: string[]
  notes?: string
  sourceFile?: string
}

export const NotificationMessageExamples: NotificationMessageExample[] = [
  {
    id: 'notification_simple_01',
    name: 'Basic Success Notification',
    description: 'Simple success notification for form submission',
    complexity: 'simple',
    category: 'feedback',
    tags: ['success', 'form', 'basic'],
    code: `NotificationMessage('Success', 'Form submitted successfully!', false)`,
    props: {
      title: '"Success"',
      message: '"Form submitted successfully!"',
      isError: 'false (success state)'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Standard success notification pattern for completed actions'
  },

  {
    id: 'notification_simple_02',
    name: 'Basic Error Notification',
    description: 'Simple error notification for failed operations',
    complexity: 'simple',
    category: 'feedback',
    tags: ['error', 'failure', 'basic'],
    code: `NotificationMessage('Error', 'Failed to submit form', true)`,
    props: {
      title: '"Error"',
      message: '"Failed to submit form"',
      isError: 'true (error state)'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Standard error notification for failed operations'
  },

  {
    id: 'notification_simple_03',
    name: 'Validation Error Notification',
    description: 'Error notification for form validation failures',
    complexity: 'simple',
    category: 'validation',
    tags: ['validation', 'error', 'form'],
    code: `NotificationMessage('Error', 'Please check the form fields', true)`,
    props: {
      title: '"Error"',
      message: '"Please check the form fields"',
      isError: 'true'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Used for general form validation errors'
  },

  {
    id: 'notification_medium_01',
    name: 'Dynamic Success with Count',
    description: 'Success notification with dynamic message including record count',
    complexity: 'medium',
    category: 'data-operations',
    tags: ['success', 'dynamic', 'count', 'bulk-operations'],
    code: `NotificationMessage(
  'Success',
  \`User \${response.data.name} created successfully with ID: \${response.data.id}\`,
  false
)`,
    props: {
      title: '"Success"',
      message: 'Template string with dynamic data',
      isError: 'false'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Dynamic messaging for operations with specific results'
  },

  {
    id: 'notification_medium_02',
    name: 'File Upload Success',
    description: 'Success notification for file upload operations with count',
    complexity: 'medium',
    category: 'file-operations',
    tags: ['file-upload', 'success', 'count', 'plural'],
    code: `NotificationMessage('Success', \`\${files.length} file(s) uploaded successfully\`, false)`,
    props: {
      title: '"Success"',
      message: 'Dynamic count with plural handling',
      isError: 'false'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Handles singular/plural messaging for file operations'
  },

  {
    id: 'notification_medium_03',
    name: 'API Error with Fallback',
    description: 'Error notification with API error message and fallback',
    complexity: 'medium',
    category: 'api-integration',
    tags: ['api', 'error', 'fallback', 'conditional'],
    code: `NotificationMessage('Error', errorMessage || 'Login failed', true)`,
    props: {
      title: '"Error"',
      message: 'Conditional message with fallback',
      isError: 'true'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Graceful error handling with fallback messages'
  },

  {
    id: 'notification_complex_01',
    name: 'Validation Array Processing',
    description: 'Complex validation error processing with multiple messages',
    complexity: 'complex',
    category: 'validation',
    tags: ['validation', 'array', 'multiple-errors', 'processing'],
    code: `if (response?.Validations?.length > 0) {
  response.Validations.forEach((validation) => {
    NotificationMessage('Error Saving', validation.Message, true)
  })
} else {
  NotificationMessage(title ?? 'Save Successful', \`\${numberOfRecords} record(s) saved successfully\`, false)
}`,
    props: {
      title: 'Dynamic based on validation state',
      message: 'Array processing or success count',
      isError: 'Conditional based on validation results'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/components/shared/Grid/Messages/UpdateNotificationMessage.tsx',
    notes: 'Handles complex validation scenarios with multiple potential errors'
  },

  {
    id: 'notification_complex_02',
    name: 'Validation Error with First Error Display',
    description: 'Complex error handling showing first validation error from array',
    complexity: 'complex',
    category: 'validation',
    tags: ['validation', 'error-array', 'first-error', 'complex'],
    code: `if (createUserValidationResponse?.errors?.length > 0) {
  const firstError = createUserValidationResponse.errors[0]
  NotificationMessage('Validation Error', firstError.errors[0], true)
} else {
  NotificationMessage('Error', 'Failed to create user. Please try again.', true)
}`,
    props: {
      title: 'Conditional - "Validation Error" or "Error"',
      message: 'First error from nested array or fallback message',
      isError: 'true'
    },
    dependencies: ['@gravitate-js/excalibrr'],
    sourceFile: 'src/knowledge/components/Form/index.ts',
    notes: 'Advanced error handling for nested validation structures'
  }
]

export default NotificationMessageExamples