const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const uploadSingle = require("../middlewares/uploadSingle");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  deleteCategoryImage,
} = require("../controllers/categoryController");

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:idOrSlug", getCategory);

// Admin only
router.post("/", auth, admin, createCategory);
router.put("/:id", auth, admin, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);
router.post("/:id/image", auth, admin, uploadSingle("image"), uploadCategoryImage);
router.delete("/:id/image", auth, admin, deleteCategoryImage);

module.exports = router;