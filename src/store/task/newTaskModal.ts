
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"


interface TaskListState {
    taskList: []
    isNewModalVisible:boolean
    setSceneList: (data:[]) => void
    setNewModalVisible: (visible:boolean) => void
}

interface NewTaskModalState {
    relateSceneList: addSceneData[]
    searchKeyword: string
    searchModalVisible: boolean
    selectAll: boolean
    searchResult: searchSceneItem[]
    selectedScenes: searchSceneItem[]
    searchCurrentPage: number
    searchCurrentPageSize: number
    addSceneCurrentPage: number
    addSceneCurrentPageSize: number
    setRelateSceneList: (data: []) => void
    setSearchKeyword: (keyword: string) => void
    setSearchModalVisible: (visible:boolean) => void
    setSelectAll: (visible:boolean) => void
    setSearchResult: (data:[]) => void
    setSelectedScenes: (data: []) => void
    setSearchCurrentPage: (page:number) => void
    setSearchCurrentPageSize: (pageSize:number) => void
    setaddSceneCurrentPage: (page:number) => void
    setaddSceneCurrentPageSize: (pageSize:number) => void
}

interface addSceneData {
    id: number
    text: string
    instanceCount: number
}

interface searchSceneItem {
    id: number
    text: string
}

const createTaskAddModalStore = (): UseBoundStore<StoreApi<NewTaskModalState>> => {
    const initialState = {
        relateSceneList: [],
        searchKeyword: "",
        searchModalVisible: false,
        selectAll:false,
        searchResult: [],
        selectedScenes: [],
        searchCurrentPage: 1,
        searchCurrentPageSize: 10,
        addSceneCurrentPage: 1,
        addSceneCurrentPageSize: 10
    }
    const actions = (set:any) => ({
        setRelateSceneList: (data: []) => {
            set((state:any) => ({
                relateSceneList: data
            }))
        },
        setSearchKeyword: (keyword: string) => {
            set((state:any) => ({
                searchKeyword: keyword
            }))
        },
        setSearchModalVisible: (visible:boolean) => {
            set((state:any) => ({
                searchModalVisible: visible
            }))
        },
        setSearchResult: (data:[]) => {
            set((state:any) => ({
                searchResult: data
            }))
        },
        setSelectedScenes: (data: []) => {
            set((state:any) => ({
                selectedScenes: data
            }))
        },
        setSearchCurrentPage: (page:number) => {
            set((state:any) => ({
                searchCurrentPage: page
            }))
        },
        setSearchCurrentPageSize: (pageSize:number) => {
            set((state:any) => ({
                searchCurrentPageSize: pageSize
            }))
        },
        setAddSceneCurrentPage: (page:number) => {
            set((state:any) => ({
                addSceneCurrentPage: page
            }))
        },
        setAddSceneCurrentPageSize: (pageSize:number) => {
            set((state:any) => ({
                addSceneCurrentPageSize: pageSize
            }))
        },
        setSelectAll: (visible:boolean) => {
            set((state:any) => ({
                selectAll: visible
            }))
        }
    })

    const useNewTaskModalStore:any = createStore(initialState,actions)

    return createSelectors(useNewTaskModalStore)
}


export default createTaskAddModalStore