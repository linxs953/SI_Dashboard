
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Layout, Menu, message, Modal, Row, Spin, Timeline } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined,SyncOutlined,ArrowLeftOutlined  } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import createTaskRunDetailStore from 'src/store/task/taskDetail';
import useFetchApi from 'src/hooks/fetchApi';


const { Content } = Layout;


const domain = import.meta.env.VITE_API_URL;
const stote = createTaskRunDetailStore()

const ReportDetail: React.FC = () => {

  // 从 store 中读取 state
  const {
    taskRunRecord, setTaskRunRecord,
    sceneRunRecord, setSceneRunRecord,
    selectedScene, setSelectedScene,
    loading, setLoading,
    isActionModalVisible, setIsActionModalVisible,
    selectedAction, setSelectedAction,
    isSceneModalVisible, setIsSceneModalVisible

  } = stote((state) => ({
    taskRunRecord: state.taskRecord,
    setTaskRunRecord: state.setTaskRecord,
    sceneRunRecord: state.sceneRecords,
    setSceneRunRecord: state.setSceneRecords,
    selectedScene: state.selectedScene,
    setSelectedScene: state.setSelectedScene,
    loading: state.loading,
    setLoading: state.setLoading,
    isActionModalVisible: state.isActionModalVisible,
    setIsActionModalVisible: state.setIsActionModalVisible,
    selectedAction: state.selectedAction,
    setSelectedAction: state.setSelectedAction,
    isSceneModalVisible: state.isSceneModalVisible,
    setIsSceneModalVisible: state.setIsSceneModalVisible
  }))
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId') || '';
  const execId = searchParams.get('execId') || '';
  const [refetch,setRefetch] = useState(0)
  const navigate = useNavigate();

  // 调用api获取任务运行数据
  const { data, isLoading, error } = useFetchApi(domain, `/task/getDetail?taskId=${taskId}&execId=${execId}`,{},refetch);

  const setTaskRunRecords = async (data:any) => {
    const taskMetaInfo = data
    if (taskMetaInfo) {
        // 设置顶部的任务信息
        const taskRecord: TaskRunRecord = {
            taskId: taskMetaInfo.taskMeta?.taskId,
            taskRunId: taskMetaInfo.taskMeta?.execId,
            taskName: taskMetaInfo.taskMeta?.taskName,
            scenesRecords: taskMetaInfo.taskRun?.sceneRecords || [],
            status: taskMetaInfo.taskRun?.state,
            author: taskMetaInfo.taskMeta?.author,
            createAt: taskMetaInfo.taskMeta?.createTime,
            updateAt: taskMetaInfo.taskMeta?.updateTime
        };
        setTaskRunRecord(taskRecord);

        // 设置场景信息
        if (taskMetaInfo.taskRun?.sceneRecords) {
            const sceneRunRecord: SceneRecord[] = taskMetaInfo.taskRun.sceneRecords.map((scene: any) => ({
              sceneId: scene.sceneId,
              sceneName: scene.sceneName,
              duration: scene.duration,
              fail: scene.failCount,
              finish: scene.finishCount,
              success: scene.successCount,
              status: scene.state,
              actionRecords: scene.actionRecords.map((action: any) => ({
                actionId: action.actionId,
                actionName: action.actionName,
                request: action.request,
                response: action.response,
                duration: action.duration,
                status: action.state,
                error: action.error
              }))
            }));
            setSceneRunRecord(sceneRunRecord)
        }

    } else {
      message.error("获取的运行记录数据格式不正确");
    }
  };

  const showSceneModal = (sceneRecord: SceneRecord) => {
    setSelectedScene(sceneRecord);
    console.log(selectedScene)
    setIsSceneModalVisible(true);
  };

  const showActionModal = (actionRecord: ActionRecord) => {
    setSelectedAction(actionRecord);
    setIsActionModalVisible(true);
  };

  const closeSceneModal = () => {
    setIsSceneModalVisible(false);
  };

  const closeActionModal = () => {
    setIsActionModalVisible(false);
  };

  const getTaskRunStateElement = () => {
    const task = taskRunRecord
    if (!task) return null;
    let state = 1
    if (sceneRunRecord) {
      for (const scene of sceneRunRecord) {
          if (scene.status === 2) {
              state = 2;
              break;
          }
          if (scene.status === 0) {
              state = 0;
          }
      }
    }                      
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
  }

  const renderAllSceneRunDetailComponent = () => {
    return (
      <>
        {sceneRunRecord?.map((selectedRecord: SceneRecord) => (
          <Timeline 
            key={selectedRecord.sceneId} 
            pending={selectedRecord.status === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#1890ff', fontSize: '8px' }}>任务进行中</span>
              <span style={{ color: '#808080', fontSize: '18px' }}>已执行: {selectedRecord.duration}ms</span>
              </div>
            ) : false} 
            style={{ marginBottom: '40px', width: '100%' }}>
              <Timeline.Item 
                color={selectedRecord.status === 1 ? 'green' : selectedRecord.status === 2 ? 'red' : 'gray'} 
                style={{ marginBottom: '20px',paddingBottom: '20px',borderBottom: '1px solid #e0e0e0' }}
              >
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
                                    selectedRecord.status === 0 ? '执行中' :
                                    selectedRecord.status === 1 ? '成功' : '失败'
                                  }
                                  {selectedRecord.status === 0 ? (
                                    <SyncOutlined spin style={{ color: '#1890ff', marginLeft: '8px', fontSize: '20px' }} />
                                  ) : selectedRecord.status === 1 ? (
                                    <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px', fontSize: '20px' }} />
                                  ) : (
                                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: '8px', fontSize: '20px' }} />
                                  )}
                              </span>
                              <a style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px', whiteSpace: 'nowrap' }} onClick={() => showSceneModal(selectedRecord)}>查看详情</a>
                            </div>
                      )}
                  </div>
                  <Timeline style={{ marginTop: '20px' }}>
                    {selectedRecord.actionRecords.map((action: ActionRecord, index: number) => (
                      <Timeline.Item key={action.actionId} color={action.status === 1 ? 'green' : action.status === 2 ? 'red' : 'gray'} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ marginRight: '15px', fontSize: '20px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{`${index + 1}. ${action.actionName}`}</p>
                          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto',marginBottom: '14px' }}>
                            {action.status === 0 ? (
                              <Spin size="default" />
                            ) : (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ width: '150px', marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>执行时间: {action.duration}ms</span>
                                  <span style={{ display: 'flex', alignItems: 'center', marginRight: '15px', color: '#808080', fontSize: '18px', whiteSpace: 'nowrap' }}>
                                    执行状态: {
                                      action.status === 0 ? '执行中' :
                                      action.status === 1 ? '成功' : '失败'
                                    }
                                    {action.status === 0 ? (
                                      <SyncOutlined spin style={{ color: '#1890ff', marginLeft: '8px', fontSize: '20px' }} />
                                    ) : action.status === 1 ? (
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
      </>
    );
  }

  const renderSceneRunDetailForm = () => {
    return (
      <>
        {selectedScene && (
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>场景名称：</span>
              <span>{selectedScene.sceneName}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>场景ID：</span>
              <span>{selectedScene.sceneId}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>状态：</span>
              <span style={{ color: selectedScene.status === 1 ? '#52c41a' : '#1890ff' }}>
                {selectedScene.status === 1 ? '成功' : selectedScene.status === 2 ? <span style={{ color: 'red' }}>失败</span> : '进行中'}
              </span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>执行时间：</span>
              <span>{selectedScene.duration}ms</span>
            </div>
          </div>
        )}
      </>
    )
  }

  const renderActionRunDetailForm = () => {
    return (
      <>
        {selectedAction && (
          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'start' }}>
              <span style={{ fontWeight: 'bold', color: '#333' }}>Action名称：</span>
              <span>{selectedAction.actionName}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>Action ID：</span>
              <span>{selectedAction.actionId}</span>
              
              <span style={{ fontWeight: 'bold', color: '#333' }}>状态：</span>
              <span style={{ color: selectedAction.status === 1 ? '#52c41a' : selectedAction.status === 2 ? 'red' : '#1890ff' }}>
                {selectedAction.status === 1 ? '成功' : selectedAction.status === 2 ? '失败' : '进行中'}
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
      </>
    )
  }

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (error) {
      message.error("获取运行记录失败");
      setLoading(false);
    } else if (data) {
      setTaskRunRecords(data);
      setLoading(false);
    }
  }, [isLoading, error, data]);

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
                    {getTaskRunStateElement()}
                </div>
              {renderAllSceneRunDetailComponent()}
            </div>
        </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: '18px', color: '#808080' }}>请从左侧选择一个场景</div>
        )}

        </Content>
 
        <Modal
            title="场景运行详情"
            open={isSceneModalVisible}
            onCancel={closeSceneModal}
            footer={[
            <Button key="submit" type="primary" onClick={closeSceneModal}>
                确定
            </Button>
            ]}
            width={800}
        >
          {renderSceneRunDetailForm()}
        </Modal>
        <Modal
          title="Action详情"
          open={isActionModalVisible}
          onOk={closeActionModal}
          onCancel={closeActionModal}
          footer={[
            <Button key="close" type="primary" onClick={closeActionModal}>
              关闭
            </Button>
          ]}
          width={800}
        >
          {renderActionRunDetailForm()}
        </Modal>
    </Layout>
  );
};

export default ReportDetail;
