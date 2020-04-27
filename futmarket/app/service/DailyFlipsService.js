import ApiConstants from "../../constants/ApiConstants";

const DailyFlipsService = {

    getDailyFlips: function (userConsole) {
        return fetch(ApiConstants.API_REST_SERVER_BASE_PATH + "/dailyFlips/" + userConsole)
            .then(response => response.json());
    },

};

export default DailyFlipsService;