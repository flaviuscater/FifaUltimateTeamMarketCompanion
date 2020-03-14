
const findTransferTargetDealsService = require("../service/FindTransferTargetDealsService.js");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const url = 'mongodb://localhost:27017/graphqldb';

mongoose.connect(url);
mongoose.connection.once('open', () =>{
    console.log(`Connected to mongo at ${url}`);
    findTransferTargetDealsService.refreshTransferTargetsPrices();
});
mongoose.connection.once('close', () => console.log('Connection closed'));

