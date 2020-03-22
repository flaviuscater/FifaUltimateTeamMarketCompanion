// machine local ip adress
const LOCAL_CABLE_URL = 'http://192.168.1.250';

//wifi
const LOCAL_WIFI_URL = 'http://192.168.1.39';

//hotspot
const LOCAL_HOTSPOT_URL = 'http://192.168.43.116';

export default {
    API_GRAPH_QL_SERVER_BASE_PATH: LOCAL_CABLE_URL + ":4000/graphql",
    API_REST_SERVER_BASE_PATH: LOCAL_CABLE_URL + ":4001"
};