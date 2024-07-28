const apiDomain = import.meta.env.VITE_DOMAIN
let apiSpec:any =  {
    "saveCanvans": {
            url: "https://$apiDomain/api/v1/canvans/save?name=1&p2=v2",
            method: "POST",
            payload: {}
        },
}
for (let key in apiSpec) {
    apiSpec[key].url = String(apiSpec[key].url).replaceAll("$apiDomain",apiDomain)
}
export default apiSpec