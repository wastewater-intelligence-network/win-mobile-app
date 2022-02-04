import Fetch from './fetch';

export default class SampleTracking {
    sampleCollected = (location, containerId, pointId, additionalData) => {
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

            if(additionalData) {
                data["additionalData"] = additionalData
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

    changeSampleStatus = (containerId, statusPatch) => {
        return new Promise((resolve, reject) => { 
            var data = {
                "containerId": containerId,
                "statusPatch": statusPatch
            }

            Fetch('/samplingStatus', {
                method: 'PATCH',
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }

    sampleInTransit = (containerId) => {
        return this.changeSampleStatus(containerId, 'sample_in_transit')
    }

    sampleAcceptedInLab = (containerId) => {
        return this.changeSampleStatus(containerId, 'sample_received_in_lab')
    }

    getSamplesList = (date) => {
        return new Promise((resolve, reject) => {
            Fetch('/getSamplesCollectedOn?date=' + date, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }
}
