const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const PlayerSchema = new mongoose.Schema({
    //futbinId
    _id: String,
    name: String,
    imageUrl: String,
    currentPrice: Number,
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

module.exports = mongoose.model('Player', PlayerSchema);

// userId in path Param on TransferTarget#add, fetch prices on server and return transfer target with price set
// on frontend page startup, getAllTransferTargets and