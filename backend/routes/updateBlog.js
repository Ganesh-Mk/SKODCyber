const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

router.put('/updateBlog/:id', async (req, res) => {
  try {
    const { title, image, description } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, image, description },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;