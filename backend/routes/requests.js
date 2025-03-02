// routes/getRequests.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/requests', async (req, res) => {
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
  
      const user = await User.findById(userId)
        .select('requestsCame')
        .populate('requestsCame', 'name image email')
        .lean();
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({
        success: true,
        requests: user.requestsCame || []
      });
    } catch (error) {
      console.error('Error fetching requests:', error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;