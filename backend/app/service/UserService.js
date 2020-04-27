const User = require('../models/persistence/User');

const UserService = {

    saveUserPushToken: function (req, res) {
        const userTokenRequest = new User(req.body);

        User.findOneAndUpdate({
            pushToken: userTokenRequest.pushToken
        }, {
            userId: userTokenRequest.userId,
            pushToken: userTokenRequest.pushToken,
        }, {upsert: true}, function (err, updatedUser) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on Push token creation"
                });
            }
            const response = {
                message: "Saved user token",
                userId: updatedUser.userId,
            };
            return res.status(200).send(response);
        });
    },

    updateUserConsole: function (req, res) {
        const userConsoleUpdateRequest = req.body;

        User.updateOne({
            userId: userConsoleUpdateRequest.userId
        }, {$set: {console: userConsoleUpdateRequest.console}}, {upsert: true}, function (err, updatedUserConsole) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on User Console update"
                });
            }
            const response = {
                message: "User console has been updated",
                userId: updatedUserConsole.userId,
                console: updatedUserConsole.console
            };
            return res.status(200).send(response);
        });
    },

    getUser: function (req, res) {
        const userId = req.params.userId;

        User.findOne({userId: userId}, function (err, foundUser) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on fetching the User: " + userId
                });
            }

            return res.json(foundUser);
        });
    },

};

module.exports = UserService;