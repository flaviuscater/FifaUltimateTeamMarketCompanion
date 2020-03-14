const notificationService = require("../service/NotificationService.js");

const User = require('../models/persistence/User');

const UserService = {

    saveUserPushToken: function (req, res) {
        const userTokenRequest = new User(req.body);

        User.findOneAndUpdate({
            pushToken: userTokenRequest.pushToken
        }, {userId: userTokenRequest.userId, pushToken: userTokenRequest.pushToken}, {upsert: true}, function (err, response) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on Push token creation"
                });
            } else if (res != null) {
                console.log(response);
                return response;
            }
        });


    }
};

module.exports = UserService;