import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"



interface ActionListState {
    isEditModalVisible: boolean
    isDrawerVisible: boolean
    currentDependTab: string
    selectedAction: ActionInfo
    setIsEditModalVisible?: (visible:boolean) => void
    setIsDrawerVisible?: (visible:boolean) => void
    setCurrentDependTab?: (dependTabName:string) => void
    setSelectedAction?: (selectedAction:ActionInfo) => void
}


const createActionListStore =  ():UseBoundStore<StoreApi<ActionListState>> => {
    const initialState = {
        isEditModalVisible: false,
        isDrawerVisible: false,
        currentDependTab: "headers",
        selectedAction: {}
    }
    const actions = (set:any) => ({
        setIsEditModalVisible: (visible:boolean) => {
            set((state:any) => ({
                isEditModalVisible: visible
            }))
        },
        setIsDrawerVisible:  (visible:boolean) => {
            set((state:any) => ({
                isDrawerVisible: visible
            }))
        },
        setCurrentDependTab: (dependTabName:string) => {
            set((state:any) => ({
                currentDependTab: dependTabName
            }))
        },
        setSelectedAction: (selectedAction:ActionInfo) => {
            set((state:any) => ({
                selectedAction: selectedAction
            }))
        }
    })
    const useActionListStore:any = createStore(initialState,actions)
    return createSelectors(useActionListStore)
}

export default createActionListStore