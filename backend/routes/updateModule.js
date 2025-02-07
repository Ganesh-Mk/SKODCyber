const express = require('express');
const router = express.Router();
const multer = require("multer");
const Module = require('../models/moduleModel');
const uploadVideo = require('../utils/uploadVideo');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put('/updateModule', upload.single('video'), async (req, res) => {
  try {
    const { moduleId, title, description } = req.body;
    const file = req.file;

    const existingModule = await Module.findById(moduleId);
    if (!existingModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    let videoUrl = existingModule.videoUrl;
    if (file) {
      videoUrl = await uploadVideo(file.buffer, 'modules');
    }

    existingModule.title = title || existingModule.title;
    existingModule.description = description || existingModule.description;
    existingModule.videoUrl = videoUrl;

    const updatedModule = await existingModule.save();

    res.json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
