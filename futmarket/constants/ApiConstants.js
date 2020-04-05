// machine local ip adress
const LOCAL_CABLE_URL = 'http://192.168.1.250';

//wifi
const LOCAL_WIFI_URL = 'http://192.168.1.39';

//hotspot
const LOCAL_HOTSPOT_URL = 'http://192.168.43.116';


const HEROKU_URL = 'https://fut-market-companion-api.herokuapp.com';

export default {
    // API_GRAPH_QL_SERVER_BASE_PATH: LOCAL_WIFI_URL + ":4000/graphql",
    // API_REST_SERVER_BASE_PATH: LOCAL_WIFI_URL + ":4001"

    API_GRAPH_QL_SERVER_BASE_PATH: HEROKU_URL + "/graphql",
    API_REST_SERVER_BASE_PATH: HEROKU_URL
};