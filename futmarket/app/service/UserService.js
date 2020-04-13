import ApiConstants from "../../constants/ApiConstants";
import Constants from "expo-constants";

const UserService = {
    updateUser: function (updateUserRequest) {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/user", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateUserRequest)
        })
            .then(res => res.json())
        //.then(res => console.log(res));
    },

    getUser: function () {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/user/" + Constants.deviceId)
            .then(res => res.json())
    },

};

export default UserService;