const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

router.get('/allCourse', async (req, res) => {
  try {
    const courses = await Course.find()

    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 