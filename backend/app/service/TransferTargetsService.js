const notificationService = require("../service/NotificationService.js");
const TransferTargets = require('../models/persistence/TransferTargets');
const playerPriceService = require('./PlayerPriceService');

const TransferTargetsService = {

    saveTransferTargetByUserId: function (req, res) {
        const transferTarget = new TransferTargets(req.body);
        const userId = req.params.userId;

        TransferTargets.findOne({_id: transferTarget._id}, (err, foundTransferTarget) => {
            if (foundTransferTarget !== undefined && foundTransferTarget !== null && !err) {
                let userIds = foundTransferTarget.userIds;
                if (userIds.indexOf(userId) < 0) {
                    userIds.push(userId);
                }
                transferTarget.userIds = userIds;
            }

            transferTarget.userIds = [userId];
            playerPriceService.constructDailyPlayerPrice(transferTarget._id)
                .then(playerPrice => {
                    transferTarget.price = playerPrice;
                    TransferTargets.findOneAndUpdate({
                        _id: transferTarget._id
                    }, transferTarget, {returnOriginal: false, upsert: true}, function (err, doc) {
                        if (err || doc == null) {
                            console.log(err);
                            res.status(500).json({
                                message: "Error on TransferTarget creation"
                            });
                        }
                        res.json(doc);
                    });
                });
        });

    },

    saveTransferTarget: function (transferTarget) {
        if (transferTarget == null) {
            return
        }
        TransferTargets.findOneAndUpdate({
            _id: transferTarget._id
        }, transferTarget, {returnOriginal: false, upsert: true}, function (err, doc) {
            if (err || doc == null) {
                console.log(err);
            }
            return doc;
        });
    },

    getAllTransferTargetsByUserId: function (req, res) {
        const userId = req.params.userId;
        TransferTargets.find({userIds: userId}, (err, transferTargets) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on TransferTarget creation"
                });
            } else {
                res.json(transferTargets);
            }
        })
    },

    getAllTransferTargets() {
        return TransferTargets.find({}).then(function (storedDataArray) {
            return storedDataArray;
        }).catch(function (err) {
            if (err) {
                throw new Error(err.message);
            }
        });
    }
};

module.exports = TransferTargetsService;