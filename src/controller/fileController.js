
const File = require('../models/File');
const ParsedData = require('../models/ParsedData');
const { v4: uuidv4 } = require('uuid');
const { setProgress, getProgress } = require('../services/progresService');
const parseCSV = require('../utils/csvParser');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    try {
        const fileId = uuidv4();

        const fileDoc = await File.create({
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

        parseCSV(
            stream,
            async (row, count) => {
                rows.push(row);

                if (rows.length === 100) {
                    await ParsedData.create({ fileId, chunkIndex, rows });
                    rows = [];
                    chunkIndex++;


                    const percent = Math.min(99, Math.floor((count / req.file.size) * 100));
                    await setProgress(fileId, 'processing', percent);
                }
            },
            async () => {

                if (rows.length) {
                    await ParsedData.create({ fileId, chunkIndex, rows });
                }

                await File.findOneAndUpdate({ fileId }, { status: 'ready', progress: 100 });
                await setProgress(fileId, 'ready', 100);
            }
        );

        return res.json({ fileId, status: 'processing', progress: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getProgress = async (req, res) => {
    try {
        const prog = await getProgress(req.params.id);
        if (!prog) return res.status(404).json({ error: "File not found" });
        res.json(prog);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getFileContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 0, limit = 1000 } = req.query;

        const file = await File.findOne({ fileId: id });
        if (!file || file.status !== 'ready') {
            return res.status(404).json({ error: 'File not found or not ready' });
        }

        const data = await ParsedData.find({ fileId: id })
            .sort("chunkIndex")
            .skip(page * limit)
            .limit(parseInt(limit));

        res.json({
            fileId: file.fileId,
            rows: data.flatMap(d => d.rows),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.listFiles = async (req, res) => {
    try {
        const files = await File.find().sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteFile = async (req, res) => {
    try {
        await File.deleteOne({ fileId: req.params.id });
        await ParsedData.deleteMany({ fileId: req.params.id });
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
