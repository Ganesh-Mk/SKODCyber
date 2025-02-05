const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add this
const User = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password"
      });
    }

    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      image: user.image,
      social: user.social
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token // Send token back to client
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;