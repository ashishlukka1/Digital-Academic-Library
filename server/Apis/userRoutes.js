const express = require('express');
const  UserRouter= express.Router();
const User = require('../Models/UserModel');
const AcademicResourceRequest=require('../Models/AcademicResourceRequest');
const BookRequest=require('../Models/BookRequest')
const Reservation=require('../Models/Reservation')

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
UserRouter.post('/register', async (req, res) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password, role, institutionName,phoneNumber
       } = req.body;


    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password

    // Create and save user
    const user = new User({
      firstName,
      lastName,
      email,
      password: password,
      role: role,
      phoneNumber,
      institutionName
    });

    await user.save();

    // Respond with created user data
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

UserRouter.post('/check-user', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    res.status(200).json({
      success: true,
      exists: !!user,
      payload:user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Public
UserRouter.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
UserRouter.post('/signin', async (req, res) => {
  console.log("hello");
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      payload: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

UserRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Send success response
    res.status(200).json({
      success: true,
      payload: user
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Request for Academic Books
UserRouter.post('/requests', async (req, res) => {
  try {
    const { student, title, description, resourceType, institutionName } = req.body;

    if (!student || !title || !institutionName) {
      return res.status(400).json({ success: false, message: 'Student, title, and institution name are required' });
    }

    const newRequest = new AcademicResourceRequest({
      student,
      title,
      description,
      resourceType,
      institutionName
    });

    await newRequest.save();

    res.status(201).json({ success: true, message: 'Resource request submitted', request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
UserRouter.post("/reservation", async (req, res) => {
  try {
    const { user, book, reservation } = req.body;

    if (!user || !book || !reservation) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newReservation = new Reservation({
      user,
      book,
      reservation
    });

    await newReservation.save();

    res.status(201).json({ success: true, message: "Reservation saved successfully", data: newReservation });
  } catch (error) {
    console.error("Error saving reservation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

UserRouter.get('/get-books', async (req, res) => {
  try {
    const data = await BookRequest.find();
    console.log(data);
    res.status(200).json({
      success: true,
      message: "List of academic resource requests",
      payload: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving academic resource requests",
      error: error.message
    });
  }
});


module.exports = UserRouter;
