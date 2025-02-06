const express = require('express');
const router = express.Router();
const Course = require('../models/courseModel');
const User = require('../models/userModel');

router.delete('/deleteCourse', async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
