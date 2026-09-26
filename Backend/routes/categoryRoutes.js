const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:idOrSlug", getCategory);

// Admin only
router.post("/", auth, admin, createCategory);
router.put("/:id", auth, admin, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);

module.exports = router;