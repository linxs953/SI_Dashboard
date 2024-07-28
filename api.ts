import * as fs from 'fs';
import * as yaml from 'js-yaml';

const apiKeysFileTemplate = `
const $keyApiSpec:ApiSpec = $apiSpec

export const $keyApiSpecKeys = Object.keys($keyApiSpec)
export const $keyApiSpecMaps = $keyApiSpec
`

const entryFileTemplate = `
// api 调用入口文件
import { $keyApiSpecMaps } from "./apiKeys";
import { RestRequest } from "../request";

// 初始化请求实例
const client = new RestRequest()

export default async function entry(apikey:string, apiProps:ApiProps): Promise<Error | object>{
    let apiInfo:ApiInfo = $keyApiSpecMaps[apikey]
    apiInfo.Domain = apiProps.Domain
    const resp = await client.SendRequest(apiInfo,apiProps)

    // 请求错误,返回错误
    // 请求正常,返回object
    const err = resp as Error
    if (err) {
        return err
    }
    return resp as object
}
`

const typesFileTemplate = `
// 定义生成的 api 接口的结构
interface ApiSpec {
    [key:string]:ApiInfo
}

interface ApiInfo {
    URL: string
    Method: string 
    Domain: string
    Headers: ApiHeader
    IsAuth: boolean
    Payload: {}
    PayloadForm: {}
    Query:ApiQuery
}

interface ApiHeader {
    [key:string]:string
}


interface ApiQuery {
    type: string
    value: object

}


// 定义api参数化对象
interface ApiProps  {
    Headers: {[key:string]:string}
    Payload: {}
    PayloadForm: FormData
    Params: [{type:string,value: {[key:string]:string}}]
    Domain: string
}
`

const interceptorFileTemplate = `
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
`

const requestFileTemplate = `
import {AxiosResponse } from "axios";
import Axios from "./interceptor";


interface Request {
    SendRequest(apiInfo:ApiInfo,params: ApiProps): Promise<Error | object>
}

export class RestRequest implements Request{
    ApiMeta!: ApiInfo

    setRequestApi(apiMeta:ApiInfo) {
        this.ApiMeta = apiMeta
    }

    verify(): Error | null {
        const api = this.ApiMeta
        if (api.Domain == "") {
            return new Error("请求域名为空")
        }

        if (api.Method == "" || !"GETPOSTPUTDELETE".includes(api.Method.toUpperCase())) {
            return new Error("请求方法为空 / 不支持的请求方法")
        }

        if (api.URL == "") {
            return new Error("请求 URL 为空")
        }

        if (api.IsAuth && !api.Headers["Authorization"]) {
            return new Error("api 需要授权, 请求 header 中缺少Authorization")
        }
        return null
    }
    
    // api 请求对象预处理
    pre(params: ApiProps):Error | null{
        try {
            this.setDomain()
            this.setHeaders(params.Headers)
            this.setParams(params.Params)
            this.setPayload(params.Payload)
            this.setPayloadForm(params.PayloadForm)
        } catch(err:any) {
            return err
        }
        return null
    }


    setDomain() {
        if (this.ApiMeta.Domain == "") {
            throw Error("请求无效, 域名为空")
        }
        this.ApiMeta.URL = this.ApiMeta.URL.replaceAll("$domain",this.ApiMeta.Domain)
    }

    setHeaders(headers:{[key:string]:string}) {
        if (this.ApiMeta.IsAuth) {
            if (!headers["Authorization"]) {
                throw Error("api 需要授权访问, 接口请求没有携带Authorization")
            }
            this.ApiMeta.Headers = headers            
        }
    }

    setPayload(payload:object) {
        this.ApiMeta.Payload = payload
    }

    setPayloadForm(payload:FormData) {
        this.ApiMeta.PayloadForm = payload
    }

    setParams(params:[{type:string, value:{[key:string]:string}}]) {
        for(let idx=0; idx < params.length;idx++) {
            if (params[idx].type == "path") {
                for (let k in params[idx].value) {
                    this.ApiMeta.URL = String(this.ApiMeta.URL).replaceAll(k,params[idx].value[k])
                }
                return
            }
            if (params[idx].type == "query") {
                this.ApiMeta.URL += "?"
                Object.keys(params[idx].value).forEach((key,index) => {
                    this.ApiMeta.URL += key + "=" + params[idx].value[key]
                    if (index < Object.keys(params[idx].value).length - 1) {
                        this.ApiMeta.URL += "&"
                    }
                })
                return
            }
            throw Error("不支持的填充参数类型  " + params[idx].type)
        }
    }

    async SendRequest(apiInfo:ApiInfo,params: ApiProps): Promise<Error | object>{
        this.setRequestApi(apiInfo)
        let err = this.pre(params)
        if (err != null) {
            return err
        }
        err = this.verify()
        if (err != null) {
            return err
        }
        let reqResult:AxiosResponse | Error
        switch (this.ApiMeta.Method) {
            case "POST": {
                const contentType = this.ApiMeta.Headers["Content-Type"]
                if (!contentType) {
                    return new Error("api 请求未设置 Content-Type")
                }

                // 请求包含实体
                if (contentType.includes("application/form-data") || contentType.includes("multipart/form-data")) {
                    reqResult = await Axios.postForm(this.ApiMeta.URL,this.ApiMeta.PayloadForm,{
                        headers: this.ApiMeta.Headers
                    })
                    break
                }

                // 请求不包含实体
                if (contentType.includes("application/json") || contentType.includes("application/x-www-form-urlencoded")) {
                    reqResult = await Axios.post(this.ApiMeta.URL,this.ApiMeta.Payload,{
                        headers: this.ApiMeta.Headers
                    })
                    break  
                }
                return new Error("不支持的 ContentType: " +  contentType)
            }
            case "GET": {
                reqResult = await Axios.get(this.ApiMeta.URL,{
                    headers: this.ApiMeta.Headers
                })                
                break
            }
            case "PUT": {
                reqResult = await Axios.put(this.ApiMeta.URL,this.ApiMeta.Payload,{
                    headers: this.ApiMeta.Headers
                })
                break
            }
            case "DELETE": {
                reqResult = await Axios.delete(this.ApiMeta.URL,{
                    headers: this.ApiMeta.Headers
                })
            }
            default: {
                return new Error("不支持的请求方式: " + this.ApiMeta.Method)
            }
        }
        if (reqResult as Error) {
            return reqResult
        }
        let resp = reqResult as AxiosResponse
        if (resp.status != 200 ) {
            return new Error("响应状态码异常, StatusCode=" + resp.status)
        }
        return resp as object
    }
}
`


