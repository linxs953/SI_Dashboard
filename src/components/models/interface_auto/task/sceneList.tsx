import { Button, Card, Col, Drawer, Form, FormListFieldData, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Switch, Table, Tabs, Tooltip } from "antd"
import { useForm } from "antd/es/form/Form"
import React from "react"
import { useEffect, useState } from "react"
import ActionExpect from "../scene/actionExpect";
import createTaskSceneListStore from "src/store/task/taskSceneList"
import { ColumnType } from "antd/es/table"
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons';
import MultiDataSourceModal from "./multiDataSourceModal"
import Options from "src/components/basic/options"
import FormItemCol from "src/components/basic/formItemCol"

const store = createTaskSceneListStore()

const dataTypeOptions = [
  { value: 'string', label: '字符串' },
  { value: 'number', label: '数字' },
  { value: 'boolean', label: '布尔值' },
  { value: 'object', label: '对象' },
  { value: 'array', label: '数组' }
]

const sideOptions = [
  { label: '管理侧', value: '管理侧' },
  { label: '平台侧', value: '平台侧' },
  { label: '用户侧', value: '用户侧' },
]


const renderSceneList = (sceneList: SceneInfo[], showEditSceneModal: () => void, columns: ColumnType<ActionInfo>[]) => {
  return sceneList.map(scene => ({
    key: scene.sceneId,
    label: scene.sceneName,
    children: (
      <>
        <div style={{marginBottom: 10}}>
          <Button type='primary' onClick={() => showEditSceneModal()}>编辑场景</Button>
        </div>
        <Table
            columns={columns.map((column, index) => ({
              ...column,
              title: typeof column.title === 'function' ? column.title : <div key={`column-${index}`} style={{ textAlign: 'center' }}>{column.title}</div>
            })) as ColumnType<ActionInfo>[]}
            dataSource={scene.actionList.map((step,index) => ({ ...step, key: `${step.actionId}-${index}` }))}
            pagination={{
              pageSize: 1,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
              position: ['bottomLeft']
            }}
            bordered
        />
      </>
    )
  }));
};

const getEnvironment = (url:string) => {
  if (!url) {
    return false;
  }
  if (url.includes('demopsuadmin') || url.includes('demopsu')) {
    return false; // 测试环境
  } else if (url.includes('admin.86lw.cc') || url.includes('psu.86lw.cc')) {
    return true; // 生产环境
  }
  return false; // 默认返回测试环境
}

const getDomain = (side: string, environmentSwitch: boolean) => {
  if (environmentSwitch !== undefined) {
    if (environmentSwitch) {
      // 生产环境
      switch (side) {
        case '管理侧':
          return 'admin.86lw.cc';
        case '平台侧':
          return 'psu.86lw.cc';
        case '用户侧':
          return 'psu.86lw.cc';
        default:
          return '';
      }
    } else {
      // 测试环境
      switch (side) {
        case '管理侧':
          return 'demopsuadmin.86yfw.com';
        case '平台侧':
          return 'demopsu.86yfw.com';
        case '用户侧':
          return 'demopsu.86yfw.com';
        default:
          return '';
      }
    }
  }
  return '';
}


