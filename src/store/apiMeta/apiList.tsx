import { create, StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"


interface ApiListState {
    apiList: []
    loading: boolean
    searchKey:string
    pagination: {
        pageNum: number
        pageSize: number
        total: number
    }
    updateApiList: (data:[]) => void
    updateSearchKey: (search:string) => void
    setLoading: (loading:boolean) => void
    setPagination: (pageination:{pageNum:number,pageSize:number, total:number}) => void
}


const createApiListStore = (): UseBoundStore<StoreApi<ApiListState>> => {
    const initialState = {
        apiList: [],
        loading: false,
        searchKey: '',
        pagination: {
            pageNum: 1,
            pageSize: 10,
            total: 0
        }
    }
    const actions = (set:any) => ({
        updateApiList: (data:[]) => {
            set((state:any) => ({
                apiList: data
            }))
        },
        updateSearchKey: (search:string)=> {
            set((state:any) => ({
                searchKey: search
            }))
        },
        setLoading: (loading:boolean) => {
            set((state:any) => (
                {
                    loading: loading
                }
            ))
        },
        setPagination: (pageination:{pageNum:number,pageSize:number, total:number}) => {
            set((state:any) => ({
                pagination: {
                    pageNum: pageination.pageNum,
                    pageSize: pageination.pageSize,
                    total: pageination.total,
                }
            }))
        }
    })
    const useApiListStore2:any = createStore(initialState,actions)
    return createSelectors(useApiListStore2)
}


export default createApiListStore