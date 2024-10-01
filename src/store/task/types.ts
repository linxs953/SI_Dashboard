

// 创建任务Modal
interface addSceneData {
    id: number
    text: string
    instanceCount: number
}

interface searchSceneItem {
    id: number
    text: string
}



// 任务运行详情
interface SceneRecord {
    sceneId: string;
    sceneName: string;
    duration: number;
    total: number;
    success: number;
    fail: number;
    finish: number;
    status: number;
    error: Object;
    actionRecords: ActionRecord[];
}


interface ActionRecord {
    actionId: string;
    actionName: string;
    request: Object;
    response: Object;
    duration: number;
    status: number;
    error: Object;
}

interface TaskRunRecord {
  taskId: string;
  taskRunId: string;
  taskName: string;
  author: string
  createAt: string
  updateAt: string
  scenesRecords: SceneRecord[];
  status: number;
}



// 任务列表状态
interface TaskInfo {
    taskId: string
    taskName: string
    scenes: number
    author: string
    createdAt: string
    updatedAt: string
}