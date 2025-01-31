const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received signup request:");
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      social: {
        twitter: `${name.replace(/\s+/g, '')}`,
        instagram: `${name.replace(/\s+/g, '')}`,
        linkedin: `${name.replace(/\s+/g, '')}`,
        github: `${name.replace(/\s+/g, '')}`
      }
    });

    await newUser.save();
    console.log("User saved successfully:", newUser);

    // Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;