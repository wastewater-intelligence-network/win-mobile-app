import Fetch from './fetch';

export default class SampleTracking {
    sampleCollected = (location, containerId, pointId, additionalData, navigation) => {
        // console.log(`location=${location.coords.latitude} ${location.coords.longitude}, containerID=${containerId}, pointID=${pointId}, additionalData=${additionalData.ph} ${additionalData.temperature}${additionalData.inflow}`)
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
            }, navigation)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }

    changeSampleStatus = (containerId, statusPatch, navigation) => {
        return new Promise((resolve, reject) => { 
            var data = {
                "containerId": containerId,
                "statusPatch": statusPatch
            }

            Fetch('/samplingStatus', {
                method: 'PATCH',
                body: JSON.stringify(data)
            }, navigation )
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }

    sampleInTransit = (containerId, navigation) => {
        return this.changeSampleStatus(containerId, 'sample_in_transit', navigation)
    }

    sampleAcceptedInLab = (containerId, navigation) => {
        return this.changeSampleStatus(containerId, 'sample_received_in_lab', navigation)
    }

    getSamplesList = (date, navigation) => {
        return new Promise((resolve, reject) => {
            Fetch('/getSamplesCollectedOn?date=' + date, {
                method: 'GET'
            }, navigation)
                .then(res => res.json())
                .then(res => {
                    resolve(res)
                })
                .catch(reject)
        })
    }
}
