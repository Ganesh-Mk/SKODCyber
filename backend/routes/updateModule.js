const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');

router.put('/updateModule', async (req, res) => {
  try {
    const { moduleId, title, description, videoUrl } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      { title, description, videoUrl },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    res.json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
