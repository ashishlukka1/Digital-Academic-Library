import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Guest.css';

function Guest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search query from navigation state - updated to match Home.jsx implementation
  const searchQuery = location.state?.searchQuery || '';

  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchQuery) {
        setBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            searchQuery
          )}&maxResults=15`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data.items || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchQuery]);

  const handleReadClick = () => {
    // Redirect to sign in page when user tries to read a book
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="guest-container">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guest-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="guest-container">
      <p className="search-results-count">
        {searchQuery ? `Results for "${searchQuery}"` : 'Featured Books'}
      </p>
      
      {books.length === 0 ? (
        <div className="no-results">
          {searchQuery ? 'No books found for your search' : 'Try searching for a book'}
        </div>
      ) : (
        <div className="books-list">
          {books.map((book) => {
            const { id, volumeInfo } = book;
            const thumbnail = volumeInfo.imageLinks?.thumbnail || '/placeholder-book.png';
            
            return (
              <div key={id} className="book-card-horizontal">
                <div className="book-thumbnail">
                  <img src={thumbnail} alt={volumeInfo.title} />
                </div>
                <div className="book-info">
                  <h3>{volumeInfo.title}</h3>
                  <p className="book-authors">
                    {volumeInfo.authors?.join(', ') || 'Unknown Author'}
                  </p>
                  <p className="book-description">
                    {volumeInfo.description
                      ? `${volumeInfo.description.substring(0, 100)}...`
                      : 'No description available'}
                  </p>
                  <button className="read-button" onClick={handleReadClick}>
                    Read Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Guest;