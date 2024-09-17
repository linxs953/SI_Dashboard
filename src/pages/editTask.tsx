import React, { useEffect, useState } from 'react';
import { Layout, Button, Modal, Result, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
// import "../../../node_modules/antd/dist/reset.css"
import SceneList from '../components/interface_auto/task/sceneList';
import TaskInfo from '../components/interface_auto/task/taskInfo';
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
      updateTime: ''
  })
  
  const [sceneList, setSceneList] = useState<SceneInfo[]>([])
  const searchParams = new URLSearchParams(location.search);
  const taskId = searchParams.get('taskId');  
  const navigate = useNavigate()

  const fetchTaskDetails = async () => {
    const getDataSource = (type:string) => {
      if (type === '1') return 'scene';
      if (type === '2') return 'basic';
      if (type === '3') return 'custom';
      return 'event'
    }

    const processString = (str: string): string => {
      if (!str.includes('.')) {
        return str;
      }
      const parts = str.split('.');
      return `${parts.slice(1).join('.')}`;
    }
    try {
      const response = await axios.get(`${domain}/task/getOne?taskId=${taskId}`);
      if (response.data && response.data.code === 0) {
          setTaskInfo({
            taskId: response.data.data.taskId,
            taskName: response.data.data.taskName,
            relateSceneNum: response.data.data.taskSpec.length,
            description: response.data.data.description ? response.data.data.description : "无描述",
            timeout: response.data.data.timeout ? response.data.data.timeout : 1,
            retry: response.data.data.retry ? response.data.data.retry : 1,
            creator: response.data.data.author,
            creationTime: response.data.data.createTime,
            updateTime: response.data.data.updateTime,
          });
          const getRelateStep = (dep:any)=> {
            if (dep?.type != "1") return ""
            if (dep?.dataKey != "") return `${dep.actionKey}/${dep.dataKey}`
            if (dep?.dataKey == "") return `${dep.actionKey}`
          }

          const getCacheKey = (dep:any) => {
            if (dep?.type != "2") return ""
            if (dep?.dataKey != "") return `${dep.actionKey}/${dep.dataKey}`
            if (dep?.dataKey == "") return `${dep.actionKey}`
          }
          
          
          let sceneInfoList: SceneInfo[] = response.data.data.taskSpec.map(scene => (

            {
              sceneId: scene.sceneId,
              sceneName: scene.sceneName,
              sceneDescription: scene.description || "无描述",
              sceneTimeout: scene.timeout || 1,
              sceneRetries: scene.retry || 0,
              searchKey: scene.searchKey,
              environment: scene.envKey,
              actionList: scene.actions ? scene.actions.map(action => ({
                ...action,
                actionMethod: action.actionMethod,
                relateId: action.relateId,
                actionRoute: action.actionPath,
                actionRetry: action.retry || 0,
                actionTimeout: action.timeout || 1,
                actionDomain: action.domainKey,
                actionEnvironment: action.envKey,
                actionSearchKey: action.searchKey,
                actionExpect: action.expect,
                actionOutput: action.output,
                actionDependencies: [
                  ...(action.dependency || []).map(dep => ({
                    dependType: dep?.refer?.type || '',
                    targetField: processString(dep.refer?.target),
                    dsType: getDataSource(dep?.type),
                    dataKey:dep?.dataKey  || '' ,
                    customValue: dep?.type === "3" ? `${dep?.dataKey}` || '' : '',
                    cacheKey: getCacheKey(dep),
                    relateStep: getRelateStep(dep)
                  })),
                ]
              })) : []
            }));
          sceneInfoList = sceneInfoList.filter(scene => scene.actionList.length > 0);
          setSceneList(sceneInfoList);
      } else {
        message.error('获取任务详情失败');
      }
    } catch (error) {
      console.error('获取任务详情时出错:', error);
      message.error('获取任务详情时发生错误');
    }
  };

  const updateTask = async(taskInfo:TaskDetail, scenes:SceneInfo[]) => {
    const getDataSourceCode = (dsName:string) => {
      if (dsName === 'scene') return '1';
      if (dsName === 'basic') return '2';
      if (dsName === 'custom') return '3';
      return "4"
    }

    const getActionKey = (dep:any) =>{
      if (dep?.dsType == "scene") {
        if (dep?.relateStep?.includes('/')) {
          return dep.relateStep.split('/')[0]
        }
        return dep?.relateStep
      }
      if (dep?.dsType == "basic") {
        if (dep?.cacheKey?.includes('/')) {
          return dep.cacheKey.split('/')[0]
        }
        return dep?.cacheKey
      }
      return ""
    }

    const getDataKey = (dep:any) =>{
      if (dep?.dsType == "scene") {
        if (dep?.relateStep?.includes('/')) {
          return dep.relateStep.split('/')[1]
        }
        return dep?.relateStep
      }
      if (dep?.dsType == "basic") {
        if (dep?.cacheKey?.includes('/')) {
          return dep.cacheKey.split('/')[1]
        }
        return dep?.cacheKey
      }
      return ""
    }
    
    try {
      const requestBody = {
        taskId: taskInfo.taskId,
        taskName: taskInfo.taskName,
        author: taskInfo.creator,
        // description: taskInfo.description,
        // timeout: taskInfo.timeout,
        // retry: taskInfo.retry,
        taskType: 'autoapi',
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
            expect: action.actionExpect,
            output: action.actionOutput,
            dependency: action.actionDependencies.map(dep => {
              const baseDep = {
                actionKey: '',
                dataKey: '',
                type: getDataSourceCode(dep.dsType),
                refer: {
                  type: dep.dependType,
                  target: dep.targetField
                }
              };
              
              switch(dep.dsType) {
                case 'scene':
                  return { ...baseDep, actionKey: getActionKey(dep),dataKey: getDataKey(dep) };
                case 'basic':
                  return { ...baseDep, actionKey: getActionKey(dep),dataKey: getDataKey(dep) };
                case 'custom':
                  return { ...baseDep, dataKey: dep.customValue };
                case 'event':
                  return { ...baseDep, dataKey: dep.eventKey };
                default:
                  return baseDep;
              }
            }),
            headers: action.actionDependencies
              .filter(dep => dep.dependType === 'headers')
              .reduce((acc, dep) => ({...acc, [dep.targetField]: dep.customValue}), {})
          }))
        }))
      };


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