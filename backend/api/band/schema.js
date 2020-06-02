let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let bandSchema = new Schema({
    name: {type: String,required:true},
    spotifyId: String,
    href: String,
    description: String,
    tags: [String],
    imgURL: String,
    usersFavList: [Schema.ObjectId]
});

bandSchema.pre('save', function(next) {
    let error = null;
    next(error);
});

let Band = mongoose.model('Band', bandSchema);

module.exports = Band;
