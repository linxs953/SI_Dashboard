import {create} from "zustand"

interface GlobalStore {
    loading: boolean
}

const useGlobalStore = create<GlobalStore>()(() => ({
    loading: false
}))


export const hideLoading = () => {
    useGlobalStore.setState({
        loading: false
    })
}


export const showLoading = () => {
    useGlobalStore.setState({
        loading: true
    })
}


export default useGlobalStore