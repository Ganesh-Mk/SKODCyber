const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const mongoose = require("mongoose");

router.post("/handle-request", async (req, res) => {
  try {
    const { senderId, receiverId, action } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid sender ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    // Remove from requestsCame regardless of action
    const updatedReceiver = await User.findByIdAndUpdate(
      receiverId,
      { $pull: { requestsCame: senderId } },
      { new: true }
    );

    if (action === "accept") {
      // Add to connections for both users
      await User.findByIdAndUpdate(
        receiverId,
        { $addToSet: { connections: senderId } },
        { new: true }
      );
      
      await User.findByIdAndUpdate(
        senderId,
        { $addToSet: { connections: receiverId } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: `Request ${action}ed successfully`
    });

  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;