const SceneList: React.FC<{ sceneList: SceneInfo[], updateSceneList: (updatedSceneList: SceneInfo[]) => void }> = ({ sceneList, updateSceneList }) => {
  const [form] = useForm()
  const [isMultiDataSourceModalVisible, setIsMultiDataSourceModalVisible] = useState(false);

  const [currentActionDepend, setCurrentActionDepend] = useState<DependInfo>({
    output: {
      type: "",
      value: "",
    },
    dataSource: [],
    dsSpec: [],
    extra: "",
    isMultDs: false,
    mode: "",
    refer: {
        type: "",
        target: "",
        dataType: "",
    }
  });

  const {
    activeTabKey,
    isConfigDrawerVisible,
    isEditModalVisible,
    isEditSceneModalVisible,
    dependSelectTab,
    currentStep,
    currentScene,
    selectScene,
    isSelectActionModalVisible,
    isCacheModalVisible,
    isExpectDrawerModalVisible,
    sceneIndex,
    cacheIndex,
    setActiveTabKey,
    setIsConfigDrawerVisible,
    setIsEditActionModalVisible,
    setIsEditSceneModalVisible,
    setDependSelectTab,
    setCurrentAction,
    setCurrentScene,
    setSelectScene,
    setIsSelectActionModalVisible,
    setIsCacheModalVisible,
    setIsExpectDrawerModalVisible,
    setSceneIndex,
    setCacheIndex,
  } = store((state) => ({
    activeTabKey: state.activeTabKey,
    isConfigDrawerVisible: state.isDependDrawerVisible,
    isEditModalVisible: state.isEditActionModalVisible,
    isEditSceneModalVisible: state.isEditSceneModalVisible,
    dependSelectTab: state.dependSelectTab,
    currentStep: state.currentAction,
    currentScene: state.currentScene,
    selectScene: state.selectScene,
    isSelectActionModalVisible: state.isSelectActionModalVisible,
    isCacheModalVisible: state.isBasicDataModalVisible,
    isExpectDrawerModalVisible: state.isExpectDrawerModalVisible,
    sceneIndex: state.sceneIndex,
    cacheIndex: state.formBasicDataIndex,
    setActiveTabKey: state.setActiveTabKey,
    setIsConfigDrawerVisible: state.setIsDependDrawerVisible,
    setIsEditActionModalVisible: state.setIsEditActionModalVisible,
    setIsEditSceneModalVisible: state.setIsEditSceneModalVisible,
    setDependSelectTab: state.setDependSelectTab,
    setCurrentAction: state.setCurrentAction,
    setCurrentScene: state.setCurrentScene,
    setSelectScene: state.setSelectScene,
    setIsSelectActionModalVisible: state.setIsSelectActionModalVisible,
    setIsCacheModalVisible: state.setIsBasicDataModalVisible,
    setIsExpectDrawerModalVisible: state.setIsExpectDrawerModalVisible,
    setSceneIndex: state.setSceneIndex,
    setCacheIndex: state.setFormBasicDataIndex,
  }))

  const updateCurrentStepExpect = (updateAction: ActionInfo) => {
    // 更新 sceneList
    const updatedSceneList = sceneList.map(scene => {
      if (scene.sceneId === activeTabKey) {
        const updatedActionList = scene.actionList.map(action => {
          if (String(action.actionId) === String(updateAction.actionId)) {
            return updateAction
          }
          return action;
        });

        
        return {
          ...scene,
          actionList: updatedActionList
        };
      }
      return scene;
    });

    // 调用 updateSceneList 函数更新状态
    updateSceneList(updatedSceneList);

    setActiveTabKey(activeTabKey);
    
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const handleConfigDrawerClose = () => {
    setIsConfigDrawerVisible(false);
  };

  const columns:ColumnType<ActionInfo>[] = [
    {
        title: '步骤ID',
        dataIndex: 'actionId',
        key: 'stepId',
        width: 250, 
        align: 'center',
    },
    {
        title: '步骤名称',
        dataIndex: 'actionName',
        key: 'stepName',
        width: 200, 
        align: 'center',
    },
    {
      title: '请求方法',
      dataIndex: 'actionMethod',
      key: 'stepMethod',
      width: 200, 
      align: 'center',
    },
    {
      title: '请求路由',
      dataIndex: 'actionPath',
      key: 'stepRoute',
      width: 200, 
      align: 'center',
    },
    {
      title: '重试次数',
      dataIndex: 'retry',
      key: 'stepRetry',
      width: 200, 
      align: 'center',
    },
    {
      title: '超时时间',
      dataIndex: 'timeout',
      key: 'stepTimeout',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 270, // 指定操作列的宽度为250像素
      render: (_: any, record: ActionInfo) => (
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
              <Tooltip title="预期结果" >
                <Button type='link' onClick={() => showExpectDrawer(record)} >
                    预期结果
                </Button>
              </Tooltip>
              <Popconfirm
                  title="确定要删除这个步骤吗？"
                  onConfirm={() => handleDelete(activeTabKey, record.actionId)}
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

  const updateActionDepend = (depend:DependInfo) => {
    let newDepend: ActionInfo = currentStep
    newDepend.actionDependencies = currentStep.actionDependencies.map(de => {
        if (de.refer.target === depend.refer.target) {
          return depend
        }
        return de
    })
    setCurrentAction(newDepend)
    setIsMultiDataSourceModalVisible(false)
  }

  // 编辑步骤
  const showEditModal = (step: ActionInfo) => {
    const scene = sceneList.find(s => s.sceneId === activeTabKey);
    setCurrentScene(scene as SceneInfo);
    setCurrentAction(step as ActionInfo);
    setIsEditActionModalVisible(true);
    form.setFieldsValue(step);
  };

  const handleEditModalCancel = () => {
    setIsEditActionModalVisible(false);
  };

  const handleDelete = (sceneId: string, stepId: string) => {
    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === sceneId
        ? {...scene, actionList: scene.actionList.filter(step => step.actionId !== stepId)}
        : scene
    );
    updateSceneList(updatedSceneList);
  };

  const updateStepOk = (updatedStep: ActionInfo) => {

    let upScene: SceneInfo = sceneList.find(s => s.sceneId === activeTabKey) as SceneInfo;
    // 更新 upScene 中的 step
    const formValues = form.getFieldsValue()
    updatedStep = {
      ...updatedStep,
      ...formValues,
      timeout: formValues.timeout,
      retry: formValues.retry,
      actionTimeout: formValues.timeout,
      actionRetry: formValues.retry,
    }

    const updatedActionList = upScene.actionList.map(step => 
      step.actionId === updatedStep.actionId ? updatedStep : step
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
    setIsEditActionModalVisible(false);
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
      ...upScene,
      "sceneId": upScene.sceneId,
      "actionList": upScene.actionList.map(action => {
        action.actionId === currentStep.actionId ? currentStep : action
      }),      
    }
    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === upScene.sceneId ? updatedScene : scene
    );
    updateSceneList(updatedSceneList as SceneInfo[]);
    setActiveTabKey(updatedScene.sceneId);
    message.success('场景更新成功');
    setIsEditSceneModalVisible(false);    
  };

  const showConfigDrawer = (step: ActionInfo) => {
    console.log(step)
    setCurrentAction(step);
    setIsConfigDrawerVisible(true);
    form.resetFields();
    form.setFieldsValue({
      headers: step.actionDependencies.filter(dep => dep.refer.type === 'headers'),
      path: step.actionDependencies.filter(dep => dep.refer.type === 'path'),
      params: step.actionDependencies.filter(dep => dep.refer.type === 'params'),
      payload: step.actionDependencies.filter(dep => dep.refer.type === 'payload')
    });
    console.log(form.getFieldsValue())
  };

  const showExpectDrawer = (step:ActionInfo) => {
    setCurrentAction({ ...step });

    setIsExpectDrawerModalVisible(true);
  }
 
  const onFinish = async (values: any) => {
    const value = await form.getFieldsValue()
    console.log('Form values:', value);
    // 处理提交逻辑
  };

  const getSide = (url: string) => {
    const urlPatterns = {
      '管理侧': /(admin|demopsuadmin)/,
      '平台侧': /(psu|demopsu)/,
      '用户侧': /(psu|demopsu)/
    };
  
    for (const [side, pattern] of Object.entries(urlPatterns)) {
      if (pattern.test(url)) {
        form.setFieldsValue({
          side: side
        })
        return side;
      }
    }
  
    return '';
  }

  const saveDepend = () => {
    console.log(form.getFieldsValue());
    const updatedDependencies = form.getFieldsValue();
    const updatedActionDependencies = [
      ...currentStep.actionDependencies.filter(dep => !['headers', 'path', 'params', 'payload'].includes(dep.refer.type)),
      // ...updatedDependencies.headers || [],
      // ...updatedDependencies.path || [],
      // ...updatedDependencies.params || [],
      // ...updatedDependencies.payload || []
    ];
    const updatedStep = {
      ...currentStep,
      actionDependencies: updatedActionDependencies
    };


    const updatedSceneList = sceneList.map(scene => 
      scene.sceneId === activeTabKey
        ? {
            ...scene,
            actionList: scene.actionList.map(step => 
              step.actionId === currentStep.actionId ? currentStep : step
            )
          }
        : scene
    );

    updateSceneList(updatedSceneList);
    setIsConfigDrawerVisible(false)
  }

  const handleSideChange = (value: string) => {
    const environmentSwitch = form.getFieldValue('environmentSwitch');
    const domain = getDomain(value, environmentSwitch);
    form.setFieldsValue({
      actionDomain: domain
    });
  }

  const handleEnvironmentChange = (checked: boolean) => {
    const side = form.getFieldValue('side');
    const domain = getDomain(side, checked);
    form.setFieldsValue({
      actionDomain: domain
    });
  };


  // 渲染组件方法
  const editSceneModalForm = () => {
    return (
      <>
        <Row justify="center">
          <Form
            form={form}
            layout="vertical"
            initialValues={currentScene}
          >
            <Row gutter={20}>
              <FormItemCol span={8} label="场景名称" name="sceneName" rules={[{ required: true, message: '请输入场景名称!' }]}>
                <Input />
              </FormItemCol>

              <FormItemCol span={6} offset={0.5} label="重试次数" name="sceneRetries" rules={[{ required: true, message: '请输入重试次数!' }]}>
                <Input />
              </FormItemCol>

              <FormItemCol span={6} offset={0.5} label="超时时间" name="sceneTimeout" rules={[{ required: true, message: '请输入超时时间!' }]}>
                <Input />
              </FormItemCol>

            </Row>
            <Row gutter={20}>
              <FormItemCol span={20} label="场景描述" name="sceneDescription" rules={[{ required: true, message: '请输入场景描述!' }]}>
                <Input.TextArea rows={4} />
              </FormItemCol>

            </Row>
          </Form>
        </Row>
      </>
    )
  }

  const editActionModalForm = () => {
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          initialValues={currentStep}
        >
          <Row gutter={20}>
            <FormItemCol label="步骤名称" name="actionName">
              <Input />
            </FormItemCol>
            <FormItemCol label="超时时间" name="timeout" span={6} offset={0.5}>
              <InputNumber />
            </FormItemCol>
            <FormItemCol label="重试次数" name="retry" span={6} offset={0.5}>
              <InputNumber />
            </FormItemCol>
          </Row>
          <Row gutter={20}>
            <Col span={20}>
              <Row gutter={16}>
                <FormItemCol span={12} name="side" label="选择侧">
                  <Options
                    value={getSide(form.getFieldValue('actionDomain'))}
                    onChange={(value) => handleSideChange(value as string)}
                    data={sideOptions}
                  />
                </FormItemCol>
                <FormItemCol span={12} name="environmentSwitch" label="选择环境" valuePropName="checked">
                    <Switch
                      checkedChildren="生产"
                      unCheckedChildren="测试"
                      defaultChecked={getEnvironment(form.getFieldValue('actionDomain'))}
                      onChange={(checked) => handleEnvironmentChange(checked)}
                    />
                </FormItemCol>
              </Row>
              <Form.Item name="actionDomain" label="域名">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <FormItemCol span={20} name="description" label="步骤描述">
              <Input.TextArea disabled rows={4} />
            </FormItemCol>
          </Row>
        </Form>
      </>
    )
  }

  const renderDependencyForms = () => {
    const dependencyTypes = ['headers', 'path', 'params', 'payload'];
    const labels = {
      'headers': '请求头',
      'path': '请求路径', 
      'params': '请求参数',
      'payload': '请求体'
    };

    return dependencyTypes.map(type => ({
      key: type,
      label: labels[type as keyof typeof labels],
      children: (
        <Form 
          form={form} 
          onFinish={onFinish} 
          initialValues={{ [type]: currentStep?.actionDependencies?.filter(dep => dep.refer.type === type) }}
        >
          <Form.List name={type}>
            {(fields, { add, remove }) => dependForm2(fields, { add, remove })}
          </Form.List>
        </Form>
      ),
    }));
  };

  const dependForm2 = (fields: FormListFieldData[], { add, remove }: { add: () => void; remove: (index: number) => void }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} gutter={20}>
          <Col span={8}>
            <Form.Item {...restField} name={[name, 'refer', 'target']} label="目标字段">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item {...restField} name={[name, 'output', 'type']} label="输出字段类型">
              <Options data={dataTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={2} style={{ paddingLeft: '4px', paddingRight: '4px' }}>
            <Tooltip title="配置数据">
              <Button icon={<SettingOutlined />} style={{ padding: '0 8px', marginRight: '8px'}}
                      onClick={() => {
                        console.log(form.getFieldValue([dependSelectTab, name]))
                        const formValue = form.getFieldValue([dependSelectTab, name])
                        console.log(formValue.dataSource)
                        const depend: DependInfo = currentStep.actionDependencies.find(item => item.refer.target === formValue.refer.target) as DependInfo
                        
                        console.log(depend)
                        setCurrentActionDepend(depend)
                        setIsMultiDataSourceModalVisible(true);
                      }}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button icon={<DeleteOutlined />} onClick={() => remove(name)} type="link" danger />
            </Tooltip>
          </Col>
        </Row>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => {
          setCurrentAction({
            ...currentStep,
            actionDependencies: [
              ...currentStep.actionDependencies,
              {
                name: "",
                dependType: 'scene',
                dsType: '1',
                dependId: "",
                dataKey: "",
                actionKey: "",
                searchCond: []
              }
            ]
          })
          
        }} block>
          添加数据
        </Button>
      </Form.Item>

      <MultiDataSourceModal 
        visible={isMultiDataSourceModalVisible}
        actionDependency={currentActionDepend}
        sceneList={sceneList}
        currentAction={currentStep.actionId}
        updateFn={updateActionDepend}
        onCancel={() => setIsMultiDataSourceModalVisible(false)}
      />
    </>
  )


  useEffect(() => {
    if (currentStep) {
      setCurrentAction(currentStep)
    }
  }, [currentStep])

  useEffect(() => {
    if (sceneList.length > 0) {
      if (activeTabKey === '') {
        setActiveTabKey(sceneList[0].sceneId)
      }
    }
  }, [sceneList])

  useEffect(() => {
    const scene = sceneList.find(s => s.sceneId === activeTabKey);
    setCurrentScene(scene as SceneInfo);
  }, [activeTabKey]);



  return (
    <>
      <Card title="关联场景列表" style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Tabs 
              activeKey={activeTabKey} 
              onChange={handleTabChange} 
              items={renderSceneList(sceneList, showEditSceneModal, columns)}
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
                <Button type="primary" onClick={saveDepend}>
                  保存
                </Button>
              </div>
            }
          >
            <Tabs
              onChange={(key) => {
                setDependSelectTab(key)
              }}
              items={renderDependencyForms()}
            />
          </Drawer>
          <ActionExpect action={currentStep} setStep={setCurrentAction} setSceneList={updateCurrentStepExpect} visible={isExpectDrawerModalVisible} onClose={() => {setIsExpectDrawerModalVisible(false)}} />
          <Modal
            title="编辑Action"
            open={isEditModalVisible}
            onCancel={handleEditModalCancel}
            width={700}
            footer={[
              <Button key="cancel" onClick={handleEditModalCancel}>
                取消
              </Button>,
              <Button key="submit" type="primary" onClick={() => updateStepOk(currentStep)}>
                保存
              </Button>,
            ]}
          >
            {editActionModalForm()}
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
                {editSceneModalForm()}
            </Modal>
          )}
      </Card>

    </>
  );
};
export default SceneList;


