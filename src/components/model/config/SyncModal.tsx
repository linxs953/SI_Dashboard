// SyncTaskModal.tsx
import { Form, Modal, Select, Input, Space, Button, Typography, Steps, message, Divider, Collapse, Tabs, Card, Badge, Tooltip, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined, ApiOutlined, DatabaseOutlined, LinkOutlined, LockOutlined, KeyOutlined, FileTextOutlined } from '@ant-design/icons';
import { SyncTaskFormData, DataSourceConfig, StorageTargetConfig, ApiSyncConfig, ApiSyncPayload, SyncSourceConfig, SyncMode, DatabaseDriver, ApifoxConfig, SyncTaskType } from '../../../types/sync';
import { useState, useCallback, useMemo, memo } from 'react';

const { Text } = Typography;

interface SyncTaskModalProps {
  visible: boolean;
  editingTask?: SyncTaskFormData;
  onCancel: () => void;
  onSubmit: (values: ApiSyncPayload | SyncTaskFormData) => void;
}

// Memoized component wrapper for better performance
const SyncTaskModal: React.FC<SyncTaskModalProps> = memo(({ visible, editingTask, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeDataSourceTab, setActiveDataSourceTab] = useState('0');
  const [activeStorageTargetTab, setActiveStorageTargetTab] = useState('0');
  const MAX_SOURCES = 3; // 最大数据源数量
  const MAX_TARGETS = 3; // 最大存储目标数量

  // Memoize static data to prevent recreation on re-renders
  const steps = useMemo(() => [
    { title: '基础信息', description: '任务名称和计划' },
    { title: '数据源配置', description: 'API或数据库配置' },
    { title: '存储目标配置', description: '数据存储配置' },
  ], []);

  // Use useCallback to prevent recreation on each render
  const handlePrevStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
  }, []);

  // Memoize form initial values to prevent unnecessary rerenders
  const initialValues = useMemo(() => editingTask || {
    taskName: '',
    sourceType: [],
    destinationType: [],
    schedule: '',
    enable_schedule: false,
    sync_type: '同步器',
    retry_count: 100,
    retry_interval: 100,
    priority: 100,
    timeout: 100,
    dataSources: [{ type: 'api', apiType: 'swagger', config: {} }],
    storageTargets: [{ type: 'database', config: { dbDriver: 'mongodb', mongoConfig: { host: '', port: '27017', username: '', password: '', db: [], collection: [] }, mode: '1' } }]
  }, [editingTask]);

  // 验证数据源是否配置完整
  const validateDataSource = useCallback((dataSource: DataSourceConfig) => {
    // 验证类型必须是API
    if (!dataSource.type || dataSource.type !== 'api') return false;
    if (!dataSource.apiType) return false;
    if (!dataSource.config) return false;
    
    // 检查API配置
    const config = dataSource.config as ApiSyncConfig;
    // 基础验证，在提交前检查必要字段
    if (dataSource.apiType === 'apifox') {
      // Apifox需要验证的字段
      if (!config.docUrl) return false;
      if (!config.projectId) return false;
      // 授权可能有些场景不需要
      // if (!config.authorization) return false;
    }
    
    return true;
  }, []);
  
  // 验证存储目标是否配置完整
  const validateStorageTarget = useCallback((target: StorageTargetConfig) => {
    if (!target.type) return false;
    if (!target.config) return false;
    
    // 只支持数据库类型的存储目标
    if (target.type === 'database') {
      if (!target.config.dbDriver) return false;
      
      // MongoDB 特殊处理
      if (target.config.dbDriver === 'mongodb') {
        const mongoConfig = target.config.mongoConfig;
        if (!mongoConfig) return false;
        if (!mongoConfig.host) return false;
        if (!mongoConfig.port) return false;
        if (!mongoConfig.dbName || mongoConfig.dbName.length === 0) return false;
        if (!mongoConfig.collection || mongoConfig.collection.length === 0) return false;
        return true;
      } else {
        // 其他数据库类型
        if (!target.config.connection) return false;
        if (!target.config.tables || target.config.tables.length === 0) return false;
        return true;
      }
    }
    
    return false;
  }, []);
  
  // 将同步计划文本转换为cron表达式
  const convertScheduleToCron = useCallback((schedule: string): string => {
    switch (schedule) {
      case '每小时': // 每小时
        return '0 0 * * * *'; // 每小时整点执行
      case '每日 00:00': 
        return '0 0 0 * * *'; // 每天零点执行
      case '每日 02:00':
        return '0 0 2 * * *'; // 每天凌晨2点执行
      case '每日 08:00':
        return '0 0 8 * * *'; // 每天早上8点执行
      case '每周一 09:00':
        return '0 0 9 * * 1'; // 每周一上午9点执行
      default:
        return '0 0 0 * * *'; // 默认每天零点执行
    }
  }, []);

  const handleNextStep = useCallback(async () => {
    // Skip validation in development if needed (fast mode)
    // const isDevelopment = process.env.NODE_ENV === 'development';
    // if (isDevelopment) {
    //   if (currentStep < 2) {
    //     setCurrentStep(prev => prev + 1);
    //     return;
    //   }
    //   // For the final step in dev mode, just submit with minimal validation
    //   const formValues = form.getFieldsValue();
    //   // Basic API payload with minimal required fields
    //   const createSyncTaskPayload = {...}
    //   onSubmit(createSyncTaskPayload);
    //   setCurrentStep(0);
    //   form.resetFields();
    //   return;
    // }
    try {
      let fieldsToValidate: string[] = [];
      switch (currentStep) {
        case 0:
          fieldsToValidate = ['taskName', 'description', 'enable_schedule'];
          // 只有启用定时后才验证schedule字段
          const enableSchedule = form.getFieldValue('enable_schedule');
          if (enableSchedule) {
            fieldsToValidate.push('schedule');
          }
          break;
        case 1:
          fieldsToValidate = ['dataSources'];
          break;
        case 2:
          fieldsToValidate = ['storageTargets'];
          break;
      }
      
      await form.validateFields(fieldsToValidate);
      
      // 检查当前步骤是否需要额外验证
      if (currentStep === 1) {
        // 验证数据源配置
        const dataSources = form.getFieldValue('dataSources');
        if (!dataSources || dataSources.length === 0) {
          message.error('请至少添加一个数据源');
          return;
        }
        
        // 验证每个数据源是否配置完整
        const incompleteDataSourceIndices: number[] = [];
        dataSources.forEach((ds: DataSourceConfig, index: number) => {
          if (!validateDataSource(ds)) {
            incompleteDataSourceIndices.push(index + 1);
          }
        });
        
        if (incompleteDataSourceIndices.length > 0) {
          message.error(`数据源 ${incompleteDataSourceIndices.join(', ')} 配置不完整，请完成必填项`);
          return;
        }
      } else if (currentStep === 2) {
        // 验证存储目标配置
        const storageTargets = form.getFieldValue('storageTargets');
        if (!storageTargets || storageTargets.length === 0) {
          message.error('请至少添加一个存储目标');
          return;
        }
        
        // 验证每个存储目标是否配置完整
        const incompleteTargetIndices: number[] = []; 
        storageTargets.forEach((target: StorageTargetConfig, index: number) => {
          if (!validateStorageTarget(target)) {
            incompleteTargetIndices.push(index + 1);
          }
        });
        
        if (incompleteTargetIndices.length > 0) {
          message.error(`存储目标 ${incompleteTargetIndices.join(', ')} 配置不完整，请完成必填项`);
          return;
        }
        
        // 构建提交参数
        const formValues = form.getFieldsValue();
        const taskName = formValues.taskName;
        const description = formValues.description;
        const schedule = formValues.schedule;
        const dataSources = formValues.dataSources || [];
        const submissionStorageTargets = formValues.storageTargets || [];
        
        // 策略参数
        const retry_count = formValues.retry_count || 100;
        const retry_interval = formValues.retry_interval || 100;
        const priority = formValues.priority || 100;
        const timeout = formValues.timeout || 100;
        // Get API type from the first data source if available
        const firstDataSource = dataSources[0] || {};
        const apiType = firstDataSource.apiType || '';
        
        // Determine sync_type based on the API type
        const sync_type = apiType === 'apifox' ? SyncTaskType.ApifoxSync :
                          apiType === 'swagger' ? SyncTaskType.SwaggerSync :
                          apiType === 'postman' ? SyncTaskType.PostmanSync :
                          apiType === 'openapi' ? SyncTaskType.OpenAPISync :
                          "-1:不支持的文档类型"; // 默认值
        const enable_schedule = formValues.enable_schedule || false;
        
        // 将计划转换为cron表达式
        const cronExpression = enable_schedule ? convertScheduleToCron(schedule) : '';
        
        // 构建API请求参数 (这是后端API需要的格式)
        const apiParams = {
          type: "sync",
          event: "createTask",
          spec: {
            strategy: {
              auto: enable_schedule,
              cron_expression: enable_schedule ? cronExpression : "",
              retry_count: Number(retry_count),
              retry_interval: Number(retry_interval),
              priority: Number(priority),
              timeout: Number(timeout)
            },
            sync_type: sync_type, // 从表单中获取
            source: dataSources.map((source: DataSourceConfig) => {
              // Handle different API source types
              if (source.type === 'api') {
                // Now we can safely assert this is ApiSyncConfig
                const apiConfig = source.config as ApiSyncConfig || {};
                
                if (source.apiType === "apifox") {
                  const apifoxConfig: SyncSourceConfig = {
                    "apifox": {
                      base: apiConfig.docUrl || '',
                      shareLink: apiConfig.docUrl || '',
                      projectId: apiConfig.projectId || '',
                      username: apiConfig.authorization?.split('\n')[0]?.split('=')[1] || '',
                      password: apiConfig.authorization?.split('\n')[1]?.split('=')[1] || ''
                    } as ApifoxConfig
                  }
                  return apifoxConfig;
                } else if (source.apiType === "swagger") {
                  // Add swagger config here if needed
                  return {
                    "swagger": {
                      url: apiConfig.docUrl || '',
                      projectId: apiConfig.projectId || ''
                    }
                  };
                }
              }
              return null;
            }),
            destination: submissionStorageTargets.map((target: StorageTargetConfig) => {
              let destConfig = {};
              
              // 获取同步模式的真实值
              console.log(target.config);
              const syncMode = target.config.mode || SyncMode.Full;
              
              if (target.config.dbDriver === DatabaseDriver.MongoDB) {
                // MongoDB配置
                destConfig = {
                  dest_type: target.config.dbDriver,
                  mode: syncMode,
                  mongoConfig: {
                    host: target.config.mongoConfig?.host || undefined,
                    port: target.config.mongoConfig?.port || "27017",
                    username: target.config.mongoConfig?.username || undefined,
                    password: target.config.mongoConfig?.password || undefined,
                    dbName: target.config.mongoConfig?.dbName || undefined,
                    collection: target.config.mongoConfig?.collection || undefined
                  }
                };
              } else {
                // 其他数据库类型的基本结构， 暂时不支持
                destConfig = {
                  dest_type: `-1`,
                  mode: undefined,
                  config: {
                    connection:  undefined,
                    tables: undefined
                  }
                };
              }
              
              return destConfig;
            })
          },
          metadata: {
            name: taskName || "未命名任务",
            namespace: "default",
            desc: description || undefined,
          }
        };

        // 提交API格式的数据
        const createSyncTaskPayload: ApiSyncPayload = {
          type: apiParams.type,
          event: apiParams.event,
          spec: {
            strategy: {
              auto: apiParams.spec.strategy.auto,
              cron_expression: apiParams.spec.strategy.cron_expression,
              retry_count: apiParams.spec.strategy.retry_count,
              retry_interval: apiParams.spec.strategy.retry_interval,
              priority: apiParams.spec.strategy.priority,
              timeout: apiParams.spec.strategy.timeout
            },
            sync_type: apiParams.spec.sync_type,
            source: apiParams.spec.source,
            destination: apiParams.spec.destination
          },
          metadata: {
            name: apiParams.metadata.name,
            namespace: apiParams.metadata.namespace,
            desc: apiParams.metadata.desc
          }
        }
        // Call onSubmit with the API payload and close the modal
        onSubmit(createSyncTaskPayload);
        // Reset form and close modal
        setCurrentStep(0);
        form.resetFields();
        onCancel(); // Close the modal after submission
        return;
      }
      
      // 只在不是最后一步时前进
      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      message.error('请完成必填项');
    }
  }, [currentStep, form, onSubmit, onCancel, validateDataSource, validateStorageTarget, convertScheduleToCron]);

  return (
    <Modal
      title={
        <Text strong>
          {editingTask ? '编辑同步任务' : '新建同步任务'}
        </Text>
      }
      width={800}
      open={visible}
      onCancel={() => {
        setCurrentStep(0);
        form.resetFields();
        onCancel();
      }}
      footer={useMemo(() => [
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        currentStep > 0 && (
          <Button key="prev" onClick={handlePrevStep}>
            上一步
          </Button>
        ),
        <Button key="next" type="primary" onClick={handleNextStep}>
          {currentStep === 2 ? '提交' : '下一步'}
        </Button>,
      ], [currentStep, onCancel, handlePrevStep, handleNextStep])}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        items={steps}
        style={{ marginBottom: 24 }}
      />
      
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        {/* 基础信息 */}
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>
            基础信息配置
          </Text>
          <Form.Item
            name="sync_type"
            label="同步器类型"
            initialValue="同步器"
          >
            <Input disabled={true} placeholder="同步器类型代码" />
          </Form.Item>
          <Form.Item
            name="taskName"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="同步任务名称" />
          </Form.Item>

          <Form.Item
              name="description"
              label="任务描述"
              rules={[{ required: true, message: '请输入任务描述' }]}
            >
              <Input.TextArea
                placeholder="请输入任务描述"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
          </Form.Item>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <Form.Item
              name="enable_schedule"
              label="定时执行"
              valuePropName="checked"
              initialValue={false}
              style={{ marginBottom: 0, minWidth: '150px' }}
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => 
                prevValues.enable_schedule !== currentValues.enable_schedule
              }
            >
              {({ getFieldValue }) => {
                const enableSchedule = getFieldValue('enable_schedule');
                return enableSchedule ? (
                  <Form.Item
                    name="schedule"
                    label="同步计划"
                    rules={[{ 
                      required: true, 
                      message: '请设置同步计划' 
                    }]}
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <Select
                      placeholder="选择同步频率"
                      options={[
                        { label: '每小时', value: '每小时' },
                        { label: '每日 00:00', value: '每日 00:00' },
                        { label: '每日 02:00', value: '每日 02:00' },
                        { label: '每日 08:00', value: '每日 08:00' },
                        { label: '每周一 09:00', value: '每周一 09:00' },
                      ]}
                    />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
          </div>
          

          
          <Collapse ghost style={{ marginBottom: '16px' }} collapsible="header">
            <Collapse.Panel header="策略配置选项" key="1">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <Form.Item
                  name="retry_count"
                  label="重试次数"
                  initialValue={100}
                >
                  <Input type="number" placeholder="重试次数" />
                </Form.Item>
                
                <Form.Item
                  name="retry_interval"
                  label="重试间隔(秒)"
                  initialValue={100}
                >
                  <Input type="number" placeholder="重试间隔" />
                </Form.Item>
                
                <Form.Item
                  name="priority"
                  label="优先级"
                  initialValue={100}
                >
                  <Input type="number" placeholder="任务优先级" />
                </Form.Item>
                
                <Form.Item
                  name="timeout"
                  label="超时时间(秒)"
                  initialValue={100}
                >
                  <Input type="number" placeholder="超时时间" />
                </Form.Item>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>

        {/* 数据源配置 */}
        <div style={{ display: currentStep === 1 ? 'block' : 'none', marginBottom: 24 }}>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>
            <ApiOutlined style={{ marginRight: 8 }} />
            数据源配置
          </Text>
          <Form.List name="dataSources">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 16 }}>
                  {fields.length > 0 ? (
                    <Card bordered={false} className="tabs-card" style={{ padding: 0 }}>
                      <Tabs
                        type="card"
                        activeKey={activeDataSourceTab}
                        onChange={setActiveDataSourceTab}
                        tabBarExtraContent={
                          <Tooltip title={fields.length >= MAX_SOURCES ? '最多只能添加3个数据源' : ''} placement="top">
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                if (fields.length < MAX_SOURCES) {
                                  const newKey = fields.length.toString();
                                  add({ type: 'api', apiType: 'swagger', config: {} });
                                  setActiveDataSourceTab(newKey);  
                                }
                              }}
                              disabled={fields.length >= MAX_SOURCES}
                            >
                              添加数据源
                            </Button>
                          </Tooltip>
                        }
                        items={fields.map(({ key, name, ...restField }) => ({
                          key: name.toString(),
                          label: (
                            <Space>
                              <span>数据源 {name + 1}</span>
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) => 
                                  prevValues?.dataSources?.[name]?.type !== curValues?.dataSources?.[name]?.type
                                }
                              >
                                {({ getFieldValue }) => {
                                  const type = getFieldValue(['dataSources', name, 'type']);
                                  return (
                                    <Badge status="processing" text={type === 'api' ? 'API接口' : '未配置'} />
                                  );
                                }}
                              </Form.Item>
                              {fields.length > 1 && (
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(name);
                                    // If removing the active tab, switch to the first one
                                    if (activeDataSourceTab === name.toString()) {
                                      setActiveDataSourceTab(fields.filter(f => f.name !== name)[0]?.name.toString() || '0');
                                    }
                                  }}
                                />
                              )}
                            </Space>
                          ),
                          children: (
                            <div style={{ padding: '16px 8px 0' }}>
                              <Form.Item noStyle shouldUpdate>
                                {({ getFieldValue }) => {
                                  const type = getFieldValue(['dataSources', name, 'type']);
                                  
                                  // Common configuration section
                                  const commonConfig = (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'type']}
                                        label="类型"
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: '请选择类型' }]}
                                      >
                                        <Select
                                          options={[
                                            { label: 'API接口', value: 'api' }
                                          ]}
                                        />
                                      </Form.Item>
                                      
                                      {type === 'api' && (
                                        <>
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'apiType']}
                                            label="API文档类型"
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: true, message: '请选择API文档类型' }]}
                                          >
                                            <Select
                                              placeholder="选择类型"
                                              options={[
                                                { label: 'Apifox', value: 'apifox' },
                                                { label: 'Swagger', value: 'swagger' },
                                                { label: 'OpenAPI', value: 'openapi' },
                                                { label: 'Postman', value: 'postman' }
                                              ]}
                                            />
                                          </Form.Item>
                                        
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'config', 'projectId']}
                                            label="项目ID"
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: true, message: '请输入项目ID' }]}
                                          >
                                            <Input placeholder="project-123" />
                                          </Form.Item>
                                        </>
                                      )}
                                    </div>
                                  );
                  
                                  if (type === 'api') {
                                    return (
                                      <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                                        {commonConfig}
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'config', 'docUrl']}
                                            label="分享链接"
                                            style={{ marginBottom: 0 }}
                                            rules={[{ required: true, message: '请输入文档链接' }]}
                                          >
                                            <Input 
                                              prefix={<LinkOutlined />}
                                              placeholder="https://api-docs.example.com/swagger.json" 
                                            />
                                          </Form.Item>
                  
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'config', 'authorization']}
                                            label="密钥"
                                            style={{ marginBottom: 0 }}
                                            tooltip="请输入授权信息，支持多行（如headers、token等）"
                                            rules={[{ required: true, message: '请输入授权信息' }]}
                                          >
                                            <Input.TextArea
                                              placeholder="Bearer token或者其他授权信息"
                                              autoSize={{ minRows: 5, maxRows: 6 }}
                                            />
                                          </Form.Item>
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                                      {commonConfig}
                                      <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                        请选择数据源类型以继续配置
                                      </div>
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </div>
                          ),
                        }))}
                      />
                    </Card>
                  ) : (
                    <Tooltip title={fields.length >= MAX_SOURCES ? '最多只能添加3个数据源' : ''} placement="top">
                      <Button
                        type="dashed"
                        onClick={() => {
                          if (fields.length < MAX_SOURCES) {
                            add({ type: 'api', apiType: 'swagger', config: {} });
                            setActiveDataSourceTab('0');
                          }
                        }}
                        block
                        icon={<PlusOutlined />}
                        disabled={fields.length >= MAX_SOURCES}
                      >
                        添加第一个数据源
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </>
            )}
          </Form.List>
        </div>

        {/* 存储目标配置 */}
        <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>
            <DatabaseOutlined style={{ marginRight: 8 }} />
            存储目标配置
          </Text>
          <Form.List name="storageTargets">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 16 }}>
                  {fields.length > 0 ? (
                    <Card bordered={false} className="tabs-card" style={{ padding: 0 }}>
                      <Tabs
                        type="card"
                        activeKey={activeStorageTargetTab}
                        onChange={setActiveStorageTargetTab}
                        tabBarExtraContent={
                          <Tooltip title={fields.length >= MAX_TARGETS ? '最多只能添加3个存储目标' : ''} placement="top">
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => {
                                if (fields.length < MAX_TARGETS) {
                                  const newKey = fields.length.toString();
                                  add({ type: 'database', config: { dbDriver: 'mongodb', mongoConfig: { host: '', port: '27017', username: '', password: '', db: [], collection: [] }, mode: '1' } });
                                  setActiveStorageTargetTab(newKey);
                                }
                              }}
                              disabled={fields.length >= MAX_TARGETS}
                            >
                              添加存储目标
                            </Button>
                          </Tooltip>
                        }
                        items={fields.map(({ key, name, ...restField }) => ({
                          key: name.toString(),
                          label: (
                            <Space>
                              <span>存储目标 {name + 1}</span>
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) => 
                                  prevValues?.storageTargets?.[name]?.type !== curValues?.storageTargets?.[name]?.type
                                }
                              >
                                {({ getFieldValue }) => {
                                  const type = getFieldValue(['storageTargets', name, 'type']);
                                  return (
                                    <Badge 
                                      status="processing" 
                                      text={'数据库'} 
                                    />
                                  );
                                }}
                              </Form.Item>
                              {fields.length > 1 && (
                                <Button
                                  type="text"
                                  danger
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    remove(name);
                                    // If removing the active tab, switch to the first one
                                    if (activeStorageTargetTab === name.toString()) {
                                      setActiveStorageTargetTab(fields.filter(f => f.name !== name)[0]?.name.toString() || '0');
                                    }
                                  }}
                                />
                              )}
                            </Space>
                          ),
                          children: (
                            <div style={{ padding: '16px 8px 0' }}>
                              <div style={{ background: '#fafafa', padding: '16px', borderRadius: '8px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'type']}
                                    label="类型"
                                    style={{ marginBottom: 16 }}
                                    rules={[{ required: true, message: '请选择类型' }]}
                                  >
                                    <Select
                                      options={[
                                        { label: '数据库', value: 'database' }
                                      ]}
                                      disabled
                                    />
                                  </Form.Item>
                                </div>
                                
                                <Form.Item 
                                  noStyle 
                                  shouldUpdate={(prevValues, curValues) => {
                                    // Only update when this specific storage target's driver changes
                                    const prevDriver = prevValues?.storageTargets?.[name]?.config?.dbDriver;
                                    const curDriver = curValues?.storageTargets?.[name]?.config?.dbDriver;
                                    return prevDriver !== curDriver;
                                  }}
                                >
                                  {({ getFieldValue }) => {
                                    // 默认使用数据库类型
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'config', 'dbDriver']}
                                            label="数据库驱动"
                                            rules={[{ required: true, message: '请选择数据库驱动' }]}
                                          >
                                            <Select
                                              options={[
                                                { label: 'PostgreSQL', value: 'pg' },
                                                { label: 'MySQL', value: 'mysql' },
                                                { label: 'MongoDB', value: 'mongodb' }
                                              ]}
                                            />
                                          </Form.Item>
                                          
                                          <Form.Item
                                            {...restField}
                                            name={[name, 'config', 'mode']}
                                            label="同步模式"
                                            initialValue="1"
                                          >
                                            <Select
                                              options={[
                                                { label: '全量同步', value: '1' },
                                                { label: '增量同步', value: '2' }
                                              ]}
                                            />
                                          </Form.Item>

                                          <Form.Item 
                                            noStyle 
                                            shouldUpdate={(prevValues, curValues) => 
                                              prevValues?.storageTargets?.[name]?.config?.dbDriver !== 
                                              curValues?.storageTargets?.[name]?.config?.dbDriver
                                            }
                                          >
                                            {({ getFieldValue }) => {
                                              const dbDriver = getFieldValue(['storageTargets', name, 'config', 'dbDriver']);
                                              
                                              if (dbDriver === 'mongodb') {
                                                return (
                                                  <>
                                                    <div style={{ marginBottom: '16px' }}>
                                                      <Text type="secondary">MongoDB 配置</Text>
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'config', 'mongoConfig', 'host']}
                                                        label="主机"
                                                        rules={[{ required: true, message: '请输入主机地址' }]}
                                                      >
                                                        <Input placeholder="localhost" />
                                                      </Form.Item>
                                                      
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'config', 'mongoConfig', 'port']}
                                                        label="端口"
                                                        rules={[{ required: true, message: '请输入端口' }]}
                                                      >
                                                        <Input placeholder="27017" />
                                                      </Form.Item>
                                                      
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'config', 'mongoConfig', 'username']}
                                                        label="用户名"
                                                      >
                                                        <Input placeholder="用户名" />
                                                      </Form.Item>
                                                      
                                                      <Form.Item
                                                        {...restField}
                                                        name={[name, 'config', 'mongoConfig', 'password']}
                                                        label="密码"
                                                      >
                                                        <Input.Password placeholder="密码" />
                                                      </Form.Item>
                                                    </div>
                                                    
                                                    <Form.Item
                                                      {...restField}
                                                      name={[name, 'config', 'mongoConfig', 'dbName']}
                                                      label="数据库"
                                                      rules={[{ required: true, message: '请选择数据库' }]}
                                                    >
                                                      <Select
                                                        mode="tags"
                                                        placeholder="输入数据库名称并按回车"
                                                        tokenSeparators={[',']}
                                                      />
                                                    </Form.Item>
                                                    
                                                    <Form.Item
                                                      {...restField}
                                                      name={[name, 'config', 'mongoConfig', 'collection']}
                                                      label="集合"
                                                      rules={[{ required: true, message: '请选择集合' }]}
                                                    >
                                                      <Select
                                                        mode="tags"
                                                        placeholder="输入集合名称并按回车"
                                                        tokenSeparators={[',']}
                                                      />
                                                    </Form.Item>
                                                    

                                                  </>
                                                );
                                              } else {
                                                return (
                                                  <>
                                                    <Form.Item
                                                      {...restField}
                                                      name={[name, 'config', 'connection']}
                                                      label="连接字符串"
                                                      rules={[{ required: true, message: '请输入连接字符串' }]}
                                                    >
                                                      <Input placeholder="postgresql://user:pass@host:port/db" />
                                                    </Form.Item>
                                                    <Form.Item
                                                      {...restField}
                                                      name={[name, 'config', 'tables']}
                                                      label="表名列表"
                                                      rules={[{ required: true, message: '请添加至少一个表名' }]}
                                                    >
                                                      <Select
                                                        mode="tags"
                                                        placeholder="输入表名并按回车"
                                                        tokenSeparators={[',']}
                                                      />
                                                    </Form.Item>
                                                  </>
                                                );
                                              }
                                            }}
                                          </Form.Item>
                                        </div>
                                      );
                                  }}
                                </Form.Item>
                              </div>
                            </div>
                          ),
                        }))}
                      />
                    </Card>
                  ) : (
                    <Tooltip title={fields.length >= MAX_TARGETS ? '最多只能添加3个存储目标' : ''} placement="top">
                      <Button
                        type="dashed"
                        onClick={() => {
                          if (fields.length < MAX_TARGETS) {
                            add({ type: 'database', config: { dbDriver: '', connection: '', tables: [] } });
                            setActiveStorageTargetTab('0');
                          }
                        }}
                        block
                        icon={<PlusOutlined />}
                        disabled={fields.length >= MAX_TARGETS}
                      >
                        添加第一个存储目标
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </>
            )}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
});

export default SyncTaskModal;