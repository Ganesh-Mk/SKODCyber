const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

router.post('/createCourse', async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    const newCourse = new Course({
      title,
      description,
      thumbnail
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;