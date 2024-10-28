import React, { useEffect, useState } from 'react';
import { Drawer, List, Button, Tabs, Form, Input, message, Row, Tooltip, Space } from 'antd';
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons'; 
import Options from 'src/components/basic/options';
import FormItemCol from 'src/components/basic/formItemCol';
import MultiDataSourceModal from '../task/multiDataSourceModal';

interface ExpectProps {
  action: ActionInfo;
  setSceneList: (updateSceneList: ActionInfo) => void;
  setStep: (step:ActionInfo) => void
  visible: boolean;
  onClose: () => void;
}

const compareOptions = [
  {value: 'equal', label: '等于'},
  {value: 'notEqual', label: '不等于'},
  {value: 'contain', label: '包含'},
  {value: 'notContain', label: '不包含'},
  {value: 'gt', label: '大于'},
  {value: 'lt', label: '小于'},
  {value: 'gte', label: '大于等于'},
  {value: 'lte', label: '小于等于'}
]

const dataTypeOptions = [
  {value: 'string', label: '字符串'},
  {value: 'integer', label: '数字'},
  {value: 'boolean', label: '布尔值'},
  {value: 'object', label: '对象'},
  {value: 'array', label: '数组'}
]




const ActionExpect: React.FC<ExpectProps> = ({ action,setSceneList, setStep,visible, onClose }) => {

    const [internalAction, setInternalAction] = useState<ActionInfo>(action);
    const [multiDataSourceModalVisible, setMultiDataSourceModalVisible] = useState(false);
    const [desireSetting, setDesireSetting] = useState<DesireSetting>({
        output: {
            type: '',
            value: null
        },
        dataSource: [],
        dsSpec: [],
        extra: '',
        isMultiDs: false,
        mode: '',
        referTarget: '',
        referType: ''
    });

    useEffect(() => {
        setInternalAction(action)
    }, [action]);



    
    const fieldNameOnchange = (value:any, index:number) => {
        const newName = value.target.value;
        setInternalAction({
            ...action,
            actionExpect: {
                ...internalAction.actionExpect,
                api: internalAction.actionExpect.api.map((apiItem:any, apiIndex:number) => {
                    if (apiIndex === index) {
                        console.log(index, apiIndex)
                        const newApiItem = { ...apiItem, data: { ...apiItem.data, name: newName } };
                        console.log(newApiItem)
                        return { ...apiItem, data: { ...apiItem.data, name: newName } };
                    }
                    return apiItem;
                })
            }
        });
    }

    const desireOnchange = (value:any, index:number) => {
        setInternalAction({
            ...internalAction,
            actionExpect: {
                ...internalAction.actionExpect,
                api: internalAction.actionExpect.api.map((apiItem, apiIndex) => {
                    if (apiIndex === index) {   
                        return {...apiItem, data: {...apiItem.data, desire: value.target.value}}
                    }
                    return apiItem;
                })
            }
        });
    }

    const operationOnchange = (value:any, index:number) => {
        setInternalAction({
            ...internalAction,
            actionExpect: {
                ...internalAction.actionExpect,
                api: internalAction.actionExpect.api.map((apiItem, apiIndex) => {
                    if (apiIndex === index) {
                        return {...apiItem, data: {...apiItem.data, operation: value}}
                    }
                    return apiItem;
                })
            }
        });
    }

    const typeOnchange = (value:any, index:number) => {
        setInternalAction({
            ...internalAction,
            actionExpect: {
                ...internalAction.actionExpect,
                api: internalAction.actionExpect.api.map((apiItem, apiIndex) => {
                    if (apiIndex === index) {
                        return {...apiItem, data: {...apiItem.data, type: value}}
                    }
                    return apiItem;
                })
            }
        });
    }

    const deleteOnclick = (index:any) => {
        let newExpectApi = internalAction.actionExpect.api.filter((apiItem, apiIndex) => {
            return apiIndex !== index;
        })
        setInternalAction({
            ...internalAction,
            actionExpect: {
                ...internalAction.actionExpect,
                api: newExpectApi
            }
        })
    }

    const renderFieldAssertion = () => (
        <List
            dataSource={internalAction.actionExpect.api}
            renderItem={(item:any, index:number) => (
                <List.Item>
                    <Form layout="horizontal" style={{ width: '100%' }}>
                        <Row gutter={[8, 16]} align="middle" style={{ width: '100%' }}>
                            <FormItemCol label="字段名" span={7} wrapperCol={{ span: 17 }} labelCol={{ span: 7 }} >
                                <Input width={'100%'} value={item.data?.name} onChange={(e) => fieldNameOnchange(e, index)} />
                            </FormItemCol>
                            <FormItemCol label="数据类型" span={6} wrapperCol={{ span: 17 }} labelCol={{ span: 12 }} >
                                <Options style={{ width: '100%' }} value={item.data?.type} data={dataTypeOptions}
                                        onChange={(e) => typeOnchange(e, index)} 
                                />
                            </FormItemCol>
                            <FormItemCol label="比较" span={5}  labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} >
                                <Options style={{ width: '100%' }} value={item.data?.operation} data={compareOptions} onChange={(e) => operationOnchange(e, index)} />
                            </FormItemCol>
                            <FormItemCol label="预期值" span={4} wrapperCol={{ span: 12}} labelCol={{ span: 12 }}>
                                <Tooltip title="配置数据">
                                    <Button 
                                        icon={<SettingOutlined />} 
                                        onClick={() => {

                                            console.log(action.actionExpect)
                                            setDesireSetting(action.actionExpect.api[index].data.desireSetting)
                                            // 开启多数据源弹窗
                                            setMultiDataSourceModalVisible(true)

                                        }}
                                    />
                                </Tooltip>
                            </FormItemCol>
                            <FormItemCol span={1} label='' >
                                <Button type="link" danger icon={<DeleteOutlined />} onClick={() => {deleteOnclick(index)}} />
                            </FormItemCol>
                        </Row>
                    </Form>
                </List.Item>
            )}
        />
    );

    const tabItems = [
        {
            key: '1',
            label: '字段断言',
            children: renderFieldAssertion()
        },
    ];

    const saveExpect = () => {
        setStep(internalAction)
        setSceneList(internalAction)
        message.success("保存成功")
        onClose();
    }

    const updateDesireSetting = (desire:any) => {
        const newDesireSetting = {
            ...desire,
            output: {
                type: desire?.output?.type || "",
                value: desire?.output?.value || ""
            },
            dataSource: desire?.dataSource || [],
            dsSpec: desire?.dsSpec || [],
            extra: desire?.extra || "",
            isMultiDs: desire?.isMultiDs !== undefined ? desire?.isMultiDs : false,
            mode: desire?.mode || "",
            referTarget: desire?.referTarget || "",
            referType: desire?.referType || ""
        }
        console.log(newDesireSetting)
        setInternalAction({
            ...internalAction,
            actionExpect: {
                ...internalAction.actionExpect,
                api: internalAction.actionExpect.api.map((apiItem:any) => {
                    if (apiItem.data.name === newDesireSetting.referTarget) {
                        return {
                            ...apiItem,
                            data: {
                                ...apiItem.data,
                                desireSetting: newDesireSetting
                            }
                        }
                    }
                    return apiItem;
                })
            }
        });
        setMultiDataSourceModalVisible(false)
    }

    return (
        <>
            <Drawer
            title="期望结果"
            placement="right"
            onClose={onClose}
            open={visible}
            width={"41%"}
            footer={
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button key="cancel" onClick={onClose} style={{ marginRight: '16px' }}>取消</Button>
                <Button key="save" type="primary" onClick={saveExpect}>保存</Button>
              </div>
            }
            >
                <Tabs defaultActiveKey="1" items={tabItems} />
            </Drawer>
            <MultiDataSourceModal 
                visible={multiDataSourceModalVisible}
                customTitle={`期望结果配置 [${desireSetting.referTarget}]`}
                actionDependency={desireSetting as any}
                sceneList={[]}
                currentAction={action.actionId}
                updateFn={updateDesireSetting}
                onCancel={() => {
                    setMultiDataSourceModalVisible(false)
                }}
            />
        </>
  );
};

export default ActionExpect;
