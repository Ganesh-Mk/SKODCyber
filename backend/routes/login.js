// routes/login.js

const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const router = express.Router();

// Login Route (POST /login)
router.post("/login", async (req, res) => {
  try {
    // 1. Extract credentials from request body
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // 2. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    // 3. Find user by email (case insensitive)
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    // 4. Check if user exists
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 5. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 6. Create user object without sensitive data
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      image: user.image,
      social: user.social
    };

    console.log("✅ Login successful for:", email);

    // 7. Send successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;