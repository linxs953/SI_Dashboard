import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import "../../../node_modules/antd/dist/reset.css"
import SceneList from './task/sceneList';
import TaskInfo from './task/taskInfo';

const TaskDetails = () => {
  const [taskInfo, setTaskInfo] = useState<TaskDetail>({
      taskId: '',
      taskName: '',
      relateSceneNum: 0,
      description: '',
      timeout: 0,
      retry: 0,
      creator: '',
      creationTime: ''
  })
  
  const [sceneList, setSceneList] = useState<SceneInfo[]>([])
  
  useEffect(() => {
    const taskInfo:TaskDetail = {
      taskId: 'T001',
      taskName: '项目A',
      relateSceneNum: 5,
      description: '这是一个关于数据分析的任务',
      creator: '张三',
      creationTime: '2023-09-01',
      timeout: 10,
      retry: 3
    }
    const sceneList = [
      {
        sceneId: 'S001',
        sceneName: '场景1',
        sceneDescription: '这是一个场景',
        sceneTimeout: 10,
        sceneRetries: 1,
        actionList: [
          {
            stepId: 'A001',
            stepName: '步骤1',
            stepDescription: '这是一个步骤',
            stepTimeout: 10,
            stepRetry: 1,
            stepMethod: 'GET',
            stepRoute: '/api/data',
            stepDependencies: [
              {
                dependType: 'headers',
                targetField: 'Authorization',
                dsType: 'scene',
                relateStep: 'S002.A001'
              },
              {
                dependType: 'payload',
                targetField: 'account',
                dsType: 'basic',
                cacheKey: 'td.user.0.phone'
              },
              {
                dependType: 'params',
                targetField: 'page',
                dsType: 'custom',
                customValue: '10'
              },
              {
                dependType: 'path',
                targetField: 'orderId',
                dsType: 'custom',
                customValue: '123456'
              }
            ]
          }
        ]
      },
      {
        sceneId: 'S002',
        sceneName: '场景2',
        sceneDescription: '这是一个场景',
        sceneTimeout: 10,
        sceneRetries: 1,
        actionList: [
          {
            stepId: 'B001',
            stepName: '步骤2',
            stepDescription: '这是一个步骤',
            stepTimeout: 10,
            stepRetry: 1,
            stepMethod: 'GET',
            stepRoute: '/api/data2',
            stepDependencies: []
          }
        ]
      },
      {
        sceneId: 'S003',
        sceneName: '场景3',
        sceneDescription: '这是一个场景',
        sceneTimeout: 10,
        sceneRetries: 1,
        actionList: [
          {
            stepId: 'C001',
            stepName: '步骤1',
            stepDescription: '这是一个步骤',
            stepTimeout: 10,
            stepRetry: 1,
            stepMethod: 'GET',
            stepRoute: '/api/data3',
            stepDependencies: []
          }
        ]
      }
    ]
    setTaskInfo(taskInfo)
    setSceneList(sceneList)
  }, [])

  return (
      <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Content style={{ padding: '0 50px', width: '100%', flex: 1 }}>
              <div style={{ background: '#fff', padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <TaskInfo taskDetail={taskInfo} onTaskDetailChange={setTaskInfo} />
                  <SceneList sceneList={sceneList} updateSceneList={setSceneList} />
              </div>
          </Content>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#fff' }}>
            <Button style={{ marginRight: '10px' }}>取消</Button>
            <Button type="primary" onClick={() => {
              console.log(taskInfo);
              console.log(sceneList);
            }}>保存</Button>
          </div>
      </Layout>
  );
};

export default TaskDetails;