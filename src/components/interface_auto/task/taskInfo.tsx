import React, { useEffect } from 'react';
import { Card, Col, Form, Input, Row } from 'antd';


const TaskInfo: React.FC<{ taskDetail: TaskDetail; onTaskDetailChange: (updatedTaskDetail: TaskDetail) => void }> = ({ taskDetail, onTaskDetailChange }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(taskDetail);
  }, [taskDetail]);

  const handleFormChange = () => {
    const updatedValues = form.getFieldsValue();
    onTaskDetailChange(updatedValues as TaskDetail);
  };

  return (
    <Card title="任务详情" style={{ width: '100%' }}>
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={20}>
          <Col span={5}>
            <Form.Item label="任务ID" name="taskId">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="创建人" name="creator">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="创建时间" name="creationTime">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="修改时间" name="updateTime">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="任务名称" name="taskName">
              <Input  />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="场景数" name="relateSceneNum">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="超时时间" name="timeout">
              <Input  />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="重试次数" name="retry">
              <Input  />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={20}>
            <Form.Item label="任务描述" name="description">
              <Input.TextArea rows={4}  />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default TaskInfo;