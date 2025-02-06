const mongoose = require('mongoose');
require('./courseModel');

const moduleSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'user'],
    required: [true, 'role is required']
  },
}, {
  timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
