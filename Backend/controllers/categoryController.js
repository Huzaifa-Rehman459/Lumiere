const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

const slugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// POST /api/categories  (admin only)
async function createCategory(req, res) {
  try {
    const { name, description = "" } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be text" });
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName);
    if (!slug) {
      return res.status(400).json({ message: "Category name must contain letters or numbers" });
    }

    const exists = await categoryModel.findOne({
      $or: [{ name: cleanName }, { slug }],
    });
    if (exists) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }

    const category = await categoryModel.create({
      name: cleanName,
      slug,
      description: description.trim(),
    });

    res.status(201).json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/categories  (public) - Shop All sidebar reads this to build checkboxes
async function getCategories(req, res) {
  try {
    const onlyActive = req.query.all !== "true"; // admin panel can pass ?all=true to see hidden ones too
    const filter = onlyActive ? { isActive: true } : {};

    const categories = await categoryModel.find(filter).sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/categories/:idOrSlug  (public) - accepts either an id or a slug
async function getCategory(req, res) {
  try {
    const { idOrSlug } = req.params;
    const query = mongoose.isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug.toLowerCase() };

    const category = await categoryModel.findOne(query);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// PUT /api/categories/:id  (admin only)
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const data = {};
    const { name, description, isActive } = req.body || {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Category name cannot be empty" });
      }
      data.name = name.trim();
      data.slug = slugify(data.name);
      if (!data.slug) {
        return res.status(400).json({ message: "Category name must contain letters or numbers" });
      }

      const clash = await categoryModel.findOne({
        _id: { $ne: id },
        $or: [{ name: data.name }, { slug: data.slug }],
      });
      if (clash) {
        return res.status(409).json({ message: "A category with this name already exists" });
      }
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({ message: "Description must be text" });
      }
      data.description = description.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ message: "isActive must be true or false" });
      }
      data.isActive = isActive;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const category = await categoryModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// DELETE /api/categories/:id  (admin only)
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const inUse = await productModel.countDocuments({ category: id });
    if (inUse > 0) {
      return res.status(409).json({
        message: `Cannot delete: ${inUse} product(s) still use this category. Reassign or delete them first.`,
      });
    }

    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};