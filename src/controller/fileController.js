const File = require('../models/File');
const ParsedData = require('../models/ParsedData');
const { v4: uuidv4 } = require('uuid');
const { setProgress, getProgress } = require('../services/progresService');
const { parseCSV } = require('../utils/csvParser');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    try {
        const fileId = uuidv4();
        const fileDoc = new File.create({
            fileId,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            status: "processing",
            progress: 0
        });
        await setProgress(fileId, 'processing', 0);

        const stream = fs.createReadStream(req.file.path);
        let rows = [];
        let chunkIndex = 0;

        parseCSV(stream, (row, count) => {
            rows.push(row);
            if (rows.length == 100 ) {
                await ParsedData.create({ fileId, chunkIndex, rows });
                rows = [];
                chunkIndex++;
                await setProgress(fileId, 'processing', Math.min(99, Math.floor((count / req.file.size) * 100)));
            }
    }, async() => {
            if (rows.length) await ParsedData.create({ fileId, chunkIndex, rows });
            await File.findOneAndUpdate({ fileId }, { status: 'ready', progress: 100 });
            await setProgress(fileId, 'ready', 100);
        });

    res.json({ fileId, status: 'processing', progress: 0 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getProgress = async (req, res) => {
    const progress = await getProgress(req.params.id);
    res.json( progress );
};

exports.getFileContent = async (req, res) => {
    const file = await File.findOne({ fileId: req.params.id });
    if (!file || file.status !== 'ready') {
        return res.status(404).json({ error: 'File not found or not ready' });
    }
    const data = await ParsedData.find({ fileId: req.params.id }).sort("chunkIndex");
    res.json({file_id: file.fileId, content: data.flatMap(d => d.rows) });
};

exports.listFiles = async (req, res) => {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
};
exports.deleteFile = async (req, res) => {
    await File.deleteOne({ fileId: req.params.id });
    await ParsedData.deleteMany({ fileId: req.params.id });
    res.json({ message: 'File deleted successfully' });
};

    