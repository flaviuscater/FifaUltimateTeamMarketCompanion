const Price = require("../Price.js");

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const TransferTargetsSchema = new mongoose.Schema({
        //futbinId
        _id: String,
        userIds: [String],
        name: String,
        imageUrl: String,
        price: {
            psPrice: Price,
            xboxPrice: Price,
            pcPrice: Price,
        },
        club: String,
        nationality: String,
        league: String,
        rating: Number,
        position: String,
        version: String
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('TransferTargets', TransferTargetsSchema);

