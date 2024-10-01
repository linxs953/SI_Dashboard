
import { StoreApi, UseBoundStore } from "zustand"
import createSelectors from "../selectors"
import createStore from "../store"

interface TaskSceneListState {
    activeTabKey: string
    setActiveTabKey: (activeTabKey: string) => void
    
    isDependDrawerVisible: boolean
    setIsDependDrawerVisible: (isDependDrawerVisible: boolean) => void
    
    isEditActionModalVisible: boolean
    setIsEditActionModalVisible: (isEditActionModalVisible: boolean) => void

    isEditSceneModalVisible: boolean
    setIsEditSceneModalVisible: (isEditSceneModalVisible: boolean) => void

    dependSelectTab: string
    setDependSelectTab: (dependSelectTab: string) => void
    
    isExpectDrawerModalVisible:boolean
    setIsExpectDrawerModalVisible: (isExpectDrawerModalVisible:boolean) => void
    
    sceneIndex: number
    setSceneIndex: (sceneIndex:number) => void

    formBasicDataIndex: number
    setFormBasicDataIndex: (formBasicDataIndex:number) => void
    
    currentAction: ActionInfo
    setCurrentAction: (currentAction: ActionInfo) => void
    
    currentScene: SceneInfo
    setCurrentScene: (currentScene: SceneInfo) => void

    selectScene: SceneInfo
    setSelectScene: (selectScene: SceneInfo) => void

    isSelectActionModalVisible: boolean
    setIsSelectActionModalVisible: (isSelectActionModalVisible: boolean) => void

    isBasicDataModalVisible: boolean
    setIsBasicDataModalVisible: (isBasicDataModalVisible: boolean) => void
     
}

const createTaskSceneListStore = (): UseBoundStore<StoreApi<TaskSceneListState>> => {
    const initialState = {
        activeTabKey: "",
        
        isDependDrawerVisible: false,
        
        isEditActionModalVisible: false,
    
        isEditSceneModalVisible: false,
    
        dependSelectTab: "headers",
        
        isExpectDrawerModalVisible:false,
        
        sceneIndex: 0,
    
        formBasicDataIndex: 0,
        
        currentAction: {
              actionId: '',
              actionName: '',
              actionDescription: '',
              actionTimeout: 0,
              actionRetry: 0,
              actionMethod: '',
              actionRoute: '',
              actionDependencies: [],
              relateId: '',
              actionExpect: {api: [], sql: []},
              actionOutput: '',
              actionSearchKey: '',
              actionDomain: '',
              actionEnvironment: '',
        },
        
        currentScene: {
              sceneId: '',
              sceneName: '',
              sceneDescription: '',
              sceneTimeout: 0,
              sceneRetries: 0,
              actionList: [],
              searchKey: '',
              environment: ''
        },
    
        selectScene: {
              sceneId: '',
              sceneName: '',
              sceneDescription: '',
              sceneTimeout: 0,
              sceneRetries: 0,
              actionList: [],
              searchKey: '',
              environment: ''
        },
    
        isSelectActionModalVisible: false,
    
        isBasicDataModalVisible: false,
         
    }
    const actions = (set:any) => ({
        setActiveTabKey: (activeTabKey: string) => {
            set((state:any) => ({
                activeTabKey: activeTabKey
            }))
        },
        
        setIsDependDrawerVisible: (isDependDrawerVisible: boolean) => {
            set((state:any) => ({
                isDependDrawerVisible: isDependDrawerVisible
            }))
        },
        
        setIsEditActionModalVisible: (isEditActionModalVisible: boolean) => {
            set((state:any) => ({
                isEditActionModalVisible: isEditActionModalVisible
            }))
        },
    
        setIsEditSceneModalVisible: (isEditSceneModalVisible: boolean) => {
            set((state:any) => ({
                isEditSceneModalVisible: isEditSceneModalVisible
            }))
        },
    
        setDependSelectTab: (dependSelectTab: string) => {
            set((state:any) => ({
                dependSelectTab: dependSelectTab
            }))
        },
        
        setIsExpectDrawerModalVisible: (isExpectDrawerModalVisible:boolean) => {
            set((state:any) => ({
                isExpectDrawerModalVisible: isExpectDrawerModalVisible
            }))
        },
        
        setSceneIndex: (sceneIndex:number) => {
            set((state:any) => ({
                sceneIndex: sceneIndex
            }))
        },
    
        setFormBasicDataIndex: (formBasicDataIndex:number) => {
            set((state:any) => ({
                formBasicDataIndex: formBasicDataIndex
            }))
        },
        
        setCurrentAction: (currentAction: ActionInfo) => {
            set((state:any) => ({
                currentAction: currentAction
            }))
        },
        
        setCurrentScene: (currentScene: SceneInfo) => {
            set((state:any) => ({
                currentScene: currentScene
            }))
        },
    
        setSelectScene: (selectScene: SceneInfo) => {
            set((state:any) => ({
                selectScene: selectScene
            }))
        },
    
        setIsSelectActionModalVisible: (isSelectActionModalVisible: boolean) => {
            set((state:any) => ({
                isSelectActionModalVisible: isSelectActionModalVisible
            }))
        },
    
        setIsBasicDataModalVisible: (isBasicDataModalVisible: boolean) => {
            set((state:any) => ({
                isBasicDataModalVisible: isBasicDataModalVisible
            }))
        }
    })

    const taskSceneListStore:any = createStore(initialState, actions);

    return createSelectors(taskSceneListStore)
}


export default createTaskSceneListStore