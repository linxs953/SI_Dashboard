import { Button, Card, Col, Drawer, Form, FormListFieldData, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Table, Tabs, Tooltip } from "antd"
import { useForm } from "antd/es/form/Form"
import React from "react"
import { useEffect, useState } from "react"

const {Option} = Select

const SceneList: React.FC<{ sceneList: SceneInfo[], updateSceneList: (updatedSceneList: SceneInfo[]) => void }> = ({ sceneList, updateSceneList }) => {
  const [activeTabKey, setActiveTabKey] = useState(sceneList[0]?.sceneId);
  const [form] = useForm()
  const [isConfigDrawerVisible, setIsConfigDrawerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditSceneModalVisible, setIsEditSceneModalVisible] = useState(false); 
  
  const [dependSelectTab, setDependSelectTab] = useState('headers');

  const [currentStep, setCurrentStep] = useState<StepInfo>({
    stepId: '',
    stepName: '',
    stepDescription: '',
    stepTimeout: 0,
    stepRetry: 0,
    stepMethod: '',
    stepRoute: '',
    stepDependencies: []
  });
  const [currentScene, setCurrentScene] = useState<SceneInfo>({
    sceneId: '',
    sceneName: '',
    sceneDescription: '',
    sceneTimeout: 0,
    sceneRetries: 0,
    actionList: []
  });

  const columns = [
    {
        title: '步骤ID',
        dataIndex: 'stepId',
        key: 'stepId',
        width: 200, 
        align: 'center',
    },
    {
        title: '步骤名称',
        dataIndex: 'stepName',
        key: 'stepName',
        width: 200, 
        align: 'center',
    },
    {
      title: '请求方法',
      dataIndex: 'stepMethod',
      key: 'stepMethod',
      width: 200, 
      align: 'center',
    },
    {
      title: '请求路由',
      dataIndex: 'stepRoute',
      key: 'stepRoute',
      width: 200, 
      align: 'center',
    },
    {
      title: '重试次数',
      dataIndex: 'stepRetry',
      key: 'stepRetry',
      width: 200, 
      align: 'center',
    },
    {
      title: '超时时间',
      dataIndex: 'stepTimeout',
      key: 'stepTimeout',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 250, // 指定操作列的宽度为250像素
      render: (_: any, record: StepInfo) => (
          <>
              <Tooltip title="编辑">
                  <Button type="link" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
                      编辑
                  </Button>
              </Tooltip>
              <Tooltip title="配置依赖" >
                <Button type='link' onClick={() => showConfigDrawer(record)} >
                    配置依赖
                </Button>
              </Tooltip>
              <Popconfirm
                  title="确定要删除这个步骤吗？"
                  onConfirm={() => handleDelete(activeTabKey, record.stepId)}
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

  // 编辑步骤
  const showEditModal = (step: StepInfo) => {
    const scene = sceneList.find(s => s.sceneId === activeTabKey);
    setCurrentScene(scene as SceneInfo);
    setCurrentStep(step);
    setIsEditModalVisible(true);
    form.setFieldsValue(step);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleDelete = (sceneId: string, stepId: string) => {
    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === sceneId
        ? {...scene, actionList: scene.actionList.filter(step => step.stepId !== stepId)}
        : scene
    );
    updateSceneList(updatedSceneList);
  };

  const updateStepOk = (updatedStep: StepInfo) => {

    let upScene: SceneInfo = sceneList.find(s => s.sceneId === activeTabKey) as SceneInfo;
    // 更新 upScene 中的 step
    updatedStep = {
      ...updatedStep,
      ...form.getFieldsValue(),
    }

    const updatedActionList = upScene.actionList.map(step => 
      step.stepId === updatedStep.stepId ? updatedStep : step
    );
    upScene = {
      ...upScene,
      actionList: updatedActionList
    };
    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === upScene.sceneId ? upScene : scene
    );
    updateSceneList(updatedSceneList as SceneInfo[]);
    setActiveTabKey(upScene.sceneId);
    message.success('场景更新成功');
    setIsEditModalVisible(false);

    console.log(upScene)
  };

  // 编辑场景
  const showEditSceneModal = () => {
    const scene = sceneList.find(s => s.sceneId === activeTabKey);
    setCurrentScene(scene as SceneInfo);
    setIsEditSceneModalVisible(true);
    form.setFieldsValue(scene); 
  };

  const updateSceneInfoOK = (upScene: SceneInfo) => {
    let updatedScene = {
      "sceneId": upScene.sceneId,
      "actionList": upScene.actionList,
      ...form.getFieldsValue(),
    }
    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === upScene.sceneId ? updatedScene : scene
    );
    updateSceneList(updatedSceneList as SceneInfo[]);
    setActiveTabKey(updatedScene.sceneId);
    message.success('场景更新成功');
    setIsEditSceneModalVisible(false);    
  };

  const showConfigDrawer = (step: StepInfo) => {
    setCurrentStep(step);
    setIsConfigDrawerVisible(true);
  };

  const handleConfigDrawerClose = () => {
    setIsConfigDrawerVisible(false);
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };
 
  const onFinish = async (values: any) => {
    const value = await form.getFieldsValue()
    console.log('Form values:', value);
    // 处理提交逻辑
  };

  const dependForm = (fields: FormListFieldData[], { add, remove }: { add: () => void; remove: (index: number) => void }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} gutter={20}>
          <Col span={6}>
            <Form.Item
              {...restField}
              name={[name, 'dsType']}
              label="数据源类型"
            >
              <Select 
                value={form.getFieldValue([dependSelectTab, name, 'dsType'])}
                onChange={(value) => {
                  const newFields = [...fields];
                  const originalField = form.getFieldValue([dependSelectTab, name]);
                  newFields[name] = {
                    ...originalField,
                    dsType: value
                  } as FormListFieldData;
                  form.setFieldsValue({ [dependSelectTab]: newFields });
                }}
              >
                <Option value="scene">场景</Option>
                <Option value="basic">基础数据</Option>
                <Option value="custom">自定义数据</Option>
                <Option value="event">基于事件生成</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            {(() => {
              const dsType = form.getFieldValue([dependSelectTab, name, 'dsType']);
              console.log(dependSelectTab,dsType)
              switch (dsType) {
                case 'scene':
                  return (
                    <Form.Item
                      {...restField}
                      name={[name, 'relateStep']}
                      label="场景索引"
                    >
                      <Input />
                    </Form.Item>
                  );
                case 'basic':
                  return (
                    <Form.Item
                      {...restField}
                      name={[name, 'cacheKey']}
                      label="缓存键"
                    >
                      <Input />
                    </Form.Item>
                  );
                case 'custom':
                  return (
                    <Form.Item
                      {...restField}
                      name={[name, 'customValue']}
                      label="自定义值"
                    >
                      <Input />
                    </Form.Item>
                  );
                case 'event':
                  return (
                    <Form.Item
                      {...restField}
                      name={[name, 'eventKey']}
                      label="事件键"
                    >
                      <Input />
                    </Form.Item>
                  );
                default:
                  return null;
              }
            })()}
          </Col>
          <Col span={8}>
            <Form.Item
              {...restField}
              name={[name, 'targetField']}
              label="目标字段"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Button onClick={() => remove(name)} type="link" danger>
              删除
            </Button>
          </Col>
        </Row>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => {
          add()
          form.setFieldsValue({
            [dependSelectTab]: {
              [fields.length]: {
                dsType: 'scene'
              }
            }
          })
        }} block>
          添加数据
        </Button>
      </Form.Item>
    </>
  )

  useEffect(() => {
    if (currentStep) {
      setCurrentStep(currentStep)
    }
  }, [currentStep])

  return (
    <>
      <Card title="关联场景列表" style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Tabs 
              activeKey={activeTabKey} 
              onChange={handleTabChange} 
              items={sceneList.map(scene => ({
                key: scene.sceneId,
                label: scene.sceneName,
                children: (
                  <>
                    <div style={{marginBottom: 10}}>
                      <Button type='primary' onClick={() => showEditSceneModal()}>编辑场景</Button>
                    </div>
                    <Table
                        columns={columns.map(column => ({
                          ...column,
                          title: <div style={{ textAlign: 'center' }}>{column.title}</div>
                        }))}
                        dataSource={scene.actionList.map(step => ({ ...step, key: step.stepId }))}
                        pagination={{
                          pageSize: 10,
                          showQuickJumper: true,
                          showTotal: (total) => `共 ${total} 条数据`,
                          position: ['bottomLeft']
                        }}
                        bordered
                    />
                  </>
                )
              }))}
          />
          <Drawer
            title="配置依赖"
            placement="right"
            closable={false}
            onClose={handleConfigDrawerClose}
            open={isConfigDrawerVisible}
            width={"40%"}
            footer={
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <Button onClick={handleConfigDrawerClose} style={{ marginRight: 20 }}>
                  取消
                </Button>
                <Button type="primary" onClick={() => {
                  console.log(form.getFieldsValue());
                }}>
                  保存
                </Button>
              </div>
            }
          >
            <Tabs
              onChange={(key) => {
                setDependSelectTab(key)
              }}
              items={[
                {
                  key: 'headers',
                  label: '请求头',
                  children: (
                    <Form form={form} onFinish={onFinish} initialValues={{ headers: currentStep?.stepDependencies.filter(dep => dep.dependType === 'headers') }}>
                      <Form.List name="headers">
                          {(fields, { add, remove }) => dependForm(fields, { add, remove })}
                      </Form.List>
                    </Form>
                  ),
                },
                {
                  key: 'path',
                  label: '请求路径',
                  children: (
                    <Form form={form} onFinish={onFinish} initialValues={{ path: currentStep?.stepDependencies.filter(dep => dep.dependType === 'path') }}>
                      <Form.List name="path">
                          {(fields, { add, remove }) => dependForm(fields, { add, remove })}
                      </Form.List>
                    </Form>
                  ),
                },
                {
                  key: 'params',
                  label: '请求参数',
                  children: (
                    <Form form={form} onFinish={onFinish} initialValues={{ params: currentStep?.stepDependencies.filter(dep => dep.dependType === 'params') }}>
                      <Form.List name="params">
                          {(fields, { add, remove }) => dependForm(fields, { add, remove })}
                      </Form.List>
                    </Form>
                  ),              
                },
                {
                  key: 'payload',
                  label: '请求体',
                  children: (
                    <Form form={form} onFinish={onFinish} initialValues={{ payload: currentStep?.stepDependencies.filter(dep => dep.dependType === 'payload') }}>
                      <Form.List name="payload">
                          {(fields, { add, remove }) => dependForm(fields, { add, remove })}
                      </Form.List>
                    </Form>
                  ),              
                },
              ]}
            />
          </Drawer>
          <Modal
            title="编辑步骤"
            open={isEditModalVisible}
            onCancel={handleEditModalCancel}
            footer={[
              <Button key="cancel" onClick={handleEditModalCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={() => updateStepOk(currentStep)}>
                保存
              </Button>,
            ]}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={currentStep}
            >
               <Row gutter={20}>
               <Col span={8}>
                <Form.Item name="stepName" label="步骤名称">
                  <Input />
                </Form.Item>
               </Col>
               <Col span={6} offset={0.5}>
                <Form.Item name="stepTimeout" label="超时时间">
                  <InputNumber />
                </Form.Item>
               </Col>
               <Col span={6} offset={0.5}>
                <Form.Item name="stepRetry" label="重试次数">
                  <InputNumber />
                </Form.Item>
               </Col>
               </Row>
              <Row gutter={20}>
                <Col span={20}>
                <Form.Item name="stepDescription" label="步骤描述">
                  <Input.TextArea rows={4} />
                </Form.Item>
                </Col>
              </Row>



            </Form>
          </Modal>
          {isEditSceneModalVisible && (
            <Modal
              title="编辑场景"
              open={true}
              onCancel={() => setIsEditSceneModalVisible(false)}
              footer={[
                <Button key="cancel" onClick={() => setIsEditSceneModalVisible(false)}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => updateSceneInfoOK(currentScene)}>
                  保存
                </Button>,
              ]}
            >
                <Row justify={"center"}>
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={currentScene}
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
                            name="sceneDescription"
                            rules={[{ required: true, message: '请输入场景描述!' }]}
                            >
                              <Input.TextArea rows={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Row>
            </Modal>
          )}

      </Card>
    </>
  );
};

export default SceneList;

