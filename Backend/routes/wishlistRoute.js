const express = require("express");
const auth = require("../middlewares/auth");
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.use(auth); // every wishlist route needs login

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;