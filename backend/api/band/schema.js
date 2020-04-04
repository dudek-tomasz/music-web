let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let bandSchema = new Schema({
    name: {type: String,required:true},
    description: String,
    tags: {type: [String],required:true},
    usersFavList: [Schema.ObjectId]
});

bandSchema.pre('save', function(next) {
    let error = null;
    //this.name ? error = null : error = new Error("Name missing");
    next(error);
});

let Band = mongoose.model('Band', bandSchema);

module.exports = Band;
