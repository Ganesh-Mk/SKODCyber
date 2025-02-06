const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const User = require('../models/userModel');

router.put('/updateCourse', async (req, res) => {
  try {
    const { courseId, userId, title, description, thumbnail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const role = user.role;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, thumbnail, role },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
