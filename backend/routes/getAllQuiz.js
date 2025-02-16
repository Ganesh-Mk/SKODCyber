const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');

router.get('/allQuiz', async (req, res) => {
  try {
    const allQuiz = await Quiz.find();
    res.json(allQuiz);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;