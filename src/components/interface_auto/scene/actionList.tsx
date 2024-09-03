import { Card, Tabs, Button, Table, Drawer, Modal, Row, Col, Input, InputNumber, Form, Popconfirm, Tooltip, message, FormListFieldData, Select } from "antd";
import React, { useState } from "react";
import sceneList from "../task/sceneList";
import { useForm } from "antd/es/form/Form";

const {Option} = Select

const ActionList: React.FC<{ actionList: ActionInfo[], updateActionList: (updatedActionList: ActionInfo[]) => void }> = ({ actionList, updateActionList }) => {
    const [form ] = useForm()
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [isConfigDrawerVisible, setIsConfigDrawerVisible] = React.useState(false);
    const [dependSelectTab, setDependSelectTab] = useState('headers');
    const [currentStep, setCurrentStep] = useState<ActionInfo>({
        actionId: '',
        actionName: '',
        actionDescription: '',
        actionTimeout: 0,
        actionRetry: 0,
        actionMethod: '',
        actionRoute: '',
        actionDependencies: [],
        relateId: '',
        actionExpect: '',
        actionOutput: '',
        actionSearchKey: '',
        actionDomain: '',
        actionEnvironment: '',
    });

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
    };

    const updateStepOk = (step:ActionInfo) => {
        let fields = form.getFieldsValue();
        if (!fields.actionDesc) {
            delete fields.actionDesc;
        }
        const updateStep:ActionInfo = {
            ...step,
            ...fields
        }
        updateActionList(actionList.map((action) => action.actionId === step.actionId ? updateStep : action))
        handleEditModalCancel()
        console.log(updateStep)
        message.success("更新流程成功")
    }

    const showEditModal = (step:ActionInfo) => {
        setCurrentStep(step);
        setIsEditModalVisible(true);
    }

    const handleDelete = (actionId:string) => {
        message.error(`${actionId}`)
        const updatedAc = actionList.filter(ac => ac.actionId != actionId)
        updateActionList(updatedAc)
    }

    const handleConfigDrawerClose = () => {
        setIsConfigDrawerVisible(false);
    };

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const columns = [
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
          width: 250, // 指定操作列的宽度为250像素
          render: (_: any, record: ActionInfo) => (
              <>
                  <Tooltip title="编辑">
                      <Button type="link" onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
                          编辑
                      </Button>
                  </Tooltip>
                  <Popconfirm
                      title="确定要删除这个步骤吗？"
                      onConfirm={() => handleDelete(record.actionId)}
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
                      const currentField = form.getFieldValue([dependSelectTab, name]);
                      const updatedField = {
                        ...currentField,
                        dsType: value
                      };
                      
                      // 清除其他类型特有的字段
                      delete updatedField.relateStep;
                      delete updatedField.cacheKey;
                      delete updatedField.customValue;
                      delete updatedField.eventKey;
                      
                      // 只更新当前记录
                      form.setFieldsValue({
                        [dependSelectTab]: {
                          [name]: updatedField
                        }
                      });
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

    return (
        <>
        <Card title="关联的流程节点列表" style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Table
                columns={columns.map((column, index) => ({
                    ...column,
                    title: <div key={`column-${index}`} style={{ textAlign: 'center' }}>{column.title}</div>
                }))}
                dataSource={actionList.map((step,index) => ({ ...step, key: `${step.actionId}-${index}` }))}
                pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条数据`,
                    position: ['bottomLeft']
                }}
                bordered
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
                    const updatedDependencies = form.getFieldsValue();
                    const updatedActionDependencies = [
                      ...currentStep.actionDependencies.filter(dep => !['headers', 'path', 'params', 'payload'].includes(dep.dependType)),
                      ...updatedDependencies.headers || [],
                      ...updatedDependencies.path || [],
                      ...updatedDependencies.params || [],
                      ...updatedDependencies.payload || []
                    ];
  
                    const updatedStep = {
                      ...currentStep,
                      actionDependencies: updatedActionDependencies
                    };
  
                    console.log(updatedStep)
  
                    setIsConfigDrawerVisible(false)
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
                      <Form form={form} onFinish={onFinish} initialValues={{ headers: currentStep?.actionDependencies?.filter(dep => dep.dependType === 'headers') }}>
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
                      <Form form={form} onFinish={onFinish} initialValues={{ path: currentStep?.actionDependencies?.filter(dep => dep.dependType === 'path') }}>
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
                      <Form form={form} onFinish={onFinish} initialValues={{ params: currentStep?.actionDependencies?.filter(dep => dep.dependType === 'params') }}>
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
                      <Form form={form} onFinish={onFinish} initialValues={{ payload: currentStep?.actionDependencies?.filter(dep => dep.dependType === 'payload') }}>
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
              title="编辑节点"
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
              <Form
                form={form}
                layout="vertical"
                initialValues={currentStep}
              >
                 <Row gutter={20}>
                 <Col span={8}>
                  <Form.Item name="actionName" label="节点名称">
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
                 </Col>
                 </Row>
                <Row gutter={20}>
                  <Col span={20}>
                  <Form.Item name="actionDescription" label="节点描述">
                    <Input.TextArea value={"无描述"} disabled rows={4} />
                  </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
        </Card>
      </>
    )
}

export default ActionList;