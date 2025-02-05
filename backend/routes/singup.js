const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add this
const User = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      social: newUser.social
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
      token // Send token back to client
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;