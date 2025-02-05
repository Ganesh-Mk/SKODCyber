const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');

router.post('/createModule', async (req, res) => {
  try {
    const { title, description, videoUrl, courseId } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create the module
    const newModule = new Module({
      title,
      description,
      videoUrl,
      course: courseId
    });

    const savedModule = await newModule.save();

    // Add the module to the course
    course.modules.push(savedModule._id);
    await course.save();

    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
