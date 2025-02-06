const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');

router.put('/updateModule/:id', async (req, res) => {
  try {
    const { title, description, videoUrl, role } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { title, description, videoUrl, role },
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
