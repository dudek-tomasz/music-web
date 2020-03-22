let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let gradeSchema = new Schema({
    comment: String,
    grade: {type: Number, required: true},
    userId: {type: Schema.ObjectId, required: true},
    targetId: {type: Schema.ObjectId, required: true},
    type: {type: String, enum: ['BAND', 'ALBUM', 'TRACK']}
});

gradeSchema.pre('save', function (next) {
    let error = null;
    //this.name ? error = null : error = new Error("Name missing");
    next(error);
});

let Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;