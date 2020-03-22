let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true}
});

userSchema.pre('save', function (next) {
    let error = null;
    //this.name ? error = null : error = new Error("Name missing");
    next(error);
});

let User = mongoose.model('User', userSchema);

module.exports = User;
