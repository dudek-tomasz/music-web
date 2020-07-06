let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    favBands: [String],
    favTracks: [String]
});

userSchema.pre('save', function (next) {
    let error = null;
    next(error);
});

let User = mongoose.model('User', userSchema);

module.exports = User;
