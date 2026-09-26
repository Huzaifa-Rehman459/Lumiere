const mongoose = require("mongoose");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const MAX_QTY = 10;              // max per cart line
const FREE_SHIPPING_MIN = 50;    // your design: "Free shipping on orders over $50"
const SHIPPING_FEE = 5;          // my assumption, change to your real fee

// Money is calculated in cents, because JavaScript decimals drift:
// 0.1 + 0.2 = 0.30000000000000004. Whole numbers don't.
const toCents = (n) => Math.round(n * 100);
const fromCents = (c) => c / 100;

function fail(res, err) {
  if (err.name === "VersionError") {
    return res.status(409).json({ message: "Your cart changed, please try again" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
}

// Finds the user's cart or creates it. Two simultaneous first requests could both
// try to create it, so a duplicate-key error just means "someone else just did".
async function getOrCreateCart(userId) {
  try {
    return await cartModel.findOneAndUpdate(
      { user: userId },
      { $setOnInsert: { items: [] } },
      { new: true, upsert: true }
    );
  } catch (err) {
    if (err.code === 11000) return cartModel.findOne({ user: userId });
    throw err;
  }
}

// Checks the chosen size and color against what the product really offers.
function checkVariant(product, size, color) {
  let chosenSize = null;
  if (product.sizes.length) {
    if (typeof size !== "string" || !product.sizes.includes(size)) {
      return { error: `Choose a size: ${product.sizes.join(", ")}` };
    }
    chosenSize = size;
  } // no sizes on the product (e.g. a handbag): anything sent is ignored

  let chosenColor = null;
  if (product.colors.length) {
    const match =
      typeof color === "string" && product.colors.find((c) => c.name === color);
    if (!match) {
      return {
        error: `Choose a color: ${product.colors.map((c) => c.name).join(", ")}`,
      };
    }
    chosenColor = match.name;
  }

  return { size: chosenSize, color: chosenColor };
}

const sameProduct = (item, productId) => String(item.product) === String(productId);

const totalQty = (items) => items.reduce((sum, i) => sum + i.quantity, 0);

function parseQuantity(value) {
  if (!Number.isInteger(value) || value < 1 || value > MAX_QTY) return null;
  return value;
}

// Loads current product data, drops items whose product was deleted,
// and calculates all money on the server.
async function buildCartView(cart) {
  const empty = { items: [], itemCount: 0, subtotal: 0, shipping: 0, total: 0 };
  if (!cart) return { cart: empty, removedItems: 0 };

  await cart.populate({
    path: "items.product",
    select: "name price images stock category",
  });

  // Products that no longer exist come back as null: remove those lines
  const gone = cart.items.filter((i) => !i.product);
  if (gone.length) {
    await cartModel.updateOne(
      { _id: cart._id },
      { $pull: { items: { _id: { $in: gone.map((i) => i._id) } } } }
    );
  }
  const live = cart.items.filter((i) => i.product);

  // Stock belongs to the product, not to a size, so add up quantities per product
  const qtyByProduct = {};
  for (const i of live) {
    const pid = String(i.product._id);
    qtyByProduct[pid] = (qtyByProduct[pid] || 0) + i.quantity;
  }

  let subtotalCents = 0;
  const items = live.map((i) => {
    const lineCents = toCents(i.product.price) * i.quantity;
    subtotalCents += lineCents;
    return {
      _id: i._id,
      product: {
        _id: i.product._id,
        name: i.product.name,
        price: i.product.price,
        category: i.product.category,
        image: i.product.images[0]?.url || null,
      },
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      lineTotal: fromCents(lineCents),
      stock: i.product.stock,
      inStock: qtyByProduct[String(i.product._id)] <= i.product.stock,
    };
  });

  const shippingCents =
    subtotalCents === 0 || subtotalCents >= toCents(FREE_SHIPPING_MIN)
      ? 0
      : toCents(SHIPPING_FEE);

  return {
    cart: {
      items,
      itemCount: totalQty(live),
      subtotal: fromCents(subtotalCents),
      shipping: fromCents(shippingCents),
      total: fromCents(subtotalCents + shippingCents),
    },
    removedItems: gone.length,
  };
}

// GET /api/cart
async function getCart(req, res) {
  try {
    const cart = await cartModel.findOne({ user: req.user._id });
    res.json(await buildCartView(cart));
  } catch (err) {
    fail(res, err);
  }
}

// POST /api/cart/items
async function addToCart(req, res) {
  try {
    const { productId, size, color } = req.body || {};
    const quantity = req.body?.quantity === undefined ? 1 : parseQuantity(req.body.quantity);

    if (typeof productId !== "string" || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    if (quantity === null) {
      return res
        .status(400)
        .json({ message: `Quantity must be a whole number from 1 to ${MAX_QTY}` });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = checkVariant(product, size, color);
    if (variant.error) {
      return res.status(400).json({ message: variant.error });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: product.stock === 0 ? "Out of stock" : `Only ${product.stock} in stock`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const line = cart.items.find(
      (i) =>
        sameProduct(i, product._id) &&
        i.size === variant.size &&
        i.color === variant.color
    );

    if (line && line.quantity + quantity > MAX_QTY) {
      return res
        .status(400)
        .json({ message: `You can have at most ${MAX_QTY} of one item` });
    }

    const alreadyInCart = totalQty(cart.items.filter((i) => sameProduct(i, product._id)));
    if (alreadyInCart + quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} in stock (you already have ${alreadyInCart} in your cart)`,
      });
    }

    if (line) {
      line.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        size: variant.size,
        color: variant.color,
        quantity,
      });
    }
    await cart.save();

    res.json(await buildCartView(cart));
  } catch (err) {
    fail(res, err);
  }
}

// PUT /api/cart/items/:itemId
async function updateItem(req, res) {
  try {
    const { itemId } = req.params;
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const quantity = parseQuantity(req.body?.quantity);
    if (quantity === null) {
      return res
        .status(400)
        .json({ message: `Quantity must be a whole number from 1 to ${MAX_QTY}` });
    }

    const cart = await cartModel.findOne({ user: req.user._id });
    const item = cart?.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }

    const product = await productModel.findById(item.product);
    if (!product) {
      await cartModel.updateOne(
        { _id: cart._id },
        { $pull: { items: { _id: itemId } } }
      );
      return res.status(404).json({
        message: "This product is no longer available and was removed from your cart",
      });
    }

    const otherLines = cart.items.filter(
      (i) => sameProduct(i, product._id) && String(i._id) !== itemId
    );
    if (totalQty(otherLines) + quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} in stock` });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(await buildCartView(cart));
  } catch (err) {
    fail(res, err);
  }
}

// DELETE /api/cart/items/:itemId
async function removeItem(req, res) {
  try {
    const { itemId } = req.params;
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const cart = await cartModel.findOneAndUpdate(
      { user: req.user._id, "items._id": itemId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );
    if (!cart) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }

    res.json(await buildCartView(cart));
  } catch (err) {
    fail(res, err);
  }
}

module.exports = { getCart, addToCart, updateItem, removeItem };