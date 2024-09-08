


import React, { useEffect, useState } from 'react';
import { Drawer, List, Typography, Button, Tabs, Form, Input, Select, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; 
const { Text } = Typography;

interface ExpectProps {
  action: ActionInfo;
  setSceneList: (updateSceneList: ActionInfo) => void;
  setStep: (step:ActionInfo) => void
  visible: boolean;
  onClose: () => void;
}



const ActionExpect: React.FC<ExpectProps> = ({ action,setSceneList, setStep,visible, onClose }) => {
    useEffect(() => {
    }, [action]);


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
                <Button key="cancel" onClick={onClose} style={{ marginRight: '16px' }}>
                  取消
                </Button>
                <Button key="save" type="primary" onClick={() => {
                  setSceneList(action)
                  message.success("保存成功")
                  onClose();
                }}>
                  保存
                </Button>
              </div>
            }
            >
                <Tabs 
                    defaultActiveKey="1"
                    items={[
                    {
                        key: '1',
                        label: '字段断言',
                        children: (
                        <List
                            dataSource={action.actionExpect.api}
                            renderItem={(item, index) => (
                            <List.Item>
                                <Form layout="inline">
                                <Form.Item label="字段名" >
                                    <Input value={item.data?.name} />
                                </Form.Item>
                                <Form.Item label="预期值">
                                    <Input 
                                        style={{ width: '12em' }}
                                        value={item.data?.desire} onChange={(value:any) => {
                                    setStep({
                                        ...action,
                                        actionExpect: {
                                            ...action.actionExpect,
                                            api: action.actionExpect.api.map((apiItem, apiIndex) => {
                                                if (apiIndex === index) {
                                                    return {...apiItem, data: {...apiItem.data, desire: value.target.value}}
                                                }
                                                return apiItem;
                                            })
                                        }
                                    });
                                        
                                    }}/>
                                </Form.Item>
                                <Form.Item label="比较方式">
                                    <Select
                                        style={{ width: '7em' }}
                                        value={item.data?.operation}
                                        onChange={(value) => {
                                        setStep({
                                            ...action,
                                            actionExpect: {
                                                ...action.actionExpect,
                                                api: action.actionExpect.api.map((apiItem, apiIndex) => {
                                                    if (apiIndex === index) {
                                                        return {...apiItem, data: {...apiItem.data, operation: value}}
                                                    }
                                                    return apiItem;
                                                })
                                            }
                                        });
                                        }}
                                    >
                                        <Select.Option value="equal">等于</Select.Option>
                                        <Select.Option value="notEqual">不等于</Select.Option>
                                        <Select.Option value="contain">包含</Select.Option>
                                        <Select.Option value="notContain">不包含</Select.Option>
                                        <Select.Option value="gt">大于</Select.Option>
                                        <Select.Option value="lt">小于</Select.Option>
                                        <Select.Option value="gte">大于等于</Select.Option>
                                        <Select.Option value="lte">小于等于</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="数据类型">
                                    <Select
                                        value={item.data?.type}
                                        style={{ width: '6em' }}
                                        onChange={(value) => {
                                            setStep({
                                                ...action,
                                                actionExpect: {
                                                    ...action.actionExpect,
                                                    api: action.actionExpect.api.map((apiItem, apiIndex) => {
                                                        if (apiIndex === index) {
                                                            return {...apiItem, data: {...apiItem.data, type: value}}
                                                        }
                                                        return apiItem;
                                                    })
                                                }
                                            });
                                        }}
                                    >
                                        <Select.Option value="string">字符串</Select.Option>
                                        <Select.Option value="integer">数字</Select.Option>
                                        <Select.Option value="boolean">布尔值</Select.Option>
                                        <Select.Option value="object">对象</Select.Option>
                                        <Select.Option value="array">数组</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button 
                                        type="link" 
                                        danger 
                                        icon={<DeleteOutlined />} 
                                        onClick={() => {
                                            let newExpectApi = action.actionExpect.api.filter((apiItem, apiIndex) => {
                                                return apiIndex !== index;
                                            })
                                            setStep({
                                                ...action,
                                                actionExpect: {
                                                    ...action.actionExpect,
                                                    api: newExpectApi
                                                }
                                            })
                                            // setaction({
                                            //     ...action,
                                            //     api: newExpectApi
                                            // })
                                        }}
                                    >
                                        
                                    </Button>
                                </Form.Item>
                                </Form>
                            </List.Item>
                            )}
                        />
                        ),
                    },
                    ]}
                />
            </Drawer>

        </>
  );
};

export default ActionExpect;
