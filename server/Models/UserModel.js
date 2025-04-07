const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  
  // Role-based Access Control
  role: {
    type: String,
    enum: ['student', 'faculty', 'librarian', 'researcher', 'admin', 'public'],
    default: 'student'
  },
  
  // Institution Information
  institutionName: {
    type: String,
  },
  
  
  // Academic Interests
  academicProfile: {
    fields: [String],
    interests: [String]
  },
  
  // Account Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;