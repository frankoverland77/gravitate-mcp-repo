import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Form, Input, Select, DatePicker, Switch, Checkbox } from 'antd';
import React from 'react';

const { Option } = Select;

export function CustomerForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form submitted:', values);
    // Mock save action - replace with actual API call
  };

  return (
    <Vertical style={{ padding: "24px", maxWidth: "600px" }}>
      <Texto category="h4" style={{ marginBottom: "24px" }}>
        Customer Management
      </Texto>
      
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Form.Item 
          name="firstName" 
          label="First Name"
          rules={[{ required: true, message: 'First Name is required' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item 
          name="lastName" 
          label="Last Name"
          rules={[{ required: true, message: 'Last Name is required' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email Address"
          rules={[{ required: true, message: 'Email Address is required' }]}
        >
          <Input placeholder="customer@example.com" />
        </Form.Item>

        <Form.Item 
          name="phone" 
          label="Phone Number"
          
        >
          <Input placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Form.Item 
          name="customerType" 
          label="Customer Type"
          rules={[{ required: true, message: 'Customer Type is required' }]}
        >
          <Select >
        <Option value="Individual">Individual</Option>
        <Option value="Business">Business</Option>
        <Option value="Premium">Premium</Option>
        <Option value="Enterprise">Enterprise</Option>
      </Select>
        </Form.Item>

        <Form.Item 
          name="membershipStart" 
          label="Membership Start Date"
          
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          name="isActive" 
          label="Active Customer"
          
        >
          <Switch />
        </Form.Item>

        <Form.Item name="newsletter" valuePropName="checked" >
          <Checkbox>Subscribe to Newsletter</Checkbox>
        </Form.Item>

        <Form.Item>
          <Horizontal style={{ gap: "12px", justifyContent: "flex-end" }}>
            <GraviButton 
              
              
              onClick={() => console.log("Cancel clicked")}
            >
              Cancel
            </GraviButton>
            <GraviButton 
              
              
              onClick={() => form.resetFields()}
            >
              Reset Form
            </GraviButton>
            <GraviButton 
              htmlType="submit"
              success
              
            >
              Save Customer
            </GraviButton>
          </Horizontal>
        </Form.Item>
      </Form>
    </Vertical>
  );
}