let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let albumSchema = new Schema({
    name: {type: String, required:true},
    description: String,
    tags: [String],
    bandId: {type: Schema.ObjectId, required: true},
    imgURL: String,
    usersFavList:[Schema.ObjectId]
});

albumSchema.pre('save', function(next) {
    let error = null;
    next(error);
});

let Album = mongoose.model('Album', albumSchema);

module.exports = Album;
