const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/allUser', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;