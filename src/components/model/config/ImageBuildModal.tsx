import React, { useState } from 'react';
import { Modal, Form, Input, Select, Steps, Button } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { ImageBuildRecord } from '../../pages/imageBuild';
import { FormInstance } from 'antd/es/form/Form';

const { Option } = Select;

interface ImageBuildModalProps {
  visible: boolean;
  editingRecord: ImageBuildRecord | null;
  form: FormInstance;
  onSubmit: (values: ImageBuildRecord) => void;
  onCancel: () => void;
  handleRepoUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRepoTypeChange: (value: string) => void;
}

const ImageBuildModal: React.FC<ImageBuildModalProps> = ({
  visible,
  editingRecord,
  form,
  onSubmit,
  onCancel,
  handleRepoUrlChange,
  handleRepoTypeChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '仓库配置',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Form.Item
            name="repoType"
            label="仓库类型"
            rules={[{ required: true, message: '请选择仓库类型' }]}
          >
            <Select 
              placeholder="请选择仓库类型"
              style={{ borderRadius: '6px' }}
              onChange={handleRepoTypeChange}
            >
              <Option value="github">GitHub</Option>
              <Option value="gitlab">GitLab</Option>
              <Option value="bitbucket">Bitbucket</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="repoUrl"
            label="仓库地址"
            rules={[
              { required: true, message: '请输入仓库地址' },
              {
                validator: async (_, value) => {
                  if (!value) return;
                  // eslint-disable-next-line no-useless-catch
                  try {
                    new URL(value);
                    if (!value.endsWith('.git')) {
                      throw new Error('仓库地址必须以.git结尾');
                    }
                  } catch (error) {
                    throw error;
                  }
                },
                message: '请输入有效的git仓库地址，必须以.git结尾'
              }
            ]}
            normalize={(value) => {
              return value ? value.replace(/ /g, '') : '';
            }}
          >
            <Input 
              placeholder="请输入git仓库地址，例如：https://github.com/username/repo.git"
              style={{ borderRadius: '6px' }}
              onChange={handleRepoUrlChange}
            />
          </Form.Item>

          <Form.Item
            name="repoAuth"
            label="API Key"
            rules={[{ required: true, message: '请输入API Key' }]}
            extra={
              <span style={{ color: '#888', fontSize: '12px' }}>
                请输入仓库的API Key，每行一个键值对，格式：key=value
              </span>
            }
          >
            <Input.TextArea
              placeholder="key1=value1&#10;key2=value2"
              style={{ 
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}
              rows={4}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </div>
      )
    },
    {
      title: '推送配置',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Form.Item
            name="pushRegistry"
            label="推送地址"
            rules={[
              { required: true, message: '请输入推送地址' },
              {
                validator: async (_, value) => {
                  if (!value) return;
                  if (!value.includes('/')) {
                    throw new Error('推送地址格式不正确');
                  }
                },
                message: '请输入有效的推送地址，例如：registry.example.com/namespace'
              }
            ]}
            extra={
              <span style={{ color: '#888', fontSize: '12px' }}>
                输入镜像推送的目标地址，例如：registry.example.com/namespace
              </span>
            }
          >
            <Input 
              placeholder="请输入推送地址"
              style={{ borderRadius: '6px' }}
              onChange={(e) => {
                const valueWithoutSpaces = e.target.value.replace(/ /g, ''); // 移除所有空格
                form.setFieldsValue({ pushRegistry: valueWithoutSpaces }); // 更新表单值
              }}
            />
          </Form.Item>

          <Form.Item
            name="pushAuth"
            label="认证信息"
            extra={
              <span style={{ color: '#888', fontSize: '12px' }}>
                如果是私有镜像仓库，请输入认证信息，每行一个键值对，格式：key=value
              </span>
            }
          >
            <Input.TextArea
              placeholder="username=your-username&#10;password=your-password"
              style={{ 
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}
              rows={4}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>
        </div>
      )
    },
    {
      title: '构建配置',
      content: (
        <div style={{ padding: '24px 0' }}>
          <Form.Item
            name="imageName"
            label="镜像名称"
            rules={[{ required: true, message: '请输入镜像名称' }]}
            extra={
              <span style={{ color: '#888', fontSize: '12px' }}>
                将自动从仓库地址中提取，也可手动修改
              </span>
            }
          >
            <Input 
              placeholder="请输入镜像名称"
              style={{ borderRadius: '6px' }}
              
            />
          </Form.Item>

          {editingRecord && (
            <Form.Item
              name="version"
              label="版本号"
            >
              <Input 
                disabled 
                style={{ 
                  borderRadius: '6px',
                  background: '#f5f5f5'
                }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="branch"
            label="分支名"
            rules={[{ required: true, message: '请输入分支名称' }]}
            extra={
              <span style={{ color: '#888', fontSize: '12px' }}>
                例如：main, master, develop
              </span>
            }
          >
            <Input 
              placeholder="请输入分支名称"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
        </div>
      )
    }
  ];

  const next = async () => {
    try {
      // 验证当前步骤的表单字段
      const currentFields = currentStep === 0 
        ? ['repoType', 'repoUrl', 'repoAuth']
        : currentStep === 1 
          ? ['pushRegistry']
          : ['imageName'];
      
      await form.validateFields(currentFields);
      // await form.setFieldsValue(currentFields)
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log(error)
      // 验证失败，不进行跳转
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // 验证所有字段
      const allFields = [
        'repoType', 'repoUrl', 'repoAuth',
        'pushRegistry', 'pushAuth',
        'imageName', 'branch'
      ];
      
      const values = await form.validateFields(allFields);
      onSubmit(values);
    } catch (error) {
      // 验证失败
      console.log(error)
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    onCancel();
  };


  return (
    <Modal
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '4px 0'
        }}>
          {editingRecord ? (
            <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          )}
          <span style={{ fontSize: '16px', fontWeight: 500 }}>
            {editingRecord ? '编辑构建任务' : '新增构建任务'}
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={600}
      centered
      style={{ padding: '24px' }}
      bodyStyle={{
        maxHeight: 'none',
        overflow: 'visible',
        padding: '8px 0'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        style={{ marginTop: '8px' }}
        initialValues={{
          repoType: 'github'
        }}
      >
        <Steps
          current={currentStep}
          items={steps.map(item => ({ title: item.title }))}
          style={{ marginBottom: '24px' }}
        />
        
        {steps[currentStep].content}

        <div style={{ 
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {currentStep > 0 && (
            <Button style={{ minWidth: '80px' }} onClick={prev}>
              上一步
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < steps.length - 1 && (
            <Button type="primary" style={{ minWidth: '80px' }} onClick={next}>
              下一步
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" style={{ minWidth: '80px' }} onClick={handleSubmit}>
              完成
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default ImageBuildModal;
