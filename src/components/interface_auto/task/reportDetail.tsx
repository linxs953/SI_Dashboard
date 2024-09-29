
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Layout, Menu, message, Modal, Row, Spin, Timeline, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined,SyncOutlined,ArrowLeftOutlined  } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';


const { Content } = Layout;



interface SceneRecord {
    sceneId: string;
    sceneName: string;
    duration: number;
    total: number;
    success: number;
    fail: number;
    finish: number;
    status: number;
    error: Object;
    actionRecords: ActionRecord[];
}


interface ActionRecord {
    actionId: string;
    actionName: string;
    request: Object;
    response: Object;
    duration: number;
    status: string;
    error: Object;
}

interface TaskRunRecord {
  taskId: string;
  taskRunId: string;
  taskName: string;
  author: string
  createAt: string
  updateAt: string
  scenesRecords: SceneRecord[];
  status: number;
}

const domain = import.meta.env.VITE_API_URL;

const ReportDetail: React.FC = () => {
  // 接口获取数据之后, taskId 对应的所有运行记录
  const [taskRunRecord, setTaskRunRecord] = useState<TaskRunRecord | null>(null);
  const [sceneRunRecord, setSceneRunRecord] = useState<SceneRecord[] | null>(null);

  const [selectedScene, setSelectedScene] = useState<SceneRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionRecord | null>(null);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId') || '';
  const execId = searchParams.get('execId') || '';

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSceneDetails, setSelectedSceneDetails] = useState(null);
  const navigate = useNavigate();


  const getTaskRunRecords = async (taskId:string,execId:string) => {
    const url = `${domain}/task/getDetail?taskId=${taskId}&execId=${execId}`;
    const res = await axios.get(url)
    if (res.status != 200) {
        message.error("获取运行记录失败")
        return
    }
    const taskMetaInfo = res.data
    if (taskMetaInfo) {

        // 设置顶部的任务信息
        setTaskRunRecord({
            taskId: taskMetaInfo.taskMeta?.taskId,
            taskRunId: taskMetaInfo.taskMeta?.execId,
            taskName: taskMetaInfo.taskMeta?.taskName,
            scenesRecords: taskMetaInfo.taskRun?.sceneRecords || [],
            status: taskMetaInfo.taskRun?.state,
            author: taskMetaInfo.taskMeta?.author,
            createAt: taskMetaInfo.taskMeta?.createTime,
            updateAt: taskMetaInfo.taskMeta?.updateTime
        })
        console.log(taskRunRecord)

        // 设置场景信息
        console.log()
        if (taskMetaInfo.taskRun?.sceneRecords) {
            setSceneRunRecord(taskMetaInfo.taskRun.sceneRecords)
            console.log(taskMetaInfo.taskRun.sceneRecords[0])
        }

    } else {
      message.error("获取的运行记录数据格式不正确");
    }
  };
  

  useEffect(() => {
    getTaskRunRecords(taskId,execId)
  }, []);


  useEffect(() => {
    if (selectedScene) {
      const timer = setTimeout(() => {
        setSelectedScene(prevScene => {
          if (prevScene) {
            return {
              ...prevScene,
              status: '1', // 假设 '1' 表示成功
              duration: 500,
            };
          }
          return prevScene;
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [selectedScene]);



  const showModal = (sceneRecord) => {
    setSelectedSceneDetails(sceneRecord);
    console.log(selectedSceneDetails)
    setIsModalVisible(true);
  };

  const showActionModal = (actionRecord) => {
    setSelectedAction(actionRecord);
    setIsActionModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };


  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Button 
          icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} 
          style={{ 
            // position: 'fixed',
            top: '1%',
            left: '2%',
            zIndex: 1000,
            backgroundColor: 'transparent',
            padding: '4px 15px',
            fontSize: '16px',
            transition: 'all 0.3s',
            width: '80px'  // 增加按钮的宽度
          }}
          onClick={() => {
            navigate('/dashboard/api/task/reports?taskId=' + taskId);
          }}
        >
          返回
        </Button>
        <Card
            style={{
                backgroundColor: '#f0f0f0',
                marginBottom: '2%',
                marginLeft: '2%',
                marginTop: '3%',
                position: 'absolute',
                width: '84%',
                maxHeight: '16%',
                
            }}
        >
            <Row gutter={[16, 16]}>
                {[
                    { name: 'taskId', label: '任务ID', value: taskRunRecord?.taskId },
                    { name: 'taskName', label: '任务名称', value: taskRunRecord?.taskName },
                    { name: 'author', label: '创建人', value: taskRunRecord?.author },
                    { name: 'sceneCount', label: '场景数', value: taskRunRecord?.scenesRecords?.length },
                    { name: 'createAt', label: '创建时间', value: taskRunRecord?.createAt },
                    { name: 'updateAt', label: '修改时间', value: taskRunRecord?.updateAt },
                ].map((item, index) => (
                    <Col span={8} key={index}>
                        <Form.Item label={item.label}>
                            <Input 
                                readOnly
                                value={item.value || '暂无数据'}
                                style={{ 
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    color: '#333',
                                    fontSize: '10px',
                                    padding: '9px',
                                    borderRadius: '4px'
                                }}
                            />
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        </Card>
        <Content style={{ 
            maxHeight: '53%',
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            alignItems: 'stretch', 
            margin: 'auto 0', 
            marginRight: '50px',
            marginTop: '11%',
            marginLeft: '1%',
            height: '74%', // 保持与 Sider 一致的高度
            overflowY: 'auto', // 支持垂直滚动
            position: 'relative' // 添加相对定位
        }}>
        {loading ? (
          <Spin size="large" />
        ) : execId ? (
        <div style={{ height: '100%', borderRadius: '10px', backgroundColor: '#f0f0f0', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflowY: 'auto', paddingBottom: '60px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start', 
              justifyContent: 'flex-start', 
              marginLeft: '20px', 
              padding: '20px', 
              fontSize: '16px' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', marginTop: '20px' }}>
                    {(() => {
                      const task = taskRunRecord
                      if (!task) return null;
                      let state = 1
                      if (sceneRunRecord) {
                        for (const scene of sceneRunRecord) {
                            if (scene.state === 2) {
                                state = 2;
                                break;
                            }
                            if (scene.state === 0) {
                                state = 0;
                            }
                        }
                      }

                      console.log(state)
                      
                      switch (state) {
                        case 0: // 运行中
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                              <SyncOutlined spin style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
                              <span style={{ fontSize: '24px', color: '#1890ff' }}>任务运行中</span>
                            </div>
                          );
                        case 1: // 成功
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '10px' }} />
                              <span style={{ fontSize: '24px', color: '#52c41a' }}>任务运行成功</span>
                            </div>
                          );
                        case 2: // 失败
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                              <CloseCircleOutlined style={{ fontSize: '24px', color: '#f5222d', marginRight: '10px' }} />
                              <span style={{ fontSize: '24px', color: '#f5222d' }}>任务运行失败</span>
                            </div>
                          );
                        default:
                          return null;
                      }
                    })()}
                </div>
              {sceneRunRecord?.map((selectedRecord) => (
                <Timeline key={selectedRecord.sceneId} pending={selectedRecord.status === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#1890ff', fontSize: '8px' }}>任务进行中</span>
                    <span style={{ color: '#808080', fontSize: '18px' }}>已执行: {selectedRecord.duration}ms</span>
                    </div>
                ) : 
                false
                } style={{ marginBottom: '40px', width: '100%' }}>
                  <Timeline.Item color={selectedRecord.state === 1 ? 'green' : selectedRecord.state === 2 ? 'red' : 'gray'} style={{ marginBottom: '20px',paddingBottom: '20px',borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      alignItems: 'center',
                  }}>
                    <h2 style={{ margin: 0, fontSize: '20px', flexShrink: 0 }}>{selectedRecord.sceneName}</h2>
                      {selectedRecord.status === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Spin size="default" style={{ marginRight: '15px' }} />
                            <span style={{ color: '#1890ff', fontSize: '18px', whiteSpace: 'nowrap' }}>已执行: {selectedRecord.duration}ms</span>
                        </div>
                      ) : (
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'row', 
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                marginLeft: 'auto',
                            }}>
                              <span style={{width: '150px', marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>执行时间: {selectedRecord.duration}ms</span>
                              <span style={{ marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>
                                  执行状态: {
                                    selectedRecord.state === 0 ? '执行中' :
                                    selectedRecord.state === 1 ? '成功' : '失败'
                                  }
                                  {selectedRecord.state === 0 ? (
                                    <SyncOutlined spin style={{ color: '#1890ff', marginLeft: '8px', fontSize: '20px' }} />
                                  ) : selectedRecord.state === 1 ? (
                                    <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px', fontSize: '20px' }} />
                                  ) : (
                                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: '8px', fontSize: '20px' }} />
                                  )}
                              </span>
                              <a style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px', whiteSpace: 'nowrap' }} onClick={() => showModal(selectedRecord)}>查看详情</a>
                            </div>
                      )}
                    </div>
                    <Timeline style={{ marginTop: '20px' }}>
                      {selectedRecord.actionRecords.map((action, index) => (
                        <Timeline.Item key={action.actionId} color={action.state === 1 ? 'green' : action.state === 2 ? 'red' : 'gray'} style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ marginRight: '15px', fontSize: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{`${index + 1}. ${action.actionName}`}</p>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto',marginBottom: '14px' }}>
                              {action.status === '0' ? (
                                <Spin size="default" />
                              ) : (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ width: '150px', marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>执行时间: {action.duration}ms</span>
                                    <span style={{ display: 'flex', alignItems: 'center', marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>
                                      执行状态: {
                                        action.state === 0 ? '执行中' :
                                        action.state === 1 ? '成功' : '失败'
                                      }
                                      {action.state === 0 ? (
                                        <SyncOutlined spin style={{ color: '#1890ff', marginLeft: '8px', fontSize: '20px' }} />
                                      ) : action.state === 1 ? (
                                        <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px', fontSize: '20px' }} />
                                      ) : (
                                        <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: '8px', fontSize: '20px' }} />
                                      )}
                                    </span>
                                  </div>
                                  <a style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px', whiteSpace: 'nowrap' }} onClick={() => showActionModal(action)}>查看详情</a>
                                </>
                              )}
                            </div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Timeline.Item>
                </Timeline>
              ))}
            </div>
        </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '18px', color: '#808080' }}>请从左侧选择一个场景</div>
        )}

        </Content>
 
        <Modal
            title="场景运行详情"
            open={isModalVisible}
            onOk={handleOk}
            okText="确定"
            footer={[
            <Button key="submit" type="primary" onClick={handleOk}>
                确定
            </Button>
            ]}
            width={800}
        >
        {selectedSceneDetails && (
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>场景名称：</span>
              <span>{selectedSceneDetails.sceneName}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>场景ID：</span>
              <span>{selectedSceneDetails.sceneId}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>状态：</span>
              <span style={{ color: selectedSceneDetails.state === 1 ? '#52c41a' : '#1890ff' }}>
                {selectedSceneDetails.state === 1 ? '成功' : selectedSceneDetails.state === 2 ? <span style={{ color: 'red' }}>失败</span> : '进行中'}
              </span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>执行时间：</span>
              <span>{selectedSceneDetails.duration}ms</span>
            </div>
          </div>
        )}
        </Modal>
        <Modal
      title="Action详情"
      open={isActionModalVisible}
      onOk={() => setIsActionModalVisible(false)}
      footer={[
        <Button key="close" type="primary" onClick={() => setIsActionModalVisible(false)}>
          关闭
        </Button>
      ]}
      width={800}
    >
      {selectedAction && (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start' }}>
            <span style={{ fontWeight: 'bold', color: '#333' }}>Action名称：</span>
            <span>{selectedAction.actionName}</span>
            
            <span style={{ fontWeight: 'bold', color: '#333' }}>Action ID：</span>
            <span>{selectedAction.actionId}</span>
            
            <span style={{ fontWeight: 'bold', color: '#333' }}>状态：</span>
            <span style={{ color: selectedAction.state === 1 ? '#52c41a' : selectedAction.state === 2 ? 'red' : '#1890ff' }}>
              {selectedAction.state === 1 ? '成功' : selectedAction.status === '2' ? '失败' : '进行中'}
            </span>
            
            <span style={{ fontWeight: 'bold', color: '#333' }}>执行时间：</span>
            <span>{selectedAction.duration}ms</span>
            
            <span style={{ fontWeight: 'bold', color: '#333' }}>请求：</span>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {JSON.stringify(selectedAction.request, null, 2)}
            </pre>
            
            <span style={{ fontWeight: 'bold', color: '#333' }}>响应：</span>
            <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {JSON.stringify(selectedAction.response, null, 2)}
            </pre>
            
            {selectedAction.error && Object.keys(selectedAction.error).length > 0 && (
              <>
                <span style={{ fontWeight: 'bold', color: '#333' }}>错误：</span>
                <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', color: 'red' }}>
                  {JSON.stringify(selectedAction.error, null, 2)}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
        </Modal>
    </Layout>
  );
};

export default ReportDetail;
