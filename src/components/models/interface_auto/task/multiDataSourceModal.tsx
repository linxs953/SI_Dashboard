import React, { SetStateAction, useEffect, useState } from 'react';
import { Modal, Tabs, Form, Select, Switch, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getDsTypeName, getDependType, getActionMap } from './multiDataSourceUtils';
import { DataSourceForm } from './dataSourceForm';
import { TemplateDataForm } from './templateDataForm';
import { OutputTypeForm } from './outputTypeForm';
import DataMappingForm from './dataMappingForm';

const { TabPane } = Tabs;

interface MultiDataSourceModalProps {
  customTitle?: string;
  visible: boolean;
  actionDependency: DependInfo;
  sceneList: SceneInfo[];
  currentAction: string;
  updateFn: (action: DependInfo) => void;
  onCancel: () => void;
}

const MultiDataSourceModal: React.FC<MultiDataSourceModalProps> = ({
  customTitle,
  visible,
  actionDependency,
  sceneList,
  currentAction,
  updateFn,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('dataSource');
  const [dataSource, setDataSource] = useState<DependInfo>(actionDependency);
  const [currentActionId, setCurrentActionId] = useState<string>(currentAction);
  const [showAllTabs, setShowAllTabs] = useState(dataSource.isMultiDs);
  const [dsSpec, setDsSpec] = useState<DataSourceSpec[]>(actionDependency.dsSpec || []);

  useEffect(() => {
    console.log(actionDependency)
    setShowAllTabs(actionDependency.isMultiDs);
  }, [actionDependency]);

  useEffect(() => {
    setDataSource(actionDependency);
    setDsSpec(actionDependency.dsSpec || []);
  }, [actionDependency]);

  useEffect(() => {
    setCurrentActionId(currentAction);
  }, [currentAction]);

  const handleOk = () => {
    const newDataSource = dataSource.dataSource.map(ds => {
      if (ds.dsType === '1') {
        const newActionKey = `${ds.sceneId}.${ds.actionId}`
        return {
          ...ds,
          actionKey: newActionKey,
          dependId: ds.dependId
        }
      }
      console.log(ds)
      return ds;
    })

    
    const updatedDependency = {
      ...actionDependency,
      output: dataSource.output,
      dataSource: newDataSource || [],
      extra: form.getFieldValue('templateData') || dataSource.extra,
      isMultiDs: showAllTabs,
      dsSpec: dsSpec, // 使用最新的 dsSpec 状态
    };

    console.log(updatedDependency)
    updateFn(updatedDependency);
  };

  const updateDsSpec = (value: SetStateAction<DataSourceSpec[]>) => {
    setDsSpec(typeof value === 'function' ? value(dsSpec) : value);
  }

  const handleExtraChange = (value: Partial<DependInfo>) => {
    console.log(value);
    setDataSource(prevState => ({
      ...prevState,
      ...value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setShowAllTabs(checked);
    setActiveTab('dataSource');  // 切换到数据源标签页
  };


  useEffect(() => {
    console.log(dataSource)
  }, [dataSource])

  return (
    <Modal
      title={customTitle || "多数据源配置"}
      open={visible}
      width={1300}
      okText="保存"
      cancelText="取消"
      onOk={handleOk}
      onCancel={onCancel}
      style={{ minHeight: '300px', overflowY: 'auto' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Switch
          checkedChildren="多数据源"
          unCheckedChildren="单数据源"
          checked={showAllTabs}
          onChange={handleSwitchChange}
        />
      </div>
      <div style={{ height: '500px', overflowY: 'auto' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="数据源依赖" key="dataSource">
            {activeTab === 'dataSource' && (
              <DataSourceForm
                form={form}
                dataSource={dataSource}
                setDataSource={setDataSource}
                sceneList={sceneList}
                getActionMap={(dsType: string) => getActionMap(sceneList, currentActionId)}
                getDsTypeName={getDsTypeName}
                getDependType={getDependType}
                currentActionId={currentActionId}
              />
            )}
          </TabPane>
          {showAllTabs && (
            <TabPane tab="模板数据定义" key="template">
              {activeTab === 'template' && (
                <TemplateDataForm 
                  form={form} 
                  dependInfo={dataSource} 
                  onExtraChange={handleExtraChange} 
                />
              )}
            </TabPane>
          )}
          {showAllTabs && (
            <TabPane tab="关联数据" key="dataMapping">
              {activeTab === 'dataMapping' && (
                <DataMappingForm 
                  setActiveTab={setActiveTab} 
                  dataSources={dataSource.dataSource} 
                  dsSpec={dsSpec} 
                  extra={dataSource.extra} 
                  setDsSpec={updateDsSpec} 
                />
              )}
            </TabPane>
          )}
          <TabPane tab="数据输出" key="output">
            {activeTab === 'output' && (
              <OutputTypeForm form={form} dataSpec={dataSource} setDataSpec={setDataSource} showAllTabs={showAllTabs} />
            )}
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default MultiDataSourceModal;

