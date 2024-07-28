import docCookies from "src/utils/cookie";
import { create } from "zustand";

interface UserStoreState {
    isLogin: boolean
    UserId: number
}

const initiateState:UserStoreState = {isLogin: false, UserId: 0}
const useStore = create<UserStoreState>()(() => ({...initiateState}))


export const login = async () => {
    let user = {...initiateState}
    // todo:登录获取sessionid并写入
    docCookies.setItem("sessionId","登录信息")
    useStore.setState(user)
}


export const logout = async() => {
    let user = {...initiateState}
    // todo: 调用登出接口
    docCookies.removeItem("sessionId")
    useStore.setState(user)
}


export const fetchUserInfo = async(userId:number) => {
    let user = {...initiateState}
    // todo:获取用户信息接口
    useStore.setState(user)
}