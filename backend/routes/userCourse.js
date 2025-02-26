    const express = require("express");
    const router = express.Router();
    const Course = require("../models/courseModel");

    router.get("/userCourses/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const courses = await Course.find({ userId: userId });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching user courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
    });

    module.exports = router;

    
