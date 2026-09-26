const categoryModel = require("../models/categoryModel");
const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

const SIZES = ["XS", "S", "M", "L", "XL"];
const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const MAX_IMAGES = 6;

const SORTS = {
  featured: { isBestSeller: -1, createdAt: -1, _id: 1 },
  newest: { createdAt: -1, _id: 1 },
  price_asc: { price: 1, _id: 1 },
  price_desc: { price: -1, _id: 1 },
  rating: { rating: -1, _id: 1 },
};

// "M,L" or ["M","L"] -> ["M","L"]. Anything that isn't a string is dropped.
function toList(value) {
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .filter((v) => typeof v === "string")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseNumber(value) {
  if (typeof value !== "string" || value.trim() === "") return NaN;
  return Number(value);
}

// ---------------------------------------------------------------------------
// Validates product fields and returns { error } or { data }.
// partial = false -> creating (name, description, price, category required)
// partial = true  -> updating (only fields that were actually sent are checked)
// Building `data` field by field (never trusting req.body directly) is what
// stops mass-assignment, e.g. someone sending "rating": 5 to fake reviews.
// ---------------------------------------------------------------------------
async function buildProductData(body, { partial }) {
  const data = {};
  const provided = (key) => body[key] !== undefined;
  const needed = (key) => !partial || provided(key);

  if (needed("name")) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return { error: "Product name is required" };
    }
    data.name = body.name.trim();
  }

  if (needed("description")) {
    if (typeof body.description !== "string" || !body.description.trim()) {
      return { error: "Description is required" };
    }
    data.description = body.description.trim();
  }

  if (needed("price")) {
    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0
    ) {
      return { error: "Price must be a number of 0 or more" };
    }
    data.price = body.price;
  }

  if (needed("category")) {
    if (
      typeof body.category !== "string" ||
      !mongoose.isValidObjectId(body.category)
    ) {
      return { error: "A valid category id is required" };
    }
    const category = await categoryModel.findOne({
      _id: body.category,
      isActive: true,
    });
    if (!category) {
      return { error: "Category not found or is inactive" };
    }
    data.category = category._id;
  }

  if (provided("sizes")) {
    if (
      !Array.isArray(body.sizes) ||
      !body.sizes.every((s) => SIZES.includes(s))
    ) {
      return { error: `Sizes must be from: ${SIZES.join(", ")}` };
    }
    data.sizes = [...new Set(body.sizes)];
  }

  if (provided("colors")) {
    const valid =
      Array.isArray(body.colors) &&
      body.colors.every(
        (c) =>
          c &&
          typeof c.name === "string" &&
          c.name.trim() &&
          typeof c.hex === "string" &&
          HEX.test(c.hex)
      );
    if (!valid) {
      return {
        error:
          'Each color needs a name and a hex code, e.g. { "name": "Pink", "hex": "#F4A6B8" }',
      };
    }
    data.colors = body.colors.map((c) => ({ name: c.name.trim(), hex: c.hex }));
  }

  if (provided("stock")) {
    if (!Number.isInteger(body.stock) || body.stock < 0) {
      return { error: "Stock must be a whole number of 0 or more" };
    }
    data.stock = body.stock;
  }

  for (const flag of ["isBestSeller", "isNewArrival"]) {
    if (provided(flag)) {
      if (typeof body[flag] !== "boolean") {
        return { error: `${flag} must be true or false` };
      }
      data[flag] = body[flag];
    }
  }

  return { data };
}

