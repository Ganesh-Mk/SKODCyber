const express = require('express');
const router = express.Router();
const multer = require("multer");
const Module = require('../models/moduleModel');
const Course = require('../models/courseModel');
const Quiz = require('../models/quizModel');
const uploadVideo = require('../utils/uploadVideo');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/createModule', upload.single('video'), async (req, res) => {
  try {
    let { title, description, courseId, quizzes } = req.body;
    const file = req.file;
    quizzes = JSON.parse(quizzes);

    if (!file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const videoUrl = await uploadVideo(file.buffer, 'modules');

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let quizIds = [];
    if (quizzes && Array.isArray(quizzes)) {
      const quizDocs = await Quiz.insertMany(quizzes);
      quizIds = quizDocs.map(quiz => quiz._id);
    }

    const newModule = new Module({
      title,
      description,
      videoUrl,
      courseId,
      quizzes: quizIds
    });

    const savedModule = await newModule.save();
    course.modules.push(savedModule._id);
    await course.save();

    res.status(201).json(savedModule);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
