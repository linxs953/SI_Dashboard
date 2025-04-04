// API同步任务类型定义
export type ApiSyncType = 'apifox' | 'swagger' | 'postman' | 'openapi';

// 同步任务状态
export type SyncStatus = 'pending' | 'syncing' | 'success' | 'failed';


export enum SyncTaskType {
  ApifoxSync = '11',
  SwaggerSync = '12',
  PostmanSync = '13',
  OpenAPISync = '14',
  MysqlSync = '21',
  RedisSync = '22',
  MongoDBSync = '23',
  ClickHouseSync = '24',
}

// 数据库驱动类型
export enum DatabaseDriver {
  MySQL = 'mysql',
  PostgreSQL = 'postgresql',
  MongoDB = 'mongodb',
  Oracle = 'oracle',
  SQLServer = 'sqlserver'
}

// 同步模式
export enum SyncMode {
  Full = '1',
  Incremental = '2',
  Snapshot = '3'
}


// API同步配置
export interface ApiSyncConfig {
  docUrl: string;           // API文档链接
  authUrl?: string;         // 授权链接
  docPassword?: string;     // 文档密码
  apiKey?: string;          // API密钥
  authorization?: string;   // 授权信息
  headers?: Record<string, string>; // 请求头
  syncInterval?: string;    // 同步间隔
  projectId?: string;       // 项目ID
  version?: string;         // API版本
}

// 数据库同步配置
export interface DatabaseSyncConfig {
  connection: string;       // 连接字符串
  query?: string;           // 查询语句
  tables?: string[];        // 表名列表
  syncInterval?: string;    // 同步间隔
}

// 数据源配置
export interface DataSourceConfig {
  type: 'api' | 'database'; // 数据源类型
  name: string;             // 数据源名称
  apiType?: ApiSyncType;    // API类型（当type为api时）
  config: ApiSyncConfig | DatabaseSyncConfig; // 配置信息
}

export interface SyncSourceConfig {
  apifox: ApifoxConfig
}

export interface ApifoxConfig {
  base: string;
  shareLink:string;
  projectId:string;
}

// MongoDB配置
export interface MongoDBConfig {
  host: string;
  port: string;
  username?: string;
  password?: string;
  dbName: string[];
  collection: string[];
}

// 存储目标配置
export interface StorageTargetConfig {
  type: 'redis' | 'database' | 'messageQueue' | 'elasticsearch';
  name?: string;
  config: {
    dbDriver?: string;
    connection?: string;
    tables?: string[];
    mongoConfig?: MongoDBConfig;
    mode?: string;
    [key: string]: any;
  };
}

// API请求格式的数据结构
export interface ApiSyncPayload {
  type: string;
  event: string;
  spec: {
    strategy: {
      auto: boolean;
      cron_expression: string;
      retry_count: number;
      retry_interval: number;
      priority: number;
      timeout: number;
    };
    sync_type: string;
    source: any[];
    destination: any[];
  };
  metadata: {
    name: string;
    namespace: string;
    desc?: string;
  };
  // _formData?: SyncTaskFormData; // 原始表单数据，为了兼容性
}

// 同步任务表单数据
export interface SyncTaskFormData {
  taskName: string;
  sourceType: string[];
  destinationType: string[];
  schedule: string;
  enable_schedule: boolean;
  sync_type: string;
  retry_count: number;
  retry_interval: number;
  priority: number;
  timeout: number;
  description?: string;
  dataSources: DataSourceConfig[];
  storageTargets: StorageTargetConfig[];
}

// 同步任务数据模型
export interface SyncTask {
  id: string;
  taskName: string;
  source: string[];
  destination: string[];
  schedule: string;
  lastSync: string;
  status: SyncStatus;
  dataSources: DataSourceConfig[];
  storageTargets: StorageTargetConfig[];
}
