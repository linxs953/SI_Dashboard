


import React, { useEffect, useState } from 'react';
import { Drawer, List, Typography, Button, Tabs, Form, Input, Select, Modal, message, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'; 
import Options from 'src/components/basic/options';
import FormItemCol from 'src/components/basic/formItemCol';
const { Text } = Typography;

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
    useEffect(() => {
    }, [action]);


    
    const fieldNameOnchange = (value:any, index:number) => {
        const newName = value.target.value;
        setStep({
            ...action,
            actionExpect: {
                ...action.actionExpect,
            api: action.actionExpect.api.map((apiItem, apiIndex) => {
                if (apiIndex === index) {
                    return { ...apiItem, data: { ...apiItem.data, name: newName } };
                }
                return apiItem;
                })
            }
        });
    }

    const desireOnchange = (value:any, index:number) => {
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
    }

    const operationOnchange = (value:any, index:number) => {
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
    }

    const typeOnchange = (value:any, index:number) => {
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
    }

    const deleteOnclick = (index:any) => {
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
    }

    const renderFieldAssertion = () => (
        <List
            dataSource={action.actionExpect.api}
            renderItem={(item, index) => (
            <List.Item>
                <Form layout="inline">
                    <Row gutter={[46, 40]}>
                        <FormItemCol label="字段名" span={6} wrapperCol={{ span: 20 }} labelCol={{ span: 12 }} >
                            <Input value={item.data?.name} onChange={(e) => fieldNameOnchange(e, index)} />
                        </FormItemCol>
                        <FormItemCol label="预期值" span={6} wrapperCol={{ span: 20 }} labelCol={{ span: 13 }} >
                            <Input style={{ width: '6em' }} value={item.data?.desire} onChange={(e) => desireOnchange(e, index)}/>
                        </FormItemCol>
                        <FormItemCol label="比较" span={5} wrapperCol={{ span: 10 }} labelCol={{ span: 12 }} >
                            <Options style={{ width: '6em' }} value={item.data?.operation} data={compareOptions} onChange={(e) => operationOnchange(e, index)} 
                            />
                        </FormItemCol>
                        <FormItemCol label="数据类型" span={5} wrapperCol={{ span: 20 }} labelCol={{ span: 18 }} >
                            <Options style={{ width: '6em' }} value={item.data?.type} data={dataTypeOptions}
                                    onChange={(e) => typeOnchange(e, index)} 
                            />
                        </FormItemCol>
                        <FormItemCol label="" span={2} wrapperCol={{ span: 10 }} labelCol={{ span: 10 }} style={{ marginLeft: 'auto' }}>
                            <Button 
                                type="link" 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => {
                                    deleteOnclick(index)
                                }}
                            >
                            </Button>
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
                    items={tabItems}
                />
            </Drawer>
        </>
  );
};

export default ActionExpect;
