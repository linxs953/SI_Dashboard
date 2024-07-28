
// api 调用入口文件
import { userManagerApiSpecMaps } from "./apiKeys";
import { RestRequest } from "../request";

// 初始化请求实例
const client = new RestRequest()

export default async function entry(apikey:string, apiProps:ApiProps): Promise<Error | object>{
    let apiInfo:ApiInfo = userManagerApiSpecMaps[apikey]
    apiInfo.URL = apiInfo.Path
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
