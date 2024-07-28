
const userManagerApiSpec:ApiSpec = {
      "getSms": {
            "URL": "https://$domain/api/captcha/sms",
            "Path": "https://$domain/api/captcha/sms",
            "Method": "GET",
            "Headers": {
                  "Content-Type": "application/x-www-form-urlencoded"
            },
            "Payload": {},
            "PayloadForm": {},
            "IsAuth": false,
            "Domain": "$domain",
            "Query": {
                  "type": "query",
                  "value": {
                        "phone": "string",
                        "type": "integer"
                  }
            }
      }
}

export const userManagerApiSpecKeys = Object.keys(userManagerApiSpec)
export const userManagerApiSpecMaps = userManagerApiSpec
