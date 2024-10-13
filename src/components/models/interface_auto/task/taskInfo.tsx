import React, { useEffect } from 'react';
import { Card, Col, Form, Input, Row } from 'antd';
import FormItemCol from 'src/components/basic/formItemCol';


const TaskInfo: React.FC<{ taskDetail: TaskDetail; onTaskDetailChange: (updatedTaskDetail: TaskDetail) => void }> = ({ taskDetail, onTaskDetailChange }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      taskId: taskDetail.taskId,
      creator: taskDetail.creator,
      creationTime: taskDetail.creationTime,
      updateTime: taskDetail.updateTime,
      taskName: taskDetail.taskName,
      relateSceneNum: taskDetail.relateSceneNum,
      timeout: taskDetail.timeout,
      retry: taskDetail.retry,
      description: taskDetail.description
    });
    console.log(form.getFieldsValue());
  }, [taskDetail]);

  const handleFormChange = () => {
    const updatedValues = form.getFieldsValue();
    onTaskDetailChange(updatedValues as TaskDetail);
  };

  return (
    <Card title="任务详情" style={{ width: '100%' }}>
      <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
        <Row gutter={20}>
          <FormItemCol span={5} label="任务ID" name="taskId">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="创建人" name="creator">
            <Input disabled />
          </FormItemCol> 
          <FormItemCol span={5} label="创建时间" name="creationTime">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="修改时间" name="updateTime">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="任务名称" name="taskName">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="场景数" name="relateSceneNum">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="超时时间" name="timeout">
            <Input disabled />
          </FormItemCol>  
          <FormItemCol span={5} label="重试次数" name="retry">
            <Input disabled />
          </FormItemCol>  
        </Row>
        <Row gutter={20}>
          <FormItemCol span={20} label="任务描述" name="description">
            <Input.TextArea rows={4}  />
          </FormItemCol>  
        </Row>
      </Form>
    </Card>
  );
};

export default TaskInfo;