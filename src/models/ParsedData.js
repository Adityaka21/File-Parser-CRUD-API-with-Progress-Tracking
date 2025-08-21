const mongoose = require('mongoose');

const ParsedDataSchema = new mongoose.Schema({
    fileId: String,
    chunkIndex: Number,
    rows: Array
});

module.exports = mongoose.model('ParsedData', ParsedDataSchema);
