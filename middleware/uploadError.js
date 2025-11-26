const multer = require("multer");

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum file size is 5MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message:
          "Unexpected field in form data. Please use 'image' as the field name for the file.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "File upload error: " + err.message,
    });
  }

  if (err && err.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during file upload",
    });
  }

  next();
};

module.exports = handleMulterErrors;
