
import { message } from "antd"
import axios from "axios"

const Axios = axios.create({
    timeout: 20000
})


Axios.interceptors.request.use(
    (res) => {
        return Promise.resolve(res)
    },
    (err) => {
        return Promise.reject(err)
    }
)


Axios.interceptors.response.use(
    (res) => {
        switch(res.status) {
            case 200: {
                if (res.data.code > 200) {
                    message.warning(res.data.message || "请求处理失败")
                } else {
                    return res.data
                }
                break
            }
            case 401: {
                message.warning(res.data.message || "未登录")
                break
            }
            case 400: {
                message.warning(res.data.message || "参数有误")
                break
            }
            default: {
                message.warning(res.data.message || "请求错误")
                break
            }
        }
    },
    (err) => {
        return Promise.reject(err)
    }
)
export default Axios
