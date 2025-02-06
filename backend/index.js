const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Import routes
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

// Use routes
app.use("/", signupRoute);
app.use("/", loginRoute);
app.use("/", deleteUser);
app.use("/", getAllUser);

app.use("/", createBlog);
app.use("/", deleteBlog);
app.use("/", getAllBlog);
app.use("/", updateBlog);

app.use("/", createCourse);
app.use("/", deleteCourse);
app.use("/", getAllCourse);
app.use("/", updateCourse);

app.use('/', createModule);
app.use('/', updateModule);
app.use('/', deleteModule);

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