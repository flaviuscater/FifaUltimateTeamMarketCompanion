const Price = require("../Price");

const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const DailyFlipPlayerSchema = new mongoose.Schema({
        //futbinId
        _id: String,
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
        version: String,
        //Ps4, Xbox or Pc
        consoles: [String],
        expireAt: { type: Date, default:  Date.now }
    }, {
        timestamps: true
    }
);

DailyFlipPlayerSchema.index({"expireAt": 1}, {expireAfterSeconds: 7200});//2 hours

module.exports = mongoose.model('DailyFlipPlayer', DailyFlipPlayerSchema);

