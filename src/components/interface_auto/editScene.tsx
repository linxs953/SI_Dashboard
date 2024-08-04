import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Modal, Table, Tooltip, message, InputNumber, Row, Col, FormInstance } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SceneData {
  sceneName: string;
  sceneDesc: string;
  sceneRetries: number;
  sceneTimeout: number;
  actions: ActionData[];
}

interface ActionData {
  actionId: string;
  actionName: string;
  retries: number;
  timeout: number;
}

const EditScene: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionData | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const sceneId = searchParams.get('sceneId');

  useEffect(() => {
    if (!sceneId) {
      showModal();
    } else {
      fetchSceneData(sceneId);
    }
  }, [location, sceneId]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const fetchSceneData = async (scid: string) => {
    const response = await axios.get(`http://localhost:8000/scene/get?scid=${scid}`);
    if (response.status !== 200) {
      message.error("获取场景信息失败");
      return;
    }
    if (response.data.code && response.data.code === 2) {
      message.error("不存在的ID");
      return;
    }
    if (!response.data.data) {
      message.error("解析请求失败");
      return;
    }
    const data: SceneData = {
      "sceneName": response.data.data.scname,
      "sceneDesc": response.data.data.description,
      "sceneRetries": response.data.data.retry,
      "sceneTimeout": response.data.data.timeout,
      "actions": response.data.data.actions
    };
    setSceneData(data);
    form.setFieldsValue(data);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/dashboard/api/scene');
  };

  const handleBack = () => {
    navigate('/dashboard/api/scene');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (sceneData?.actions.length == 0) {
        message.error("列表数据为空")
        return
      }
      console.log(values)
      const data = {
        "scname": values?.sceneName,
        "description": values?.sceneDesc,
        "timeout": values?.sceneTimeout,
        "retry": values?.sceneRetries,
        "actions": sceneData?.actions
      }
      const response = await axios.put(`http://localhost:8000/scene/update?scid=${sceneId}`, data)
      if (response.status != 200) {
        message.error("保存场景失败")
        return
      }
      if (response.data.code && response.data.code >  0) {
        message.error("保存场景出现错误")
        return
      }
      navigate("/dashboard/api/scene")
      message.success("更新场景成功")
      return
      
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleDelete = (record: ActionData) => {
    const newActions = sceneData?.actions.filter(item => item.actionId !== record.actionId);
    setSceneData(prevState => ({
      ...prevState!,
      actions: newActions!
    }));
  };

  const handleEdit = (record: ActionData) => {
    setSelectedAction(record);
    setEditModalVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedAction) {
        const updatedActions = sceneData!.actions.map(action => {
          if (action.actionId === selectedAction.actionId) {
            return { ...action, ...values };
          }
          return action;
        });
        console.log(updatedActions)
        setSceneData(prevState => ({
          ...prevState!,
          actions: updatedActions
        }));
      }
      setEditModalVisible(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  const columns = [
    {
      title: 'ApiID',
      dataIndex: 'relateId',
      key: 'actionId',
    },
    {
      title: '请求方法',
      dataIndex: 'actionMethod',
      key: 'actionMethod',
    },
    {
      title: '节点名称',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: '重试次数',
      dataIndex: 'retry',
      key: 'retries',
    },
    {
      title: '执行超时时间',
      dataIndex: 'timeout',
      key: 'timeout',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ActionData) => (
        <>
          <Tooltip title="编辑">
            <EditOutlined onClick={() => handleEdit(record)} style={{ marginRight: '8px' }} />
          </Tooltip>
          <Tooltip title="删除">
            <DeleteOutlined onClick={() => handleDelete(record)} />
          </Tooltip>
        </>
      ),
    },
  ];


  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Modal
        title="缺少参数"
        open={isModalVisible}
        onOk={handleOk}
        okText="返回"
        cancelButtonProps={{ style: { display: 'none' } }}
        footer={[
          <Button key="back" type="primary" onClick={handleOk}>
            返回
          </Button>,
        ]}
      >
        此页面需要一个sceneId参数才能正常工作。
      </Modal>

      <Row justify="center" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Col span={20} style={{ padding: '1rem' }}>
          <Form
            form={form}
            initialValues={sceneData || {}}
            onFinish={handleSave}
            layout="vertical"
          >
            <Form.Item
              label="场景名称"
              name="sceneName"
              rules={[{ required: true, message: '请输入场景名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="场景描述"
              name="sceneDesc"
              rules={[{ required: true, message: '请输入场景描述!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="重试次数"
              name="sceneRetries"
              rules={[{ required: true, message: '请输入重试次数!' }]}
            >
              <InputNumber min={0} max={10} />
            </Form.Item>
            <Form.Item
              label="超时时间"
              name="sceneTimeout"
              rules={[{ required: true, message: '请输入超时时间!' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Action列表">
              <Table
                dataSource={sceneData?.actions}
                columns={columns}
                pagination={false}
                rowKey="actionId"
                style={{ width: "1000px" }}
                scroll={{ x: 600 }}
              />
            </Form.Item>
            <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Button onClick={handleBack} style={{ marginRight: '10px' }} >
                返回
              </Button>
              <Button type="primary" htmlType="submit" >
                保存
              </Button>
            </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>

      {/* 编辑模态框 */}
      <Modal
        title="编辑数据"
        open={editModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        {/* 编辑表单内容 */}
        <Form
          form={form}
          initialValues={selectedAction || {}}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            label="节点名称"
            name="actionName"
            rules={[{ required: true, message: '请输入节点名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="重试次数"
            name="retry"
            rules={[{ required: true, message: '请输入重试次数!' }]}
          >
            <InputNumber min={0} max={10} />
          </Form.Item>
          <Form.Item
            label="执行超时时间"
            name="timeout"
            rules={[{ required: true, message: '请输入超时时间!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditScene;