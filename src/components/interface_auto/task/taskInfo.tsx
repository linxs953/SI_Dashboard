import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';

interface TaskInfoProps {
  taskData: any;
  onTaskDataChange: (newTaskData: any) => void;
}

const TaskInfo: React.FC<TaskInfoProps> = ({ taskData, onTaskDataChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(taskData);
  }, [taskData, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      onTaskDataChange(values);
    }).catch(error => {
      console.error('Validation failed:', error);
    });
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: '90%', margin: 'auto' }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="任务ID"
            name="taskId"
            rules={[{ required: true, message: 'Please input the task ID!' }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="任务场景数"
            name="scenesCount"
            rules={[{ required: true, message: 'Please input the scenes count!' }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="任务名称"
            name="taskName"
            rules={[{ required: true, message: 'Please input the task name!' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="创建人"
            name="author"
            rules={[{ required: true, message: 'Please input the author!' }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="创建时间"
            name="createdAt"
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="更新时间"
            name="updatedAt"
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
        <Col span={24}>
          <Button type="primary" onClick={handleSave}>保存</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TaskInfo