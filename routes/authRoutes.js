const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { forgotPassword } = require('../controllers/authController');

router.post('/forgot-password', forgotPassword);
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists! Please login." });
    }

    const user = new User({ name, email, password, role: role || "Driver" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secret_key_123",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-drivers", async (req, res) => {
  try {
    const drivers = await User.find({ role: "Driver" }).select("-password");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update-driver/:id", async (req, res) => {
  try {
    const updatedDriver = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email },
      { new: true }
    ).select("-password");
    res.json(updatedDriver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/delete-driver/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
