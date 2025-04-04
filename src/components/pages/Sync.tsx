import React, { useState } from 'react';
import { Button, Table, Tag, Space, Typography, Card, Tooltip, message } from 'antd';
import { PlusOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, ArrowDownOutlined, ApiOutlined, DatabaseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import SyncTaskModal from '../model/config/SyncModal';
import { SyncTask, SyncTaskFormData, DataSourceConfig, StorageTargetConfig, ApiSyncType, ApiSyncPayload, ApiSyncConfig } from "../../types/sync";
import { useHttpHook } from '../../hooks/useHttpHook';

const { Title, Text } = Typography;

// 状态样式配置（新增同步特有状态）
const syncStatusConfig = {
  pending: {
    color: '#faad14',
    icon: <SyncOutlined spin style={{ fontSize: '16px' }} />,
    text: '等待同步',
    background: '#fff7e6'
  },
  syncing: {
    color: '#1890ff',
    icon: <SyncOutlined spin style={{ fontSize: '16px' }} />,
    text: '同步中',
    background: '#e6f7ff'
  },
  success: {
    color: '#52c41a',
    icon: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
    text: '同步成功',
    background: '#f6ffed'
  },
  failed: {
    color: '#ff4d4f',
    icon: <CloseCircleOutlined style={{ fontSize: '16px' }} />,
    text: '同步失败',
    background: '#fff1f0'
  }
};

// Define a type for the status keys
type SyncStatusKey = keyof typeof syncStatusConfig;

const SyncDashboard: React.FC = () => {
  // Add HTTP hook at the component level
  const { post, loading } = useHttpHook();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState<SyncTask[]>([
    {
      id: '1',
      taskName: '用户数据同步',
      source: [
        'MySQL', 
        "Redis",
        "MongoDB",
        "ClickHouse"
      ],
      destination: [
        'Elasticsearch',
        'Kafka'
      ],
      schedule: '每日 02:00',
      lastSync: '2025-02-28 02:15',
      status: 'success',
      dataSources: [
        {
          type: 'database',
          name: 'MySQL用户数据',
          config: {
            connection: 'mysql://user:pass@host:port/db',
            tables: ['users', 'user_profiles']
          }
        }
      ],
      storageTargets: [
        {
          type: 'elasticsearch',
          name: 'ES用户索引',
          config: {
            host: 'elasticsearch:9200',
            index: 'users'
          }
        }
      ]
    },
    {
      id: '2',
      taskName: '日志归档',
      source: [
        'Kafka'
      ],
      destination: [
        'S3',
        'Elasticsearch'
      ],
      schedule: '每小时',
      lastSync: '2025-03-01 08:30',
      status: 'syncing',
      dataSources: [
        {
          type: 'database',
          name: 'Kafka日志流',
          config: {
            connection: 'kafka:9092',
            query: 'SELECT * FROM logs_topic'
          }
        }
      ],
      storageTargets: [
        {
          type: 'database',
          name: 'S3存储',
          config: {
            connection: 's3://bucket/logs'
          }
        }
      ]
    },
    {
      id: '3',
      taskName: 'Apifox接口同步',
      source: [
        'Apifox'
      ],
      destination: [
        'API网关'
      ],
      schedule: '每日 08:00',
      lastSync: '2025-03-02 08:00',
      status: 'success',
      dataSources: [
        {
          type: 'api',
          name: '用户服务API文档',
          apiType: 'apifox',
          config: {
            docUrl: 'https://apifox.com/apidoc/shared-123456',
            authUrl: 'https://apifox.com/auth',
            docPassword: '******',
            apiKey: 'apifox_key_123456',
            version: 'v2.0'
          }
        }
      ],
      storageTargets: [
        {
          type: 'database',
          name: 'API网关配置',
          config: {
            connection: 'http://api-gateway:8080/admin'
          }
        }
      ]
    },
    {
      id: '4',
      taskName: 'Swagger文档同步',
      source: [
        'Swagger'
      ],
      destination: [
        'API网关',
        '测试环境'
      ],
      schedule: '每周一 09:00',
      lastSync: '2025-03-01 09:00',
      status: 'pending',
      dataSources: [
        {
          type: 'api',
          name: '支付服务API文档',
          apiType: 'swagger',
          config: {
            docUrl: 'https://payment-service/swagger/v1/swagger.json',
            headers: {
              'Authorization': 'Bearer token123',
              'Content-Type': 'application/json'
            },
            projectId: 'payment-service-123',
            version: 'v1.0'
          }
        }
      ],
      storageTargets: [
        {
          type: 'database',
          name: '测试环境配置',
          config: {
            connection: 'http://test-env:8080/config'
          }
        }
      ]
    }
  ]);

  const TagGroup = ({ children }: { children: React.ReactNode }) => (
    <div style={{ 
    //   minWidth: "150px",
    //   maxWidth: "200px",
      width: "150px",
    //   maxHeight: "20px",
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',  // 水平居中
      alignItems: 'center',      // 垂直居中
      gap: 8,
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#f5f5f5',
      border: '1px solid #d9d9d9'
    }}>
      {children}
    </div>
  );
  

  // 表格列定义（适配同步任务字段）
  const columns: ColumnsType<SyncTask> = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: '20%',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '15px', display: 'block' }}>
            {text}
          </Text>
          <div style={{ marginTop: 4 }}>
            {record.source.includes('Apifox') && (
              <Tag color="orange" style={{ marginRight: 4 }}>
                <ApiOutlined /> Apifox
              </Tag>
            )}
            {record.source.includes('Swagger') && (
              <Tag color="green" style={{ marginRight: 4 }}>
                <ApiOutlined /> Swagger
              </Tag>
            )}
            {record.source.includes('MySQL') && (
              <Tag color="blue" style={{ marginRight: 4 }}>
                <DatabaseOutlined /> MySQL
              </Tag>
            )}
          </div>
        </div>
      )
    },
    {
      title: '数据流向',
      key: 'flow',
      width: '25%',
      render: (_, record) => (
        <>

        <div style={{ 
            display: 'flex',
            alignItems: 'flex-start', // 顶部对齐
            gap: 24,                  // 元素间距
            padding: 16,
            border: '1px solid #f0f0f0',
            borderRadius: 8
          }}>
            {/* 数据源标签组 */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start'
              }}>
                <Text type="secondary" style={{ marginBottom: 8 }}>数据源</Text>
                {record.source.map((item, idx) => (
                  <Tag 
                    color="blue" 
                    key={idx}
                    style={{ width: 'max-content' }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          
            {/* 箭头分隔 */}
            <div style={{ 
              alignSelf: 'center', 
              padding: '0 16px',
              color: '#bfbfbf',
              fontSize: 18
            }}>
              →
            </div>
          
            {/* 存储目标标签组 */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start'
              }}>
                <Text type="secondary" style={{ marginBottom: 8 }}>存储目标</Text>
                {record.destination.map((item, idx) => (
                  <Tag 
                    color="geekblue" 
                    key={idx}
                    style={{ width: 'max-content' }}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </>

      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: SyncStatusKey) => {
        const config = syncStatusConfig[status];
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: '16px',
            backgroundColor: config.background,
            color: config.color,
            fontSize: '13px',
          }}>
            <span style={{ marginRight: '6px' }}>{config.icon}</span>
            {config.text}
          </div>
        );
      }
    },
    {
      title: '最后同步时间',
      dataIndex: 'lastSync',
      key: 'lastSync',
      width: '15%',
      render: (time) => (
        <Text type="secondary" style={{ fontSize: '13px' }}>
          {new Date(time).toLocaleString()}
        </Text>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="立即同步">
            <Button 
              icon={<SyncOutlined />} 
              disabled={record.status === 'syncing'}
            />
          </Tooltip>
          <Tooltip title="编辑配置">
            <Button icon={<EditOutlined />} type="default" />
          </Tooltip>
          <Tooltip title="删除任务">
            <Button danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 将时间表转换为cron表达式（从SyncModal复制）
  const convertScheduleToCron = (schedule: string): string => {
    // 简单处理：假设schedule是'每日 HH:MM'格式
    const defaultCron = '0 0 * * * *'; // 默认：每天0点0分
    
    if (!schedule || typeof schedule !== 'string') {
      return defaultCron;
    }
    
    // 处理常见的时间表格式
    if (schedule.includes('每日') || schedule.includes('daily')) {
      const timeMatch = schedule.match(/(\d{1,2}):(\d{1,2})/);
      if (timeMatch) {
        const hour = timeMatch[1].padStart(2, '0');
        const minute = timeMatch[2].padStart(2, '0');
        return `0 ${minute} ${hour} * * *`; // 秒 分 时 日 月 星期
      }
    }
    
    // 其他时间表格式可以在这里添加处理逻辑
    
    return defaultCron;
  };
  
  // 处理新建同步任务
  const handleCreateSync = async (values: ApiSyncPayload | SyncTaskFormData) => {
    console.log('提交的同步任务参数:', JSON.stringify(values, null, 2));
    
    // 当SyncModal返回的是API格式的数据时，直接使用
    let apiPayload: ApiSyncPayload;
    
    // 定义类型守卫来区分ApiSyncPayload和SyncTaskFormData
    const isApiPayload = (data: ApiSyncPayload | SyncTaskFormData): data is ApiSyncPayload => {
      return 'type' in data && 'event' in data && data.type === 'sync' && data.event === 'createTask';
    };
    
    if (isApiPayload(values)) {
      // 如果数据已经是API格式，直接使用
      apiPayload = values;
      console.log('直接使用API格式数据');
    } else {
      // 兼容旧版方式，如果还有传递SyncTaskFormData格式的地方
      console.log('将表单数据转换为API格式');
      
      // 默认API请求模板
      apiPayload = {
        type: "sync",
        event: "createTask",
        spec: {
          strategy: {
            auto: values.enable_schedule || false,
            cron_expression: values.enable_schedule ? convertScheduleToCron(values.schedule) : '',
            retry_count: Number(values.retry_count) || 3,
            retry_interval: Number(values.retry_interval) || 3,
            priority: Number(values.priority) || 3,
            timeout: Number(values.timeout) || 3
          },
          sync_type: values.sync_type || "同步器",
          source: [],
          destination: []
        },
        metadata: {
          name: values.taskName || "未命名任务",
          namespace: "default",
          desc: values.description || ""
        }
      };
      
      // 设置数据源
      apiPayload.spec.source = values.dataSources?.map((source: DataSourceConfig) => {
        if (source.apiType === 'apifox') {
          const apiConfig = source.config as ApiSyncConfig;
          return {
            apifox: {
              base: apiConfig.docUrl || '',
              shareLink: apiConfig.docUrl || '',
              projectId: apiConfig.projectId || '',
              username: apiConfig.apiKey || '',
              password: apiConfig.docPassword || ''
            }
          };
        } else {
          const apiConfig = source.config as ApiSyncConfig;
          return {
            [source.apiType || 'api']: {
              base: apiConfig.docUrl || '',
              shareLink: apiConfig.docUrl || '',
              projectId: apiConfig.projectId || ''
            }
          };
        }
      }) || [];
      
      // 设置目标存储
      apiPayload.spec.destination = values.storageTargets?.map((target: StorageTargetConfig) => {
        if (target.config.dbDriver === 'mongodb') {
          return {
            dest_type: 'mongodb',
            mode: target.config.mode || '1',
            mongoConfig: {
              host: target.config.mongoConfig?.host || 'localhost',
              port: target.config.mongoConfig?.port || '27017',
              username: target.config.mongoConfig?.username || '',
              password: target.config.mongoConfig?.password || '',
              dbName: target.config.mongoConfig?.dbName || ['kubeinpsect'],
              collection: target.config.mongoConfig?.collection || ['tasks']
            }
          };
        } else {
          return {
            dest_type: target.config.dbDriver || 'database',
            mode: target.config.mode || '1',
            config: {
              connection: target.config.connection || '',
              tables: target.config.tables || []
            }
          };
        }
      }) || [];
    }
    
    try {
      // 发送 HTTP 请求
      console.log('发送同步任务请求:', JSON.stringify(apiPayload, null, 2));
      const response = await post('/resource/dispatch', apiPayload);
      if (response.code > 0) {
        message.error('操作失败:' + response.data.code);
        return
      }
      console.log('同步任务创建成功:', response);
      
      message.success('同步任务创建成功');
      
      // 创建任务对象以便在UI中显示
      const sourceTypes = apiPayload.spec.source.map((s: any) => {
        const sourceType = Object.keys(s)[0];
        return sourceType.charAt(0).toUpperCase() + sourceType.slice(1); // 首字母大写
      });
      
      const destinationTypes = apiPayload.spec.destination.map((d: any) => {
        if (d.dest_type?.includes('mongodb')) {
          return 'MongoDB';
        } else {
          const destType = d.dest_type || '';
          return destType.charAt(0).toUpperCase() + destType.slice(1); // 首字母大写
        }
      });
      
      // 构建数据源和存储目标配置（用于UI显示）
      const dataSources = apiPayload.spec.source.map((s: any) => {
        const sourceType = Object.keys(s)[0];
        const config = s[sourceType];
        
        return {
          type: 'api',
          name: `${sourceType}数据源`,
          apiType: sourceType as ApiSyncType,
          config: {
            docUrl: config.base || config.shareLink,
            projectId: config.projectId,
            apiKey: config.username,
            docPassword: config.password
          }
        } as DataSourceConfig;
      });
      
      const storageTargets = apiPayload.spec.destination.map((d: any) => {
        let config: any = {};
        let type = 'database';
        
        if (d.mongoConfig) {
          config = {
            dbDriver: 'mongodb',
            mongoConfig: d.mongoConfig,
            connection: `mongodb://${d.mongoConfig.username || ''}:${d.mongoConfig.password || ''}@${d.mongoConfig.host || 'localhost'}:${d.mongoConfig.port || '27017'}`,
            tables: d.mongoConfig.collection || []
          };
        } else if (d.config) {
          const destType = d.dest_type || 'database';
          config = {
            dbDriver: destType,
            connection: d.config.connection,
            tables: d.config.tables || [],
            mode: d.mode || '1'
          };
        }
        
        return {
          type,
          name: `${type}目标`,
          config
        } as StorageTargetConfig;
      });
      
      const newTask: SyncTask = {
        id: Date.now().toString(),
        taskName: apiPayload.metadata.name,
        source: sourceTypes,
        destination: destinationTypes,
        schedule: apiPayload.spec.strategy.cron_expression || '每日 00:00',
        lastSync: new Date().toISOString(),
        status: 'pending',
        dataSources: dataSources,
        storageTargets: storageTargets
      };
      
      setTasks([...tasks, newTask]);
    } catch (error: any) {
      console.error('创建同步任务失败:', error);
      message.error(`创建同步任务失败: ${error.message || '未知错误'}`);
    }
    
    setModalVisible(false);
  };

  const handleNewTaskClick = () => {
    setModalVisible(true);
    console.log('新建任务按钮被点击！');
  };

  return (
    <div style={{ 
      padding: '24px 32px',
      backgroundColor: '#f0f2f5',
      width: '100%'
    }}>
      <Card
        bordered={false}
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ 
          marginBottom: 24,
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>数据同步中心</Title>
            <Text type="secondary">跨数据源/存储的自动化同步任务管理，支持Apifox、Swagger等API文档同步</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewTaskClick}
          >
            新建同步任务
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条同步任务`
          }}
          style={{ 
            backgroundColor: '#fff',
          }}
        />
      </Card>

      <SyncTaskModal
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        onSubmit={handleCreateSync}
      />
    </div>
  );
};

export default SyncDashboard;