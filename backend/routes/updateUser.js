const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.post('/updateUser', async (req, res) => {
  try {
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
})

module.exports = router;