const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/all', async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: 'courses',
        populate: {
          path: 'modules',
          model: 'Module'
        }
      })
      .populate('blogs')
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;