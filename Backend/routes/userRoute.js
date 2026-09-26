const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.post("/signup", signup);
router.post("/login", login);

router.get('/me', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;