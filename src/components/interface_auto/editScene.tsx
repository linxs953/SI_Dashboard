import React, { act, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Modal, Table, Tooltip, message, InputNumber, Row, Col, FormInstance, Tabs, Select, Space, Layout } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';

import axios from 'axios';
import { Store } from 'antd/lib/form/interface';
import TabPane from 'antd/es/tabs/TabPane';
import { Option } from 'antd/es/mentions';
import SceneInfo from './scene/sceneInfo';
import { Content } from 'antd/es/layout/layout';
import ActionList from './scene/actionList';

interface SceneData {
  sceneId: string;
  sceneName: string;
  sceneDesc: string;
  sceneRetries: number;
  sceneTimeout: number;
  author: string;
  createTime: string;
  updateTime: string;
  actionNum: number;
  actions: ActionData[];
}

interface ActionData {
  actionId: string;
  actionName: string;
  retry: number;
  timeout: number;
  relateId: string;
  actionMethod: string;
  actionPath: string;
  dependency: DependencyData[];
}

interface DependencyData {
  actionKey: string;
  dataKey: string;
  type: string;
  refer: {
    dataType: string;
    target: string;
    type: string;
  } 
}


interface ActionInfo {
  actionName:string
  retry: number
  timeout: number
  relateId: string
  actionMethod: string
  actionPath: string
  dependency: DependencyData[]
  actionId:string
}


// const ActionInfoModal: React.FC<{selectedAction:ActionData, saveAction: (value:any) => void, open:boolean, setOpen:(value:boolean) => void,preActions:ActionData[] }> = ({selectedAction,open, setOpen,preActions, saveAction}) => {
//   const [form] = Form.useForm();
//   const [ac,setAc] = useState<ActionInfo>({
//     actionName: selectedAction?.actionName,
//     retry: selectedAction?.retry,
//     timeout: selectedAction?.timeout,
//     relateId: selectedAction?.relateId,
//     actionMethod: selectedAction?.actionMethod,
//     actionPath: selectedAction?.actionPath,
//     dependency: selectedAction?.dependency,
//     actionId: selectedAction?.actionId
//   })


//   const getDsType = (type:string) => {
//     if (type === "2") return "基础数据"
//     if (type === "1") return "场景数据"
//     if (type === "3") return "自定义数据"
//     return "无"
//   }

//   const getDsCode = (name:string) => {
//     if (name === "基础数据") return "2"
//     if (name === "场景数据") return "1"
//     if (name === "自定义数据") return "3"
//     return "4"
//   }

//   const handleTypeChange = (value: string, index: number) => {
//     const  newDepend = ac.dependency; // 克隆当前依赖项数组
//     newDepend[index].type = getDsCode(value); // 更新特定索引的依赖项
//     setAc({
//       ...ac,
//       dependency: newDepend
//     })
  
//     form.setFieldsValue({
//       dataSource: ac.dependency.map((depend, idx) => getDsType(depend.type)),
//       actionKey: ac.dependency.map((depend, idx) => depend.actionKey),
//       dataKey: ac.dependency.map((depend, idx) =>  depend.dataKey),
//       relationAction: ac.dependency.map((depend, idx) => depend.relateId)
//     });
//   };

//   const onNameChange = (value) => {
//     let actionData = ac
//     actionData.actionName = value.target.value
//     setAc(actionData)
//   }
  
//   const onRetryChange = (value) => {
//     console.log(value)
//     let actionData = ac
//     actionData.retry = value
//     setAc(actionData)
//   }

//   const onTimeoutChange = (value) => {
//     let actionData = ac
//     actionData.timeout = value
//     setAc(actionData)
//   }
  
//   const handleEditCancel = () => {
//       form.resetFields()
//       setOpen(false)
//   }

//   useEffect(() => {
//     return () => {
//       // 清理副作用
//     };
//   }, []);

