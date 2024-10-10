


import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Form, Input, Select, Button, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
const { Option } = Select;
import MonacoEditor from 'react-monaco-editor';


interface MultiDataSourceModalProps {
  visible: boolean;
  actionDependency:DependInfo
  sceneList:SceneInfo[]
  currentAction:string
  updateFn: (action: DependInfo) => void;
  onCancel: () => void;
}

const MultiDataSourceModal: React.FC<MultiDataSourceModalProps> = ({ visible, actionDependency, sceneList, currentAction, updateFn, onCancel }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('scene');
  const [dataSource, setDataSource] = useState<DependInfo>(actionDependency)
  const [currentActionId, setCurrentActionId] = useState<string>(currentAction)

  const handleOk = () => {
    updateFn(dataSource)
  };

  const getDsTypeName = (dsType:string) => {
    switch (dsType) {
      case '1':
        return '场景';
      case '2':
        return '基础数据';
      case '3':
        return '自定义数据';
      case '4':
        return '基于事件生成';
      default:
        return '未知数据源类型';
    }
  }

  const getDependType = (dsType:string) => {
    switch (dsType) {
      case '1':
        return 'scene';
      case '2':
        return 'cache';
      case '3':
        return 'custom';
      case '4':
        return 'event';
      default:
        return 'unknown';
    }
  }


  const getActionMap = () => {
    const actionMap:any = {}
    sceneList.forEach((scene:any) => {
      scene.actionList.forEach((action:any) => {
        if (action.actionId === currentActionId) {
          console.log(currentActionId)
          const actionIdx = scene.actionList.findIndex((action:any) => action.actionId === currentActionId)
          console.log(actionIdx)
          actionMap[scene.sceneId] = scene.actionList.slice(0, actionIdx).map((action:any) => ({
            actionId: action.actionId,
            actionName: action.actionName
          }))
          return
        }
      })
      if (!actionMap[scene.sceneId]) { 
        actionMap[scene.sceneId] = scene.actionList.map((action:any) => ({
          actionId: action.actionId,
          actionName: action.actionName
        }))
      }
    })
    return actionMap
  }

  useEffect(() => {
    setDataSource(actionDependency)
  }, [actionDependency])

  useEffect(() => {
    setCurrentActionId(currentAction)
  }, [currentAction])

  useEffect(() => {
    console.log(dataSource)
  }, [dataSource])

  

  return (
    <Modal
      title="多数据源配置"
      open={visible}
      width={1300}
      okText="保存"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
      style={{ minHeight: '300px', overflowY: 'auto' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="数据源依赖" key="scene">
          <Form form={form} layout="vertical">
            <Form.List name="sceneData">
              {(fields, { add, remove }) => (
                <>
                  {dataSource.dataSource.map((item:DataSource, index) => (
                    <Form.Item key={index} required={false}>
                      <Form.Item validateTrigger={['onChange', 'onBlur']} noStyle>
                        <Select 
                          style={{ width: '22%', marginRight: '10px' }} 
                          placeholder="选择数据源类型"
                          value={getDsTypeName(item.dsType)}
                          onChange={(value) => {
                            const newDataSource = dataSource.dataSource.map((item:DataSource, dsIdx:number) => {
                              if (dsIdx === index) {
                                return {
                                  ...item,
                                  dsType: value,
                                  dependType: getDependType(value),
                                  actionKey: "",
                                  dataKey: "",
                                }
                              }
                              return item
                            })
                            setDataSource({
                              ...dataSource,
                              dataSource: newDataSource,
                            })
                          }}
                        >
                          <Option value="1">场景</Option>
                          <Option value="2">基础数据</Option>
                          <Option value="3">自定义数据</Option>
                          <Option value="4">基于事件生成</Option>
                        </Select>
                        {item.dsType === '1' && (
                          <>
                            <Select 
                              style={{ width: '22%', marginRight: '10px' }} 
                              placeholder="选择场景"
                              defaultValue={item.actionKey.split(".")[0]}
                              onChange={(value) => {
                                const newDataSource = dataSource.dataSource.map((ds:DataSource, dsIdx:number) => {
                                  if (dsIdx === index) {
                                    return {
                                      ...ds,
                                      actionKey: value
                                    }
                                  }
                                  return ds
                                })
                                setDataSource({
                                  ...dataSource,
                                  dataSource: newDataSource,
                                })
                              }}
                            >
                              {sceneList.map((scene) => (
                                <Option key={scene.sceneId} value={scene.sceneId}>{scene.sceneName}</Option>
                              ))}
                            </Select>
                            <Select
                              style={{ width: '22%', marginRight: '10px' }}
                              placeholder="选择Action"
                              defaultValue={item.actionKey.split(".")[1]}
                              onChange={(value) => {
                                const newDataSource = dataSource.dataSource.map((ds:DataSource, dsIdx:number) => {
                                  if (dsIdx === index) {
                                    return {
                                      ...ds,
                                      actionKey: `${ds.actionKey}.${value}`
                                    }
                                  }
                                  return ds
                                })
                                setDataSource({
                                  ...dataSource,
                                  dataSource: newDataSource,
                                })
                              }}
                            >
                              {dataSource.dataSource[index].actionKey != "" &&  
                              getActionMap()[dataSource.dataSource[index].actionKey] &&
                              getActionMap()[dataSource.dataSource[index].actionKey].length > 0 && (
                                getActionMap()[dataSource.dataSource[index].actionKey].map((action:any) => (
                                  <Option key={action.actionId} value={action.actionId}>{action.actionName}</Option>
                                ))
                              )}
                            </Select>
                            <Input placeholder='请输入引用字段'  
                                  style={{ width: '22%', marginRight: '10px' }}
                                  onChange={(e) => {
                                    const newDataSource = dataSource.dataSource.map((ds:DataSource, dsIdx:number) => {
                                      if (dsIdx === index) {
                                        return {
                                          ...ds,
                                          dataKey: e.target.value
                                        }
                                      }
                                      return ds
                                    })
                                    setDataSource({
                                      ...dataSource,
                                      dataSource: newDataSource,
                                    })
                                  }} 
                            />

                          </>
                        )}
                        {item.dsType === '2' && (
                          <Input style={{ width: '70%', marginRight: '10px' }} value={item.cacheKey} disabled />
                        )}
                        {item.dsType === '3' && (
                          <Input style={{ width: '70%', marginRight: '10px' }} value={item.dataKey}  />
                        )}
                        {item.dsType === '4' && (
                          <Input style={{ width: '70%', marginRight: '10px' }} value={item.dataKey} disabled />
                        )}
                      </Form.Item>
                      <MinusOutlined 
                        style={{ float: 'right', cursor: 'pointer', color: 'red', fontSize: '14px', marginLeft: '8px', marginRight: '3%',marginTop: '0.5%', border: '1px solid red', borderRadius: '50%', padding: '3px' }}
                        onClick={() => {
                          const newDataSource = dataSource.dataSource.filter((_, i) => i !== index);
                          setDataSource({
                            ...dataSource,
                            dataSource: newDataSource,
                          });
                          remove(index);
                        }}
                      />
                    </Form.Item>
                  ))}
                  
                  <Form.Item>
                    <Button type="dashed" onClick={() => {
                      const newDataSource = {
                        dsType: '1',
                        dependType: 'scene',
                        actionKey: '',
                        dataKey: '',
                        name: '',
                        dependId: '',
                        searchCond: []
                      };
                      setDataSource({
                        ...dataSource,
                        dataSource: [...dataSource.dataSource, newDataSource]
                      });
                    }} block icon={<PlusOutlined />}>
                      添加数据源
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </TabPane>
        <TabPane tab="模板数据定义" key="basic">
          <Form form={form} layout="vertical">
            <Form.Item name="templateData" label="模板数据">
                <MonacoEditor
                  language="json"
                  theme="vs"
                  value={form.getFieldValue('templateData')}
                  onChange={(value: string) => form.setFieldsValue({ templateData: value })}
                  options={{
                    minimap: { enabled: true },
                    lineNumbers: 'on',
                    automaticLayout: true,
                    fontFamily: 'Fira Code, monospace',
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    wrappingIndent: 'indent',
                    autoIndent: 'full',
                    colorDecorators: true,
                    suggestOnTriggerCharacters: true,
                    renderLineHighlight: 'all',
                    renderWhitespace: 'boundary',
                    fontSize: 16, // 增加字体大小
                  }}
                  height="300px"
                />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="数据输出类型" key="output">
          <Form.Item name="outputType" label="数据输出类型">
            <Select placeholder="请选择数据输出类型">
              <Option value="string">字符串</Option>
              <Option value="number">数字</Option>
              <Option value="boolean">布尔值</Option>
              <Option value="object">对象</Option>
              <Option value="array">数组</Option>
            </Select>
          </Form.Item>
          <Form.Item name="previewData" label="预览数据">
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {JSON.stringify({"name":111}, null, 2)}
            </pre>
          </Form.Item>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default MultiDataSourceModal;
