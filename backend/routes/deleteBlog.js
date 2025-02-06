const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

router.delete('/deleteBlog', async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await User.findByIdAndUpdate(userId, { $pull: { blogs: blogId } });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
