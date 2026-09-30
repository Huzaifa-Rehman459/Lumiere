const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error("INVALID_FILE_TYPE"));
  },
});

module.exports = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: "Image must be 5 MB or smaller",
        LIMIT_UNEXPECTED_FILE: `Send the file using the field name "${fieldName}"`,
      };
      return res.status(400).json({ message: messages[err.code] || "Invalid upload" });
    }
    if (err.message === "INVALID_FILE_TYPE") {
      return res.status(400).json({ message: "Only JPG, PNG or WEBP images are allowed" });
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  });
};