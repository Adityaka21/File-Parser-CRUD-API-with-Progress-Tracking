const express = require('express');
const multer = require('multer');
const { uploadFile, getProgress, getFileContent, listFiles, deleteFile } = require('../controller/fileController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/:id/progress', getProgress);
router.get('/:id', getFileContent);
router.get('/', listFiles);
router.delete('/:id', deleteFile);

module.exports = router;
