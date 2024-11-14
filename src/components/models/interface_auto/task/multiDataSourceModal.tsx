import React, { SetStateAction, useEffect, useState } from 'react';
import { Modal, Tabs, Form, Select, Switch, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
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

const getDependId = async () => {
  try {
    const domain = import.meta.env.VITE_API_URL;
    const url = `${domain}/toolgen/depId`;
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data.data || "";
    }
    return "";
  } catch (error) {
    console.error('获取 dependId 失败:', error);
    return "";
  }
};

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
  const [showAllTabs, setShowAllTabs] = useState(actionDependency.isMultiDs);
  const [dsSpec, setDsSpec] = useState<DataSourceSpec[]>(actionDependency.dsSpec || []);

  useEffect(() => {
    setDataSource(actionDependency);
    setDsSpec(actionDependency.dsSpec || []);
    setShowAllTabs(actionDependency.isMultiDs);
    form.setFieldsValue({
      templateData: actionDependency.extra
    });
  }, [actionDependency, form]);

  useEffect(() => {
    setCurrentActionId(currentAction);
  }, [currentAction]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const newDataSource = dataSource.dataSource.map(ds => {
        if (ds.dsType === '1') {
          const newActionKey = `${ds.sceneId}.${ds.actionId}`;
          return {
            ...ds,
            actionKey: newActionKey,
            dependType: getDependType(ds.dsType),
            searchCond: ds.searchCond || [],
          };
        }
        return {
          ...ds,
          dependType: getDependType(ds.dsType),
          searchCond: ds.searchCond || [],
        };
      });

      const updatedDependency: DependInfo = {
        ...dataSource,
        dataSource: newDataSource,
        extra: values.templateData || dataSource.extra,
        isMultiDs: showAllTabs,
        dsSpec: dsSpec,
        output: dataSource.output || {},
      };

      console.log('保存的完整数据:', updatedDependency);
      updateFn(updatedDependency);
    }).catch(err => {
      console.error('表单验证失败:', err);
    });
  };

  const addNewDataSource = async () => {
    const dependId = await getDependId();
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
    
    setDataSource(prevState => ({
      ...prevState,
      dataSource: [...prevState.dataSource, newDataSource]
    }));
  };

  const handleModalOk = () => {
    const isValid = dataSource.dataSource.every(ds => {
      if (ds.dsType === '1') {
        return ds.sceneId && ds.actionId && ds.name;
      }
      return ds.name && ds.dataKey;
    });

    if (!isValid) {
      message.error('请填写完整的数据源信息');
      return;
    }

    const updatedDependency: DependInfo = {
      ...actionDependency,
      dataSource: dataSource.dataSource.map(ds => {
        if (ds.dsType === '1') {
          return {
            ...ds,
            actionKey: `${ds.sceneId}.${ds.actionId}`,
            dependType: getDependType(ds.dsType),
            searchCond: ds.searchCond || [],
          };
        }
        return {
          ...ds,
          dependType: getDependType(ds.dsType),
          searchCond: ds.searchCond || [],
        };
      }),
      extra: form.getFieldValue('templateData') || dataSource.extra,
      isMultiDs: showAllTabs,
      dsSpec: dsSpec,
      output: dataSource.output || {},
    };

    console.log('即将保存的数据:', updatedDependency);
    
    updateFn(updatedDependency);
    
    message.success('保存成功');
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
      onOk={handleModalOk}
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

