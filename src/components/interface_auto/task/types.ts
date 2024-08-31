

interface SceneInfo {
    sceneId: string
    sceneName: string
    sceneDescription: string
    sceneTimeout: number
    sceneRetries: number
    actionList: StepInfo[]
  }
  
interface StepInfo {
    stepId: string
    stepName: string
    stepDescription: string
    stepTimeout: number
    stepRetry: number
    stepMethod: string
    stepRoute: string
    stepDependencies: StepDependencies[]
}

interface StepDependencies {
    dependType: string
    targetField: string
    dsType: string
    relateStep?: string // 当dependType为scene时，relateStep为必填
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
}

interface TaskInfoState {
    taskDetail: TaskDetail
    sceneList: SceneInfo[]
}