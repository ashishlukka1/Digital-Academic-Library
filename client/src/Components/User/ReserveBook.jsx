import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, BookOpen, Check, ChevronLeft, ChevronRight, HelpCircle, BookMarked, AlertCircle } from 'lucide-react';
import './ReserveBook.css'; // Import the updated CSS file
import { getAuth } from "firebase/auth";
import axios from 'axios';


const ReserveBook = ({ userEmail, userFirstName }) => {
  // State for the multi-step flow
  const [currentStep, setCurrentStep] = useState(1);
  const auth = getAuth();
  const user = auth.currentUser;
  
  // State for book selection and filtering
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  
  // State for date and time selection
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // State for UI feedback
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Selected book details
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Reservation ID
  const [reservationId, setReservationId] = useState('');

  // User data including phone number
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    phoneNumber: ""
  });

  // Time slots
  const timeSlots = [
    '9:00 AM - 9:30 AM',
    '10:00 AM - 10:30 AM',
    '11:00 AM - 11:30 AM',
    '2:00 PM - 2:30 PM',
    '3:00 PM - 3:30 PM',
  ];

  useEffect(() => {
    // Mock data based on the image provided
    const mockBooks = [
      { 
        _id: "1", 
        title: "The Alchemist", 
        author: "Paulo Coelho", 
        coverImage: "/api/placeholder/80/120", 
        genre: "Fiction", 
        available: true,
        description: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure."
      },
      { 
        _id: "2", 
        title: "Atomic Habits", 
        author: "James Clear", 
        coverImage: "/api/placeholder/80/120", 
        genre: "Self-Help", 
        available: true,
        description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies that will teach you how to form good habits."
      },
      { 
        _id: "3", 
        title: "Deep Work", 
        author: "Cal Newport", 
        coverImage: "/api/placeholder/80/120", 
        genre: "Productivity", 
        available: true,
        description: "Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information."
      },
      { 
        _id: "4", 
        title: "Dune", 
        author: "Frank Herbert", 
        coverImage: "/api/placeholder/80/120", 
        genre: "Science Fiction", 
        available: false,
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world."
      },
      { 
        _id: "5", 
        title: "Sapiens", 
        author: "Yuval Noah Harari", 
        coverImage: "/api/placeholder/80/120", 
        genre: "History", 
        available: true,
        description: "A brief history of humankind. From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution."
      },
    ];
  
    setBooks(mockBooks);
    setFilteredBooks(mockBooks);
  }, []);

  // Fetch user data including phone number
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        try {
          // Use the /signin route to get user details from the database
          const response = await axios.post("http://localhost:5000/users/signin", {
            email: user.email
          });
          
          if (response.data.success) {
            // Store all user data including phone number
            setUserData({
              email: response.data.payload.email,
              firstName: response.data.payload.firstName,
              phoneNumber: response.data.payload.phoneNumber || "" // Handle if phoneNumber is not available
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  // Filter books based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  // Update selected book details when ID changes
  useEffect(() => {
    if (selectedBookId) {
      const book = books.find(book => book._id === selectedBookId);
      setSelectedBook(book);
    } else {
      setSelectedBook(null);
    }
  }, [selectedBookId, books]);

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  // Get the next 7 days for date selection
  const getNextSevenDays = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Handle navigation between steps
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare reservation data for Firebase
  const prepareReservationData = () => {
    // Generate a reservation ID
    const newReservationId = `RES-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setReservationId(newReservationId);
    
    const reservationData = {
      // User information
      user: {
        email: user.email,
        firstName: userData.firstName,
        phoneNumber: userData.phoneNumber // Include phone number in reservation data
      },
      
      // Book information
      book: {
        id: selectedBook?._id,
        title: selectedBook?.title,
        author: selectedBook?.author,
        genre: selectedBook?.genre
      },
      
      // Reservation details
      reservation: {
        date: selectedDate.toISOString(),
        formattedDate: formatDate(selectedDate),
        timeSlot: selectedSlot,
        reservationId: newReservationId,
        status: 'active', // For status tracking (active, completed, cancelled)
        createdAt: new Date().toISOString()
      }
    };

    // Log the data to console for Firebase storage
    console.log('Reservation data for Firebase:', reservationData);
    
    return reservationData;
  };

  // Process the booking
  const handleBooking = async () => {
    if (!selectedBookId || !selectedSlot) {
      setMessage('Please select a book and time slot');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Prepare data
      const reservationData = prepareReservationData();
  
      // ✅ Send POST request to your backend
      const response = await axios.post("http://localhost:5000/users/reservation", reservationData);
  
      if (response.data.success) {
        setIsCompleted(true);
        setCurrentStep(3);
        setMessage("Reservation successful!");
      } else {
        setMessage("Reservation failed. Please try again.");
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error("Error creating reservation: ", error);
      setMessage('Reservation failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Reset the reservation form
  const resetReservation = () => {
    setSelectedBookId('');
    setSelectedSlot('');
    setSelectedDate(new Date());
    setCurrentStep(1);
    setIsCompleted(false);
    setMessage('');
    setSearchQuery('');
  };

  return (
    <div className="reserve-book-container">
      <h2 className="page-header">
        <BookOpen className="header-icon" size={24} />
        Reserve a Book
      </h2>

      {/* Progress Indicator */}
      <div className="flow-progress">
        <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select a Book</div>
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Choose Date & Time</div>
        </div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      <div className="flow-container">
        {/* Step 1: Book Selection */}
        <div className={`flow-section ${currentStep === 1 ? 'active fade-in' : ''}`}>
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" size={18} />
          </div>

          <div className="section-instruction">
            <AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Start by selecting a book you'd like to reserve from the list below.
          </div>

          <div className="content-layout">
            {/* Books List */}
            <div className="books-list-container">
              <h3 className="section-title">Available Books</h3>
              <div className="books-list">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <div 
                      key={book._id}
                      onClick={() => setSelectedBookId(book._id)}
                      className={`book-card ${selectedBookId === book._id ? 'selected' : ''}`}
                    >
                      <div className="book-content">
                        <div className="book-details">
                          <h4 className="book-title">{book.title}</h4>
                          <p className="book-author">{book.author}</p>
                          <div className="book-tags">
                            <span className="tag genre-tag">{book.genre}</span>
                            <span className={`tag ${book.available ? 'available-tag' : 'unavailable-tag'}`}>
                              {book.available ? 'Available' : 'Checked Out'}
                            </span>
                          </div>
                        </div>
                        {selectedBookId === book._id && (
                          <Check className="selected-check" size={24} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No books match your search</p>
                )}
              </div>
            </div>

            {/* Selected Book Preview */}
            <div className="reservation-form-container">
              <div className="reservation-form">
                <h3 className="section-title">
                  <BookMarked className="header-icon" size={18} />
                  Selected Book
                </h3>

                {selectedBook ? (
                  <div className="book-detail-popup fade-in">

                    <div className="book-detail-info">
                      <h4 className="book-detail-title">{selectedBook.title}</h4>
                      <p className="book-detail-author">{selectedBook.author}</p>
                      <div className="book-detail-meta">
                        <span className="book-meta-item">
                          <span className="tag genre-tag">{selectedBook.genre}</span>
                        </span>
                        <span className="book-meta-item">
                          <span className={`tag ${selectedBook.available ? 'available-tag' : 'unavailable-tag'}`}>
                            {selectedBook.available ? 'In Stock' : 'Currently Unavailable'}
                          </span>
                        </span>
                      </div>
                      <p className="book-detail-description">
                        {selectedBook.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="section-instruction">
                    <AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Please select a book from the list to continue
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flow-navigation">
            <button 
              className="nav-button next"
              onClick={nextStep}
              disabled={!selectedBook || !selectedBook.available}
            >
              <span>Continue to Date & Time</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Step 2: Date and Time Selection */}
        <div className={`flow-section ${currentStep === 2 ? 'active fade-in' : ''}`}>
          <div className="section-instruction">
            <AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Choose when you'd like to visit the library to pick up your book.
          </div>

          <div className="content-layout">
            <div className="books-list-container">
              {selectedBook && (
                <div className="book-detail-popup fade-in">

                  <div className="book-detail-info">
                    <h4 className="book-detail-title">{selectedBook.title}</h4>
                    <p className="book-detail-author">{selectedBook.author}</p>
                    <p className="book-detail-description">
                      You're reserving this book. Please select a date and time to pick it up.
                    </p>
                  </div>
                </div>
              )}

              <h3 className="section-title">
                <Calendar className="header-icon" size={18} />
                Select Date
                <div className="help-tooltip">
                  <HelpCircle className="help-icon" size={16} />
                  <div className="tooltip-content">
                    Choose a date when you plan to visit. We'll hold the book for 24 hours from your selected time.
                  </div>
                </div>
              </h3>

              <div className="date-selector">
                {getNextSevenDays().map((date, index) => (
                  <div 
                    key={index}
                    className={`date-button ${
                      date.toDateString() === selectedDate.toDateString() ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="date-day">{date.getDate()}</div>
                    <div className="date-weekday">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="section-title">
                <Clock className="header-icon" size={18} />
                Select Time
              </h3>

              <div className="time-slots">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`time-slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>

            <div className="reservation-form-container">
              <div className="reservation-form">
                <h3 className="section-title">Reservation Summary</h3>
                
                {selectedBook && (
                  <div className="reservation-summary fade-in">
                    <p><strong>Book:</strong> {selectedBook.title}</p>
                    <p><strong>Author:</strong> {selectedBook.author}</p>
                    <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                    <p><strong>Time:</strong> {selectedSlot || 'Not selected'}</p>
                    <p><strong>User:</strong> {userData.firstName || userFirstName || 'User'}</p>
                    <p><strong>Email:</strong> {userData.email || userEmail || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {userData.phoneNumber || 'Not provided'}</p>
                    
                    {message && (
                      <div className="error-message">{message}</div>
                    )}
                    
                    <button 
                      className={`reserve-button ${isLoading ? 'loading' : ''}`}
                      onClick={handleBooking}
                      disabled={!selectedSlot || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Confirm Reservation'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flow-navigation">
            <button className="nav-button back" onClick={prevStep}>
              <ChevronLeft size={18} />
              <span>Back to Books</span>
            </button>
          </div>
        </div>

        {/* Step 3: Confirmation */}
        <div className={`flow-section ${currentStep === 3 ? 'active fade-in' : ''}`}>
          <div className="confirmation-section">
            <div className="confirmation-icon">
              <Check size={32} />
            </div>
            <h3 className="confirmation-title">Reservation Complete!</h3>
            <p className="confirmation-details">
              You've successfully reserved <span className="confirmation-book">{selectedBook?.title}</span>
            </p>

            <div className="confirmation-info">
              <div className="info-row">
                <span className="info-label">Book Title</span>
                <span className="info-value">{selectedBook?.title}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Author</span>
                <span className="info-value">{selectedBook?.author}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Pickup Date</span>
                <span className="info-value">{formatDate(selectedDate)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Pickup Time</span>
                <span className="info-value">{selectedSlot}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reserved By</span>
                <span className="info-value">{userData.firstName || userFirstName || 'User'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{userData.email || userEmail || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{userData.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Reservation ID</span>
                <span className="info-value">#{reservationId.replace('RES-', '')}</span>
              </div>
            </div>

            <p className="section-instruction" style={{ marginTop: '1.5rem', maxWidth: '32rem' }}>
              <AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Hi
            </p>

            <button 
              className="nav-button next" 
              style={{ marginTop: '1.5rem' }}
              onClick={resetReservation}
            >
              Reserve Another Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveBook;