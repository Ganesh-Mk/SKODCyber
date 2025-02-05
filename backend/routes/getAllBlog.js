const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

router.get('/allBlog', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;