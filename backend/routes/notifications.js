// In your backend routes (e.g., routes/user.js)
const router = require('express').Router();
const User = require('../models/userModel');
const Message = require('../models/messageModel'); // Assuming you have a Message model

// routes/user.js
router.get('/:userId/chat-notifications', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Check if there are pending connection requests
      const hasPendingRequests = user.requestsCame.length > 0;
      if (!hasPendingRequests) return res.json({ hasNotifications: false });
  
      // Check for any messages from requesters
      const hasMessages = await Message.exists({
        sender: { $in: user.requestsCame },
        recipient: user._id
      });
  
      res.json({ hasNotifications: hasMessages });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  module.exports = router