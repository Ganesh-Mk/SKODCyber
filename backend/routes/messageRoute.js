// messages.js (new route file)
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

// Get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId1, recipient: req.params.userId2 },
        { sender: req.params.userId2, recipient: req.params.userId1 }
      ]
    }).sort('createdAt');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;