// const dependForm = (fields: FormListFieldData[], { add, remove }: { add: () => void; remove: (index: number) => void }) => (
//   <>
//     {fields.map(({ key, name, ...restField }) => (
//       <Row key={key} gutter={20}>
//         <Col span={6}>
//           <Form.Item
//             {...restField}
//             name={[name, 'dsType']}
//             label="数据源类型"
//           >
//             <Select 
//               value={form.getFieldValue([dependSelectTab, name, 'dsType'])}
//               onChange={(value) => {
//                 const currentField = form.getFieldValue([dependSelectTab, name]);
//                 const updatedField = {
//                   ...currentField,
//                   dsType: value
//                 };
                
//                 // 清除其他类型特有的字段
//                 delete updatedField.relateStep;
//                 delete updatedField.cacheKey;
//                 delete updatedField.customValue;
//                 delete updatedField.eventKey;
                
//                 // 只更新当前记录
//                 form.setFieldsValue({
//                   [dependSelectTab]: {
//                     [name]: updatedField
//                   }
//                 });
//               }}
//             >
//               <Option value="scene">场景</Option>
//               <Option value="basic">基础数据</Option>
//               <Option value="custom">自定义数据</Option>
//               <Option value="event">基于事件生成</Option>
//             </Select>
//           </Form.Item>
//         </Col>
//         <Col span={8}>
//           {(() => {
//             const dsType = form.getFieldValue([dependSelectTab, name, 'dsType']);
//             switch (dsType) {
//               case 'scene':
//                 return (
//                   <Form.Item
//                     {...restField}
//                     name={[name, 'relateStep']}
//                     label="场景索引"
//                   >
//                      <Search
//                         readOnly
//                         onSearch={() => {
//                           setIsSelectActionModalVisible(true)
//                           setSceneIndex(name)
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       />

