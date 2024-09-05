
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"


interface TaskListState {
    taskList: []
    isNewModalVisible:boolean
    setSceneList: (data:[]) => void
    setNewModalVisible: (visible:boolean) => void
}

const createSceneListStore = (): UseBoundStore<StoreApi<TaskListState>> => {
    const initialState = {
        taskList: [],
        isNewModalVisible: false,
    }
    const actions = (set:any) => ({
        setSceneList: (data:[]) => {
            set((state:any) => ({
                taskList: data
            }))
        },
        setNewModalVisible: (visible:boolean)=> {
            set((state:any) => ({
                isNewModalVisible: visible
            }))
        },
    })
    const useTaskListStore:any = createStore(initialState,actions)

    return createSelectors(useTaskListStore)
}


export default createSceneListStore