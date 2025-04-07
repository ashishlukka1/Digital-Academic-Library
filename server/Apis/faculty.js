const express = require('express');
const facultyRouter = express.Router();
const BookRequest = require('../Models/BookRequest'); 
const AcademicResourceRequest=require('../Models/AcademicResourceRequest')

facultyRouter.post('/post-book', async (req, res) => {
  try {
    const { title, author, publishedDate, driveLink, instituteName, genre } = req.body;

    // Validate required fields
    if (!title || !author || !publishedDate || !driveLink || !instituteName || !genre) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create new request
    const newRequest = new BookRequest({
      title,
      author,
      publishedDate,
      driveLink,
      instituteName,
      genre
    });

    // Save to DB
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Book resource request submitted successfully.',
      data: newRequest
    });

  } catch (error) {
    console.error('Error submitting book request:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

facultyRouter.get('/get-req', async (req, res) => {
  try {
    const data = await AcademicResourceRequest.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching academic resource requests:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


module.exports = facultyRouter;