function generateApiSpec() {
    const sourceDir = "./api/yaml/"
    let yamlFileList = []
    let rootFileList = fs.readdirSync(sourceDir)

    // 生成yaml文件列表
    for (let idx =0; idx < rootFileList.length; idx++) {
        const blob = rootFileList[idx]
        const filename = `${sourceDir}${blob}`
        if (fs.statSync(filename).isFile()) {
            yamlFileList.push(filename)
        }
        if (fs.statSync(filename).isDirectory()) {
            fs.readdirSync(filename).forEach(item => rootFileList.push(`${blob}/${item}`))
        }
    }
    rootFileList = []
    
    for (let filename of yamlFileList) {
        const fileContents = fs.readFileSync(filename,'utf8')
        const apidata = yaml.load(fileContents) as Record<string, any>;
        const dirName = "./api/" + filename.split("/").reverse()[0].replaceAll(".yaml","")
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName)
        }

        // 根据yaml的配置,生成一份apiMap
        let apiMap:any = {}
        for (let api of apidata["apis"]) {
            let headers:any = {
                "Content-Type": api["contentType"]
            }
            if (api["auth"]["need"]) {
                headers["Authorization"] = `$JWT`
            }
            let urlObj = `{
                "URL": "https://$domain${api.url}",
                "Method": "${String(api.method).toUpperCase()}",
                "Headers": ${JSON.stringify(headers)},
                "Payload": {},
                "PayloadForm": {},
                "IsAuth": ${api.auth.need},
                "Domain": "$domain",
                "Query": ${JSON.stringify(api.query)}
            }`
            apiMap[api.key] = JSON.parse(urlObj)
        }
        let specFileContent = apiKeysFileTemplate.replaceAll("$apiSpec",JSON.stringify(apiMap,null,6))
        specFileContent = specFileContent.replaceAll("$key", apidata["key"])
        fs.writeFileSync(`${dirName}/apiKeys.ts`,specFileContent)
        
        // 生成types.ts
        fs.writeFileSync(`./api/types.ts`,typesFileTemplate)

        // 生成request.ts
        fs.writeFileSync(`./api//request.ts`,requestFileTemplate)


        // 生成interceptor.ts
        fs.writeFileSync(`./api/interceptor.ts`,interceptorFileTemplate)


        // 生成entry.ts
        fs.writeFileSync(`./${dirName}/entry.ts`,entryFileTemplate.replaceAll("$key",apidata["key"]))
    }
}

generateApiSpec()