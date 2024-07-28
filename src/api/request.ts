
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
        console.log(this.ApiMeta)
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
