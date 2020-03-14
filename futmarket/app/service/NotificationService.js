import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import ApiConstants from "../../constants/ApiConstants";

let PUSH_ENDPOINT = ApiConstants.API_REST_SERVER_BASE_PATH + "/user/push-token";

export default async function registerForPushNotificationsAsync() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    // Stop here if the user did not grant permissions
    if (status !== 'granted') {
        alert('No notification permissions!');
        return;
    }

    // Get the token that identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pushToken: token,
            userId: Constants.deviceId
        }),
    });
}