const express = require("express");
const multer = require("multer");
const uploadImage = require("../utils/uploadImage");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/updateCourse", upload.single("thumbnail"), async (req, res) => {
  try {
    const { courseId, userId, title, description } = req.body;
    const thumbnailFile = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role;

    let thumbnailUrl = undefined;
    if (thumbnailFile) {
      thumbnailUrl = await uploadImage(thumbnailFile.buffer, "course");
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { title, description, role, ...(thumbnailUrl && { thumbnail: thumbnailUrl }) },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
