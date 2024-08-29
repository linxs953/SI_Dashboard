import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Row, Col, Typography, List, Layout, Breadcrumb, Table, Tooltip, Button, Popconfirm, message, Tabs, Drawer, Select, Modal, InputNumber } from 'antd';
import { Content } from 'antd/es/layout/layout';
import "../../../node_modules/antd/dist/reset.css"
import TabPane from 'antd/es/tabs/TabPane';
import { useForm } from 'antd/es/form/Form';

const {Option} = Select

const SceneList = () => {
  const [activeTabKey, setActiveTabKey] = useState('S001');

  const [form] = useForm()

  const [scenes, setScenes] = useState([
    { id: 'S001', name: '登录流程', description: '这是第一个场景' },
    { id: 'S002', name: '门店邀请会员', description: '这是第二个场景' },
    { id: 'S003', name: '门店邀请创客', description: '这是第三个场景' }
  ])

  const [stepsData,setActions] = useState({
    S001: [
      { step: 1, description: '第一步' },
      { step: 2, description: '第二步' },
      { step: 3, description: '第三步' }
    ],
    S002: [
        { step: 1, description: '第一步' },
        { step: 2, description: '第二步' }
    ],
    S003: [
        { step: 1, description: '第一步' },
        { step: 2, description: '第二步' },
        { step: 3, description: '第三步' },
        { step: 4, description: '第四步' }
    ]
  })

  const [isConfigDrawerVisible, setIsConfigDrawerVisible] = useState(false);

  const [currentStepForConfig, setCurrentStepForConfig] = useState(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [isEditSceneModalVisible, setIsEditSceneModalVisible] = useState(false);            

  const [currentStep, setCurrentStep] = useState(null);

  const [additionalRows, setAdditionalRows] = useState(0); // 新增的状态用于跟踪附加行的数量

  const [fields, setFields] = useState([{ key: Math.random().toString(36).substring(7) }]);


  const columns = [
    {
        title: '步骤ID',
        dataIndex: 'step',
        key: 'step'
    },
    {
        title: '步骤名称',
        dataIndex: 'description',
        key: 'stepName'
    },
    {
      title: '请求方法',
      dataIndex: 'description',
      key: 'stepMethod'
    },
    {
      title: '请求路由',
      dataIndex: 'description',
      key: 'stepRoute'
    },
    {
      title: '重试次数',
      dataIndex: 'description',
      key: 'stepRetry'
    },
    {
      title: '超时时间',
      dataIndex: 'description',
      key: 'stepTimeout'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
          <>
              <Tooltip title="编辑">
                  <Button type="link" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
                      编辑
                  </Button>
              </Tooltip>
              <Tooltip title="配置依赖" >
                <Button type='link' onClick={showConfigDrawer} >
                    配置依赖
                </Button>
              </Tooltip>
              <Popconfirm
                  title="确定要删除这个场景吗？"
                  onConfirm={() => handleDelete(activeTabKey,record.step)}
                  okText="确定"
                  cancelText="取消"
              >
                  <Button type="link" danger>
                      删除
                  </Button>
              </Popconfirm>
          </>
      )
  }
  ];

  const showEditModal = (step) => {
    setCurrentStep(step);
    setIsEditModalVisible(true);
  };

// 关闭编辑弹窗
  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

// 更新步骤信息
  const updateStep = (updatedStep) => {
    setActions((prevState) => ({
      ...prevState,
      [activeTabKey]: prevState[activeTabKey].map((s) =>
        s.step === updatedStep.step ? { ...s, ...updatedStep } : s
      ),
    }));
    setIsEditModalVisible(false);
  };

  const showConfigDrawer = (step) => {
    setCurrentStepForConfig(step);
    setIsConfigDrawerVisible(true);
  };

  const handleConfigDrawerClose = () => {
    setIsConfigDrawerVisible(false);
  };

  const handleTabChange = (key) => {
      setActiveTabKey(key);
  };

  const handleDelete = (sceneId, stepId) => {
    setActions(preAction => ({
      ...preAction,
      [sceneId]: preAction[sceneId].filter(step => step.step !== stepId)
    }));
  };

  const showEditSceneModal = (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    setIsEditSceneModalVisible(true);
    console.log(scene)
  };

  
  const onFinish = async (values) => {
    const value = await form.getFieldsValue()
    console.log('Form values:', value);
    // 处理提交逻辑
  };


  const items = scenes.map((scene) => ({
    key: scene.id,
    label: scene.name,
    children: (
      <>
        <div style={{marginBottom: 10}}>
          <Button type='primary' onClick={() => showEditSceneModal(scene.id)}>编辑场景</Button>
        </div>
        <Table
            columns={columns}
            dataSource={stepsData[scene.id].map(step => ({ ...step, key: step.step }))}
            pagination={false}
            bordered
        />
      </>
    ),
  }));


  return (
    <Card title="关联场景列表" style={{ width: '100%' }}>
        <Tabs 
            activeKey={activeTabKey} 
            onChange={handleTabChange} 
            items={items} 
        ></Tabs>
        <Drawer
          title="配置依赖"
          placement="right"
          closable={false}
          onClose={handleConfigDrawerClose}
          open={isConfigDrawerVisible}
          width={"40%"}
        >
          <Tabs
            items={[
              {
                key: 'header',
                label: '请求头',
                children: (
                  <Form form={form}>
                    <Form.List name="headers">
                      {(fields, { add,remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Row key={key} gutter={20} >
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name]}
                                  // fieldKey={[field.key, 'type']}
                                  label="数据源类型"
                                >
                                  <Select>
                                    <Option value="scene">场景</Option>
                                    <Option value="basic">基础数据</Option>
                                    <Option value="custom">自定义数据</Option>
                                    <Option value="event">基于事件生成</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'index']}
                                  // fieldKey={[field, 'index']}
                                  label="数据源索引"
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'target']}
                                  // fieldKey={[fieldKey, 'target']}
                                  label="目标字段"
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                            </Row>
                          ))}
                          <Button type="dashed" block onClick={() => add()} style={{ marginTop: 16 }}>
                            添加一行
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Form>

                ),
              },
              {
                key: 'path',
                label: '请求路径',
                children: '...',
              },
              {
                key: 'params',
                label: '请求参数',
                children: '...',
              },
              {
                key: 'body',
                label: '请求体',
                children: '...',
              },
            ]}
          />

          <Button type="primary" block style={{ marginTop: 16 }}>
            保存
          </Button>
          <Button block onClick={handleConfigDrawerClose} style={{ marginTop: 8 }}>
            取消
          </Button>
        </Drawer>
        <Modal
          title="编辑步骤"
          open={isEditModalVisible}
          onCancel={handleEditModalCancel}
          footer={[
            <Button key="cancel" onClick={handleEditModalCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => updateStep(currentStep)}>
              保存
            </Button>,
          ]}
        >
          <Form
            form={form}
          >
            <Form.Item name="name" label="步骤名称">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="步骤描述">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="timeout" label="超时时间">
              <InputNumber />
            </Form.Item>
            <Form.Item name="retry" label="重试次数">
              <InputNumber />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="编辑场景"
          open={isEditSceneModalVisible}
          onCancel={() => setIsEditSceneModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditSceneModalVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={() => {}}>
              保存
            </Button>,
          ]}
        >
            <Row justify={"center"}>
              <Form
                form={form}
                layout="vertical"
              >
                <Row gutter={20}>
                  <Col span={8}>
                    <Form.Item
                    label="场景名称"
                    name="sceneName"
                    rules={[{ required: true, message: '请输入场景名称!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6} offset={0.5}>
                  <Form.Item
                      label="重试次数"
                      name="sceneRetries"
                      rules={[{ required: true, message: '请输入重试次数!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6} offset={0.5}>
                  <Form.Item
                      label="超时时间"
                      name="sceneTimeout"
                      rules={[{ required: true, message: '请输入超时时间!' }]}
                    >
                      <Input  />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col span={20}>
                    <Form.Item
                        label="场景描述"
                        name="sceneDesc"
                        rules={[{ required: true, message: '请输入场景描述!' }]}
                        >
                          <Input.TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Row>

        </Modal>
    </Card>

  );
};

const TaskInfo = () => {
  // 预设的任务信息
  const task = {
      id: 'T001',
      name: '项目A',
      sceneCount: 5,
      description: '这是一个关于数据分析的任务',
      creator: '张三',
      creationTime: '2023-09-01'
  };

  const [form] = Form.useForm();

  return (
      <Card title="任务详情" style={{ width: '100%' }}>
          <Form form={form} layout="vertical">
              <Row gutter={20} >
                <Col span={5}>
                  <Form.Item label="任务ID" valuePropName="value">
                    <Input value={task.name} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="任务名称" valuePropName="value">
                    <Input value={task.id} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="场景数" valuePropName="value">
                        <Input value={task.sceneCount} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="创建人" valuePropName="value">
                        <Input value={task.creator} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="超时时间" valuePropName="value">
                        <Input value={task.sceneCount} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="重试次数" valuePropName="value">
                        <Input value={task.sceneCount} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="创建时间" valuePropName="value">
                        <Input value={task.creationTime} disabled />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label="修改时间" valuePropName="value">
                        <Input value={task.creationTime} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                  <Col span={20}>
                    <Form.Item label="任务描述" valuePropName="value">
                          <Input.TextArea rows={4} value={task.description} disabled />
                    </Form.Item>
                  </Col>

              </Row>
          </Form>
      </Card>
  );
};


const TaskDetails = () => {

  return (
      <Layout>
          <Content style={{ padding: '0 50px' }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 360 }}>
                  <TaskInfo />
                  <SceneList />
              </div>
          </Content>
      </Layout>
  );
};

export default TaskDetails;