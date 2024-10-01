import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"

interface Pageination {
    pageNum: number
    pageSize: number
    total: number
}

interface SearchApiResult {
    id: number
    text: string
}


interface NewSceneState {
    addedApiList: SearchApiResult[]
    searchApiSearchKey: string
    isAddApiModalVisible: boolean
    apiSearchList: SearchApiResult[]
    selecetdApiList: SearchApiResult[]
    isSelectedAll: boolean
    searchListPageination: Pageination
    addedListPageination: Pageination
    setAddedApi: (data:SearchApiResult[]) => void
    setSearchKey: (search:string) => void
    setIsAddApiModalVisible: (visible:boolean) => void
    setApiSearchList: (data:SearchApiResult[]) => void
    setSelectedApiList: (data:SearchApiResult[]) => void
    setIsSelectdAll: (selectAll: boolean) => void
    setSearchListPageination: (pageination: Pageination) => void
    setAddedListPageination: (pageination: Pageination) => void
}

const createSceneStore = ():UseBoundStore<StoreApi<NewSceneState>> =>{
    const initialState = {
        addedApiList: [],
        searchApiSearchKey: '',
        isAddApiModalVisible: false,
        apiSearchList: [],
        selecetdApiList: [],
        isSelectedAll: false,
        searchListPageination: {
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        addedListPageination: {
            pageNum: 1,
            pageSize: 5,
            total: 0,
        },
    }
    const actions = (set:any) => ({
        setAddedApi: (data:SearchApiResult[]) => {
            set((state:any) => ({
                addedApiList: data
            }))
        },
        setSearchKey: (search:string) => {
            set((state:any) => ({
                searchApiSearchKey: search
            }))
        },
        setIsAddApiModalVisible: (visible:boolean) => {
            set((state:any) => ({
                isAddApiModalVisible: visible
            }))
        },
        setApiSearchList: (data:SearchApiResult[]) => {
            set((state:any) => ({
                apiSearchList: data
            }))
        },
        setSelectedApiList: (data:SearchApiResult[]) => {
            set((state:any) => ({
                selecetdApiList: data
            }))
        },
        setIsSelectdAll: (selectAll: boolean) => {
            set((state:any) => ({
                isSelectedAll: selectAll
            }))
        },
        setSearchListPageination: (pageination: Pageination) => {
            set((state:any) => ({
                searchListPageination: pageination
            }))
        },
        setAddedListPageination: (pageination: Pageination) => {
            set((state:any) => ({
                setAddedListPageination: pageination
            }))
        },
    })

    const useSceneListStore:any = createStore(initialState,actions)
    return createSelectors(useSceneListStore)
}

export default createSceneStore