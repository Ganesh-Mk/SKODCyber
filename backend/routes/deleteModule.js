const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');

router.delete('/deleteModule/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Remove module from the course
    await Course.findByIdAndUpdate(module.course, {
      $pull: { modules: module._id }
    });

    // Delete module
    await module.deleteOne();

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
