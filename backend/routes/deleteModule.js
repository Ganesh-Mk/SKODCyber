const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');

router.delete('/deleteModule', async (req, res) => {
  try {
    const { moduleId, courseId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: { modules: module._id }
    });

    await module.deleteOne();

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
