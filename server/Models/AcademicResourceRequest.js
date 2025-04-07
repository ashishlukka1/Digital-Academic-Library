const mongoose = require('mongoose');

const AcademicResourceRequestSchema = new mongoose.Schema({
  student: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  resourceType: {
    type: String,
    enum: ['book', 'journal', 'article', 'courseMaterial', 'other'],
    default: 'other'
  },
  institutionName: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const AcademicResourceRequest = mongoose.model('AcademicResourceRequest', AcademicResourceRequestSchema);

module.exports = AcademicResourceRequest;
