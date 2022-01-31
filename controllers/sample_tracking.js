import Authentication from './authentication';
import Fetch from './fetch';

export default class SampleTracking {
    sampleCollected = (location, containerId, pointId) => {
        return new Promise((resolve, reject) => { 
            var data = {
                "containerId": containerId,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        location.coords.longitude,
                        location.coords.latitude
                    ]
                }
            }

            if(pointId) {
                console.log("PointId: " + pointId)
                data["pointId"] = pointId
            }

            Fetch('/samplingRequest', {
                method: 'POST',
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }
}
