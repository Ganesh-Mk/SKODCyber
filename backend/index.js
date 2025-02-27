const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
const updateUser = require("./routes/updateUser");

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
const getUserCourses = require("./routes/userCourse")
const getSingleModule = require("./routes/getSingleModule")
const getSingleCourse = require("./routes/getTheSignleCourse")

// User
app.use(getAll);
app.use(signupRoute);
app.use(loginRoute);
app.use(deleteUser);
app.use(getAllUser);
app.use(updateUser);

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
app.use(getUserCourses);
app.use(getSingleCourse);

// Module
app.use(createModule);
app.use(updateModule);
app.use(deleteModule);
app.use(getModules);
app.use(getAllModules);
app.use(getAllQuiz);
app.use(getSingleModule);

// Test Route
app.get("/", (req, res) => {
  res.render("status", {
    serverStatus: "✅ Running",
    mongoStatus: mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Not Connected"
  });
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
