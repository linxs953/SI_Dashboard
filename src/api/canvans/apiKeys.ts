
const canvansApiSpec:ApiSpec = {
      "save": {
            "URL": "https://$domain/api/v1/canvans/save",
            "Method": "POST",
            "Headers": {
                  "Content-Type": "application/json",
                  "Authorization": "$JWT"
            },
            "Payload": {},
            "PayloadForm": {},
            "IsAuth": true,
            "Domain": "$domain",
            "Query": [
                  {
                        "name": "name",
                        "value": "1"
                  },
                  {
                        "name": "p2",
                        "value": "v2"
                  }
            ]
      },
      "get": {
            "URL": "https://$domain/api/v1/canvans/get",
            "Method": "GET",
            "Headers": {
                  "Content-Type": "application/json",
                  "Authorization": "$JWT"
            },
            "Payload": {},
            "PayloadForm": {},
            "IsAuth": true,
            "Domain": "$domain",
            "Query": [
                  {
                        "name": "name",
                        "value": "1"
                  },
                  {
                        "name": "p2",
                        "value": "v2"
                  }
            ]
      }
}

export const canvansApiSpecKeys = Object.keys(canvansApiSpec)
export const canvansApiSpecMaps = canvansApiSpec
