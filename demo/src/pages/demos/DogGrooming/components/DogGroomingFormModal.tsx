import { useEffect } from 'react';
import { Form, Input, DatePicker, Modal } from 'antd';
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr';
import { DogGroomingData, DogGroomingCreateRequest } from '../api/types.schema';

interface DogGroomingFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: DogGroomingCreateRequest) => void;
  initialValues?: DogGroomingData;
  isSubmitting?: boolean;
}

export function DogGroomingFormModal({
  visible,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting = false,
}: DogGroomingFormModalProps) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.Id;

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      title={isEdit ? 'Edit Dog Grooming' : 'Create Dog Grooming'}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="name"
          rules={[{ required: true, message: 'name is required' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="start Date"
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="end Date"
          rules={[{ required: true, message: '${label} is required' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="type"
          label="type"
          rules={[{ required: true, message: 'type is required' }]}
        >
          <Input placeholder="Enter type" />
        </Form.Item>

        <Horizontal justifyContent="flex-end" style={{ gap: '12px', marginTop: '24px' }}>
          <GraviButton buttonText="Cancel" onClick={handleCancel} />
          <GraviButton
            buttonText={isEdit ? 'Update' : 'Create'}
            theme1
            loading={isSubmitting}
            onClick={handleSubmit}
          />
        </Horizontal>
      </Form>
    </Modal>
  );
}
