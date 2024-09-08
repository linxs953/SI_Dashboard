import React, { act, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Modal, Table, Tooltip, message, InputNumber, Row, Col, FormInstance, Tabs, Select, Space, Layout } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SceneInfo from '../components/interface_auto/scene/sceneInfo';
import { Content } from 'antd/es/layout/layout';
import ActionList from '../components/interface_auto/scene/actionList';

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


const domain = import.meta.env.VITE_API_URL
const EditScene: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sceneData, setSceneData] = useState<SceneInfo | null>(null);
  const searchParams = new URLSearchParams(location.search);
  const sceneId = searchParams.get('sceneId');
  

  useEffect(() => {
    if (!sceneId) {
      showModal();
    } else {
      fetchSceneData(sceneId);
    }
  }, [location, sceneId]);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const fetchSceneData = async (scid: string) => {
    const response = await axios.get(`${domain}/scene/get?scid=${scid}`);
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
      sceneId: response.data.data.sceneId,
      sceneName: response.data.data.scname,
      sceneDescription: response.data.data.description,
      sceneRetries: response.data.data.retry,
      sceneTimeout: response.data.data.timeout,
      author: response.data.data.author,
      createTime: response.data.data.createAt,
      updateTime: response.data.data.updateAt,
      actionNum: response.data.data.actions?.length,
      actions: response.data.data.actions.map((action: any) => ({
        actionId: action.actionId,
        relateId: action.relateId,
        actionName: action.actionName,
        actionDescription: action.actionDescription,
        actionTimeout: action.timeout,
        actionRetry: action.retry,
        actionMethod: action.actionMethod,
        actionRoute: action.actionPath,
        actionExpect: action.expect,
        actionOutput: action.output,
        actionSearchKey: action.searchKey,
        actionDomain: action.domainKey,
        actionEnvironment: action.envKey,
        actionDependencies: action.dependency.map((dep: any) => ({
          dataKey: dep.dataKey,
          dependType: dep.refer.type,
          targetField: dep.refer.target,
          dsType: (() => {
            switch(dep.type) {
              case '1':
                return 'scene';
              case '2':
                return 'basic';
              case '3':
                return 'custom';
              case '4':
                return 'event';
            }
          })(),
          relateaction: dep.actionKey,
          customValue: dep.dataKey,
          cacheKey: dep.dataKey
        }))
      }))
    };
    
    setSceneData(data);
    form.setFieldsValue(data);
  };

  const updateScene = async () => {
    try {
      if (sceneData?.actions.length == 0) {
        message.error("列表数据为空")
        return
      }
      const data = {
        "scname": sceneData?.sceneName,
        "description": sceneData?.sceneDescription,
        "timeout": sceneData?.sceneTimeout,
        "retry": sceneData?.sceneRetries,
        "actions": sceneData?.actions.map((action: ActionInfo) => ({
          actionId: action.actionId,
          relateId: action.relateId,
          actionName: action.actionName,
          actionDescription: action.actionDescription,
          timeout: action.actionTimeout,
          retry: action.actionRetry,
          actionMethod: action.actionMethod,
          actionPath: action.actionRoute,
          expect: action.actionExpect,
          output: action.actionOutput,
          searchKey: action.actionSearchKey,
          domainKey: action.actionDomain,
          envKey: action.actionEnvironment,
          dependency: action.actionDependencies.map((dep) => ({
            dataKey: dep.dataKey,
            refer: {
              type: dep.dependType,
              target: dep.targetField
            },
            type: (() => {
              switch(dep.dsType) {
                case 'scene': return '1';
                case 'basic': return '2';
                case 'custom': return '3';
                case 'event': return '4';
                default: return '';
              }
            })(),
            actionKey: dep.relateaction,
            // dataKey: dep.customValue || dep.cacheKey
          }))
        }))
      }
      const response = await axios.put(`${domain}/scene/update?scid=${sceneId}`, data)
      if (response.status != 200) {
        message.error("保存场景失败")
        return
      }
      if (response.data.code && response.data.code >  0) {
        message.error("保存场景出现错误")
        return
      }
      navigate("/dashboard/api/scene")
      message.success("更新场景成功")
      return
      
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/dashboard/api/scene');
  };

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
                  <SceneInfo sceneDetail={sceneData as SceneInfo} onSceneDetailChange={(updatedSceneDetail: SceneInfo) => setSceneData(prevState => ({
                    ...prevState!,
                    ...updatedSceneDetail
                  }))} />
                  <ActionList 
                    actionList={sceneData?.actions || []} 
                    updateActionList={(updatedActionList: ActionInfo[]) => setSceneData(prevState => ({
                      ...prevState!,
                      actions: updatedActionList
                    }))}
                  />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', background: '#fff' }}>
                <Button style={{ marginRight: '10px' }} onClick={() => {
                    navigate('/dashboard/api/scene')
                  }
                }>取消</Button>
                <Button type="primary" onClick={updateScene}>保存</Button>
              </div>
          </Content>
        </Layout>
    </>
  );
};

export default EditScene;