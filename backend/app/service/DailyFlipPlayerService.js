const DailyFlipPlayer = require('../models/persistence/DailyFlipPlayer');
const playerPriceService = require('./PlayerPriceService');
const Player = require('../models/persistence/Player');

const DailyFlipPlayerService = {

    saveDailyFlipPlayer: function (flipPlayer) {
        if (flipPlayer == null) {
            return
        }
        DailyFlipPlayer.findOneAndUpdate({
            _id: flipPlayer._id
        }, flipPlayer, {returnOriginal: false, upsert: true}, function (err, doc) {
            if (err || doc == null) {
                console.log(err);
            }
            return doc;
        });
    },

    // getAllDailyFlipPlayers() {
    //     const userConsole = req.params.userConsole;
    //     return DailyFlipPlayer.find({}).then(function (storedDataArray) {
    //         return storedDataArray;
    //     }).catch(function (err) {
    //         if (err) {
    //             throw new Error(err.message);
    //         }
    //     });
    // },

    getAllDailyFlipPlayers: function (req, res) {
        const userConsole = req.params.userConsole;
        DailyFlipPlayer.find({consoles: userConsole}, (err, dailyFlips) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Error on fetching Daily Flips"
                });
            } else {
                res.json(dailyFlips);
            }
        })
    },

    deleteAllDailyFlipPlayers() {
        setInterval(function () {
            return DailyFlipPlayer.deleteMany({})
                .catch(function (err) {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            console.log("Deleted All Daily Flip Targets");
        }, 1 * 60 * 60 * 1000); // every 6 hours delete DailyFlipPlayers
    },

    findDailyFlipTargets() {
        console.log('Starting to find daily flip players');
        setInterval(async function () {
            //delete all once per day
            //await DailyFlipPlayer.deleteMany({});
            // Player.find({version: {$nin : ["Normal"]}})
            Player.find({version: {$nin: ["Icon"]}, rating: {$gt: 82}})
                .cursor().eachAsync(async futPlayer => {
                    //console.log(futPlayer);
                    return playerPriceService.constructDailyPlayerPrice(futPlayer._id)
                        .then( async playerPrice => {
                            let potentialDailyFlipPlayer = new DailyFlipPlayer(futPlayer);
                            potentialDailyFlipPlayer.price = playerPrice;

                            findPs4DailyFlipPlayers(potentialDailyFlipPlayer);
                            findXBOXDailyFlipPlayers(potentialDailyFlipPlayer);
                            findPCDailyFlipPlayers(potentialDailyFlipPlayer);
                            // sleep 2 seconds
                            await new Promise(r => setTimeout(r, 5000));
                        })
                })

        }, 30 * 10000);

    },

    refreshPrices() {
        this.getAllTransferTargets()
            .then(r => {
                r.forEach(async flipPlayer => {
                    await playerPriceService.constructDailyPlayerPrice(flipPlayer._id)
                        .then(playerPrice => {
                            flipPlayer.price = playerPrice;
                            this.saveDailyFlipPlayer(flipPlayer);
                        })
                });
                console.log('Refreshed Flip Players Prices')
            });
    }
};

function findPs4DailyFlipPlayers(potentialDailyFlipPlayer) {
    // Calculate transfer profit after tax
    let currentPrice = potentialDailyFlipPlayer.price.psPrice.currentPrice;
    let dailyHighestPrice = potentialDailyFlipPlayer.price.psPrice.dailyHighestPrice;
    let potentialTransferProfit = (dailyHighestPrice * 0.95 - currentPrice);

    let flipFound = checkIfTransferProfitIsHighEnough(currentPrice, potentialTransferProfit);
    if (flipFound) {
        saveDailyFlipPlayer(potentialDailyFlipPlayer, "PS4", potentialTransferProfit, currentPrice, dailyHighestPrice);
    }
}

function findXBOXDailyFlipPlayers(potentialDailyFlipPlayer) {
    // Calculate transfer profit after tax
    let currentPrice = potentialDailyFlipPlayer.price.xboxPrice.currentPrice;
    let dailyHighestPrice = potentialDailyFlipPlayer.price.xboxPrice.dailyHighestPrice;
    let potentialTransferProfit = (dailyHighestPrice * 0.95 - currentPrice);

    let flipFound = checkIfTransferProfitIsHighEnough(currentPrice, potentialTransferProfit);
    if (flipFound) {
        saveDailyFlipPlayer(potentialDailyFlipPlayer, "XBOX", potentialTransferProfit, currentPrice, dailyHighestPrice);
    }
}

function findPCDailyFlipPlayers(potentialDailyFlipPlayer) {
    // Calculate transfer profit after tax
    let currentPrice = potentialDailyFlipPlayer.price.pcPrice.currentPrice;
    let dailyHighestPrice = potentialDailyFlipPlayer.price.pcPrice.dailyHighestPrice;
    let potentialTransferProfit = (dailyHighestPrice * 0.95 - currentPrice);

    let flipFound = checkIfTransferProfitIsHighEnough(currentPrice, potentialTransferProfit);
    if (flipFound) {
        saveDailyFlipPlayer(potentialDailyFlipPlayer, "PC", potentialTransferProfit, currentPrice, dailyHighestPrice);
    }
}

function saveDailyFlipPlayer(dailyFlipPlayer, foundConsole, potentialTransferProfit) {

    console.log("Found Daily Flip Player: " + dailyFlipPlayer.name + " " + dailyFlipPlayer.version + " " + foundConsole + " Potential Profit: " + potentialTransferProfit);
    DailyFlipPlayer.findOne({_id: dailyFlipPlayer._id}, (err, foundPlayer) => {
        // target Found
        if (foundPlayer !== undefined && foundPlayer !== null && !err) {
            let consoles = foundPlayer.consoles;
            if (consoles.indexOf(foundConsole) < 0) {
                consoles.push(foundConsole);
            }
            dailyFlipPlayer.consoles = consoles;

        } else {
            dailyFlipPlayer.consoles = [foundConsole];
        }
        DailyFlipPlayerService.saveDailyFlipPlayer(dailyFlipPlayer);
    })

}

function checkIfTransferProfitIsHighEnough(cardPrice, profit) {
    if (cardPrice > 10000 && cardPrice < 50000) {
        return profit > 5000;
    } else if (cardPrice > 50000 && cardPrice < 100000) {
        return profit > 10000;
    } else if (cardPrice > 100000 && cardPrice < 200000) {
        return profit > 15000;
    } else if (cardPrice > 150000 && cardPrice < 400000) {
        return profit > 20000;
    }
    return false
}

module.exports = DailyFlipPlayerService;