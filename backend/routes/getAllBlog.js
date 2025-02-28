const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

router.get('/allBlog', async (req, res) => {
  try {
    // First get all blogs sorted by creation date
    const blogs = await Blog.find().sort({ createdAt: -1 });
    
    // Map through blogs to add user image
    const blogsWithUserImage = await Promise.all(blogs.map(async (blog) => {
      // Convert blog to a plain object that we can modify
      const blogObj = blog.toObject();
      
      // Find the associated user to get their image
      const user = await User.findById(blog.userId);
      
      // Add the user image to the blog object
      if (user) {
        blogObj.userImage = user.image;
      }
      
      return blogObj;
    }));
    
    res.json(blogsWithUserImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;