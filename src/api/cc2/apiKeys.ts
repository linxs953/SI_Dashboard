
const cc2ApiSpec:ApiSpec = {
      "save": {
            "URL": "/api/v1/canvans/save",
            "Method": "POST",
            "Headers": {
                  "Content-Type": "application/json",
                  "Authorization": "$JWT"
            },
            "Payload": {},
            "PayloadForm": {},
            "IsAuth": true,
            "Domain": "$domain"
      },
      "get": {
            "URL": "/api/v1/canvans/get",
            "Method": "GET",
            "Headers": {
                  "Content-Type": "application/json",
                  "Authorization": "$JWT"
            },
            "Payload": {},
            "PayloadForm": {},
            "IsAuth": true,
            "Domain": "$domain"
      }
}

export const cc2ApiSpecKeys = Object.keys(cc2ApiSpec)
export const cc2ApiSpecMaps = cc2ApiSpec
