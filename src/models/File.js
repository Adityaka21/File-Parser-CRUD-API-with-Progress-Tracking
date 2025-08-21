const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileId: { type: String, required: true, unique: true },
    originalName: String,
    mimeType: String,
    size: Number,
    status: {
        type: String,
        enum: ['uploading', 'processing', 'ready', 'failed'], default: 'uploading'
    },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
