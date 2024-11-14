import React, { useState, useEffect } from 'react';
import { Modal, Select, Form, Input, Space, Button, Table, Switch, message } from 'antd';
import Editor from "@monaco-editor/react";
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface FieldRule {
  key?: string;
  fieldName: string;
  required: boolean;
  dataType: string;
  pattern?: string;
  description?: string;
}

interface EditSpecModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  value: string;
  onChange: (value: string) => void;
}

const EditSpecModal: React.FC<EditSpecModalProps> = ({
  visible,
  onCancel,
  onOk,
  value,
  onChange,
}) => {
  const [language, setLanguage] = useState('go');
  const [form] = Form.useForm<{ rules: FieldRule[] }>();
  const [keyCounter, setKeyCounter] = useState(0);
  const [localSpec, setLocalSpec] = useState<string>('');

  // 初始化时解析 spec
  useEffect(() => {
    if (visible && value) {
      try {
        // 尝试解析 JSON 格式的 spec
        const parsedSpec = JSON.parse(value);
        setLocalSpec(JSON.stringify(parsedSpec, null, 2));
        
        // 如果有验证规则，设置到表单中
        if (parsedSpec.validationRules) {
          const rulesWithKeys = parsedSpec.validationRules.map((rule: any, index: number) => ({
            ...rule,
            key: `field-${index}`
          }));
          form.setFieldsValue({ rules: rulesWithKeys });
        } else {
          form.setFieldsValue({ rules: [] });
        }
      } catch (error) {
        // 如果不是 JSON 格式，直接显示原始内容
        setLocalSpec(value);
        form.setFieldsValue({ rules: [] });
      }
    }
  }, [visible, value, form]);

  const handleSpecChange = (newValue: string | undefined) => {
    setLocalSpec(newValue || '');
    onChange(newValue || '');
  };

  const handleModalOk = async () => {
    try {
      const formValues = await form.validateFields();
      let finalSpec = localSpec;

      // 如果是 JSON 格式，更新验证规则
      try {
        const specObj = JSON.parse(localSpec);
        specObj.validationRules = formValues.rules;
        finalSpec = JSON.stringify(specObj, null, 2);
      } catch (error) {
        message.warning('Spec 格式不是有效的 JSON');
      }

      onChange(finalSpec);
      onOk();
    } catch (error) {
      message.error('请检查表单填写是否正确');
    }
  };

  const languageOptions = [
    { label: 'Go', value: 'go' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'JSON', value: 'json' },
  ];

  const dataTypeOptions = [
    { label: '字符串', value: 'string' },
    { label: '数字', value: 'number' },
    { label: '布尔值', value: 'boolean' },
    { label: '对象', value: 'object' },
    { label: '数组', value: 'array' },
  ];

  const columns = [
    {
      title: '字段名',
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: '20%',
      render: (_: any, record: FieldRule, index: number) => (
        <Form.Item
          name={['rules', index, 'fieldName']}
          rules={[{ required: true, message: '请输入字段名' }]}
          style={{ margin: 0 }}
        >
          <Input placeholder="请输入字段名" />
        </Form.Item>
      ),
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      width: '10%',
      render: (_: any, record: FieldRule, index: number) => (
        <Form.Item
          name={['rules', index, 'required']}
          valuePropName="checked"
          style={{ margin: 0 }}
        >
          <Switch size="small" />
        </Form.Item>
      ),
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      width: '15%',
      render: (_: any, record: FieldRule, index: number) => (
        <Form.Item
          name={['rules', index, 'dataType']}
          rules={[{ required: true, message: '请选择数据类型' }]}
          style={{ margin: 0 }}
        >
          <Select options={dataTypeOptions} placeholder="请选择" />
        </Form.Item>
      ),
    },
    {
      title: '正则校验',
      dataIndex: 'pattern',
      key: 'pattern',
      width: '25%',
      render: (_: any, record: FieldRule, index: number) => (
        <Form.Item
          name={['rules', index, 'pattern']}
          style={{ margin: 0 }}
        >
          <Input placeholder="选填，输入正则表达式" />
        </Form.Item>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      render: (_: any, record: FieldRule, index: number) => (
        <Form.Item
          name={['rules', index, 'description']}
          style={{ margin: 0 }}
        >
          <Input placeholder="选填，字段描述" />
        </Form.Item>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (_: any, record: FieldRule, index: number) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const newRules = form.getFieldValue('rules').filter((_: any, i: number) => i !== index);
            form.setFieldsValue({ rules: newRules });
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title="编辑数据定义"
      open={visible}
      onOk={handleModalOk}
      onCancel={onCancel}
      width={1000}
      bodyStyle={{ height: '80vh' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <Select
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            style={{ width: 120 }}
            placeholder="选择语言"
          />
        </div>
        <div style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          marginBottom: '24px'
        }}>
          <Editor
            height="40vh"
            defaultLanguage="go"
            language={language}
            value={localSpec}
            onChange={handleSpecChange}
            theme="vs"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10, bottom: 10 },
              lineNumbers: 'on',
              roundedSelection: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: true,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
        </div>
        
        <Form 
          form={form}
          onValuesChange={(_, allValues) => {
            try {
              const specObj = JSON.parse(localSpec);
              specObj.validationRules = allValues.rules;
              setLocalSpec(JSON.stringify(specObj, null, 2));
            } catch (error) {
              // 忽略非 JSON 格式的情况
            }
          }}
        >
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: 16 
            }}>
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => {
                  const currentRules = form.getFieldValue('rules') || [];
                  const newRules = [
                    ...currentRules,
                    { 
                      key: `field-${keyCounter}`,
                      fieldName: '', 
                      required: false, 
                      dataType: 'string' 
                    }
                  ];
                  setKeyCounter(prev => prev + 1);
                  form.setFieldsValue({ rules: newRules });
                }}
              />
              <h3 style={{ 
                margin: 0, 
                marginLeft: 8,
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000d9'  // antd 的主要文字颜色
              }}>字段验证规则</h3>
            </div>
            <Table
              columns={columns}
              dataSource={form.getFieldValue('rules') || []}
              pagination={false}
              rowKey={record => record.key || record.fieldName || Math.random().toString()}
              size="small"
              scroll={{ y: 200 }}
            />
          </div>
        </Form>
      </Space>
    </Modal>
  );
};

export default EditSpecModal; 