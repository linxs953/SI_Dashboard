
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"

interface SetActionDomainState {
    isModalVisible: boolean
    setIsModalVisible: (isModalVisible: boolean) => void

    useEnvironment: string
    setUseEnvironment: (useEnvironment: string) => void

    subSystem: string
    setSubSystem: (subSystem: string) => void
}

const CreateActionDomainStore = (): UseBoundStore<StoreApi<SetActionDomainState>> => {
    const initialState = {
        isModalVisible: false,

        useEnvironment: 'test',

        subSystem: '',
    }
    const actions = (set:any) => ({
        setIsModalVisible: (isModalVisible: boolean) => {
            set((state:any) => ({
                isModalVisible: isModalVisible
            }))
        },

        setUseEnvironment: (useEnvironment: string) => {
            set((state:any) => ({
                useEnvironment: useEnvironment
            }))
        },

        setSubSystem: (subSystem: string) => {
            set((state:any) => ({
                subSystem: subSystem
            }))
        },
    })

    const useSetActionDomainStore:any = createStore(initialState,actions)

    return createSelectors(useSetActionDomainStore)
}


export default CreateActionDomainStore