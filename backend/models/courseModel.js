const mongoose = require('mongoose');
require('./moduleModel');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'developer', 'user'],
    required: [true, 'role is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required']
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;