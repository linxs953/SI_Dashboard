import React from 'react';
import { Modal, Form, Input, FormInstance } from 'antd';

interface EditIdlModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
  initialValues?: {
    name: string;
    description: string;
    type: string;
    version: string;
    image: string;
  };
}

const EditIdlModal: React.FC<EditIdlModalProps> = ({
  visible,
  onCancel,
  onOk,
  form,
  initialValues
}) => {
  return (
    <Modal
      title="编辑IDL"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>

        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请输入类型' }]}
        >
          <Input placeholder="请输入类型" />
        </Form.Item>

        <Form.Item
          name="version"
          label="版本"
          rules={[{ required: true, message: '请输入版本' }]}
        >
          <Input placeholder="请输入版本" />
        </Form.Item>

        <Form.Item
          name="image"
          label="镜像"
          rules={[{ required: true, message: '请输入镜像' }]}
        >
          <Input placeholder="请输入镜像" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditIdlModal; 