import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"



interface SceneListState {
    sceneList: []
    loading: boolean
    isNewModalVisible: boolean
    isDeleteModalVisible: boolean
    deleteSceneId: string
    setSceneList: (data:[]) => void
    setLoading: (loading:boolean) => void
    setNewModalVisible: (visible: boolean) => void
    setDeleteModalVisible: (visible: boolean) => void
    setDeleteId: (deleteId:string) => void
}

const createSceneListStore = (): UseBoundStore<StoreApi<SceneListState>> => {
    const initialState = {
        sceneList: [],
        loading: false,
        isNewModalVisible: false,
        isDeleteModalVisible:false,
        deleteSceneId: ''
    }
    const actions = (set:any) => ({
        setSceneList: (data:[]) => {
            set((state:any) => ({
                sceneList: data
            }))
        },
        setNewModalVisible: (visible:boolean)=> {
            set((state:any) => ({
                isNewModalVisible: visible
            }))
        },
        setLoading: (loading:boolean) => {
            set((state:any) => (
                {
                    loading: loading
                }
            ))
        },
        setDeleteModalVisible: (visible: boolean) => {
            set((state:any) => ({
                isDeleteModalVisible: visible
            }))
        },
        setDeleteId: (deleteId:string) => {
            set((state:any) => ({
                deleteSceneId:deleteId
            }))
        }
    })
    const useSceneListStore:any = createStore(initialState,actions)

    return createSelectors(useSceneListStore)

}


export default createSceneListStore