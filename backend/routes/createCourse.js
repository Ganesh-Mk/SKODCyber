const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const User = require('../models/userModel');

router.post('/createCourse', async (req, res) => {
  try {
    const { title, description, thumbnail, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const role = user.role;

    // Create the new course
    const newCourse = new Course({
      title,
      description,
      thumbnail,
      role,
      userId
    });

    const savedCourse = await newCourse.save();

    await User.findByIdAndUpdate(userId, { $push: { courses: savedCourse._id } });

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
