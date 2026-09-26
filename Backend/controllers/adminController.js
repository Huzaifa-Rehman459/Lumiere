const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const emailRegex = /^\S+@\S+\.\S+$/;

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

// Shared by setup and create-admin: validates input and creates an admin user.
// Returns { error: {status, message} } or { user }.
async function createAdminUser({ fullName, email, password }) {
  if (!fullName || !email || !password) {
    return { error: { status: 400, message: "Name, email and password are required" } };
  }
  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: { status: 400, message: "Invalid input" } };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!emailRegex.test(cleanEmail)) {
    return { error: { status: 400, message: "Please enter a valid email" } };
  }
  if (password.length < 8) {
    return { error: { status: 400, message: "Password must be at least 8 characters" } };
  }

  const exists = await userModel.findOne({ email: cleanEmail });
  if (exists) {
    return {
      error: {
        status: 409,
        message: "An account with this email already exists. Use the role route to promote it.",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName,
    email: cleanEmail,
    password: hashedPassword,
    role: "admin",
  });
  return { user };
}

async function setupFirstAdmin(req, res) {
  try {
    const { setupKey } = req.body;

    const adminExists = await userModel.exists({ role: "admin" });
    if (adminExists) {
      return res.status(403).json({ message: "Setup already completed" });
    }

    const expected = process.env.ADMIN_SETUP_KEY;
    if (!expected || typeof setupKey !== "string") {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const a = Buffer.from(setupKey);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(403).json({ message: "Invalid setup key" });
    }

    const { error, user } = await createAdminUser(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    res.status(201).json({ message: "First admin created", user: formatUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function createAdmin(req, res) {
  try {
    const { error, user } = await createAdminUser(req.body);
    if (error) return res.status(error.status).json({ message: error.message });

    res.status(201).json({ user: formatUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function listAdmins(req, res) {
  try {
    const admins = await userModel.find({ role: "admin" }).sort({ createdAt: 1 });
    res.json({ admins: admins.map(formatUser) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function changeRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (role !== "admin" && role !== "user") {
      return res.status(400).json({ message: 'Role must be "admin" or "user"' });
    }
    if (String(req.user._id) === id) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: formatUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = { setupFirstAdmin, createAdmin, listAdmins, changeRole };