import Authentication from './authentication';
import Fetch from './fetch';

export default class SampleTracking {
    sampleCollected = (location, containerId) => {
        return new Promise((resolve, reject) => { 
            Fetch('/samplingRequest', {
                method: 'POST',
                body: JSON.stringify({
                    "containerId": containerId,
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            location.coords.longitude,
                            location.coords.latitude
                        ]
                    }
                })
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        })
    }
}
