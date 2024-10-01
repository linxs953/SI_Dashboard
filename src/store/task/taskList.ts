
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"


interface TaskListState {
    taskList: TaskInfo[]
    isNewModalVisible:boolean
    total:number
    currentPage:number
    totalPage:number
    pageSize:number
    setPageSize: (pageSize:number) => void
    setTotalPage: (totalPage:number) => void
    setTotal: (total:number) => void
    setCurrentPage: (currentPage:number) => void
    setTaskList: (data:TaskInfo[]) => void
    setNewModalVisible: (visible:boolean) => void
}

const createSceneListStore = (): UseBoundStore<StoreApi<TaskListState>> => {
    const initialState = {
        taskList: [],
        isNewModalVisible: false,
        total:0,
        currentPage:1,
        totalPage:1,
        pageSize:10
    }
    const actions = (set:any) => ({
        setTaskList: (data:[]) => {
            set((state:any) => ({
                taskList: data
            }))
        },
        setNewModalVisible: (visible:boolean)=> {
            set((state:any) => ({
                isNewModalVisible: visible
            }))
        },
        setTotal: (total:number) => {
            set((state:any) => ({
                total: total
            }))
        },
        setTotalPage: (totalPage:number) => {
            set((state:any) => ({
                totalPage: totalPage
            }))
        },
        setCurrentPage: (currentPage:number) => {
            set((state:any) => ({
                currentPage: currentPage
            }))
        },
        setPageSize: (pageSize:number) => {
            set((state:any) => ({
                pageSize: pageSize
            }))
        }
    })
    const useTaskListStore:any = createStore(initialState,actions)

    return createSelectors(useTaskListStore)
}


export default createSceneListStore