import React, { useEffect, useState } from 'react';
import { Layout, Button, Modal, Result, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import SceneList from '../models/interface_auto/task/sceneList';
import TaskInfo from '../models/interface_auto/task/taskInfo';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const domain = import.meta.env.VITE_API_URL

const TaskDetails = () => {
  const [taskInfo, setTaskInfo] = useState<TaskDetail>({
    taskId: '',
    taskName: '',
    relateSceneNum: 0,
    description: '',
    timeout: 0,
    retry: 0,
    creator: '',
    creationTime: '',
    updateTime: '',
    taskDescription: '',
    author: '',
    scenesNum: 0,
    scenes: []
  })
  
  const [sceneList, setSceneList] = useState<SceneInfo[]>([])
  const searchParams = new URLSearchParams(location.search);
  const taskId = searchParams.get('taskId');  
  const navigate = useNavigate()

  const fetchTaskDetails = async () => {

    try {
      const response = await axios.get(`${domain}/task/getOne?taskId=${taskId}`);
      if (response.data && response.data.code === 0) {
          setTaskInfo({
            taskId: response.data.data.taskId,
            taskName: response.data.data.taskName,
            relateSceneNum: response.data.data.taskSpec.length,
            description: response.data.data.description,
            timeout: response.data.data.timeout ? response.data.data.timeout : 1,
            retry: response.data.data.retry ? response.data.data.retry : 1,
            creator: response.data.data.author,
            creationTime: response.data.data.createTime,
            updateTime: response.data.data.updateTime,
            taskDescription: response.data.data.description,
            author: response.data.data.author,
            scenesNum: response.data.data.taskSpec.length,
            scenes: response.data.data.taskSpec || []
          });
            
          let sceneInfoList: SceneInfo[] = response.data.data.taskSpec.map((scene: any) => (

            {
              sceneId: scene.sceneId,
              sceneName: scene.sceneName,
              sceneDescription: scene.description || "无描述",
              sceneTimeout: scene.timeout || 1,
              sceneRetries: scene.retry || 0,
              searchKey: scene.searchKey,
              environment: scene.envKey,
              actionList: scene.actions ? scene.actions.map((action: any) => ({
                ...action,
                actionMethod: action.actionMethod,
                relateId: action.relateId,
                actionRoute: action.actionPath,
                actionRetry: action.retry || 0,
                actionTimeout: action.timeout || 1,
                actionDomain: action.domainKey,
                actionEnvironment: action.envKey,
                actionSearchKey: action.searchKey,
                actionExpect: {
                  ...action.expect,
                  api: action.expect.api.map((apiItem:any) => {
                    return {
                      ...apiItem,
                      data: {
                        ...apiItem.data,
                        desireSetting: {
                          ...apiItem.data.desireSetting,
                          dataSource: apiItem.data.desireSetting.dataSource.map((ds:any) => ({
                            ...ds,
                            dsType: ds.type,
                          }))
                        }
                      }
                    }
                  })
                },
                actionOutput: action.output,
                actionDependencies: [
                  ...(action.dependency || []).map((dep: any) => ({
                    dataSource: dep.dataSource.map((ds: any) => {
                      return {
                        name: ds.name,
                        dependType: ds.type === "1" ? "scene" : ds.type === "2" ? "basic" : ds.type === "3" ? "custom" : "event",
                        dataKey: ds.dataKey,
                        actionKey: ds.actionKey,
                        dependId: ds.dependId,
                        searchCond: ds.searchCondArr,
                        dsType: ds.type,
                        actionId: ds.actionKey.split('.')[1] || "",
                        sceneId: ds.actionKey.split('.')[0] || ""
                      }
                    }),
                    dsSpec: dep.dsSpec.map((spec:any) => {
                      return {
                        dependId: spec.dependId,
                        dependName: dep.dataSource.find((ds:any) => ds.dependId === spec.dependId)?.name || "",
                        modelId: spec.fieldName,
                        needProcess: spec.needProcess || false
                      }
                    }),
                    extra: dep.extra,
                    isMultiDs: dep.isMultiDs,
                    mode: dep.mode,
                    refer:dep.refer,
                    output: dep.output
                  }))
                ],
              })) : []
            }));
          sceneInfoList = sceneInfoList.filter(scene => scene.actionList.length > 0);
          setSceneList(sceneInfoList);
          console.log(sceneInfoList)
      } else {
        message.error('获取任务详情失败');
      }
    } catch (error) {
      console.error('获取任务详情时出错:', error);
      message.error('获取任务详情时发生错误');
    }
  };

  const updateTask = async(taskInfo:TaskDetail, scenes:SceneInfo[]) => {
    console.log(scenes)
    const getDataSourceCode = (dsName:string) => {
      if (dsName === 'scene') return '1';
      if (dsName === 'basic') return '2';
      if (dsName === 'custom') return '3';
      return "4"
    }
    
    try {
      const requestBody = {
        taskId: taskInfo.taskId,
        taskName: taskInfo.taskName,
        author: taskInfo.creator,
        taskType: 'autoapi',
        description: taskInfo.description,
        taskSpec: scenes.map(scene => ({
          sceneId: scene.sceneId,
          sceneName: scene.sceneName,
          description: scene.sceneDescription,
          timeout: scene.sceneTimeout,
          retry: scene.sceneRetries,
          author: "linxs",
          searchKey: scene.searchKey,
          envKey: scene.environment,
          actions: scene.actionList.map(action => ({
            actionId: action.actionId,
            relateId: action.relateId,
            actionName: action.actionName,
            actionPath: action.actionRoute,
            actionMethod: action.actionMethod,
            timeout: action.actionTimeout,
            retry: action.actionRetry,
            domainKey: action.actionDomain,
            envKey: action.actionEnvironment,
            searchKey: action.actionSearchKey,
            expect: {
              ...action.actionExpect,
              api: action.actionExpect.api.map((apiItem:any) => {
                return {
                  ...apiItem,
                  data: {
                    ...apiItem.data,
                    desireSetting: {
                      ...apiItem.data.desireSetting,
                      dataSource: apiItem.data.desireSetting.dataSource.map((ds:any) => ({
                        ...ds,
                        type: ds.dsType,
                        dsType: undefined
                      }))
                    }
                  }
                }
              })
            },
            output: action.actionOutput,
            dependency: action.actionDependencies.map((dep:any) => {
              const baseDep = {
                actionKey: "",
                dataKey: "",
                type: getDataSourceCode(dep.refer.type),
                output: {
                  type: dep.output.type,
                  value: dep.output.value
                },
                refer: {
                  type: dep.refer.type,
                  target: dep.refer.target,
                  dataType: dep.refer.dataType
                },
                mode: dep.mode,
                extra: dep.extra,
                isMultiDs: dep.isMultiDs,
                dsSpec: dep.dsSpec.map((spec:DataSourceSpec) => {
                  return {
                    dependId: spec.dependId,
                    fieldName: spec.modelId,
                    needProcess: spec.needProcess
                  }
                }),
                dataSource: dep.dataSource.map((ds:any) => {
                  return {
                    name: ds.name,
                    actionKey: ds.type === "1" ? `${ds.sceneId}.${ds.actionId}` : ds.actionKey,
                    dataKey: ds.dataKey,
                    type: ds.dsType,
                    dependId: ds.dependId,
                    searchCondArr: ds.searchCond,
                    sceneId: ds.sceneId || "",
                    actionId: ds.actionId || ""
                  }
                })
              };
              return baseDep
            }), 
            headers: action.actionDependencies
              .filter(dep => dep.refer.type === 'headers')
              .reduce((acc, dep) => ({...acc, [dep.refer.target]: dep.output.value}), {})
          }))
        }))
      };
      console.log(requestBody)
      const response = await axios.post(`${domain}/task/update?taskId=${taskInfo.taskId}`, requestBody);
      
      if (response.data && response.data.code === 0) {
        message.success('更新任务成功');
      } else {
        message.error('更新任务失败');
      }
    } catch (error) {
      console.error('更新任务时出错:', error);
      message.error('更新任务时发生错误');
    }
  }

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);


  return (
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Content style={{ padding: '0 50px', width: '100%', flex: 1 }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <TaskInfo taskDetail={taskInfo} onTaskDetailChange={setTaskInfo} />
                  <SceneList sceneList={sceneList} updateSceneList={setSceneList} />
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0', background: '#fff' }}>
                    <Button style={{ marginRight: '10px' }} onClick={() => {
                      navigate('/dashboard/api/task')
                    }}
                    >取消</Button>
                    <Button type="primary" onClick={() => {
                      updateTask(taskInfo, sceneList);
                      navigate('/dashboard/api/task')
                    }}>保存</Button>
                  </div>
              </div>

          </Content>

          {(!taskId || taskId === "") && (
          <Modal
            title="警告"
            open={true}
            footer={[
              <Button key="ok" type="primary" danger onClick={() => {
                navigate('/dashboard/api/task')
              }}>
                确定
              </Button>
            ]}
            closable={false}
            maskClosable={false}
          >无效的请求信息
          </Modal>
          )}
      </Layout>
  );
};

export default TaskDetails;