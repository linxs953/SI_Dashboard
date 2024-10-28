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

interface SceneInfo {
    sceneId: string
    sceneName: string
    sceneDescription: string
    sceneTimeout: number
    sceneRetries: number
    searchKey: string
    environment: string
    actionList: ActionInfo[]
  }
  
interface ActionInfo {    
    actionId: string
    relateId:string
    actionName: string
    actionDescription: string
    actionTimeout: number
    actionRetry: number
    actionMethod: string
    actionRoute: string
    actionExpect: expect
    actionOutput: Object
    actionSearchKey: string
    actionDomain: string
    actionEnvironment: string
    actionDependencies: DependInfo[]
}

interface expect {
    api: ApiExpect[]
    sql: {}
}

interface ApiExpect {
    type: string
    data: {
        type: string
        operator: string
        name: string
        desire:string
        desireSetting: DesireSetting
    }
}


interface DesireSetting {
    output: {
        type: string
        value: any
    }
    dataSource: DataSource[]
    dsSpec: DataSourceSpec[]
    extra: string
    isMultiDs: boolean
    mode: string,
    referTarget: string
    referType: string
}

interface actionDependencies {
    dataKey?: string
    dependType: string
    targetField: string
    dsType: string
    relateaction?: string // 当dependType为scene时，relateaction为必填
    customValue?: string // 当dependType为custom时，targetValue为必填
    cacheKey?: string // 当dependType为basic时，cacheKey为必填

}

interface DependInfo {
    output: {
        type: string
        value: any
    }
    dataSource: DataSource[]
    dsSpec: DataSourceSpec[]
    extra: string
    isMultiDs: boolean
    mode: string
    refer: {
        type: string
        target: string
        dataType: string
    }
    
}

interface DataSourceSpec{
    dependId: string
    dependName: string
    modelId: string
    needProcess: boolean
}

interface DataSource {
    name: any;
    dependType: string
    dataKey: string
    actionKey: string
    dependId: string
    dsType: string
    searchCond: []
    sceneId: string
    actionId: string
}

interface TaskDetail {
    taskId: string
    taskName: string
    relateSceneNum: number
    description: string
    timeout: number
    retry: number
    creator: string
    creationTime: string
    updateTime: string
}

interface TaskInfoState {
    taskDetail: TaskDetail
    sceneList: SceneInfo[]
}