// POST /api/products  (admin only)
async function createProduct(req, res) {
  try {
    const { error, data } = await buildProductData(req.body || {}, {
      partial: false,
    });
    if (error) return res.status(400).json({ message: error });

    const product = await productModel.create(data);
    res.status(201).json({ product });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/products  (public)
async function getProducts(req, res) {
  try {
    const {
      minPrice,
      maxPrice,
      bestSeller,
      newArrival,
      sort = "featured",
    } = req.query;
    const filter = {};

    const categorySlugsOrIds = toList(req.query.category);
    if (categorySlugsOrIds.length) {
      const ids = categorySlugsOrIds.filter((c) => mongoose.isValidObjectId(c));
      const slugs = categorySlugsOrIds.filter((c) => !mongoose.isValidObjectId(c));

      const matched = await categoryModel
        .find({ $or: [{ _id: { $in: ids } }, { slug: { $in: slugs } }] })
        .select("_id");

      if (matched.length === 0) {
        return res.status(400).json({ message: "No matching category found" });
      }
      filter.category = { $in: matched.map((c) => c._id) };
    }

    const sizes = toList(req.query.size);
    if (sizes.length) {
      if (!sizes.every((s) => SIZES.includes(s))) {
        return res
          .status(400)
          .json({ message: `Size must be from: ${SIZES.join(", ")}` });
      }
      filter.sizes = { $in: sizes };
    }

    const colors = toList(req.query.color);
    if (colors.length) {
      filter["colors.name"] = { $in: colors };
    }

    const priceFilter = {};
    if (minPrice !== undefined) {
      const n = parseNumber(minPrice);
      if (!Number.isFinite(n) || n < 0) {
        return res
          .status(400)
          .json({ message: "minPrice must be a number of 0 or more" });
      }
      priceFilter.$gte = n;
    }
    if (maxPrice !== undefined) {
      const n = parseNumber(maxPrice);
      if (!Number.isFinite(n) || n < 0) {
        return res
          .status(400)
          .json({ message: "maxPrice must be a number of 0 or more" });
      }
      priceFilter.$lte = n;
    }
    if (
      priceFilter.$gte !== undefined &&
      priceFilter.$lte !== undefined &&
      priceFilter.$gte > priceFilter.$lte
    ) {
      return res
        .status(400)
        .json({ message: "minPrice cannot be greater than maxPrice" });
    }
    if (Object.keys(priceFilter).length) filter.price = priceFilter;

    if (bestSeller === "true") filter.isBestSeller = true;
    if (newArrival === "true") filter.isNewArrival = true;

    if (typeof sort !== "string" || !Object.hasOwn(SORTS, sort)) {
      return res.status(400).json({
        message: `Sort must be one of: ${Object.keys(SORTS).join(", ")}`,
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 12, 1),
      50
    );

    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .populate("category", "name slug")
        .sort(SORTS[sort])
        .skip((page - 1) * limit)
        .limit(limit),
      productModel.countDocuments(filter),
    ]);

    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/products/:id  (public)
async function getProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel
      .findById(id)
      .populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// PUT /api/products/:id  (admin only)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const { error, data } = await buildProductData(req.body || {}, {
      partial: true,
    });
    if (error) return res.status(400).json({ message: error });

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const product = await productModel
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .populate("category", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Best-effort cleanup: never throws
async function removeFromCloudinary(publicIds) {
  await Promise.allSettled(
    publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
  );
}

// DELETE /api/products/:id  (admin only)
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await removeFromCloudinary(product.images.map((img) => img.publicId));

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// Uploads one in-memory file to Cloudinary and resolves with the result
function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "lumiere/products",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /api/products/:id/images  (admin only)
async function uploadProductImages(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({
        message: 'Attach at least one image using the field name "images"',
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images.length + files.length > MAX_IMAGES) {
      return res.status(400).json({
        message: `A product can have at most ${MAX_IMAGES} images (this one has ${product.images.length})`,
      });
    }

    const results = await Promise.allSettled(
      files.map((file) => uploadBuffer(file.buffer))
    );

    results
      .filter((r) => r.status === "rejected")
      .forEach((r) => console.error("Cloudinary upload error:", r.reason));

    const uploaded = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => ({ url: r.value.secure_url, publicId: r.value.public_id }));

    // All or nothing: if any upload failed, remove the ones that succeeded
    if (uploaded.length !== files.length) {
      await removeFromCloudinary(uploaded.map((img) => img.publicId));
      return res.status(502).json({
        message: "Image upload failed, nothing was saved. Please try again.",
      });
    }

    const updated = await productModel.findByIdAndUpdate(
      id,
      { $push: { images: { $each: uploaded } } },
      { new: true }
    );

    // Product was deleted while we were uploading
    if (!updated) {
      await removeFromCloudinary(uploaded.map((img) => img.publicId));
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(201).json({ product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// DELETE /api/products/:id/images/:imageId  (admin only)
async function deleteProductImage(req, res) {
  try {
    const { id, imageId } = req.params;
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(imageId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const image = product.images.id(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary first: if that fails, the DB still matches reality
    await cloudinary.uploader.destroy(image.publicId);

    const updated = await productModel.findByIdAndUpdate(
      id,
      { $pull: { images: { _id: imageId } } },
      { new: true }
    );

    res.json({ product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
};