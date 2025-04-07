import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, User, Filter, Book, FileText, Notebook, ArrowLeft, BookOpen, ChevronLeft, ChevronRight, PlusCircle, Wifi, WifiOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Openlibrary.css'; // We'll define custom styles here
import {useNavigate} from 'react-router-dom';

// Demo data for books section
const demoBooks = [
  {
    title: "The Great Gatsby",
    author_name: ["F. Scott Fitzgerald"],
    first_publish_year: 1925,
    subject: ["Fiction", "Classic Literature", "American Literature"]
  },
  {
    title: "To Kill a Mockingbird",
    author_name: ["Harper Lee"],
    first_publish_year: 1960,
    subject: ["Fiction", "Coming-of-age", "Legal drama"]
  },
  {
    title: "1984",
    author_name: ["George Orwell"],
    first_publish_year: 1949,
    subject: ["Dystopian Fiction", "Political Fiction", "Science Fiction"]
  },
  {
    title: "Pride and Prejudice",
    author_name: ["Jane Austen"],
    first_publish_year: 1813,
    subject: ["Fiction", "Romance", "Classic Literature"]
  },
  {
    title: "The Catcher in the Rye",
    author_name: ["J.D. Salinger"],
    first_publish_year: 1951,
    subject: ["Fiction", "Coming-of-age", "Literary realism"]
  },
  {
    title: "The Hobbit",
    author_name: ["J.R.R. Tolkien"],
    first_publish_year: 1937,
    subject: ["Fantasy", "Children's Literature", "Adventure"]
  }
];

