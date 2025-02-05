const mongoose = require('mongoose');
require('./moduleModel');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
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