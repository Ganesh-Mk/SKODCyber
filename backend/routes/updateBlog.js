const express = require("express");
const multer = require("multer");
const router = express.Router();
const Blog = require("../models/blogModel");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Update Blog Route
router.put("/updateBlog", upload.single("image"), async (req, res) => {
  try {
    const { title, description, blogId, userId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Only update image if provided

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description, ...(image && { image }) }, // Only update image if it's uploaded
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
