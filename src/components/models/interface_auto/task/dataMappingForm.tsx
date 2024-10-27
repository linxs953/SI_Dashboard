import React, { useEffect, useState } from 'react';
import { Form, Select, Switch, Button, Empty, Space } from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface DataMappingFormProps {
  setDsSpec: React.Dispatch<React.SetStateAction<DataSourceSpec[]>>;
  dsSpec: Array<DataSourceSpec>; // 新增: 数据源列表
  extra: string; // 新增: 额外信息
  dataSources: Array<DataSource>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}


const extraTemplateFieldRegex = ""

// 定义一个函数,接收正则表达式和字符串作为参数
const extractMatches = (regexStr: string, str: string): string[] => {
  try {
    const regex = new RegExp(regexStr);

    // 使用正则表达式匹配字符串
    const matches = str.match(regex);
    
    // 如果匹配成功且有结果,返回匹配结果数组
    if (matches && matches.length > 0) {
      return matches;
    } else {
      // 如果没有匹配结果,返回空数组
      return [];
    }
  } catch (error) {
    // 如果发生错误,打印错误信息并返回空数组
    console.error('正则匹配出错:', error);
    return [];
  }
};


const DataMappingForm: React.FC<DataMappingFormProps> = ({ 
  setDsSpec, 
  dsSpec, 
  extra,
  dataSources,
  setActiveTab
}) => {
  const [dsMapping, setDsMapping] = useState<DataSourceSpec[]>(dsSpec);

  useEffect(() => {
    console.log(dsSpec)
    setDsMapping(dsSpec);
  }, [dsSpec]);


  // 解析extra内容,提取$$开头的字段
  const parseExtraFields = (extra: string): string[] => {
    const regex = /\$\$(\w+)/g;
    const matches = extra.match(regex);
    if (matches) {
      return matches.map(match => match.slice(2)); // 去掉$$前缀
    }
    return [];
  };

  // 处理数据映射变化
  const handleMappingChange = (index: number, field: keyof DataSourceSpec, value: any) => {
    console.log(dsMapping)
    const newData = dsMapping.map((item, i) => {
      if (i === index) {
        if (field === 'dependName') {
          console.log(dataSources)
          const selectedDataSource = dataSources.find(ds => ds.name === value);
          console.log(dataSources)
          return { 
            ...item, 
            [field]: value,
            dependId: selectedDataSource ? selectedDataSource.dependId : ''
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setDsMapping(newData);
  };

  // 添加新的映射项
  const addMappingItem = () => {
    const newItem: DataSourceSpec = {
      dependId: '',
      dependName: '',
      modelId: '',
      needProcess: false,
    };
    setDsMapping([...dsMapping, newItem]);
  };

  // 删除映射项
  const removeMappingItem = (index: number) => {
    setDsMapping(dsMapping.filter((_, i) => i !== index));
  };

  const updateDsMap = () => {
    
    const newDsSpec = dsMapping.map((item) => ({
      dependId: item.dependId,
      dependName: item.dependName,
      modelId: item.modelId,
      needProcess: item.needProcess
    }))
    setDsSpec(newDsSpec)
  }

  return (
    <Form layout="vertical">
      {!extra ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂未配置数据模板"
          style={{ margin: '20px 0' }}
        >
          <Button type="primary" onClick={() => {
            setActiveTab('template');
          }}>
            配置数据模板
          </Button>
        </Empty>
      ) : (
        <>
          {dsMapping.map((item, index) => (
            <div key={index} style={{ marginBottom: 16, border: '1px solid #d9d9d9', padding: 16, borderRadius: 4 }}>
              <Form.Item label="">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Form.Item label="绑定数据" style={{ marginRight: 16, marginBottom: 0, flex: 1 }}>
                    <Select
                      style={{ width: '100%' }}
                      value={item.dependName}
                      onChange={(value) => handleMappingChange(index, 'dependName', value)}
                    >
                      {dataSources.map(source => (
                        source.name && <Option key={source.dependId} value={source.name}>{source.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="模板字段" style={{ marginRight: 16, marginBottom: 0, flex: 1 }}>
                    <Select
                      style={{ width: '100%' }}
                      value={item.modelId}
                      onChange={(value) => handleMappingChange(index, 'modelId', value)}
                    >
                      {
                        parseExtraFields(extra).map((field, index) => (
                          field && field.trim() !== '' && <Option key={index} value={field}>{field}</Option>
                        )).filter(Boolean)
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item style={{ marginRight: 16, marginBottom: 0 }} label="数据处理">
                    <Switch
                      checked={item.needProcess}
                      onChange={(checked) => handleMappingChange(index, 'needProcess', checked)}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }} label="操作">
                    <Space>
                      <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeMappingItem(index)}></Button>
                      <Button type="link" icon={<SaveOutlined />} onClick={updateDsMap}></Button>
                    </Space>
                  </Form.Item>
                </div>
              </Form.Item>
            </div>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={addMappingItem} block icon={<PlusOutlined />}>
              添加映射项
            </Button>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default DataMappingForm;
