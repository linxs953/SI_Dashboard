import { Card, Tabs, Button, Table, Drawer, Modal, Row, Col, Input, InputNumber, Form, Popconfirm, Tooltip, message, FormListFieldData, Select } from "antd";
import React, { useState } from "react";
import sceneList from "../task/sceneList";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import FormItemCol from "src/components/basic/formItemCol";
import { ColumnType } from "antd/es/table";
import DependForm from "../drawerDependForm";

const ActionList: React.FC<{ 
  actionList: ActionInfo[], 
  updateActionList: (updatedActionList: ActionInfo[]) => void 
}> = ({ actionList, updateActionList }) => {
    const [form] = useForm();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isConfigDrawerVisible, setIsConfigDrawerVisible] = useState(false);
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
        message.success("更新流程成功")
    }

    const showEditModal = (step:ActionInfo) => {
        setCurrentStep({
            ...step,
            actionId: step.actionId,
            actionName: step.actionName,
            actionDescription: step.actionDescription,
            actionTimeout: step.actionTimeout,
            actionRetry: step.actionRetry,
            actionMethod: step.actionMethod,
            actionRoute: step.actionRoute,
            actionDependencies: step.actionDependencies,
            relateId: step.relateId,
            actionExpect: step.actionExpect,
            actionOutput: step.actionOutput,
            actionSearchKey: step.actionSearchKey,
            actionDomain: step.actionDomain,
            actionEnvironment: step.actionEnvironment,
        });
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


    const handleConfigDrawerOpen = (step: ActionInfo) => {
        setCurrentStep(step);
        form.resetFields();
        form.setFieldsValue({
          headers: step.actionDependencies.filter(dep => dep.dependType === 'headers'),
          path: step.actionDependencies.filter(dep => dep.dependType  === 'path'),
          params: step.actionDependencies.filter(dep => dep.dependType  === 'params'),
          payload: step.actionDependencies.filter(dep => dep.dependType  === 'payload')
        });
        setIsConfigDrawerVisible(true);
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
          dataIndex: 'actionRoute',
          key: 'stepRoute',
          width: 200, 
          align: 'center',
        },
        {
          title: '重试次数',
          dataIndex: 'actionRetry',
          key: 'stepRetry',
          width: 200, 
          align: 'center',
        },
        {
          title: '超时时间',
          dataIndex: 'actionTimeout',
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
                  <Tooltip title="配置依赖">
                      <Button type="link" onClick={() => handleConfigDrawerOpen(record) } style={{ marginRight: 8 }}>
                          配置依赖
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

    const getFormList = (dependType:string) => {
      const initialValues = currentStep?.actionDependencies?.filter(dep => dep.dependType === dependType)
      return (
        <Form form={form} onFinish={onFinish} initialValues={{ headers: initialValues }}>
          <Form.List name={dependType}>
              {(fields, { add, remove }) => (
                  <DependForm fields={fields} add={add} remove={remove} form={form} dependSelectTab={dependSelectTab} />
              )}
          </Form.List>
        </Form>
      )
    }

    const dependTabs = ['headers', 'path', 'params', 'payload'].map((tab) => ({
        key: tab,
        label: tab.toUpperCase(),
        children: getFormList(tab)
    }))

    const saveDependDrawer = () => {
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
      // 更新 actionList
      const updatedActionList = actionList.map(action => 
        action.actionId === updatedStep.actionId ? updatedStep : action
      );
      updateActionList(updatedActionList);
      message.success("依赖配置已更新");
      setIsConfigDrawerVisible(false)
    }


    useEffect(() => {
        if (currentStep) {
            setCurrentStep(currentStep)
        }
    }, [currentStep])

    useEffect(() => {
    }, [actionList])

    return (
        <>
        <Card title="关联的流程节点列表" style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Table
                columns={columns.map((column, index) => ({
                    ...column,
                    title: <div key={`column-${index}`} style={{ textAlign: 'center' }}>{column.title}</div>
                })) as ColumnType<ActionInfo>[]}
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
                  <Button type="primary" onClick={saveDependDrawer}>保存</Button>
                </div>
              }
            >
              <Tabs
                onChange={(key) => {
                  setDependSelectTab(key)
                }}
                items={dependTabs}
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
                    <FormItemCol label="节点名称" name="actionName" span={8}>
                        <Input />
                    </FormItemCol>
                    <FormItemCol label="超时时间" name="timeout" span={6} offset={0.5}>
                      <InputNumber />
                    </FormItemCol>
                    <FormItemCol span={6} offset={0.5} name="retry" label="重试次数">
                      <InputNumber />
                    </FormItemCol>
                </Row>
                <Row gutter={20}>
                  <FormItemCol span={20} name="actionDescription" label="节点描述" >
                    <Input.TextArea value={"无描述"} disabled rows={4} />
                  </FormItemCol>
                </Row>
              </Form>
            </Modal>
        </Card>
      </>
    )
}

export default ActionList;