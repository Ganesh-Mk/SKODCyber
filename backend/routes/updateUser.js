const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const multer = require('multer');
const uploadImage = require('../utils/uploadImage');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/updateUser', upload.single('profileImage'), async (req, res) => {
  try {
    const { userId, name, email, about, social, modulesCompleted, quizzesCompleted, badges, connectionUserId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (about) updateData.about = about;

    if (connectionUserId) {
      if (!user.connections.includes(connectionUserId)) {
        console.log("user.connections.includes(connectionUserId): ", user.connections.includes(connectionUserId))
        user.connections.push(connectionUserId);
        await user.save();
        console.log("user.connections: ", user.connections)
      }
    }

    // Handle social media links if provided
    if (social) {
      try {
        // Parse the social object if it's a string
        const socialData = typeof social === 'string' ? JSON.parse(social) : social;
        updateData.social = {
          ...user.social, // Keep existing social links
          ...socialData // Update with new social links
        };
      } catch (error) {
        return res.status(400).json({ message: 'Invalid social media data format' });
      }
    }

    if (modulesCompleted !== undefined) updateData.modulesCompleted = modulesCompleted;
    if (quizzesCompleted !== undefined) updateData.quizzesCompleted = quizzesCompleted;
    if (badges !== undefined) updateData.badges = badges;

    if (req.file) {
      const profileImageFile = req.file;
      const imageUrl = await uploadImage(profileImageFile.buffer, 'profile');
      updateData.image = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  }
  catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;