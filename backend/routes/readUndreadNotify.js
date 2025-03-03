const router = require("express").Router();
const Message = require("../models/messageModel");

// Get unread messages count
router.get("/unread/:userId", async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.params.userId,
      read: false,
    });
    res.json({ hasUnread: count > 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/unread-messages/:recipientId/:senderId", async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.params.recipientId,
      sender: req.params.senderId,
      read: false,
    });
    res.json({ hasUnread: count > 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as read
router.patch("/mark-read", async (req, res) => {
  try {
    const { recipientId, senderId } = req.body;
    await Message.updateMany(
      {
        recipient: recipientId,
        sender: senderId,
        read: false,
      },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
