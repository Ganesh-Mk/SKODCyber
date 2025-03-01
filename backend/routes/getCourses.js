const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

router.get('/getCourses', async (req, res) => {
  try {
    const { courseIds } = req.query;
    if (!courseIds) {
      return res.status(400).json({ message: 'Course IDs are required' });
    }

    const courses = await Course.find({ _id: { $in: courseIds.split(',') } });

    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
