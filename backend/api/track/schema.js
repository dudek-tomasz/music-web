let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let trackSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    albumId: Schema.ObjectId,
    bandId: {type: Schema.ObjectId, required: true},
    category: {
        type: String,
        enum: ['ROCK/METAL', 'POP', 'HIP-HOP/RAP/TRAP', 'DANCE/ELECTRONIC/HOUSE', 'CLASICAL/OPERA', 'R&B', 'SOUL/BLUES'],
        required: true
    },
    usersFavList: [Schema.ObjectId]
});

trackSchema.pre('save', function (next) {
    let error = null;
    //this.name ? error = null : error = new Error("Name missing");
    next(error);
});

let Track = mongoose.model('Track', trackSchema);

module.exports = Track;
