import React, { useState, useEffect } from 'react';
import { Modal, Steps, Form, Input, Button, Space, Tag, Switch, InputNumber, Card } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { SceneOption, TaskFormData } from "../../../types/apiruntime";
import {  CheckOutlined } from '@ant-design/icons';

// 类型定义
interface ApiRuntimeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: TaskFormData) => void;
  isEdit?: boolean;
  initialValues?: Partial<TaskFormData>;
}

interface SceneSelectorModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selected: string[]) => void;
  onCreateNew: () => void;
  existingScenes: SceneOption[];
  initialSelected?: string[];
}

// 场景选择器组件
const SceneSelectorModal: React.FC<SceneSelectorModalProps> = ({
  visible,
  onCancel,
  onSelect,
  onCreateNew,
  existingScenes,
  initialSelected = []
}) => {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const handleConfirm = () => {
    onSelect(selected);
    onCancel();
  };

  return (
    <Modal
      title="选择测试场景"
      width={800}
      open={visible}
      onCancel={onCancel}
      footer={null}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {existingScenes.map(scene => (
          <Card
            key={scene.value}
            hoverable
            onClick={() => setSelected(prev => 
              prev.includes(scene.value) 
                ? prev.filter(v => v !== scene.value) 
                : [...prev, scene.value]
            )}
            style={{
              border: `1px solid ${selected.includes(scene.value) ? '#1890ff' : '#f0f0f0'}`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {selected.includes(scene.value) && (
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#1890ff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 500, fontSize: 15 }}>{scene.label}</span>
            </div>
            <div style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>
              最后修改：{scene.lastModified || '2023-10-01'}
            </div>
            <Space size={4}>
              <Tag color="blue" style={{ fontSize: 12 }}>{scene.category || '未分类'}</Tag>
              <Tag color="green" style={{ fontSize: 12 }}>{scene.apiCount || 0}个接口</Tag>
            </Space>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="dashed" onClick={onCreateNew}>+ 新建场景</Button>
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button 
            type="primary" 
            onClick={handleConfirm}
            disabled={selected.length === 0}
          >
            确认选择 ({selected.length})
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

// 主表单组件
const ApiRuntimeModal: React.FC<ApiRuntimeModalProps> = ({ 
  visible, 
  onCancel, 
  onSubmit,
  isEdit = false,
  initialValues 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSceneSelector, setShowSceneSelector] = useState(false);
  const [form] = Form.useForm<FormInstance>();
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);

  const steps = [
    { title: '基础信息', content: 'task-info' },
    { title: '执行策略', content: 'strategy' },
    { title: '场景配置', content: 'scenes' }
  ];

  // 初始化表单
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setCurrentStep(0);
      setSelectedScenes(initialValues?.scenes || []);

      form.setFieldsValue({
        taskInfo: {
          name: initialValues?.taskInfo?.name || '',
          description: initialValues?.taskInfo?.description || '',
        },
        strategy: {
          retries: initialValues?.strategy?.retries || 3,
          timeout: initialValues?.strategy?.timeout || 30,
          autoRun: initialValues?.strategy?.autoRun ?? true,
          notifyOnFailure: initialValues?.strategy?.notifyOnFailure ?? false,
        },
        scenes: initialValues?.scenes || [],
      });
    }
  }, [visible, initialValues]);

  // 步骤切换验证
  const handleNext = async () => {
    try {
      await form.validateFields([steps[currentStep].content]);
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  // 提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        scenes: selectedScenes
      } as TaskFormData);
      onCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 弹窗标题
  const modalTitle = (
    <div style={{ padding: '0 24px' }}>
      <h3 style={{ 
        marginBottom: 16, 
        fontSize: 16, 
        fontWeight: 600,
        color: 'rgba(0, 0, 0, 0.85)'
      }}>
        {isEdit ? '编辑任务' : '新建任务'}
      </h3>
      <Steps
        current={currentStep}
        items={steps}
        labelPlacement="vertical"
        style={{ marginBottom: 8 }}
      />
    </div>
  );

  return (
    <>
      <Modal
        title={modalTitle}
        width={680}
        open={visible}
        onCancel={onCancel}
        footer={null}
        destroyOnClose
        styles={{ body: { paddingTop: 0 } }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            taskInfo: { name: '', description: '' },
            strategy: { retries: 3, timeout: 30, autoRun: true }
          }}
        >
          {/* 步骤1：基础信息 */}
          <div style={{ display: currentStep === 0 ? 'block' : 'none', padding: '0 24px' }}>
            <Form.Item
              label="任务名称"
              name={['taskInfo', 'name']}
              rules={[{ required: true, message: '请输入任务名称' }]}
              style={{ marginBottom: 24 }}
            >
              <Input 
                placeholder="示例：用户登录验证流程" 
                allowClear
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="任务描述"
              name={['taskInfo', 'description']}
              style={{ marginBottom: 24 }}
            >
              <Input.TextArea 
                rows={3} 
                placeholder="请输入任务描述（可选）"
                showCount 
                maxLength={200}
                style={{ resize: 'none' }}
              />
            </Form.Item>
          </div>

          {/* 步骤2：执行策略 */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none', padding: '0 24px' }}>
            <Form.Item
              label="失败重试次数"
              name={['strategy', 'retries']}
              rules={[{ required: true, message: '请设置重试次数' }]}
              style={{ marginBottom: 24 }}
            >
              <InputNumber 
                min={0} 
                max={10} 
                style={{ width: '100%' }}
                addonAfter="次"
              />
            </Form.Item>

            <Form.Item
              label="超时时间"
              name={['strategy', 'timeout']}
              rules={[{ 
                required: true, 
                message: '请设置超时时间（1-1440分钟）',
                type: 'number',
                min: 1,
                max: 1440
              }]}
              style={{ marginBottom: 24 }}
            >
              <InputNumber
                min={1}
                max={1440}
                style={{ width: '100%' }}
                addonAfter="分钟"
              />
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <Form.Item
                label="自动执行"
                name={['strategy', 'autoRun']}
                valuePropName="checked"
              >
                <Switch checkedChildren="开" unCheckedChildren="关" />
              </Form.Item>
              <Form.Item
                label="失败通知"
                name={['strategy', 'notifyOnFailure']}
                valuePropName="checked"
              >
                <Switch checkedChildren="开" unCheckedChildren="关" />
              </Form.Item>
            </div>
          </div>

          {/* 步骤3：场景配置 */}
          <div style={{ 
            display: currentStep === 2 ? 'block' : 'none',
            padding: '0 24px'
          }}>
            <Form.Item
              label="选择测试场景"
              required
              rules={[{ 
                validator: () => selectedScenes.length > 0 
                  ? Promise.resolve() 
                  : Promise.reject('至少选择一个测试场景')
              }]}
            >
              <Button 
                type="dashed" 
                onClick={() => setShowSceneSelector(true)}
                block
                size="large"
                style={{ height: 120, borderRadius: 8 }}
              >
                {selectedScenes.length > 0 ? (
                  <div style={{ textAlign: 'left' }}>
                    <div>已选择 {selectedScenes.length} 个场景</div>
                    <div style={{ marginTop: 8 }}>
                      {selectedScenes.map(scene => (
                        <Tag 
                          key={scene} 
                          closable
                          onClose={() => setSelectedScenes(prev => prev.filter(s => s !== scene))}
                        >
                          {scene}
                        </Tag>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#999' }}>点击选择测试场景</span>
                )}
              </Button>
            </Form.Item>
          </div>

          {/* 操作按钮区域 */}
          <div style={{ 
            padding: '24px 24px 0',
            borderTop: '1px solid #f0f0f0',
            marginTop: 24
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: currentStep === 0 ? 'flex-end' : 'space-between'
            }}>
              {currentStep > 0 && (
                <Button onClick={handlePrev} style={{ width: 100 }}>
                  上一步
                </Button>
              )}
              <Space>
                <Button onClick={onCancel} style={{ width: 100 }}>
                  取消
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="primary" onClick={handleNext} style={{ width: 100 }}>
                    下一步
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    onClick={handleSubmit}
                    style={{ width: 140 }}
                  >
                    {isEdit ? '更新任务' : '生成流程图'}
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </Form>
      </Modal>

      <SceneSelectorModal
        visible={showSceneSelector}
        onCancel={() => setShowSceneSelector(false)}
        onSelect={setSelectedScenes}
        onCreateNew={() => console.log('打开新建场景')}
        existingScenes={[
          { 
            value: 'scene-1', 
            label: '用户登录场景',
            category: '登录相关',
            apiCount: 3,
            lastModified: '2023-10-01'
          },
          { 
            value: 'scene-2', 
            label: '订单创建流程',
            category: '订单流程',
            apiCount: 5,
            lastModified: '2023-10-02'
          }
        ]}
        initialSelected={initialValues?.scenes}
      />
    </>
  );
};

export default ApiRuntimeModal;