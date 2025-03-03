// messages.js (backend route)
const router = require("express").Router();
const Message = require("../models/messageModel");

router.get("/:userId/unread-messages", async (req, res) => {
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

module.exports = router;
