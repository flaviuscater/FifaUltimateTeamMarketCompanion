const notificationService = require("../service/NotificationService.js");
const TransferTargets = require('../models/persistence/TransferTargets');
const playerPriceService = require('./PlayerPriceService');

const TransferTargetsService = {

    saveTransferTargetByUserId: function (req, res) {
        const transferTarget = new TransferTargets(req.body);
        const userId = req.params.userId;

        TransferTargets.findOne({_id: transferTarget._id}, (err, foundTransferTarget) => {
            // target Found
            if (foundTransferTarget !== undefined && foundTransferTarget !== null && !err) {
                let userIds = foundTransferTarget.userIds;
                // if doesn't exist already, add userId in array
                if (userIds.indexOf(userId) < 0) {
                    userIds.push(userId);
                }
                transferTarget.userIds = userIds;
            } else {
                transferTarget.userIds = [userId];
            }

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
        this.refreshPrices();
        const userId = req.params.userId;
        TransferTargets.find({userIds: userId}, (err, transferTargets) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on TransferTarget fetching"
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
    },

    deleteTransferTargetByUserId: function (req, res) {
        const userId = req.params.userId;
        const transferTargetId = req.params.transferTargetId;

        TransferTargets.findOne({_id: transferTargetId}, (err, foundTransferTarget) => {
            if (foundTransferTarget !== undefined && foundTransferTarget !== null && !err) {
                let userIds = foundTransferTarget.userIds;

                let idx = userIds.indexOf(userId);
                // if user Id found then delete id, and update the transferTarget
                if (userIds.length > 1 && idx > -1) {
                    userIds.splice(idx, 1);
                    foundTransferTarget.userIds = userIds;
                    this.saveTransferTarget(foundTransferTarget)
                } else { // delete the transferTarget object
                    TransferTargets.deleteOne({_id: transferTargetId}, (err, deletedTransferTarget) => {
                        if (err) return res.status(500).send(err);
                    })
                }
                const response = {
                    message: "Transfer Target successfully deleted",
                    id: foundTransferTarget._id
                };
                return res.status(200).send(response);
            }
        })
    },

    refreshPrices() {
        this.getAllTransferTargets()
            .then(r => {
                r.forEach(async transferTarget => {
                    await playerPriceService.constructDailyPlayerPrice(transferTarget._id)
                        .then(playerPrice => {
                            transferTarget.price = playerPrice;
                            this.saveTransferTarget(transferTarget);
                        })
                });
                console.log('Refreshed Transfer targets Prices')
            });
    }
};

module.exports = TransferTargetsService;