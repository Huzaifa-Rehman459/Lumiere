const express = require("express");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const {
  setupFirstAdmin,
  createAdmin,
  listAdmins,
  changeRole,
} = require("../controllers/adminController");

const router = express.Router();

// Public: only works while no admin exists
router.post("/setup", setupFirstAdmin);

// Everything below requires login + admin role
router.use(auth, admin);

router.post("/admins", createAdmin);
router.get("/admins", listAdmins);
router.put("/users/:id/role", changeRole);

module.exports = router;