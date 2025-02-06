const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/createCourse", upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const thumbnailFile = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const role = user.role;

    // Upload thumbnail to Cloudinary
    let thumbnailUrl = "";
    if (thumbnailFile) {
      thumbnailUrl = await uploadImage(thumbnailFile.buffer, "course");
    }

    // Create the new course
    const newCourse = new Course({
      title,
      description,
      thumbnail: thumbnailUrl,
      role,
      userId
    });

    const savedCourse = await newCourse.save();

    await User.findByIdAndUpdate(userId, { $push: { courses: savedCourse._id } });

    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
