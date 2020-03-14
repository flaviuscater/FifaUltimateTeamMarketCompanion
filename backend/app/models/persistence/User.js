const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
        // userId: { String, trim: true},
        userId: String,
        pushToken: { type : String , unique : true, required : true},
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);