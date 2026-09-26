const multer = require("multer");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5 MB each, 5 per request
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("INVALID_FILE_TYPE"));
  },
});

// Wrapped so multer's errors become clean 400 responses instead of 500s
module.exports = (req, res, next) => {
  upload.array("images", 5)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: "Each image must be 5 MB or smaller",
        LIMIT_FILE_COUNT: "You can upload at most 5 images at a time",
        LIMIT_UNEXPECTED_FILE:
          'Send at most 5 files, using the field name "images"',
      };
      return res
        .status(400)
        .json({ message: messages[err.code] || "Invalid upload" });
    }
    if (err.message === "INVALID_FILE_TYPE") {
      return res
        .status(400)
        .json({ message: "Only JPG, PNG or WEBP images are allowed" });
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  });
};