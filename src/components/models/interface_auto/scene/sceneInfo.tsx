import { Card, Col, Form, Input, Row } from "antd";
import { useEffect } from "react";



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
            <Col span={5}>
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
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={20}>
              <Form.Item label="工作流描述" name="sceneDescription">
                <Input.TextArea rows={4}  />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
};

export default SceneInfo;