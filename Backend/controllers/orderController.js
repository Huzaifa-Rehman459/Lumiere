const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const FREE_SHIPPING_MIN = 50;
const SHIPPING_FEE = 5;
const toCents = (n) => Math.round(n * 100);
const fromCents = (c) => c / 100;

// POST /api/orders  (logged-in user) — creates an order from their current cart
async function createOrder(req, res) {
  try {
    const { fullName, phone, addressLine, city, postalCode } = req.body || {};
    if (!fullName || !phone || !addressLine || !city || !postalCode) {
      return res.status(400).json({ message: "Full shipping address is required" });
    }
    for (const [key, value] of Object.entries({ fullName, phone, addressLine, city, postalCode })) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({ message: `${key} must be text` });
      }
    }

    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const items = [];
    let subtotalCents = 0;

    for (const line of cart.items) {
      const product = await productModel.findById(line.product);
      if (!product) {
        return res.status(409).json({
          message: "One item in your cart is no longer available. Please review your cart.",
        });
      }
      if (product.stock < line.quantity) {
        return res.status(409).json({
          message: `Only ${product.stock} left of "${product.name}". Please update your cart.`,
        });
      }

      const lineCents = toCents(product.price) * line.quantity;
      subtotalCents += lineCents;
      items.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || null,
        price: product.price,
        size: line.size,
        color: line.color,
        quantity: line.quantity,
        lineTotal: fromCents(lineCents),
      });
    }

    const shippingCents =
      subtotalCents >= toCents(FREE_SHIPPING_MIN) ? 0 : toCents(SHIPPING_FEE);

    for (const item of items) {
      const updated = await productModel.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (!updated) {
        return res.status(409).json({
          message: `"${item.name}" sold out while you were checking out. Please review your cart.`,
        });
      }
    }

    const order = await orderModel.create({
      orderNumber: orderModel.generateOrderNumber(),
      user: req.user._id,
      items,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
      },
      subtotal: fromCents(subtotalCents),
      shipping: fromCents(shippingCents),
      total: fromCents(subtotalCents + shippingCents),
    });

    // Order placed successfully — empty the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/orders  (logged-in user) — their own order history
async function getMyOrders(req, res) {
  try {
    const orders = await orderModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/orders/:id  (logged-in user, own order only)
async function getMyOrder(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const order = await orderModel.findOne({ _id: id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/orders/track/:orderNumber  (public — no login required, matches
// the design's plain "Order Number" input with no account needed)
async function trackOrder(req, res) {
  try {
    const { orderNumber } = req.params;
    const order = await orderModel
      .findOne({ orderNumber: orderNumber.trim().toUpperCase() })
      .select("orderNumber status items createdAt subtotal shipping total");

    if (!order) {
      return res.status(404).json({ message: "No order found with that number" });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// GET /api/orders/all  (admin only) — every order, for your existing admin panel
async function getAllOrders(req, res) {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

// PUT /api/orders/:id/status  (admin only)
async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const VALID = ["processing", "shipped", "delivered", "cancelled"];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    if (!VALID.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID.join(", ")}` });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "cancelled") {
      return res.status(409).json({ message: "A cancelled order can't be changed." });
    }
    if (order.status === status) {
      return res.json({ order }); // nothing to do
    }

    const updated = await orderModel.findOneAndUpdate(
      { _id: id, status: order.status },
      { status },
      { new: true }
    );
    if (!updated) {
      return res
        .status(409)
        .json({ message: "This order was just changed by someone else. Please refresh." });
    }

    if (status === "cancelled") {
      await Promise.allSettled(
        order.items.map((item) =>
          productModel.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
        )
      );
    }

    res.json({ order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
};