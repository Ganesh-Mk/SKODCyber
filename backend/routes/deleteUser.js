const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.delete('/deleteUser', async (req, res) => {
  const { userId } = req.body;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;