import { useEffect, useState } from "react";
import entry from "../../api/tools/entry"

const apiDomain = import.meta.env.VITE_DOMAIN

type ApiParamState = {
    apiKey: string,
    data: ApiProps,
    isAlready: boolean
}

const initialApiParam:ApiParamState = {
    apiKey: "",
    data: {},
    isAlready: false
}



export function useFetchPhoneCode() {
    const [data, setData] = useState(new Object())
    const [err,setErr] = useState(null)
    const [apiParamState,setApiParamState] = useState(initialApiParam)

    const apiParamString = JSON.stringify(apiParamState)


    useEffect(() => {
        const sendReq = async () => {
            entry(apiParamState.apiKey,apiParamState.data
            ).then(res => {
                console.log(res)
                setData(res)
            }).catch(err => {
                console.log(err)
                setErr(err)
            })
        }
        if (apiParamState.isAlready) {
            sendReq()
        }
        console.log(apiParamState)
    },[apiParamState])


    return [
        data,
        err,
        setApiParamState
    ];
}