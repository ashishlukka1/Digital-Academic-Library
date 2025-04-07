import React, { useState } from "react";
import axios from "axios";
import "./Publish.css"; // External CSS file
import c3 from '../../assets/c3.svg'

const PublishBookForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedDate: "",
    driveLink: "",
    instituteName: "",
    genre: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/faculty/post-book", formData);
      alert("Book published successfully!");
      onClose(); // close modal
    } catch (error) {
      console.error("Error publishing book:", error);
    }
  };

  return (
    <div className="publish-page-container">
      <div className="publish-content-wrapper">
        <div className="publish-form-container">
          <div className="form-header">
            <h2>Publish Your Book</h2>
            <div className="accent-line"></div>
            <p>Share your knowledge and expertise</p>
          </div>
          
          <form onSubmit={handleSubmit} className="publish-book-form">
            <div className="form-group">
              <label htmlFor="title">Book Title</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="Enter book title" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input 
                type="text" 
                id="author"
                name="author" 
                placeholder="Author name" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="publishedDate">Publication Date</label>
              <input 
                type="date" 
                id="publishedDate"
                name="publishedDate" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="driveLink">Resource Link</label>
              <input 
                type="url" 
                id="driveLink"
                name="driveLink" 
                placeholder="Google Drive link" 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="instituteName">Institution</label>
                <input 
                  type="text" 
                  id="instituteName"
                  name="instituteName" 
                  placeholder="Your institution" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="genre">Subject/Genre</label>
                <input 
                  type="text" 
                  id="genre"
                  name="genre" 
                  placeholder="Book genre" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="submit-btn">Publish</button>
            </div>
          </form>
        </div>
        
        <div className="illustration-container">
            <img src={c3} alt="" />
        </div>
      </div>
    </div>
  );
};

export default PublishBookForm;