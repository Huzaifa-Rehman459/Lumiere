const express = require("express");
const auth = require("../middlewares/auth");
const {
  getCart,
  addToCart,
  updateItem,
  removeItem,
} = require("../controllers/cartController");

const router = express.Router();

// Every cart route needs a logged-in user
router.use(auth);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

module.exports = router;