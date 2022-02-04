import Authentication from "./authentication"

const WIN_API_ENDPOINT = 'http://192.168.0.105:8080'

export default function Fetch(resource, init) {
    var auth = new Authentication()

    return new Promise((resolve, reject) => {
        auth.getSessionToken().then(token => {
            if(init.headers === undefined) {
                init['headers'] = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            } else {
                console.log('Token: ' + token)
                
                init['headers']['Content-Type'] = 'application/json'
        
                if(init['headers']['Authorization'] === undefined) {
                    init['headers']['Authorization'] = 'Bearer ' + token
                }
                console.log(init)
            }

            fetch(WIN_API_ENDPOINT + resource, init)
                .then(resolve)
                .catch(reject)
        })
    })
}
