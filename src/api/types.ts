
// 定义生成的 api 接口的结构
interface ApiSpec {
    [key:string]:ApiInfo
}

interface ApiInfo {
    URL: string
    Path?: string
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
    Headers?: {[key:string]:string}
    Payload?: {}
    PayloadForm?: FormData
    Params?: [{type:string,value: {[key:string]:string}}]
    Domain?: string
}
