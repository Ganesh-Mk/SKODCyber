const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import routes
const getAll = require("./routes/getAll");
const signupRoute = require("./routes/singup");
const loginRoute = require("./routes/login");
const deleteUser = require("./routes/deleteUser");
const getAllUser = require("./routes/getAllUser");

const createBlog = require("./routes/createBlog");
const deleteBlog = require("./routes/deleteBlog");
const getAllBlog = require("./routes/getAllBlog");
const updateBlog = require("./routes/updateBlog");

const createCourse = require("./routes/createCourse");
const deleteCourse = require("./routes/deleteCourse");
const getAllCourse = require("./routes/getAllCourse");
const updateCourse = require("./routes/updateCourse");

const createModule = require('./routes/createModule');
const updateModule = require('./routes/updateModule');
const deleteModule = require('./routes/deleteModule');
const getModules = require('./routes/getModules');
const getAllModules = require('./routes/getAllModules');
const getSingleUserBlog = require('./routes/getSingleUserBlog');
const getAllQuiz = require('./routes/getAllQuiz');

// User
app.use(getAll);
app.use(signupRoute);
app.use(loginRoute);
app.use(deleteUser);
app.use(getAllUser);

// Blog
app.use(createBlog);
app.use(deleteBlog);
app.use(getAllBlog);
app.use(updateBlog);
app.use(getSingleUserBlog);

// Course
app.use(createCourse);
app.use(deleteCourse);
app.use(getAllCourse);
app.use(updateCourse);

// Module
app.use(createModule);
app.use(updateModule);
app.use(deleteModule);
app.use(getModules);
app.use(getAllModules);
app.use(getAllQuiz);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Backend Server is Running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});