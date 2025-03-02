// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');

// GET messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    })
    .sort({ createdAt: 1 }) // Sort by timestamp ascending
    .exec();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

module.exports = router;