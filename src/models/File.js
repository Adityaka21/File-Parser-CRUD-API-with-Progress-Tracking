const moongoose = require('mongoose');

const FileSchema = new moongoose.Schema({
    fileId: {type: String, required: true, unique: true},
    originalName: String,
    mimeType: String,
    size: Number,
    status: {type: String, enum: ['uploading','processing','ready','failed'],  default: 'uploading'},
    progess: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
});
 
module.exports = moongoose.model('File', FileSchema);