const SearchLibrary = () => {
  const navigate=useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('books');
  
  // Selected book and its contents
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemContents, setItemContents] = useState(null);
  const [loadingContents, setLoadingContents] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter states
  const [authorFilter, setAuthorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch course materials when the tab changes to 'courses'
  useEffect(() => {
    if (activeTab === 'courses') {
      fetchCourseBooks();
    } else if (activeTab === 'books') {
      // Load demo books when books tab is active
      setResults(demoBooks);
    } else {
      setResults([]);
    }
  }, [activeTab]);

  // Function to fetch course books
  const fetchCourseBooks = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    setSelectedItem(null);
    setItemContents(null);
    
    try {
      const response = await axios.get('http://localhost:5000/users/get-books');
      setResults(response.data.payload);
    } catch (err) {
      setError('There was an error fetching course materials.');
      console.error('Error fetching course materials:', err);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setResults([]);
    setSelectedItem(null);
    setItemContents(null);
    
    try {
      // Simulate different endpoints based on active tab
      let endpoint = 'https://openlibrary.org/search.json';
      
      const res = await axios.get(`${endpoint}?q=${encodeURIComponent(query)}`);
      
      // Filter results if filters are applied
      let filteredResults = res.data.docs;
      
      if (authorFilter) {
        filteredResults = filteredResults.filter(item => 
          item.author_name && item.author_name.some(author => 
            author.toLowerCase().includes(authorFilter.toLowerCase())
          )
        );
      }
      
      if (yearFilter) {
        filteredResults = filteredResults.filter(item => 
          item.first_publish_year && item.first_publish_year.toString() === yearFilter
        );
      }
      
      if (categoryFilter) {
        filteredResults = filteredResults.filter(item => 
          item.subject && item.subject.some(subject => 
            subject.toLowerCase().includes(categoryFilter.toLowerCase())
          )
        );
      }
      
      setResults(filteredResults);
    } catch (err) {
      setError('There was an error fetching the data.');
    }
    setLoading(false);
  };
  
  // Change tab and reset results
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Reset results unless switching to courses tab (which auto-fetches)
    if (tab !== 'courses' && tab !== 'books') {
      setResults([]);
    }
    
    setSelectedItem(null);
    setItemContents(null);
  };

  // Handle book selection to view content
  const handleItemSelect = async (item) => {
    setSelectedItem(item);
    setLoadingContents(true);
    setCurrentPage(0);
    // For course materials, we could potentially fetch additional content here
    setLoadingContents(false);
  };

  const handleBackToResults = () => {
    setSelectedItem(null);
    setItemContents(null);
  };

  const handleNextPage = () => {
    if (currentPage < itemContents.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRequestBook = () => {
    navigate('/resourse-req');
  };

  const handleOfflineBookService = () => {
    navigate('/offline-book-service');
  };

  // New function to handle the drive link click
  const handleDriveLinkClick = (driveLink, e) => {
    e.stopPropagation();
    console.log('Drive Link:', driveLink);
    window.open(driveLink, '_blank', 'noopener noreferrer');
  };

  function handleClick(item) {
    navigate('/reader', { state: { driveLink: item.driveLink } });
  }
  

  const renderBookContent = () => {
    if (!itemContents || !itemContents.pages || itemContents.pages.length === 0) {
      return <p className="text-center">No content available for this book.</p>;
    }

    return (
      <div className="mt-4">
        {/* Page navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`btn d-flex align-items-center ${
              currentPage === 0 ? 'btn-disabled' : 'btn-accent'
            }`}
          >
            <ChevronLeft className="icon-sm me-1" /> Previous
          </button>
          
          <span className="text-light fw-medium">
            Page {currentPage + 1} of {itemContents.pages.length}
          </span>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === itemContents.pages.length - 1}
            className={`btn d-flex align-items-center ${
              currentPage === itemContents.pages.length - 1 ? 'btn-disabled' : 'btn-accent'
            }`}
          >
            Next <ChevronRight className="icon-sm ms-1" />
          </button>
        </div>
        
        {/* Page content */}
        <div className="book-content card">
          <div className="card-body content-area">
            {itemContents.pages[currentPage].content.split('\n').map((paragraph, idx) => {
              // Handle headings
              if (paragraph.trim().startsWith('#')) {
                const level = paragraph.match(/^#+/)[0].length;
                const text = paragraph.replace(/^#+\s*/, '');
                
                if (level === 1) {
                  return <h1 key={idx} className="book-h1 mb-4">{text}</h1>;
                } else if (level === 2) {
                  return <h2 key={idx} className="book-h2 mb-3 mt-4">{text}</h2>;
                } else if (level === 3) {
                  return <h3 key={idx} className="book-h3 mb-2 mt-3">{text}</h3>;
                } else {
                  return <h4 key={idx} className="book-h4 mb-2 mt-3">{text}</h4>;
                }
              }
              
              // Handle lists
              if (paragraph.trim().match(/^\d+\.\s/)) {
                return <p key={idx} className="book-list-item">{paragraph}</p>;
              }
              
              if (paragraph.trim().startsWith('- ')) {
                return <p key={idx} className="book-list-item">{paragraph}</p>;
              }
              
              // Handle bold text
              if (paragraph.includes('**')) {
                const parts = paragraph.split(/\*\*/);
                return (
                  <p key={idx} className="book-paragraph">
                    {parts.map((part, i) => 
                      i % 2 === 0 ? part : <strong key={i} className="book-bold">{part}</strong>
                    )}
                  </p>
                );
              }
              
              // Normal paragraph
              if (paragraph.trim()) {
                return <p key={idx} className="book-paragraph">{paragraph}</p>;
              }
              
              return null;
            })}
          </div>
        </div>
        
        {/* Bottom page navigation */}
        <div className="d-flex justify-content-between align-items-center my-4">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`btn d-flex align-items-center ${
              currentPage === 0 ? 'btn-disabled' : 'btn-accent'
            }`}
          >
            <ChevronLeft className="icon-sm me-1" /> Previous
          </button>
          
          <div className="page-indicators d-flex">
            {itemContents.pages.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`page-indicator ${currentPage === idx ? 'active' : ''}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage === itemContents.pages.length - 1}
            className={`btn d-flex align-items-center ${
              currentPage === itemContents.pages.length - 1 ? 'btn-disabled' : 'btn-accent'
            }`}
          >
            Next <ChevronRight className="icon-sm ms-1" />
          </button>
        </div>
      </div>
    );
  };

  // Function to render book item based on the active tab type
  const renderBookItem = (item, index) => {
    if (activeTab === 'courses') {
      // Render course material format
      const publishedDate = item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : 'N/A';
      
      return (
        <div 
          key={index} 
          className="result-card"
          onClick={() => handleClick(item)}
        >
          <h3 className="result-title">{item.title}</h3>
          <p className="result-meta">
            <span className="meta-label">Author:</span> {item.author || 'Unknown'}
          </p>
          <p className="result-meta">
            <span className="meta-label">Published Date:</span> {publishedDate}
          </p>
          <p className="result-meta">
            <span className="meta-label">Institution:</span> {item.instituteName || 'N/A'}
          </p>
          <p className="result-meta">
            <span className="meta-label">Genre:</span> {item.genre || 'N/A'}
          </p>
          {item.driveLink && (
            <p className="result-meta">
              <a 
                href="#"
                className="drive-link"
                onClick={(e) => handleDriveLinkClick(item.driveLink, e)}
              >
                Access Material
              </a>
            </p>
          )}
        </div>
      );
    } else {
      // Default format for other tabs
      return (
        <div 
          key={index} 
          className="result-card"
          onClick={() => handleItemSelect(item)}
        >
          <h3 className="result-title">{item.title}</h3>
          <p className="result-meta">
            <span className="meta-label">Author:</span> {item.author_name ? item.author_name.join(', ') : 'Unknown'}
          </p>
          <p className="result-meta">
            <span className="meta-label">Year:</span> {item.first_publish_year || 'N/A'}
          </p>
          {item.subject && (
            <p className="result-meta">
              <span className="meta-label">Topics:</span> {item.subject.slice(0, 3).join(', ')}
              {item.subject.length > 3 ? '...' : ''}
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="library-container">
      {/* Fixed Sidebar */}
      <div className="sidebar fixed-sidebar">
        <div className="sidebar-content">
          <h3 className="sidebar-title">Search Library</h3>
          <div className="search-box">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="search-icon" />
          </div>
          <button 
            onClick={handleSearch}
            className="btn btn-accent btn-block mt-3"
            disabled={activeTab === 'courses'} // Disable search button for courses tab
          >
            Search
          </button>
          
          {/* Request a Book button */}
          <button 
            onClick={handleRequestBook}
            className="btn btn-outline-primary btn-block mt-3 d-flex align-items-center justify-content-center"
          >
            <PlusCircle className="icon-sm me-2" /> Request a Book
          </button>
          
          {/* Offline Book Service button */}
          <button 
            onClick={handleOfflineBookService}
            className="btn btn-outline-secondary btn-block mt-3 d-flex align-items-center justify-content-center"
          >
            <WifiOff className="icon-sm me-2" /> Offline Book Service
          </button>
        
          <div className="filters mt-4">
            <h4 className="filter-title">
              <Filter className="icon-sm me-1" /> Filters
            </h4>
            <div className="mb-3">
              <label className="filter-label">
                <User className="icon-xs me-1" /> Author
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Author name"
                value={authorFilter}
                onChange={(e) => setAuthorFilter(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="filter-label">
                <Calendar className="icon-xs me-1" /> Publication Year
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year (e.g. 2020)"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="filter-label">Category</label>
              <select 
                className="form-select form-select-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="science">Science</option>
                <option value="history">History</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Add padding-left to account for fixed sidebar */}
      <div className="main-content sidebar-adjusted">
        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => handleTabChange('books')}
          >
            <Book className="icon-sm me-1" /> Books
          </button>
          <button
            className={`tab-button ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => handleTabChange('research')}
          >
            <FileText className="icon-sm me-1" /> Research Papers
          </button>
          <button
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => handleTabChange('courses')}
          >
            <Notebook className="icon-sm me-1" /> Course Materials
          </button>
        </div>

        {/* Content Area */}
        <div className="content-container">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && query && activeTab !== 'courses' && (
            <div className="no-results-message">
              No results found. Try adjusting your search or filters.
            </div>
          )}
          
          {!loading && !error && results.length === 0 && activeTab === 'courses' && (
            <div className="no-results-message">
              No course materials available.
            </div>
          )}

          {/* Selected Item View */}
          {selectedItem && (
            <div className="selected-item-container">
              <button 
                onClick={handleBackToResults}
                className="btn btn-outline-secondary mb-4 d-flex align-items-center"
              >
                <ArrowLeft className="icon-sm me-1" /> Back to results
              </button>
              
              <div className="selected-item-header">
                <h2 className="selected-title">{selectedItem.title}</h2>
                
                {activeTab === 'courses' ? (
                  <div className="selected-meta">
                    <p><strong>Author:</strong> {selectedItem.author || 'Unknown'}</p>
                    <p><strong>Published Date:</strong> {selectedItem.publishedDate ? new Date(selectedItem.publishedDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Institution:</strong> {selectedItem.instituteName || 'N/A'}</p>
                    <p><strong>Genre:</strong> {selectedItem.genre || 'N/A'}</p>
                    {selectedItem.driveLink && (
                      <a 
                        href="#"
                        className="btn btn-primary mt-2"
                        onClick={(e) => handleDriveLinkClick(selectedItem.driveLink, e)}
                      >
                        <BookOpen className="icon-sm me-1" /> Access Material
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="selected-meta">
                    <p><strong>Author:</strong> {selectedItem.author_name ? selectedItem.author_name.join(', ') : 'Unknown'}</p>
                    <p><strong>Year:</strong> {selectedItem.first_publish_year || 'N/A'}</p>
                    {selectedItem.subject && (
                      <p><strong>Topics:</strong> {selectedItem.subject.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
              
              {loadingContents ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                renderBookContent()
              )}
            </div>
          )}

          {/* Search Results Container - only show if no book is selected */}
          {!selectedItem && !loading && (
            <div className="results-container">
              {results.map((item, index) => renderBookItem(item, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchLibrary;