

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
    actionExpect: Object
    actionOutput: Object
    actionSearchKey: string
    actionDomain: string
    actionEnvironment: string
    actionDependencies: actionDependencies[]
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