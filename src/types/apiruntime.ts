// 类型定义
export interface TaskFormValues {
    taskName: string;
    description?: string;
    selectedScenes: string[];
    timeout?: number;
  }
  
  
export interface TaskCreateModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: TaskFormValues) => Promise<void>;
    sceneOptions: SceneOption[];
  }


  // 类型定义
export interface TaskFormData {
  taskInfo: {
    name: string;
    description?: string;
  };
  strategy: {
    retries: number;
    timeout: number;
    autoRun: boolean;
    notifyOnFailure: boolean;
  };
  scenes: string[];
}
export interface SceneOption {
  value: string;
  label: string;
}