const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

router.post('/createBlog', async (req, res) => {
  try {
    const { title, image, description } = req.body;

    const newBlog = new Blog({
      title,
      image,
      description
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;