const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');

router.post('/createModule', async (req, res) => {
  try {
    const { title, description, videoUrl, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newModule = new Module({
      title,
      description,
      videoUrl,
      courseId,
    });

    const savedModule = await newModule.save();

    course.modules.push(savedModule._id);
    await course.save();

    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
