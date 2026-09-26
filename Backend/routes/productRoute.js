const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const uploadImages = require("../middlewares/upload");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
} = require("../controllers/productController");

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", auth, admin, createProduct);
router.put("/:id", auth, admin, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

router.post("/:id/images", auth, admin, uploadImages, uploadProductImages);
router.delete("/:id/images/:imageId", auth, admin, deleteProductImage);

module.exports = router;