//                   </Form.Item>
//                 );
//               case 'basic':
//                 return (
//                   <Form.Item
//                     {...restField}
//                     name={[name, 'cacheKey']}
//                     label="缓存键"
//                   >
//                       <Search
//                         readOnly
//                         onSearch={() => {
//                           // setIsSelectActionModalVisible(true)
//                           // setSceneIndex(name)
//                           setIsCacheModalVisible(true)
//                           setCacheIndex(name)
//                         }}
//                         style={{ cursor: 'pointer' }}
//                       />  
//                   </Form.Item>
//                 );
//               case 'custom':
//                 return (
//                   <Form.Item
//                     {...restField}
//                     name={[name, 'customValue']}
//                     label="自定义值"
//                   >
//                     <Input />
//                   </Form.Item>
//                 );
//               case 'event':
//                 return (
//                   <Form.Item
//                     {...restField}
//                     name={[name, 'eventKey']}
//                     label="事件键"
//                   >
//                     <Input />
//                   </Form.Item>
//                 );
//               default:
//                 return null;
//             }
//           })()}
//         </Col>
//         <Col span={8}>
//           <Form.Item
//             {...restField}
//             name={[name, 'targetField']}
//             label="目标字段"
//           >
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={2}>
//           <Button onClick={() => remove(name)} type="link" danger>
//             删除
//           </Button>
//         </Col>
//       </Row>
//     ))}
//     <Form.Item>
//       <Button type="dashed" onClick={() => {
//         add()
//         form.setFieldsValue({
//           [dependSelectTab]: {
//             [fields.length]: {
//               dsType: 'scene',
//               dependType: dependSelectTab,
//               cacheKey: "",
//               relateStep: ""
//             }
//           }
//         })
//       }} block>
//         添加数据
//       </Button>
//     </Form.Item>
//     <Modal
//       title="选择关联Action"
//       open={isSelectActionModalVisible}
//       onOk={() => {
//         const formValues = form.getFieldsValue();
//         const sceneId = formValues.selectedSceneId
//         const selectedActionId = formValues.selectedActionId
//         const referenceField = formValues.referenceField
//         form.setFieldValue([dependSelectTab, sceneIndex, 'relateStep'], `${sceneId}.${selectedActionId}/${referenceField}`);
//         setIsSelectActionModalVisible(false);
//         console.log(form.getFieldsValue())
//       }}
//       onCancel={() => setIsSelectActionModalVisible(false)}
//     >
//       <>
//         <Form form={form} layout="vertical">
//           <Form.Item name="selectedSceneId" label="选择场景">
//             <Select
//               placeholder="请选择场景"
//               style={{ width: '100%', marginBottom: '10px' }}
//               onChange={(value) => {
//                 const selectedScene = sceneList.find(scene => scene.sceneId === value);
//                 setSelectScene(selectScene);
//                 form.setFieldsValue({ selectedActionId: undefined });
//               }}
//             >
//               {sceneList.map(scene => (
//                 <Option key={scene.sceneId} value={scene.sceneId}>{scene.sceneName}</Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="selectedActionId" label="选择Action">
//             <Select
//               placeholder="请选择Action"
//               style={{ width: '100%', marginBottom: '10px' }}
//               disabled={!selectScene}
//             >
//               {selectScene?.actionList
//                 ?.filter((action: any) => {
//                   if (form.getFieldValue('selectedSceneId') === activeTabKey) {
//                     const currentActionIndex = currentScene.actionList.findIndex(
//                       (a: any) => a.actionId === currentStep.actionId
//                     );
//                     return currentScene.actionList.indexOf(action) < currentActionIndex;
//                   }
//                   return true;
//                 })
//                 .map((action: any) => (
//                   <Option key={action.actionId} value={action.actionId}>{action.actionName}</Option>
//                 ))
//               }
//             </Select>
//           </Form.Item>
//           <Form.Item name="referenceField" label="引用字段">
//             <Input placeholder="请输入引用字段" />
//           </Form.Item>
//         </Form>
//       </>
//     </Modal>

