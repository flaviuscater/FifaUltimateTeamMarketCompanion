const transferTargetsService = require("../service/TransferTargetsService.js");
const playerPriceService = require("../service/PlayerPriceService.js");
const notificationService = require("../service/NotificationService.js");
const User = require('../models/persistence/User');

const FindTransferTargetDealsService = {
    refreshTransferTargetsPrices() {
        setInterval(function () {
            transferTargetsService.getAllTransferTargets()
                .then(r => {
                    r.forEach(async transferTarget => {
                        await playerPriceService.constructDailyPlayerPrice(transferTarget._id)
                            .then(playerPrice => {
                                transferTarget.price = playerPrice;
                                transferTargetsService.saveTransferTarget(transferTarget);
                                console.log(transferTarget);
                                return transferTarget;
                            })
                            .then(transferTarget => {
                                let usersPromises = [];

                                transferTarget.userIds.forEach(userId => {
                                    usersPromises.push(
                                        User.find({userId: userId.toString()}))
                                });

                                Promise.all(usersPromises).then(users => {
                                    findPs4TransferDeals(users, transferTarget);
                                    findXboxTransferDeals(users, transferTarget);
                                    findPcTransferDeals(users, transferTarget);
                                });
                            })
                    })
                })
        }, 30 * 10000);

    },
};

function findPs4TransferDeals(users, transferTarget) {
    let ps4Users = users.filter(user => "PS4" === user[0].console);

    if (ps4Users.length > 0 && transferTarget.price.psPrice.dailyLowestPrice === transferTarget.price.psPrice.currentPrice) {
        notificationService.pushNotifications(ps4Users, transferTarget);
    }
}

function findXboxTransferDeals(users, transferTarget) {
    let xboxUsers = users.filter(user => "XBOX" === user[0].console);

    if (xboxUsers.length > 0 && transferTarget.price.xboxPrice.dailyLowestPrice === transferTarget.price.xboxPrice.currentPrice) {
        notificationService.pushNotifications(xboxUsers, transferTarget);
    }
}

function findPcTransferDeals(users, transferTarget) {
    let pcUsers = users.filter(user => "PC" === user[0].console);

    if (pcUsers.length > 0 && transferTarget.price.pcPrice.dailyLowestPrice === transferTarget.price.pcPrice.currentPrice) {
        notificationService.pushNotifications(pcUsers, transferTarget);
    }
}

module.exports = FindTransferTargetDealsService;
