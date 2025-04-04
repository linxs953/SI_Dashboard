export interface ApiConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: any;
  dependencies: {
    sourceId: string;
    path: string;
  }[];
  assertions: {
    type: 'status' | 'body' | 'headers';
    path?: string;
    operator: 'equals' | 'contains' | 'exists' | 'regex';
    expected: any;
  }[];
  exports: {
    name: string;
    path: string;
  }[];
}

export interface ScenarioConfig {
  id: string;
  name: string;
  description?: string;
  apis: ApiConfig[];
}

export interface TaskConfig {
  name: string;
  description?: string;
  strategy: {
    retryCount: number;
    retryInterval: number;
    timeout: number;
    priority: number;
    schedule?: string;
    autoRun: boolean;
  };
  scenarios: ScenarioConfig[];
}
