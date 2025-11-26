const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `photo-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpg|jpeg|png|gif)$/i;
  const allowedMime = ["image/jpeg", "image/png", "image/gif"];

  const isExtValid = allowedExt.test(file.originalname);
  const isMimeValid = allowedMime.includes(file.mimetype);

  if (!isExtValid || !isMimeValid) {
    return cb(new Error("Only JPG, PNG, and GIF images allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
