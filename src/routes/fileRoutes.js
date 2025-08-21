const express = require("express");
const { uploadFile, getProgress, getFileContent, listFiles, deleteFile } = require("../controller/fileController");
const { upload, checkFileSize } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/upload", upload.single("file"), checkFileSize, uploadFile);
router.get("/:id/progress", getProgress);
router.get("/:id", getFileContent);
router.get("/", listFiles);
router.delete("/:id", deleteFile);

module.exports = router;
