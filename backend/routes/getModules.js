const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');

router.get('/getModules', async (req, res) => {
  const { courseId } = req.query;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const modules = await Module.find({ courseId: course._id });

    res.json(modules);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;