const mongoose = require('mongoose');

const BookRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publishedDate: {
    type: Date,
    required: true
  },
  driveLink: {
    type: String,
    required: true,
    trim: true
  },
  instituteName: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const BookRequest = mongoose.model('Books', BookRequestSchema);

module.exports = BookRequest;
