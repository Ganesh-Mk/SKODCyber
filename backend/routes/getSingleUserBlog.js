const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel'); // Assuming you have a Blog model
const User = require('../models/userModel'); // Assuming you have a User model
const mongoose = require('mongoose');

// Get single blog post with author details
router.get('/blog/:id', async (req, res) => {
    try {
        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid blog ID format' });
        }

        // Find blog and populate author details
        const blog = await Blog.findById(req.params.id)
            .populate({
                path: 'userId',
                select: 'name email profileImage bio', // Select the fields you want to include
                model: User
            });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Format the response
        const formattedBlog = {
            _id: blog._id,
            title: blog.title,
            description: blog.description,
            image: blog.image,
            createdAt: blog.createdAt,
            readTime: blog.readTime,
            userId: blog.userId._id,
            author: {
                name: blog.userId.name,
                email: blog.userId.email,
                profileImage: blog.userId.profileImage,
                bio: blog.userId.bio
            }
        };

        res.status(200).json(formattedBlog);

    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Error fetching blog details', error: error.message });
    }
});

// Get all blogs by author
router.get('/authorBlogs/:userId', async (req, res) => {
    try {
        // Validate if the userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find all blogs by the author
        const blogs = await Blog.find({ userId: req.params.userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate({
                path: 'userId',
                select: 'name profileImage',
                model: User
            });

        // Format the response
        const formattedBlogs = blogs.map(blog => ({
            _id: blog._id,
            title: blog.title,
            description: blog.description,
            image: blog.image,
            createdAt: blog.createdAt,
            readTime: blog.readTime,
            author: {
                name: blog.userId.name,
                profileImage: blog.userId.profileImage
            }
        }));

        res.status(200).json(formattedBlogs);

    } catch (error) {
        console.error('Error fetching author blogs:', error);
        res.status(500).json({ message: 'Error fetching author blogs', error: error.message });
    }
});


module.exports = router;