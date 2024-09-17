
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Layout, Menu, message, Modal, Row, Spin, Timeline, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined,SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const { Sider, Content } = Layout;



interface SceneRecord {
    sceneId: string;
    sceneName: string;
    duration: number;
    total: number;
    success: number;
    fail: number;
    finish: number;
    status: string;
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
  status: string;
}

const domain = import.meta.env.VITE_API_URL;

const ReportDetail: React.FC = () => {
  // 接口获取数据之后, taskId 对应的所有运行记录
  const [taskRunRecords, setTaskRunRecords] = useState<TaskRunRecord[]>([]);
  const [execId, setExecId] = useState<string>('');
  const [selectedScene, setSelectedScene] = useState<SceneRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionRecord | null>(null);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId') || '';


  const getTaskRunRecords = async (taskId:string) => {
    const url = `${domain}/task/getAllTaskRunRecord?taskId=${taskId}`;
    const res = await axios.get(url)
    if (res.status != 200) {
        message.error("获取运行记录失败")
        return
    }
    const records = res.data
    console.log(records)
    if (records && records.data) {
      const taskRunRecordsMap = new Map(Object.entries(records.data));
      const taskRunRecordsArray: TaskRunRecord[] = [];
      
      taskRunRecordsMap.forEach((value, key) => {
        let status = '0';  // 默认状态为 '0'
        if (Array.isArray(value)) {
          for (const item of value) {
            console.log(item)
            if (item.state === 2) {  // 如果有任何一个元素的 state 为 '2'，整体状态就是 '2'
              status = '2';
              break;
            } else if (item.state === 1) {  // 如果有元素的 state 为 '1'，且之前没有遇到 '2'
              status = '1';
            }
          }
        }
        let sceneRecords: SceneRecord[] = [];
        if (Array.isArray(value)) {
          value.forEach((scene) => {
            let actionRecords: ActionRecord[] = [];
            if (Array.isArray(scene.actionRecords)) {
              scene.actionRecords.forEach((action) => {
                actionRecords.push({
                  actionId: action.actionId || '',
                  actionName: action.actionName || '',
                  duration: action.duration || 0,
                  status: action.state?.toString() || '0',
                  error: action.error || {},
                  request: action.request || {},
                  response: action.response || {}
                });
              });
            }
            sceneRecords.push({
              sceneId: scene.sceneId || '',
              sceneName: scene.sceneName || '',
              duration: scene.duration || 0,
              total: scene.total || 0,
              success: scene.success || 0,
              fail: scene.fail || 0,
              finish: scene.finish || 0,
              status: scene.state?.toString() || '0',
              error: scene.error || {},
              actionRecords: actionRecords
            });
          });
        }
        taskRunRecordsArray.push({
          taskId: taskId,
          taskRunId: key,
          taskName: records.taskName || '',
          scenesRecords:  sceneRecords,
          status: status || '0',
          author: records.author,
          createAt: records.createTime,
          updateAt: records.updateTime
        });

        console.log(taskRunRecordsArray)
      });
      setTaskRunRecords(taskRunRecordsArray)
    // 设置 execID 为第一条记录的 taskRunId
    if (taskRunRecordsArray.length > 0) {
      setExecId(taskRunRecordsArray[0].taskRunId);
    }
    } else {
      message.error("获取的运行记录数据格式不正确");
    }
  };
  

  useEffect(() => {
    getTaskRunRecords(taskId)
  }, []);

  const handleSceneClick = async (taskRunId: string) => {
    setExecId(taskRunId);
  };

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSceneDetails, setSelectedSceneDetails] = useState(null);

  const showModal = (sceneRecord) => {
    setSelectedSceneDetails(sceneRecord);
    setIsModalVisible(true);
  };

  const showActionModal = (actionRecord) => {
    setSelectedAction(actionRecord);
    setIsActionModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
        <Card
            style={{
                backgroundColor: '#f0f0f0',
                marginBottom: '2%',
                marginLeft: '2%',
                marginTop: '1%',
                position: 'absolute',
                width: '82%',
                maxHeight: '18%',
                
            }}
        >
            <Row gutter={[16, 16]}>
                {[
                    { name: 'taskId', label: '任务ID', value: taskRunRecords.find(record => record.taskRunId === execId)?.taskId },
                    { name: 'taskName', label: '任务名称', value: taskRunRecords.find(record => record.taskRunId === execId)?.taskName },
                    { name: 'author', label: '创建人', value: taskRunRecords.find(record => record.taskRunId === execId)?.author },
                    { name: 'sceneCount', label: '场景数', value: taskRunRecords.find(record => record.taskRunId === execId)?.scenesRecords.length },
                    { name: 'createAt', label: '创建时间', value: taskRunRecords.find(record => record.taskRunId === execId)?.createAt },
                    { name: 'updateAt', label: '修改时间', value: taskRunRecords.find(record => record.taskRunId === execId)?.updateAt },
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
                                    fontSize: '16px',
                                    padding: '8px',
                                    borderRadius: '4px'
                                }}
                            />
                        </Form.Item>
                    </Col>
                ))}
            </Row>
        </Card>
        <Sider 
            width={180} 
            theme="light" 
            style={{ 
            borderRadius: '10px', 
            backgroundColor: '#f0f0f0', 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
            display: 'flex', 
            flexDirection: 'column', 
            maxHeight: '70%', 
            // margin: '0 auto',
            marginTop: '13%', 
            marginLeft: '2%', 
            overflow: 'hidden' 
            }}
        >
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', borderRadius: '10px' }}>
            <Menu
                mode="inline"
                style={{ 
                borderRight: 0, 
                backgroundColor: '#f0f0f0',
                fontSize: '36px',
                width: '180px',
                textAlign: 'center',
                }}
                selectedKeys={[execId]}
                items={taskRunRecords.map(record => ({
                key: record.taskRunId,
                label: (
                    <Tooltip title={record.taskName} placement="right">
                    <div style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        maxWidth: '150px',
                        fontSize: '20px',
                        lineHeight: '1.5',
                        textAlign: 'center',
                    }}>
                        {record.taskRunId}
                    </div>
                    </Tooltip>
                ),
                onClick: () => handleSceneClick(record.taskRunId),
                }))}
                className="hover-effect-menu"
            />
            </div>
        </Sider>
        <Content style={{ 
        padding: '24px', 
        // minHeight: '70%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-start', 
        alignItems: 'stretch', 
        margin: 'auto 0', 
        marginRight: '50px',
        marginTop: '12%',
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
                      const task = taskRunRecords.find(record => record.taskRunId === execId);
                      if (!task) return null;

                      switch (task.status) {
                        case '0': // 运行中
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                              <SyncOutlined spin style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
                              <span style={{ fontSize: '24px', color: '#1890ff' }}>任务运行中</span>
                            </div>
                          );
                        case '1': // 成功
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                              <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '10px' }} />
                              <span style={{ fontSize: '24px', color: '#52c41a' }}>任务运行成功</span>
                            </div>
                          );
                        case '2': // 失败
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
              {taskRunRecords.filter(record => record.taskRunId === execId)[0].scenesRecords.map(selectedRecord => (
                <Timeline key={selectedRecord.sceneId} pending={selectedRecord.status === '0' ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', color: '#1890ff', fontSize: '18px' }}>任务进行中</span>
                    <span style={{ color: '#808080', fontSize: '18px' }}>已执行: {selectedRecord.duration}ms</span>
                    </div>
                ) : 
                false
                } style={{ marginBottom: '40px', width: '100%' }}>
                  <Timeline.Item color={selectedRecord.status === '1' ? 'green' : 'blue'} style={{ marginBottom: '20px',paddingBottom: '20px',borderBottom: '1px solid #e0e0e0' }}>
                  <div style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%',
                      alignItems: 'center',
                  }}>
                    <h2 style={{ margin: 0, fontSize: '24px', flexShrink: 0 }}>{selectedRecord.sceneName}</h2>
                      {selectedRecord.status === '0' ? (
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
                                执行状态: 成功
                                <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px', fontSize: '20px' }} />
                              </span>
                              <a style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px', whiteSpace: 'nowrap' }} onClick={() => showModal(selectedRecord)}>查看详情</a>
                            </div>
                      )}
                    </div>
                    <Timeline style={{ marginTop: '20px' }}>
                      {selectedRecord.actionRecords.map((action, index) => (
                        <Timeline.Item key={action.actionId} color={action.status === '1' ? 'green' : 'blue'} style={{ marginBottom: '20px' }}>
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
                                      执行状态: {action.status === '1' ? '成功' : '失败'}
                                      {action.status === '1' ? (
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
              <span style={{ color: selectedSceneDetails.status === '1' ? '#52c41a' : '#1890ff' }}>
                {selectedSceneDetails.status === '1' ? '成功' : selectedSceneDetails.status === '2' ? <span style={{ color: 'red' }}>失败</span> : '进行中'}
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
            <span style={{ color: selectedAction.status === '1' ? '#52c41a' : selectedAction.status === '2' ? 'red' : '#1890ff' }}>
              {selectedAction.status === '1' ? '成功' : selectedAction.status === '2' ? '失败' : '进行中'}
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
