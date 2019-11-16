const mongoose = require('mongoose');

const Positions = Object.freeze({"GK": String, "LB": String, "RB": String, "CM": String,
    "LW": String,"RW": String, "ST": String});

mongoose.set('useFindAndModify', false);

const PlayerSchema = new mongoose.Schema({
    //futbinId
    _id: String,
    name: String,
    imagePath: String,
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