//   useEffect(() => {
//     form.setFieldsValue({
//       dataSource: ac.dependency.map((depend, idx) => getDsType(depend.type)),
//       actionKey: ac.dependency.map((depend, idx) => depend.actionKey),
//       dataKey: ac.dependency.map((depend, idx) =>  depend.dataKey),
//       relationAction: ac.dependency.map((depend, idx) => depend.relateId)
//     });
//   },[])

//   return (
//     <Modal
//     title="编辑步骤"
//     open={open}
//     onCancel={handleEditCancel}
//     onOk={async () => {
//       const values = ac
//       console.log(values)
//       setOpen(false)
//       saveAction(ac)
//     }}
//     okText="保存"
//     cancelText="取消"
//     width="50%"
//     >        
//         <Form
//           form={form}
//           initialValues={ac}
//           layout="vertical"
//         >
//           <Row gutter={10}>
//               <Col span={8}>
//                 <Form.Item
//                   label="步骤名称"
//                   name="actionName"
//                   rules={[{ required: true, message: '请输入步骤名称!' }]} // 添加必填验证
//                 >
//                   <Input placeholder="步骤名称" onChange={onNameChange} />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="重试次数"
//                   name="retry"
//                   rules={[{ required: true, message: '请输入重试次数!' }]} // 添加必填验证
//                 >
//                   <InputNumber min={0} max={10} style={{ width: '100%' }} onChange={onRetryChange} />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <Form.Item
//                   label="执行超时时间"
//                   name="timeout"
//                   rules={[{ required: true, message: '请输入执行超时时间!' }]} // 添加必填验证
//                 >
//                     <InputNumber min={0} style={{ width: '100%' }}  onChange={onTimeoutChange} />
//                 </Form.Item>
//                 <span style={{ marginLeft: '8px', display: 'inline-block',width: '80px',color: '#999',marginTop: "7px" }}>单位: 秒</span>
//               </div>                
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="接口ID"
//                   name="relateId"
//                 >
//                   <InputNumber disabled style={{ width: '100%' }}  />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="接口路径"
//                   name="actionPath"
//                 >
//                   <InputNumber disabled style={{ width: '100%' }}  />
//                 </Form.Item>
//               </Col>
//               <Col span={8}>
//                 <Form.Item
//                   label="请求方法"
//                   name="actionMethod"
//                 >
//                   <InputNumber disabled style={{ width: '100%' }}  />
//                 </Form.Item>
//               </Col>
//           </Row>
//         </Form>
//         <Tabs>
//             <TabPane tab="请求头" key="headers">
//             {ac.dependency  && ac.dependency.filter((de,index)=>de.refer.type === "header").map((depend,index) => (
//                 <Form  form={form} initialValues={depend} >
//                   <Space direction="vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <Space  style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                     <Form.Item
//                           key={`数据源${index}`}
//                           label={"数据源"}
//                           layout='horizontal'
//                           name={['dataSource',index]}
//                           >
//                           <Select 
//                                   defaultValue={getDsType(depend.type)} 
//                                   style={{width: "100px"}}
//                                   key={index}
//                                   onChange={(value) => handleTypeChange(value, index)}
//                           >
//                             <Select.Option value='基础数据'>基础数据</Select.Option>
//                             <Select.Option value='场景数据'>场景数据</Select.Option>
//                             <Select.Option value='自定义数据'>自定义数据</Select.Option>
//                             <Select.Option value='无'>无</Select.Option>
//                           </Select>
//                     </Form.Item>
//                     {depend.type === '2' && (
//                         <>
//                           <Form.Item
//                           key={`数据索引${index}`}
//                           label={"数据索引"}
//                             name={["actionKey",index]}
//                             layout='horizontal'
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据 Key" 
//                                    style={{ width: '120px' }}
//                                    defaultValue={depend.actionKey}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label={"引用数据"}
//                             name={["dataKey",index]}
//                             layout='horizontal'
//                             key={`引用数据${index}`}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据应用" 
//                                    defaultValue={depend.dataKey}
//                                    style={{ width: '120px' }}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                     {depend.type === '1' && (
//                         <>
//                           {/* <Form.Item
//                             label={"关联场景"}
//                             layout='horizontal'
//                             // name={`dependency[${index}].scenario`}
//                             name={["relationScene",index]}
//                             // rules={[{ required: true, message: '请选择场景' }]}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Select  defaultValue={"当前场景"} 
//                                      style={{ width: '120px' }} // 控制下拉框的宽度
//                             >
//                               <Option value="当前场景">当前场景</Option>
//                               <Option value="无">无</Option>
//                             </Select>
//                           </Form.Item> */}
//                           <Form.Item
//                             label={"关联步骤"}
//                             key={`关联步骤${index}`}
//                             layout='horizontal'
//                             name={["relationAction",index]}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Select
//                               style={{ width: '120px' }}
//                               options={preActions.map(step => ({ value: step.actionName, label: step.actionName }))}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                   </Space>
//                   </Space>
//                 </Form>
//             ))}
//             </TabPane>
//             <TabPane tab="请求链接" key="url">
//             {ac.dependency  && ac.dependency.filter((de,index)=>de.refer.type === "path").map((depend,index) => (
//                 <Form  form={form} initialValues={depend} >
//                   <Space direction="vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <Space  style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                     <Form.Item
//                           key={`数据源${index}`}
//                           label={"数据源"}
//                           layout='horizontal'
//                           name={['dataSource',index]}
//                           >
//                           <Select 
//                                   defaultValue={getDsType(depend.type)} 
//                                   style={{width: "100px"}}
//                                   key={index}
//                                   onChange={(value) => handleTypeChange(value, index)}
//                           >
//                             <Select.Option value='基础数据'>基础数据</Select.Option>
//                             <Select.Option value='场景数据'>场景数据</Select.Option>
//                             <Select.Option value='自定义数据'>自定义数据</Select.Option>
//                             <Select.Option value='无'>无</Select.Option>
//                           </Select>
//                     </Form.Item>
//                     {depend.type === '2' && (
//                         <>
//                           <Form.Item
//                           key={`数据索引${index}`}
//                           label={"数据索引"}
//                             name={["actionKey",index]}
//                             layout='horizontal'
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据 Key" 
//                                    style={{ width: '120px' }}
//                                    defaultValue={depend.actionKey}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label={"引用数据"}
//                             name={["dataKey",index]}
//                             layout='horizontal'
//                             key={`引用数据${index}`}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据应用" 
//                                    defaultValue={depend.dataKey}
//                                    style={{ width: '120px' }}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                     {depend.type === '1' && (
//                         <>
//                           <Form.Item
//                             label={"关联步骤"}
//                             key={`关联步骤${index}`}
//                             layout='horizontal'
//                             name={["relationAction",index]}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Select
//                               style={{ width: '120px' }}
//                               options={preActions.map(step => ({ value: step.actionName, label: step.actionName }))}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                   </Space>
//                   </Space>
//                 </Form>
//             ))}
//             </TabPane>
//             <TabPane tab="请求参数" key="params">
//             {ac.dependency  && ac.dependency.filter((de,index)=>de.refer.type === "query").map((depend,index) => (
//                 <Form  form={form} initialValues={depend} >
//                   <Space direction="vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <Space  style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                     <Form.Item
//                           key={`数据源${index}`}
//                           label={"数据源"}
//                           layout='horizontal'
//                           name={['dataSource',index]}
//                           >
//                           <Select 
//                                   defaultValue={getDsType(depend.type)} 
//                                   style={{width: "100px"}}
//                                   key={index}
//                                   onChange={(value) => handleTypeChange(value, index)}
//                           >
//                             <Select.Option value='基础数据'>基础数据</Select.Option>
//                             <Select.Option value='场景数据'>场景数据</Select.Option>
//                             <Select.Option value='自定义数据'>自定义数据</Select.Option>
//                             <Select.Option value='无'>无</Select.Option>
//                           </Select>
//                     </Form.Item>
//                     {depend.type === '2' && (
//                         <>
//                           <Form.Item
//                           key={`数据索引${index}`}
//                           label={"数据索引"}
//                             name={["actionKey",index]}
//                             layout='horizontal'
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据 Key" 
//                                    style={{ width: '120px' }}
//                                    defaultValue={depend.actionKey}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label={"引用数据"}
//                             name={["dataKey",index]}
//                             layout='horizontal'
//                             key={`引用数据${index}`}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据应用" 
//                                    defaultValue={depend.dataKey}
//                                    style={{ width: '120px' }}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                     {depend.type === '1' && (
//                         <>
//                           <Form.Item
//                             label={"关联步骤"}
//                             key={`关联步骤${index}`}
//                             layout='horizontal'
//                             name={["relationAction",index]}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Select
//                               style={{ width: '120px' }}
//                               options={preActions.map(step => ({ value: step.actionName, label: step.actionName }))}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                   </Space>
//                   </Space>
//                 </Form>
//             ))}
//             </TabPane>
//             <TabPane tab="Payload" key="payload">
//             {ac.dependency  && ac.dependency.filter((de,index)=>de.refer.type === "payload").map((depend,index) => (
//                 <Form  form={form} initialValues={depend} >
//                   <Space direction="vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <Space  style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                     <Form.Item
//                           key={`数据源${index}`}
//                           label={"数据源"}
//                           layout='horizontal'
//                           name={['dataSource',index]}
//                           >
//                           <Select 
//                                   defaultValue={getDsType(depend.type)} 
//                                   style={{width: "100px"}}
//                                   key={index}
//                                   onChange={(value) => handleTypeChange(value, index)}
//                           >
//                             <Select.Option value='基础数据'>基础数据</Select.Option>
//                             <Select.Option value='场景数据'>场景数据</Select.Option>
//                             <Select.Option value='自定义数据'>自定义数据</Select.Option>
//                             <Select.Option value='无'>无</Select.Option>
//                           </Select>
//                     </Form.Item>
//                     {depend.type === '2' && (
//                         <>
//                           <Form.Item
//                           key={`数据索引${index}`}
//                           label={"数据索引"}
//                             name={["actionKey",index]}
//                             layout='horizontal'
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据 Key" 
//                                    style={{ width: '120px' }}
//                                    defaultValue={depend.actionKey}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label={"引用数据"}
//                             name={["dataKey",index]}
//                             layout='horizontal'
//                             key={`引用数据${index}`}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Input placeholder="数据应用" 
//                                    defaultValue={depend.dataKey}
//                                    style={{ width: '120px' }}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                     {depend.type === '1' && (
//                         <>
//                           <Form.Item
//                             label={"关联步骤"}
//                             key={`关联步骤${index}`}
//                             layout='horizontal'
//                             name={["relationAction",index]}
//                             style={{marginLeft:"10px"}}
//                           >
//                             <Select
//                               style={{ width: '120px' }}
//                               options={preActions.map(step => ({ value: step.actionName, label: step.actionName }))}
//                             />
//                           </Form.Item>
//                         </>
//                       )}
//                   </Space>
//                   </Space>
//                 </Form>
//             ))}
//             </TabPane>
//         </Tabs>
//     </Modal>
//   )
// }

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
      // fetchSceneData(sceneId);
      setSceneData({
        sceneId: 'scid',
        sceneName: '测试场景',
        sceneDesc: '测试场景',
        sceneRetries: 10,
        sceneTimeout: 10,
        author: 'linxs',
        createTime: '2024-10-10: 00:00:00',
        updateTime: '2024-10-10: 00:00:00',
        actionNum: 10,
        actions: [
          {
            actionId: "acid",
            actionName: 'string',
            retry: 10,
            timeout: 10,
            relateId: 'string',
            actionMethod: 'string',
            actionPath: '/api/path',
            dependency: []
          },
        ]
      })
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
      "sceneId": response.data.data.sceneId,
      "sceneName": response.data.data.scname,
      "sceneDesc": response.data.data.description,
      "sceneRetries": response.data.data.retry,
      "sceneTimeout": response.data.data.timeout,
      "author": response.data.data.author,
      "createTime": response.data.data.createAt,
      "updateTime": response.data.data.updateAt,
      "actionNum": response.data.data.actions?.length,
      "actions": response.data.data.actions
    };
    console.log(response.data.data)
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
      const values = await form.getFieldsValue();
      if (sceneData?.actions.length == 0) {
        message.error("列表数据为空")
        return
      }
      const data = {
        "scname": values?.sceneName,
        "description": values?.sceneDesc,
        "timeout": values?.sceneTimeout,
        "retry": values?.sceneRetries,
        "actions": sceneData?.actions
      }
      console.log(values)
      // const response = await axios.put(`http://localhost:8000/scene/update?scid=${sceneId}`, data)
      // if (response.status != 200) {
      //   message.error("保存场景失败")
      //   return
      // }
      // if (response.data.code && response.data.code >  0) {
      //   message.error("保存场景出现错误")
      //   return
      // }
      // navigate("/dashboard/api/scene")
      // message.success("更新场景成功")
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


  const handleEditCancel = () => {
    setEditModalVisible(false);
    setSelectedAction(null)
    form.resetFields()
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
        setSceneData(prevState => ({
          ...prevState!,
          actions: updatedActions
        }));
      }
      // setDrawerVisible(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const handleEdit = (record: ActionData,idx:any) => {
    console.log(record)
    setSelectedAction(record);
    setEditModalVisible(true);
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
      title: '流程节点名称',
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
      render: (idx: any, record: ActionData) => (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="编辑">
            <EditOutlined onClick={() => handleEdit(record,idx)} style={{ marginRight: '8px' }} />
          </Tooltip>
          <Tooltip title="删除">
            <DeleteOutlined onClick={() => handleDelete(record)} />
          </Tooltip>
        </span>
      ),
    },
  ];

  const getPreActions = (): Record<string, ActionData[]> => {
    let data: Record<string, ActionData[]> = {};
    
    // 遍历每个 ActionData
    sceneData?.actions.map((currentAction: ActionData,index:number) => {
      // 初始化当前 actionId 的前置动作列表
      if (!data[currentAction.actionId]) {
        data[currentAction.actionId] = [];
      }
      data[currentAction.actionId] = sceneData.actions.slice(0,index)
    });
    return data
  }

  const saveActionRecord = (action:ActionData) => {
    const index = sceneData?.actions?.findIndex(item => item.actionId === action.actionId)
    console.log(action)
    if (index !== -1) {
      let updatedActions = sceneData?.actions as ActionData[];
      
      updatedActions[index] = action; // 更新对应索引的 ActionData
  
      setSceneData(prevState => ({
        ...prevState!,
        actions: updatedActions
      }));
    }
  }
  return (
    <>
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
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Content style={{ padding: '0 50px', width: '100%', flex: 1 }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <SceneInfo sceneDetail={sceneData as SceneDetail} onSceneDetailChange={(updatedSceneDetail: SceneDetail) => setSceneData(prevState => ({
                    ...prevState!,
                    ...updatedSceneDetail
                  }))} />
                  <ActionList 
                    actionList={sceneData?.actions || []} 
                    updateActionList={(updatedActionList: ActionData[]) => setSceneData(prevState => ({
                      ...prevState!,
                      actions: updatedActionList
                    }))}
                  />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#fff' }}>
                <Button style={{ marginRight: '10px' }}>取消</Button>
                <Button type="primary" onClick={() => {
                  // updateTask(taskInfo, sceneList);
                  
                  message.success("保存成功")
                }}>保存</Button>
              </div>
          </Content>
        </Layout>
    </>
  );
};

export default EditScene;