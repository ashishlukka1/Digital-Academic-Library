// AcademicPortal.jsx
import React, { useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import OpenLibrary from '../User/OpenLibrary'

const AcademicPortal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const naviagte=useNavigate();

  

  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? '' : category);
  };

  const handleForumClick = () => {
    // Navigate to forum or open forum modal
    naviagte('discussion-forum')
    console.log('Opening discussion forum');
  };

  const handleStartClick = () => {
    // Navigate to forum or open forum modal
    naviagte('openlibrary')
    console.log('Opening discussion forum');
  };

  return (
    <div className="portal-container">
      <div className="portal-content">
        <h1 className="portal-title">Your Gateway to Academic Excellence</h1>
        <p className="portal-subtitle">
          Access research papers, course materials, and academic resources in one place
        </p>

        <div className="search-forum-container">
        <div className="forum-container">
            <button className="forum-button" onClick={handleStartClick}>
              Get Started!
            </button>
          </div>
          <div className="forum-container">
            <button className="forum-button" onClick={handleForumClick}>
              Discussions forum <span className="arrow">▶</span>
            </button>
          </div>
        </div>

        <div className="categories-container">
          {['Research Papers', 'Course Materials', 'Books', 'Journals'].map((category) => (
            <button 
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicPortal;