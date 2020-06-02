let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let trackSchema = new Schema({
    name: {type: String, required: true},
    spotifyId: String,
    href: String,
    description: String,
    albumId: String,
    albumName: String,
    bandId: {type: String, required: true},
    bandName: String,
    imgURL: String,
    previewURL: String,
    usersFavList: [Schema.ObjectId]
});

trackSchema.pre('save', function (next) {
    let error = null;
    next(error);
});

let Track = mongoose.model('Track', trackSchema);

module.exports = Track;
