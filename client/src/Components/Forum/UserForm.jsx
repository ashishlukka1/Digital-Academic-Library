import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../contexts/SocketContext';

const UserForm = () => {
  // Add fallback empty object to prevent errors if context is not available
  const { setUsername } = useContext(SocketContext) || {};
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const [hasStoredUsername, setHasStoredUsername] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus on the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Check if username is already stored in localStorage
    try {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setInputUsername(storedUsername);
        setHasStoredUsername(true);
      }
    } catch (err) {
      console.error('Error accessing localStorage:', err);
    }
  }, []);

  // Simple input handler - keep this basic to avoid potential issues
  const handleInputChange = (e) => {
    setInputUsername(e.target.value);
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Trim the username to handle whitespace
    const trimmedUsername = inputUsername.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }
    
    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }
    
    try {
      // Store username in local storage
      localStorage.setItem('username', trimmedUsername);
      
      // Set username in context if available
      if (typeof setUsername === 'function') {
        setUsername(trimmedUsername);
      } else {
        console.warn('setUsername function not found in context');
      }
      
      // Navigate to home page
      navigate('/');
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: "450px", backgroundColor: "#ffffff" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <i className="bi bi-chat-square-text-fill" style={{ fontSize: "3rem", color: "#4a86e8" }}></i>
            <h2 className="mt-3" style={{ color: "#333333" }}>Welcome to ChatRooms</h2>
            <p style={{ color: "#666666" }}>
              {hasStoredUsername ? 'Confirm your nickname or choose a new one' : 'Choose a nickname to get started'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Nickname
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                id="username"
                name="username"
                placeholder="Enter your nickname"
                value={inputUsername}
                onChange={handleInputChange}
                // Using defaultValue as a fallback if controlled input fails
                defaultValue={inputUsername}
                ref={inputRef}
                autoComplete="off"
                style={{ 
                  backgroundColor: "#f9f9f9", 
                  color: "#333333",
                  borderColor: "#cccccc"
                }}
              />
              <div className="form-text" style={{ color: "#666666" }}>
                This name will be visible to other users in chat rooms.
              </div>
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-lg"
                style={{
                  backgroundColor: "#4a86e8",
                  color: "#ffffff",
                  borderColor: "#4a86e8"
                }}
              >
                {hasStoredUsername ? 'Confirm & Continue' : 'Start Chatting'}
              </button>
            </div>
          </form>
          
          {/* Emergency fallback if form doesn't work */}
          <div className="mt-3 text-center">
            <small>
              <button 
                className="btn btn-link btn-sm p-0 text-muted"
                onClick={() => {
                  // Emergency fallback functionality
                  const username = prompt("Enter your username (minimum 3 characters):");
                  if (username && username.trim().length >= 3) {
                    try {
                      localStorage.setItem('username', username.trim());
                      if (typeof setUsername === 'function') {
                        setUsername(username.trim());
                      }
                      navigate('/');
                    } catch (err) {
                      alert("Error setting username. Please try again.");
                    }
                  }
                }}
              >
                Having trouble? Click here
              </button>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;