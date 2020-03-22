const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const UserSchema = new mongoose.Schema({
        userId: String,
        pushToken: { type : String , unique : true, required : true},
        console: String
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);