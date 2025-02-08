const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const Blog = require("../models/blogModel");
const router = express.Router();

// Configure multer to use memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Update Blog Route
router.put("/updateBlog", upload.single("image"), async (req, res) => {
  try {
    const { blogId, title, description } = req.body;

    // Validate required fields
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Find blog first to check if it exists
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Prepare update data starting with existing blog data
    const updateData = {
      ...existingBlog.toObject(),
      title: title || existingBlog.title,
      description: description || existingBlog.description,
    };

    // Handle image upload to Cloudinary if new image is provided
    if (req.file) {
      try {
        // Upload to Cloudinary using the imported uploadImage utility
        const cloudinaryUrl = await uploadImage(req.file.buffer, "blogs");
        if (cloudinaryUrl) {
          updateData.image = cloudinaryUrl;
        }
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({ 
          message: "Failed to upload image to Cloudinary",
          error: uploadError.message 
        });
      }
    }

    // Update blog in database
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Failed to update blog" });
    }

    // Send success response
    res.status(200).json({
      success: true,
      data: updatedBlog,
      message: "Blog updated successfully"
    });

  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating blog", 
      error: error.message 
    });
  }
});

module.exports = router;