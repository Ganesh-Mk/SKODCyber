const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const User = require('../models/userModel');

router.post('/createBlog', async (req, res) => {
  try {
    const { title, image, description, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const role = user.role;

    const newBlog = new Blog({
      title,
      image,
      description,
      role,
      userId
    });

    const savedBlog = await newBlog.save();
    await User.findByIdAndUpdate(userId, { $push: { blogs: savedBlog._id } });

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;