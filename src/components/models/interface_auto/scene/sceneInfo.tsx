import { Card, Col, Form, Input, Row } from "antd";
import React from "react";
import { useEffect } from "react";
import FormItemWithoutCol from "src/components/basic/formItem";
import FormItemCol from "src/components/basic/formItemCol";



const SceneInfo: React.FC<{ sceneDetail: SceneInfo; onSceneDetailChange: (updatedSceneDetail: SceneInfo) => void }> = ({ sceneDetail, onSceneDetailChange }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      form.setFieldsValue(sceneDetail);
    }, [sceneDetail]);
  
    const handleFormChange = () => {
      const updatedValues = form.getFieldsValue();
      onSceneDetailChange(updatedValues as SceneInfo);
    };
  
    return (
      <Card title="工作流详情" style={{ width: '100%' }}>
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
          <Row gutter={20}>
            <FormItemCol span={5} label="流程ID" name="sceneId">
              <Input disabled />
            </FormItemCol>
            <FormItemCol span={5} label="创建人" name="author">
              <Input disabled />
            </FormItemCol>
            <FormItemCol span={5} label="创建时间" name="createTime">
              <Input disabled />
            </FormItemCol>
            <FormItemCol span={5} label="修改时间" name="updateTime">
              <Input disabled />
            </FormItemCol>
            <FormItemCol span={5} label="流程名称" name="sceneName">
              <Input />
            </FormItemCol>
            <FormItemCol span={5} label="用例数" name="actionNum">
              <Input disabled />
            </FormItemCol>
            <FormItemCol span={5} label="超时时间" name="sceneTimeout">
              <Input />
            </FormItemCol>
            <FormItemCol span={5} label="重试次数" name="sceneRetries">
              <Input />
            </FormItemCol>
          </Row>
          <Row gutter={20}>
            <FormItemCol span={20} label="工作流描述" name="sceneDescription">
              <Input.TextArea rows={4}  />
            </FormItemCol>
          </Row>
        </Form>
      </Card>
    );
};

export default SceneInfo;



// <Col span={20}>
// <Form.Item label="工作流描述" name="sceneDescription">
//   <Input.TextArea rows={4}  />
// </Form.Item>
// </Col>


{/* <Col span={5}>
<Form.Item label="流程ID" name="sceneId">
  <Input disabled />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="创建人" name="author">
  <Input disabled />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="创建时间" name="createTime">
  <Input disabled />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="修改时间" name="updateTime">
  <Input disabled />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="流程名称" name="sceneName">
  <Input  />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="用例数" name="actionNum">
  <Input disabled />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="超时时间" name="sceneTimeout">
  <Input  />
</Form.Item>
</Col>
<Col span={5}>
<Form.Item label="重试次数" name="sceneRetries">
  <Input  />
</Form.Item>
</Col> */}