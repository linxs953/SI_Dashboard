import React, { useState } from 'react';
import { Modal, Form, Input, FormInstance, Steps, Button, Space, Select, Card, Table, Switch } from 'antd';
import { PlusOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';

interface ValidationRule {
  key: string;
  fieldName: string;
  required: boolean;
  dataType: string;
}

interface AddIdlModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
}

type LanguageType = 'go' | 'json' | 'typescript';

const AddIdlModal: React.FC<AddIdlModalProps> = ({
  visible,
  onCancel,
  onOk,
  form
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationRules, setValidationRules] = useState<ValidationRule[]>([]);
  const [spec, setSpec] = useState('');
  const [language, setLanguage] = useState<LanguageType>('go');
  const [keyCounter, setKeyCounter] = useState(0);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(['name', 'description']);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      onOk();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSpecChange = (value: string | undefined) => {
    if (value !== undefined) {
      setSpec(value);
      form.setFieldValue('spec', value);
    }
  };

  const handleLanguageChange = (value: LanguageType) => {
    setLanguage(value);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (changedValues.rules) {
      setValidationRules(changedValues.rules);
    }
  };

  const onValidationRulesChange = (newRules: ValidationRule[]) => {
    setValidationRules(newRules);
  };

  const columns = [
    {
      title: '字段名',
      dataIndex: 'fieldName',
      key: 'fieldName',
      align: 'center',
      width: '35%',
      render: (text: string, record: ValidationRule, index: number) => (
        <Form.Item
          name={['rules', index, 'fieldName']}
          style={{ margin: 0 }}
        >
          <Input placeholder="请输入字段名" style={{ textAlign: 'center' }} />
        </Form.Item>
      )
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      align: 'center',
      width: '20%',
      render: (text: boolean, record: ValidationRule, index: number) => (
        <Form.Item
          name={['rules', index, 'required']}
          valuePropName="checked"
          style={{ margin: 0, textAlign: 'center' }}
        >
          <Switch size="small" />
        </Form.Item>
      )
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      align: 'center',
      width: '30%',
      render: (text: string, record: ValidationRule, index: number) => (
        <Form.Item
          name={['rules', index, 'dataType']}
          style={{ margin: 0 }}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value="string">字符串</Select.Option>
            <Select.Option value="number">数字</Select.Option>
            <Select.Option value="boolean">布尔值</Select.Option>
            <Select.Option value="array">数组</Select.Option>
            <Select.Option value="object">对象</Select.Option>
          </Select>
        </Form.Item>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_: unknown, record: ValidationRule, index: number) => (
        <Form.Item
          style={{ 
            margin: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button
            type="link"
            danger
            onClick={() => {
              const currentRules = form.getFieldValue('rules') || [];
              const newRules = currentRules.filter((_: unknown, i: number) => i !== index);
              form.setFieldsValue({ rules: newRules });
              onValidationRulesChange(newRules);
            }}
          >
            删除
          </Button>
        </Form.Item>
      )
    }
  ];

  const steps = [
    {
      title: '基础信息',
      content: (
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入描述" rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value="synchronizer">同步器</Select.Option>
              <Select.Option value="executor">执行器</Select.Option>
              <Select.Option value="performance">性能测试</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="version"
            label="版本号"
            rules={[
              { required: true, message: '请输入版本号' },
              { 
                pattern: /^\d+\.\d+\.\d+$/, 
                message: '版本号格式应为 x.y.z' 
              }
            ]}
          >
            <Input placeholder="请输入版本号，例如：1.0.0" />
          </Form.Item>

          <Form.Item
            name="image"
            label="镜像"
            rules={[{ required: true, message: '请输入镜像地址' }]}
            extra="例如：registry.example.com/image:tag"
          >
            <Input placeholder="请输入镜像地址" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '数据定义',
      content: (
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item label="语言选择" style={{ marginBottom: '16px' }}>
            <Select
              value={language}
              onChange={handleLanguageChange}
              style={{ width: 200 }}
            >
              <Select.Option value="go">Go</Select.Option>
              <Select.Option value="json">JSON</Select.Option>
              <Select.Option value="typescript">TypeScript</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="spec"
            label="数据规范"
            rules={[{ required: true, message: '请输入数据规范' }]}
            style={{ 
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              overflow: 'hidden',
              height: 'calc(100vh - 520px)'
            }}>
              <MonacoEditor
                height="100%"
                language={language}
                value={spec}
                onChange={handleSpecChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  theme: 'light',
                }}
              />
            </div>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '字段验证',
      content: (
        <Form 
          form={form} 
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          <div style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            padding: '20px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
          }}>
            <Form.List name="rules">
              {(fields, { add, remove }) => (
                <>
                  {fields.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px 0',
                      color: '#999',
                      backgroundColor: '#fafafa',
                      borderRadius: '8px',
                      border: '1px dashed #e5e7eb'
                    }}>
                      <div style={{ fontSize: '14px', marginBottom: '8px' }}>暂无验证规则</div>
                      <Button 
                        type="link" 
                        icon={<PlusOutlined />}
                        onClick={() => {
                          const newRules = [{ 
                            key: `field-${keyCounter}`,
                            fieldName: '', 
                            required: false, 
                            dataType: 'string' 
                          }];
                          setKeyCounter(prev => prev + 1);
                          onValidationRulesChange(newRules);
                          form.setFieldsValue({ rules: newRules });
                        }}
                      >
                        添加规则
                      </Button>
                    </div>
                  ) : (
                    fields.map((field, index) => (
                      <div 
                        key={field.key}
                        style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          marginBottom: index < fields.length - 1 ? '16px' : 0,
                          padding: '12px 16px',
                          backgroundColor: '#fafafa',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          border: '1px solid #f0f0f0'
                        }}
                      >
                        <Form.Item
                          {...field}
                          name={[field.name, 'fieldName']}
                          style={{ margin: 0, flex: '1 1 35%' }}
                        >
                          <Input 
                            placeholder="请输入字段名" 
                            style={{ 
                              borderRadius: '6px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #d9d9d9',
                              height: '32px',
                              paddingLeft: '12px'
                            }}
                          />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, 'required']}
                          valuePropName="checked"
                          style={{ margin: 0, flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}
                        >
                          <Switch 
                            checkedChildren="必填" 
                            unCheckedChildren="选填"
                            style={{
                              minWidth: '80px',
                              height: '24px',
                              lineHeight: '24px',
                              backgroundColor: form.getFieldValue(['rules', field.name, 'required']) ? '#1890ff' : '#f0f0f0'
                            }}
                            className="custom-switch"
                          />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, 'dataType']}
                          style={{ margin: 0, flex: '1 1 30%' }}
                        >
                          <Select
                            style={{ width: '100%' }}
                            dropdownStyle={{ borderRadius: '6px' }}
                          >
                            <Select.Option value="string">
                              <Space>
                                <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>Aa</span>
                                字符串
                              </Space>
                            </Select.Option>
                            <Select.Option value="number">
                              <Space>
                                <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>123</span>
                                数字
                              </Space>
                            </Select.Option>
                            <Select.Option value="boolean">
                              <Space>
                                <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>T/F</span>
                                布尔值
                              </Space>
                            </Select.Option>
                            <Select.Option value="array">
                              <Space>
                                <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>[...]</span>
                                数组
                              </Space>
                            </Select.Option>
                            <Select.Option value="object">
                              <Space>
                                <span style={{ color: '#1890ff', fontFamily: 'monospace' }}>{'{}'}</span>
                                对象
                              </Space>
                            </Select.Option>
                          </Select>
                        </Form.Item>

                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            remove(field.name);
                            const currentRules = form.getFieldValue('rules') || [];
                            onValidationRulesChange(currentRules);
                          }}
                          style={{ 
                            flex: '0 0 80px',
                            height: '32px',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          删除
                        </Button>
                      </div>
                    ))
                  )}
                </>
              )}
            </Form.List>
          </div>
        </Form>
      ),
    },
  ];

  const getModalStyle = () => {
    return {
      top: '5vh',
      height: '90vh'
    };
  };

  const GlobalStyle = {
    '.validation-rule-row': {
      '&:hover': {
        backgroundColor: '#f8fafc'
      }
    },
    '.ant-table-thead > tr > th': {
      backgroundColor: '#f8fafc !important',
      color: '#64748b !important',
      fontWeight: 500,
      fontSize: '13px',
      padding: '12px 8px',
      borderBottom: '1px solid #e2e8f0'
    },
    '.ant-table-tbody > tr > td': {
      borderBottom: '1px solid #f1f5f9'
    },
    '.custom-switch': {
      '.ant-switch-inner-checked': {
        marginLeft: '8px !important',
        marginRight: '28px !important',
        fontSize: '12px'
      },
      '.ant-switch-inner-unchecked': {
        marginLeft: '28px !important',
        marginRight: '8px !important',
        fontSize: '12px'
      },
      '.ant-switch-handle': {
        width: '20px',
        height: '20px',
        top: '2px',
        insetInlineStart: '2px'
      },
      '&.ant-switch-checked .ant-switch-handle': {
        insetInlineStart: 'calc(100% - 22px)'
      }
    }
  };

  return (
    <Modal
      title="新增数据"
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={1000}
      destroyOnClose
      style={getModalStyle()}
      bodyStyle={{ 
        height: 'calc(90vh - 110px)',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div style={{
          padding: '24px 24px 0',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fff',
        }}>
          <Steps
            current={currentStep}
            items={steps.map(item => ({ title: item.title }))}
          />
        </div>
        
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {currentStep === 2 && (
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              zIndex: 10,
              padding: '24px 24px 16px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                marginBottom: '16px'
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
                    onValidationRulesChange(newRules);
                    form.setFieldsValue({ rules: newRules });
                  }}
                />
                <h3 style={{ 
                  margin: 0,
                  marginLeft: 8,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000d9'
                }}>字段验证规则</h3>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                padding: '12px 16px',
                color: '#1f2937',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}>
                <div style={{ flex: '1 1 35%', paddingLeft: '12px' }}>字段名</div>
                <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'center' }}>是否必填</div>
                <div style={{ flex: '1 1 30%', paddingLeft: '12px' }}>数据类型</div>
                <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center' }}>操作</div>
              </div>
            </div>
          )}

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: '57px',
            overflow: 'auto',
            paddingTop: currentStep === 2 ? '140px' : '24px'
          }}>
            <div style={{
              padding: '0 24px'
            }}>
              {steps[currentStep].content}
            </div>
          </div>

          <div style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid #f0f0f0',
            padding: '12px 24px',
            backgroundColor: '#fff',
            zIndex: 10
          }}>
            <Space style={{ float: 'right' }}>
              <Button onClick={onCancel}>取消</Button>
              {currentStep > 0 && <Button onClick={handlePrev}>上一步</Button>}
              {currentStep < 2 ? (
                <Button type="primary" onClick={currentStep === 0 ? handleNext : () => setCurrentStep(2)}>
                  下一步
                </Button>
              ) : (
                <Button type="primary" onClick={handleFinish}>
                  完成
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddIdlModal; 