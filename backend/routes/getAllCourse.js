const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

router.get('/allCourse', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: 'modules',
        select: 'title description videoUrl role'
      })
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 