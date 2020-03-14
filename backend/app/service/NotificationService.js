const {Expo} = require('expo-server-sdk');

const User = require('../models/persistence/User');

// Create a new Expo SDK client
let expo = new Expo();

const NotificationService = {

    pushNotifications: async function (userIds, transferTargetDealNotification) {
        let userTokensPromises = [];

        userIds.forEach( userId => {
            userTokensPromises.push(
                User.find({userId: userId.toString()}))

        });

        await Promise.all(userTokensPromises).then(userTokens => {
            this.sendBatchNotifications(userTokens, transferTargetDealNotification);
        });

    },

    sendBatchNotifications(userPushTokens, transferTargetDealNotification) {
        let messages = [];
        for (let token of userPushTokens) {
            if (token.length === 0) {
                console.log("User token not found");
                continue
            }
            let pushToken = token[0].pushToken;

            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications)
            messages.push({
                to: pushToken,
                sound: 'default',
                body: 'Good deal found: ' + transferTargetDealNotification.transferTarget.name + " " +transferTargetDealNotification.transferTarget.version,
                data: transferTargetDealNotification,
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