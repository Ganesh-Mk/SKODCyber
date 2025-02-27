const express = require('express');
const router = express.Router();
const User = require('../models/userModel');


router.get('/user/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Check if the ID is valid
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const user = await User.findById(userId);
      
      // If no user was found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      // For malformed IDs, Mongoose will throw a CastError
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;