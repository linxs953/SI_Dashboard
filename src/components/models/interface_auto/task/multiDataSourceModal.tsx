import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Form, Select, Switch, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getDsTypeName, getDependType, getActionMap } from './multiDataSourceUtils';
import { DataSourceForm } from './dataSourceForm';
import { TemplateDataForm } from './templateDataForm';
import { OutputTypeForm } from './outputTypeForm';
import DataMappingForm from './dataMappingForm';

const { TabPane } = Tabs;

interface MultiDataSourceModalProps {
  visible: boolean;
  actionDependency: DependInfo;
  sceneList: SceneInfo[];
  currentAction: string;
  updateFn: (action: DependInfo) => void;
  onCancel: () => void;
}

const MultiDataSourceModal: React.FC<MultiDataSourceModalProps> = ({
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
  const [showAllTabs, setShowAllTabs] = useState(dataSource.isMultDs);


  useEffect(() => {
    console.log(actionDependency);
    setShowAllTabs(actionDependency.isMultDs);
  }, [actionDependency]);

  const handleOk = () => {
    console.log(form.getFieldsValue());
    const updatedDependency = {
      ...actionDependency,
      dataSource: dataSource.dataSource || [],
      extra: form.getFieldValue('templateData'),
      isMultDs: showAllTabs
    };
    updateFn(updatedDependency);
  };

  const updateDsSpec: React.Dispatch<React.SetStateAction<DataSourceSpec[]>> = (dsSpec) => {
    setDataSource((prevState) => ({
      ...prevState,
      dsSpec: typeof dsSpec === 'function' ? dsSpec(prevState.dsSpec) : dsSpec
    }));
  }

  useEffect(() => {
    setDataSource(actionDependency);
  }, [actionDependency]);

  useEffect(() => {
    setCurrentActionId(currentAction);
  }, [currentAction]);

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

  return (
    <Modal
      title="多数据源配置"
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
                <DataMappingForm setActiveTab={setActiveTab} dataSources={dataSource.dataSource} dsSpec={dataSource.dsSpec} extra={dataSource.extra} setDsSpec={updateDsSpec} />
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
