import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import Request from 'src/network/request';

const req = new Request("http://localhost:8000")

const initialTaskData = {
  taskId: '',
  taskName: '',
  author: '',
  scenesCount: 0,
}
const TaskDetails = () => {
  const [form] = Form.useForm();
  const { taskId: urlTaskId } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(initialTaskData);

  useEffect(() => {
    if (!urlTaskId) {
      message.error("缺少taskId")
      return
    }
    if (urlTaskId) {
      fetchTaskDetails(urlTaskId);
    }
  }, [urlTaskId]);

  const fetchTaskDetails = async (taskId:string) => {
    try {
      const response = await req.send({
        url: `/task/get?taskId=${taskId}`,
        method: 'GET',
        params: { taskId },
      });
      const data = response.data;
      if (!data) {
         message.error("获取任务信息失败")
         return
      }
      setTaskData({
        taskId: data.taskId,
        taskName: data.taskName,
        author: data.author,
        scenesCount: data.scenes.length,
      });
      form.setFieldsValue({
        taskId: data.taskId,
        taskName: data.taskName,
        author: data.author,
        scenesCount: data.scenes.length,
      });
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await req.send({
        url: `/task/update?taskId=${urlTaskId}`,
        method: 'POST',
        data: form.getFieldsValue(),
      })
      if (!response.data) {
        message.error("读取返回值失败")
        return
      }
      message.success('Task updated successfully');
      navigate('/dashboard/api/task');
    } catch (error) {
      console.error('Error updating task:', error);
      message.error('Failed to update task');
    }
  };

  return (
    <div>
      <h1>Task Details</h1>
      <Form
        form={form}
        initialValues={taskData}
        layout="vertical"
        style={{ maxWidth: '600px', margin: 'auto' }}
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
          <Col span={24}>
            <Form.Item
              label="任务名称"
              name="taskName"
              rules={[{ required: true, message: 'Please input the task name!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="创建人"
              name="author"
              rules={[{ required: true, message: 'Please input the author!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Button onClick={() => navigate('/dashboard/api/task')}>取消</Button>
            <Button type="primary" onClick={handleSave} style={{ marginLeft: '8px' }}>保存</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TaskDetails;