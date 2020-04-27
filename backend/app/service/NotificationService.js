const {Expo} = require('expo-server-sdk');

const User = require('../models/persistence/User');

// Create a new Expo SDK client
let expo = new Expo();

const NotificationService = {

    pushNotifications: async function (users, transferTarget) {
        let userPushTokens = users.map(user =>{
            return user[0].pushToken
        });
        this.sendBatchNotifications(userPushTokens, transferTarget);
    },

    sendBatchNotifications(userPushTokens, transferTarget) {
        let messages = [];
        for (let pushToken of userPushTokens) {

            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications)
            messages.push({
                to: pushToken,
                sound: 'default',
                //todo: refactor for the flipping notifications
                body: 'Lowest price of today: ' + transferTarget.name + " " + transferTarget.version,
                data: transferTarget,
            })
        }

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
            // Send the chunks to the Expo push notification service. There are
            // different strategies you could use. A simple one is to send one chunk at a
            // time, which nicely spreads the load out over time:
            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                    // NOTE: If a ticket contains an error code in ticket.details.error, you
                    // must handle it appropriately. The error codes are listed in the Expo
                    // documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                } catch (error) {
                    console.error(error);
                }
            }
        })();
    }
};

module.exports = NotificationService;