const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const Blog = require("../models/blogModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/updateBlog", upload.single("image"), async (req, res) => {
  try {
    const { blogId, title, description } = req.body;
    const imageFile = req.file;

    let imageUrl = undefined;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile.buffer, "blog");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description, ...(imageUrl && { image: imageUrl }) },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;