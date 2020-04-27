import ApiConstants from "../../constants/ApiConstants";
import Constants from 'expo-constants';

const TransferTargetsService = {

    addTransferTarget: function (transferTarget) {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/transferTargets/user/" + Constants.deviceId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transferTarget)
        })
            .then(res => res.json())
            //.then(res => console.log(res));
    },


    getTransferTargets: function () {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/transferTargets/user/" + Constants.deviceId)
            .then(response => response.json());
    },

    deleteTransferTarget: function (id) {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/transferTargets/" + id + "/user/" + Constants.deviceId, {
            method: 'DELETE'
        })
            .then(response => response.json());
    },

};

export default TransferTargetsService;