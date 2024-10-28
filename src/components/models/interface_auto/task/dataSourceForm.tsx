import React, { useEffect } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

// 定义组件props的接口
interface DataSourceFormProps {
  form: any; // 这里使用any,因为我们不确定form的具体类型
  dataSource: DependInfo;
  setDataSource: React.Dispatch<React.SetStateAction<DependInfo>>;
  sceneList: any[]; // 假设sceneList是一个数组,如果知道具体类型可以更精确地定义
  getActionMap: (dsType: string) => any;
  getDsTypeName: (dsType: string) => string;
  getDependType: (dsType: string) => string;
  currentActionId: string; // 添加这个属性来获取当前编辑的步骤ID
}


export const DataSourceForm: React.FC<DataSourceFormProps> = ({
  form,
  dataSource,
  setDataSource,
  sceneList,
  getDsTypeName,
  getDependType,
  currentActionId
}) => {

  const handleDataSourceChange = (index: number, field: keyof DataSource, value: string) => {
    const newDataSource = dataSource.dataSource.map((dsItem: DataSource, dsIdx: number) => {
      if (dsIdx === index) {
        let updatedItem = { ...dsItem, [field]: value };
        
        // 如果改变的是数据源类型，重置相关字段
        if (field === 'dsType') {
          updatedItem = {
            ...updatedItem,
            dependType: getDependType(value),
            actionKey: '',
            dataKey: '',
            searchCond: [],
            sceneId: '',
            actionId: ''
          };
        }

        // 如果改变的是场景ID，重置步骤ID和数据键
        if (field === 'sceneId') {
          updatedItem = {
            ...updatedItem,
            sceneId: value,
            actionId: ' ',
          };
        }
        
        return updatedItem;
      }
      return dsItem;
    });

    setDataSource((prevState) => ({
      ...prevState,
      dataSource: newDataSource,
    }));
  };

  const getActionOptions = (dependId: string) => {
    if (!dependId) return [];
    
    try {
      const currentScene = sceneList.find(scene => scene.sceneId === dependId);
      if (!currentScene) return [];
      const allActions = currentScene.actionList || [];

      const currentActionIndex = allActions.findIndex((action:ActionInfo) => action.actionId === currentActionId);

      console.log(`当前步骤 index ${currentActionIndex}`)

      const currentSceneId = sceneList.find(scene => scene.actionList.some((action:ActionInfo) => action.actionId === currentActionId))?.sceneId
      console.log(currentSceneId)
      if (dependId === currentSceneId) {
        
        // 如果是当前编辑的场景，只显示当前步骤之前的步骤
        // console.log(allActions.slice(0, currentActionIndex)[0].actionName)
        return allActions.slice(0, currentActionIndex).map((action:ActionInfo,index:number) => (
          <Option key={action.actionId} value={action.actionId}>{`${index+1}-${action.actionName}`}</Option>
        ));
      } else {
        // 如果不是当前编辑的场景，显示该场景的所有步骤
        return allActions.map((action:ActionInfo,index:number) => (
          <Option key={action.actionId} value={action.actionId}>{`${index+1}-${action.actionName}`}</Option>
        ));
      }
    } catch (error) {
      console.error('Error getting action options:', error);
      return [];
    }
  };

  const renderSceneType = (item: DataSource, index: number) => {
    item.sceneId = (item.sceneId != '') ? item.sceneId : item.actionKey.split('.')[0] 
    item.actionId = (item.actionId != '') ? item.actionId : item.actionKey.split('.')[1]
    console.log(item)
    return (
      <>
        <Form.Item
          label="指定场景"
          style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
        >
          <Select 
            placeholder="选择场景"
            value={item.sceneId}
            onChange={(value: string) => {
              handleDataSourceChange(index, 'sceneId', value);
            }}
          >
            {sceneList.map((scene: any) => (
              <Option key={scene.sceneId} value={scene.sceneId}>{scene.sceneName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="指定步骤"
          style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
        >
          <Select 
            placeholder="选择步骤"
            value={item.actionId}
            onChange={(value: string) => handleDataSourceChange(index, 'actionId', value)}
          >
            {getActionOptions(item.sceneId)}
          </Select>
        </Form.Item>
        <Form.Item
          label="引用数据"
          style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
        >
          <Input
            placeholder="输入引用数据"
            value={item.dataKey}
            onChange={(e) => handleDataSourceChange(index, 'dataKey', e.target.value)}
          />
        </Form.Item>
      </>
    );
  };

  const renderBasicDataType = (item: DataSource, index: number) => (
    <>
      <Form.Item
        label="键名"
        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
      >
        <Input
          placeholder="输入键名"
          value={item.actionKey}
          onChange={(e) => handleDataSourceChange(index, 'actionKey', e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label="引用数据"
        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
      >
        <Input
          placeholder="输入引用数据"
          value={item.dataKey}
          onChange={(e) => handleDataSourceChange(index, 'dataKey', e.target.value)}
        />
      </Form.Item>
    </>
  );

  const renderCustomDataType = (item: DataSource, index: number) => (
    <Form.Item
      label="自定义值"
      style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
    >
      <Input
        placeholder="输入自定义值"
        value={item.dataKey}
        onChange={(e) => handleDataSourceChange(index, 'dataKey', e.target.value)}
      />
    </Form.Item>
  );

  const renderDataSourceItem = (item: DataSource, index: number) => (
    <div key={index} style={{ display: 'flex', marginBottom: '10px', alignItems: 'center', flexWrap: 'nowrap' }}>
      <Form.Item
        label="数据源类型"
        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
      >
        <Select 
          placeholder="选择数据源类型"
          value={getDsTypeName(item.dsType)}
          onChange={(value: string) => handleDataSourceChange(index, 'dsType', value)}
        >
          <Option value="1">场景</Option>
          <Option value="2">基础数据</Option>
          <Option value="3">自定义数据</Option>
          <Option value="4">基于事件生成</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="名称"
        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
      >
        <Input
          placeholder="输入数据源名称"
          value={item.name}
          onChange={(e) => handleDataSourceChange(index, 'name', e.target.value)}
        />
      </Form.Item>
      
      {item.dsType === '1' && renderSceneType(item, index)}
      {item.dsType === '2' && renderBasicDataType(item, index)}
      {item.dsType === '3' && renderCustomDataType(item, index)}
      
      <MinusOutlined 
        style={{ cursor: 'pointer', color: 'red', fontSize: '16px', marginLeft: '8px' }}
        onClick={() => {
          setDataSource((prevState) => ({
            ...prevState,
            dataSource: prevState.dataSource.filter((_: DataSource, i: number) => i !== index),
          }));
        }}
      />
    </div>
  );

  const getDependId = async () => {
    const domain = import.meta.env.VITE_API_URL
    const url = `${domain}/toolgen/depId`
    const response = await axios.get(url)
    if (response.status === 200) {
      if (!response.data.data) {
        return ""
      } else {
        return response.data.data
      }
    } else {
      return ""
    }
  }

  useEffect(() => {
    console.log(dataSource.dataSource)
  }, [])

  return (
    <Form form={form} layout="horizontal">
      {dataSource.dataSource.map((item: DataSource, index: number) => renderDataSourceItem(item, index))}
      <Form.Item>
        <Button 
          type="dashed" 
          onClick={async () => {
            const dependId = await getDependId()
            const newDataSource: DataSource = {
              dsType: '1',
              dependType: 'scene',
              actionKey: '',
              dataKey: '',
              name: '',
              dependId: dependId,
              searchCond: [],
              sceneId: '',
              actionId: ''
            };
            setDataSource((prevState) => ({
              ...prevState,
              dataSource: [...prevState.dataSource, newDataSource]
            }));
          }} 
          block 
          icon={<PlusOutlined />}
        >
          添加数据源
        </Button>
      </Form.Item>
    </Form>
  );
};
