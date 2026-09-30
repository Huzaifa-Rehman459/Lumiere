const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  createOrder,
  getMyOrders,
  getMyOrder,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// Public
router.get("/track/:orderNumber", trackOrder);

// Logged-in user
router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);

// Admin only (for your existing admin panel to consume)
router.get("/all", auth, admin, getAllOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);

// Logged-in user, own order — declared last since "/all" would otherwise
// never be reached (Express matches "/:id" first if it comes before "/all")
router.get("/:id", auth, getMyOrder);

module.exports = router;