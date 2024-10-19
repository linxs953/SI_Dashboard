import React, { useState, useEffect } from 'react';
import { Button, Form, FormInstance, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
const { Option } = Select;

interface OutputTypeFormProps {
  form: FormInstance;
  dataSpec: DependInfo;
  setDataSpec: (newDataSpec: DependInfo) => void;
  showAllTabs: boolean;
}

export const OutputTypeForm: React.FC<OutputTypeFormProps> = ({ form, dataSpec, setDataSpec, showAllTabs }) => {
  const [outputMeta, setOutputMeta] = useState<DependInfo>(dataSpec);

  const outputTypeChange = (value: string) => {
    const newOutputMeta = {
      ...outputMeta,
      output: {
        ...outputMeta.output,
        type: value
      }
    };
    setOutputMeta(newOutputMeta);
  }

  const getExtraContent = () => {
    if (!dataSpec.extra) {
      dataSpec.extra = "";
    }

    if (!showAllTabs) {
      // 单数据源情况
      const ds = dataSpec.dataSource
      if (ds.length > 0) {
        console.log(ds[0])
        if (ds[0].dsType === "3") {
          return ds[0].dataKey;
        }
        return ds[0].dependId;
      }
      return "";
    } else {
      // 多数据源情况
      if (dataSpec.extra === "") {
        return "";
      }
      let extraContent = dataSpec.extra;
      
      // 遍历 dsSpec 并将其写入 extraContent
      if (dataSpec.dsSpec) {
        Object.entries(dataSpec.dsSpec).forEach(([key, value]) => {
          extraContent = extraContent.replace(`$$${value.modelId}`, value.dependId);
        });
      }
      
      return extraContent;
    }
  }

  useEffect(() => {
    const newDataSpec = {
      ...dataSpec,
      output: {
        ...dataSpec.output,
        value: getExtraContent()
      }
    }
    setDataSpec(newDataSpec);
  }, [outputMeta, dataSpec.dsSpec]);

  return (
    <>
      <Form.Item name="outputType" label="数据输出类型">
        <Select placeholder="请选择数据输出类型" defaultValue={dataSpec.output.type} onChange={outputTypeChange}>
          <Option value="string">字符串</Option>
          <Option value="number">数字</Option>
          <Option value="boolean">布尔值</Option>
          <Option value="object">对象</Option>
          <Option value="array">数组</Option>
        </Select>
      </Form.Item>
      <Form.Item name="previewData" label="预览数据">
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {dataSpec.output.value}
        </pre>
      </Form.Item>
    </>
  );
};