//     <Modal
//       title="选择基础数据"
//       open={isCacheModalVisible}
//       onOk={() => {
//         const formValues = form.getFieldsValue();
//         const cacheKey = formValues.cacheKey
//         const cacheFiled = formValues.cacheFiled
//         form.setFieldValue([dependSelectTab, cacheIndex, 'cacheKey'], `${cacheKey}/${cacheFiled}`);
//         setIsCacheModalVisible(false);
//       }}
//       onCancel={() => setIsCacheModalVisible(false)}
//     >
//       <>
//         <Form form={form} layout="vertical">
//           <Form.Item name="cacheKey">
//             <Input placeholder="请输入基础数据键" />
//           </Form.Item>
//           <Form.Item name="cacheFiled">
//             <Input placeholder="请输入字段名" />
//           </Form.Item>
//         </Form>
//       </>
//     </Modal>
//   </>
// )


{/* <Col span={8}>
              <Form.Item name="actionName" label="步骤名称">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6} offset={0.5}>
              <Form.Item name="timeout" label="超时时间">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={6} offset={0.5}>
              <Form.Item name="retry" label="重试次数">
                <InputNumber />
              </Form.Item>
            </Col> */}

{/* <Col span={8}>
  <Form.Item name="actionName" label="步骤名称">
    <Input />
  </Form.Item>
</Col>
<Col span={6} offset={0.5}>
  <Form.Item name="timeout" label="超时时间">
    <InputNumber />
  </Form.Item>
</Col>
<Col span={6} offset={0.5}>
  <Form.Item name="retry" label="重试次数">
    <InputNumber />
  </Form.Item>
</Col> */}


{/* <Col span={12}>
  <Form.Item name="side" label="选择侧">
    <Options
      value={getSide(form.getFieldValue('actionDomain'))}
      onChange={(value) => handleSideChange(value as string)}
      data={sideOptions}
    />
  </Form.Item>
</Col> */}

{/* <Col span={12}>
  <Form.Item name="environmentSwitch" label="选择环境" valuePropName="checked">
    <Switch
      checkedChildren="生产"
      unCheckedChildren="测试"
      defaultChecked={getEnvironment(form.getFieldValue('actionDomain'))}
      onChange={(checked) => handleEnvironmentChange(checked)}
    />
  </Form.Item>
</Col> */}


{/* <Col span={20}>
<Form.Item name="description" label="步骤描述">
  <Input.TextArea disabled rows={4} />
</Form.Item>
</Col> */}