import { useState } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Form, Input, Switch } from 'antd';
import { useTheme } from '@hooks/useTheme';

export function CustomerForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  useTheme('BP');

  const handleSubmit = async (values: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', values);
    setLoading(false);
  };

  return (
    <Vertical className="p-2" style={{ height: '100%', maxWidth: '600px' }}>
      <Horizontal justifyContent="space-between" alignItems="center" className="mb-3">
        <Texto category="h4" style={{ color: 'var(--theme-color-2)' }}>
          Customer Form
        </Texto>
      </Horizontal>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ flex: 1 }}
      >
        <Form.Item
          label="Customer Name"
          name="name"
          rules={[{ required: true, message: 'Please enter customer name' }]}
        >
          <Input placeholder="Enter customer name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter valid email' }
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Horizontal gap={12} justifyContent="flex-end">
            <GraviButton
              buttonText="Cancel"
              onClick={() => form.resetFields()}
            />
            <GraviButton
              buttonText="Save Customer"
              success
              onClick={() => form.submit()}
              loading={loading}
            />
          </Horizontal>
        </Form.Item>
      </Form>
    </Vertical>
  );
}