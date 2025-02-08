const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/createBlog", upload.single("image"), async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const imageFile = req.file;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Upload image to Cloudinary
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImage(imageFile.buffer, "blogs");
    }

    // Create Blog
    const newBlog = new Blog({
      title,
      image: imageUrl,
      description,
      role: user.role,
      userId,
      userName : user.name
    });

    const savedBlog = await newBlog.save();
    await User.findByIdAndUpdate(userId, { $push: { blogs: savedBlog._id } });

    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
