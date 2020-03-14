const transferTargetsService = require("../service/TransferTargetsService.js");
const playerPriceService = require("../service/PlayerPriceService.js");
const notificationService = require("../service/NotificationService.js");

const FindTransferTargetDealsService = {

    refreshTransferTargetsPrices() {
        setInterval(function() {
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
                                let transferTargetDealNotification = {};
                                if (transferTarget.price.pcPrice.dailyLowestPrice === transferTarget.price.pcPrice.currentPrice) {
                                    transferTargetDealNotification.console = "PC";
                                } else if (transferTarget.price.psPrice.dailyLowestPrice === transferTarget.price.psPrice.currentPrice) {
                                    transferTargetDealNotification.console = "PS4"
                                } else if (transferTarget.price.xboxPrice.dailyLowestPrice === transferTarget.price.xboxPrice.currentPrice) {
                                    transferTargetDealNotification.console = "XBOX"
                                }
                                if (transferTargetDealNotification.console !== undefined) {
                                    transferTargetDealNotification.transferTarget = transferTarget;
                                    let userIds = transferTarget.userIds;
                                    notificationService.pushNotifications(userIds, transferTargetDealNotification);
                                }
                            })
                    })
                })
        }, 10 * 10000);

    },

};

module.exports = FindTransferTargetDealsService;
