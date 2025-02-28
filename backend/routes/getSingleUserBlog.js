const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel'); 
const User = require('../models/userModel');
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
                select: 'name email image about social', // Updated to match your schema fields
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
            userId: blog.userId._id,
            author: {
                name: blog.userId.name,
                email: blog.userId.email,
                image: blog.userId.image, // Using image field from your schema
                about: blog.userId.about, // Using about instead of bio
                social: blog.userId.social // Including social links
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
                select: 'name image', // Updated to match your schema field
                model: User
            });

        // Format the response
        const formattedBlogs = blogs.map(blog => ({
            _id: blog._id,
            title: blog.title,
            description: blog.description,
            image: blog.image,
            createdAt: blog.createdAt,
            author: {
                name: blog.userId.name,
                image: blog.userId.image // Using image field from your schema
            }
        }));

        res.status(200).json(formattedBlogs);

    } catch (error) {
        console.error('Error fetching author blogs:', error);
        res.status(500).json({ message: 'Error fetching author blogs', error: error.message });
    }
});

module.exports = router;