let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let albumSchema = new Schema({
    name: {type: String, required:true},
    category: {type: String, enum: ['ROCK/METAL', 'POP','HIP-HOP/RAP/TRAP','DANCE/ELECTRONIC/HOUSE','CLASICAL/OPERA','R&B','SOUL/BLUES'], required: true} ,
    description: String,
    bandId: {type: Schema.ObjectId, required:true},
    usersFavList:[Schema.ObjectId]
});

albumSchema.pre('save', function(next) {
    let error = null;
    //this.name ? error = null : error = new Error("Name missing");
    next(error);
});

let Album = mongoose.model('Album', albumSchema);

module.exports = Album;