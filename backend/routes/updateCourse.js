const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');

router.put('/updateCourse/:id', async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail },
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