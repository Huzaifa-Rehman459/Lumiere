const mongoose = require("mongoose");
const wishlistModel = require("../models/wishlistModel");
const productModel = require("../models/productModel");

function fail(res, err) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
}

async function getOrCreateWishlist(userId) {
  try {
    return await wishlistModel.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { products: [] } },
      { new: true, upsert: true }
    );
  } catch (err) {
    if (err.code === 11000) return wishlistModel.findOne({ user: userId });
    throw err;
  }
}

// Removes references to products that no longer exist, and returns clean data
async function buildWishlistView(wishlist) {
  if (!wishlist) return { products: [] };

  const products = await productModel
    .find({ _id: { $in: wishlist.products } })
    .select("name price images category rating");

  // Some ids in wishlist.products may point at deleted products
  if (products.length !== wishlist.products.length) {
    const stillExist = products.map((p) => p._id);
    await wishlistModel.updateOne(
      { _id: wishlist._id },
      { $set: { products: stillExist } }
    );
  }

  return {
    products: products.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      category: p.category,
      rating: p.rating,
      image: p.images[0]?.url || null,
    })),
  };
}

// GET /api/wishlist
async function getWishlist(req, res) {
  try {
    const wishlist = await wishlistModel.findOne({ user: req.user._id });
    res.json(await buildWishlistView(wishlist));
  } catch (err) {
    fail(res, err);
  }
}

// POST /api/wishlist/toggle
async function toggleWishlist(req, res) {
  try {
    const { productId } = req.body || {};
    if (typeof productId !== "string" || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const wishlist = await getOrCreateWishlist(req.user._id);
    const already = wishlist.products.some((id) => String(id) === productId);

    const update = already
      ? { $pull: { products: productId } }
      : { $addToSet: { products: productId } };

    const updated = await wishlistModel.findByIdAndUpdate(wishlist._id, update, {
      new: true,
    });

    res.json({
      saved: !already,
      ...(await buildWishlistView(updated)),
    });
  } catch (err) {
    fail(res, err);
  }
}

// DELETE /api/wishlist/:productId
async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const wishlist = await wishlistModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { new: true }
    );

    res.json(await buildWishlistView(wishlist));
  } catch (err) {
    fail(res, err);
  }
}

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };