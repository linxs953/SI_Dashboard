import React from 'react';
import { Card, Form, Input, Row, Col, Typography } from 'antd';
import {
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';

const { Text } = Typography;

const TaskDetails = () => {
  const [form] = Form.useForm();

  return (
    <Card
      bordered={false}
      style={{
        width: '60%',
        height: '20%',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '8px',
      }}
    >
      <ProForm form={form} layout="vertical">
        <Row gutter={[16, 16]} style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
          <Col span={4}>
            <ProFormText
              name="taskId"
              label="任务 ID"
              initialValue="123456789"
              disabled
            />
          </Col>
          <Col span={4}>
            <ProFormText
              name="taskName"
              label="任务名称"
            />
          </Col>
          <Col span={4}>
            <ProFormText
              name="sceneCount"
              label="关联场景数"
            />
          </Col>
          <Col span={4}>
            <ProFormText
              name="creator"
              label="创建人"
            />
          </Col>
          <Col span={4}>
            <ProFormText
              name="createTime"
              label="创建时间"
            />
          </Col>
          <Col span={4}>
            <ProFormText
              name="updateTime"
              label="更新时间"
            />
          </Col>
        </Row>
      </ProForm>
    </Card>
  );
};

export default TaskDetails;