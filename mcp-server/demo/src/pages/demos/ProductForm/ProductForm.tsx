import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { Form, Input, InputNumber, Select, Switch, DatePicker } from 'antd';
import React from 'react';

const { Option } = Select;

export function ProductForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form submitted:', values);
    // Mock save action - replace with actual API call
  };

  return (
    <Vertical style={{ padding: "24px", maxWidth: "600px" }}>
      <Texto category="h4" style={{ marginBottom: "24px" }}>
        Product Management Form
      </Texto>
      
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Form.Item 
          name="name" 
          label="Product Name"
          rules={[{ required: true, message: 'Product Name is required' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Price"
          rules={[{ required: true, message: 'Price is required' }]}
        >
          <InputNumber placeholder="0.00" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          name="category" 
          label="Category"
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select >
        <Option value="Electronics">Electronics</Option>
        <Option value="Clothing">Clothing</Option>
        <Option value="Books">Books</Option>
        <Option value="Home">Home</Option>
      </Select>
        </Form.Item>

        <Form.Item 
          name="description" 
          label="Description"
          
        >
          <Input placeholder="Product description" />
        </Form.Item>

        <Form.Item 
          name="inStock" 
          label="In Stock"
          
        >
          <Switch />
        </Form.Item>

        <Form.Item 
          name="releaseDate" 
          label="Release Date"
          
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Horizontal style={{ gap: "12px", justifyContent: "flex-end" }}>
            <GraviButton 
              htmlType="submit"
              success
              
            >
              Save Product
            </GraviButton>
            <GraviButton 
              
              
              onClick={() => console.log("Cancel clicked")}
            >
              Cancel
            </GraviButton>
          </Horizontal>
        </Form.Item>
      </Form>
    </Vertical>
  );
}