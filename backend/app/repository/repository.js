
const findTransferTargetDealsService = require("../service/FindTransferTargetDealsService.js");
const dailyFlipPlayerService = require("../service/DailyFlipPlayerService.js");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb+srv://admin:admin1234@futmarketcluster.0p5up.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url);
mongoose.connection.once('open', () =>{
    console.log(`Connected to mongo at ${url}`);
    findTransferTargetDealsService.refreshTransferTargetsPrices();
    dailyFlipPlayerService.deleteAllDailyFlipPlayers();
    dailyFlipPlayerService.findDailyFlipTargets();
});
mongoose.connection.once('close', () => console.log('Connection closed'));

