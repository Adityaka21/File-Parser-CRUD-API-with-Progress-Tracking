const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "text/plain"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only JPEG, PNG, TXT allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, 
});

const checkFileSize = (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  if (req.file.size < 1024) {
    fs.unlinkSync(req.file.path); 
    return res.status(400).json({ error: "File too small (min 1KB)" });
  }

  next();
};

module.exports = { upload, checkFileSize };
