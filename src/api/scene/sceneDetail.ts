
// 场景信息的数据结构

interface SceneDetail {
    sceneId: string;
    sceneName: string;
    sceneDesc: string;
    retry: number;
    timeout: number;
    author: string;
    actionNum: number;
    actions: ActionData[];
    createTime: string;
    updateTime: string;
}

// Action只抽取部分字段，用于页面展示
interface ActionData {
    actionId: string;
    actionName: string;
    retry: number;
    timeout: number;
    domain: string;
    relateId: string;
    // 用于页面展示
    actionMethod: string;
    actionPath: string;
    dependency: Dependency[];
}


interface Dependency {
    dependType:string // 依赖类型， headers / payload / path / params / expect

    // 依赖定义
    dependSpec :{
        fieldRefer:string       // 要注入依赖的字段表达式，有多层通过.连接
        dataSourceType:string  // 数据源类型，与后端返回值data.type对应，scene / basic / custom / event
        relateStep?: string     // 引用的那个场景，当dataSourceType=scene时设置
        customValue?:string     // 设置字段的自定义值，当dataSourceType=custom时设置
        relateCache?:string     // 设置引用的基础数据kv，当dataSourceType=basic时设置
        dataRefer?:string       // 从数据源读取的数据索引，当dataSourceType=scene / basic时设置
        event?: string          // 设置使用哪个event来生成数据，当dataSourceType=event时设置
    }    
}
