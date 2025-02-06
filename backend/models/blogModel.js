const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'user'],
    required: [true, 'role is required']
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;