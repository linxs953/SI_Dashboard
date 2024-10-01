
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"

interface TaskRunDetailState {
    taskRecord: TaskRunRecord
    setTaskRecord: (taskRecord: TaskRunRecord) => void
    
    sceneRecords: SceneRecord[]
    setSceneRecords: (sceneRecords: SceneRecord[]) => void
    
    loading: boolean
    setLoading: (loading: boolean) => void
    
    isActionModalVisible: boolean
    setIsActionModalVisible: (isActionModalVisible: boolean) => void
    
    selectedAction: ActionRecord | null
    setSelectedAction: (selectedAction: ActionRecord | null) => void
    
    isSceneModalVisible: boolean
    setIsSceneModalVisible: (isModalVisible: boolean) => void

    selectedScene: SceneRecord | null
    setSelectedScene: (selectedScene: SceneRecord | null) => void
    
}

const createTaskRunDetailStore = (): UseBoundStore<StoreApi<TaskRunDetailState>> => {
    const initialState = {
        taskRecord: {} as TaskRunRecord,
        
        sceneRecords: [],

        loading: false,

        isActionModalVisible: false,
        
        selectedAction: {} as ActionRecord,

        isSceneModalVisible: false,

        selectedScene: {} as SceneRecord,
    }
    const actions = (set:any) => ({
        setTaskRecord: (taskRecord: TaskRunRecord) => {
            set((state:any) => ({
                taskRecord: taskRecord
            }))
        },
        
        setSceneRecords: (sceneRecords: SceneRecord[]) => {
            set((state:any) => ({
                sceneRecords: sceneRecords
            }))
        },
        
        setLoading: (loading: boolean) => {
            set((state:any) => ({
                loading: loading
            }))
        },
        
        setIsActionModalVisible: (isActionModalVisible: boolean) => {
            set((state:any) => ({
                isActionModalVisible: isActionModalVisible
            }))
        },
        
        
        setSelectedAction: (selectedAction: ActionRecord) => {
            set((state:any) => ({
                selectedAction: selectedAction
            }))
        },

        setIsSceneModalVisible: (isSceneModalVisible: boolean) => {
            set((state:any) => ({
                isSceneModalVisible: isSceneModalVisible
            }))
        },

        setSelectedScene: (selectedScene: SceneRecord) => {
            set((state:any) => ({
                selectedScene: selectedScene
            }))
        },
        
    })

    const useTaskDetailStore:any = createStore(initialState,actions)

    return createSelectors(useTaskDetailStore)
}


export default createTaskRunDetailStore