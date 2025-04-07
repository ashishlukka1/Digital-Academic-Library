import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './SocketContext';
import './WebSocketsss.css'; // Make sure to create this CSS file

const WebSocketComponent = () => {
  const { socket, availableRooms, username, setUsername } = useContext(SocketContext);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    // Store username and show room list
    localStorage.setItem('username', username);
  };

  const handleJoinRoom = (roomName) => {
    if (username) {
      navigate(`/room/${roomName}`);
    } else {
      alert('Please enter a username first');
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName && username) {
      socket.emit('create_room', { 
        roomName: newRoomName, 
        description: newRoomDescription 
      });
      setNewRoomName('');
      setNewRoomDescription('');
      setShowCreateForm(false);
    } else {
      alert('Please enter both a username and room name');
    }
  };

  const filteredRooms = availableRooms.filter(room => 
    room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check for stored username on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  return (
    <div className="home-container">
      <div className="home-content">
        {!username ? (
          <div className="welcome-card">
            <div className="welcome-header">
              <h2>Welcome to Chat Rooms</h2>
            </div>
            <div className="welcome-body">
              <form onSubmit={handleUsernameSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Choose a username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                  />
                </div>
                <button type="submit" className="primary-button">Continue</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="rooms-container">
            <div className="rooms-header">
              <h2>Available Chat Rooms</h2>
              <button 
                className={`toggle-form-button ${showCreateForm ? 'active' : ''}`}
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? 'Cancel' : 'Create New Room'}
              </button>
            </div>
            
            <div className="rooms-content">
              {showCreateForm ? (
                <div className="create-room-form">
                  <h3>Create a New Room</h3>
                  <form onSubmit={handleCreateRoom}>
                    <div className="form-group">
                      <label htmlFor="roomName">Room Name</label>
                      <input
                        type="text"
                        id="roomName"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        required
                        placeholder="Enter room name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="roomDescription">Description (optional)</label>
                      <textarea
                        id="roomDescription"
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                        placeholder="Describe the purpose of this room"
                      />
                    </div>
                    <button type="submit" className="create-button">Create Room</button>
                  </form>
                </div>
              ) : (
                <div className="rooms-list-container">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search for a room..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  
                  {filteredRooms.length > 0 ? (
                    <ul className="rooms-list">
                      {filteredRooms.map((room) => (
                        <li key={room} className="room-item">
                          <span className="room-name">{room}</span>
                          <button 
                            className="join-button"
                            onClick={() => handleJoinRoom(room)}
                          >
                            Join
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-rooms">
                      <div className="empty-icon">💬</div>
                      <p>No chat rooms available. Create one to get started!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSocketComponent;
