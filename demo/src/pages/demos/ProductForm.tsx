import React, { useState } from 'react';
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr';
import { Form, Input, Select, Switch } from 'antd';

export function ProductForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', values);
    setLoading(false);
  };

  return (
    <Vertical style={{ height: '100%', padding: '16px', maxWidth: '600px' }}>
      <Horizontal justifyContent="space-between" alignItems="center" style={{ marginBottom: '24px' }}>
        <Texto category="h4" style={{ color: 'var(--theme-color-2)' }}>
          Product Form
        </Texto>
      </Horizontal>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ flex: 1 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="isActive"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item>
          <Horizontal justifyContent="flex-end" style={{ gap: '12px' }}>
            <GraviButton 
              buttonText="Cancel"
              onClick={() => form.resetFields()}
            />
            <GraviButton
              buttonText="Save"
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