// routes/sendRequest.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const mongoose = require("mongoose");

router.post("/send-request", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: "Invalid sender ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: "Invalid receiver ID" });
    }

    // Add to receiver's requestsCame array
    const updatedUser = await User.findByIdAndUpdate(
      receiverId,
      { $addToSet: { requestsCame: senderId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request sent successfully",
      requestsCame: updatedUser.requestsCame
    });
  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;