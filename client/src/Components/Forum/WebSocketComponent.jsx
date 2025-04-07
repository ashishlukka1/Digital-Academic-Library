import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './SocketContext';
import './WebSocketsss.css';

const WebSocketComponent = () => {
  const { socket, availableRooms, username, setUsername, closeRoom } = useContext(SocketContext);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userCreatedRooms, setUserCreatedRooms] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState('');
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
        description: newRoomDescription,
        creator: username
      });
      
      // Store the created room in local state and localStorage
      const updatedRooms = [...userCreatedRooms, newRoomName];
      setUserCreatedRooms(updatedRooms);
      localStorage.setItem('userCreatedRooms', JSON.stringify(updatedRooms));
      
      setNewRoomName('');
      setNewRoomDescription('');
      setShowCreateForm(false);
    } else {
      alert('Please enter both a username and room name');
    }
  };

  const confirmDeleteRoom = (roomName) => {
    setRoomToDelete(roomName);
    setShowConfirmModal(true);
  };

  const handleDeleteRoom = () => {
    if (roomToDelete) {
      // Use the closeRoom function from context to delete the room
      closeRoom(roomToDelete);
      
      // Update local state of user-created rooms
      const updatedRooms = userCreatedRooms.filter(room => room !== roomToDelete);
      setUserCreatedRooms(updatedRooms);
      localStorage.setItem('userCreatedRooms', JSON.stringify(updatedRooms));
      
      setShowConfirmModal(false);
      setRoomToDelete('');
    }
  };

  const cancelDeleteRoom = () => {
    setShowConfirmModal(false);
    setRoomToDelete('');
  };

  const filteredRooms = availableRooms.filter(room => 
    room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if current user is the creator of a room
  const isRoomCreator = (roomName) => {
    return userCreatedRooms.includes(roomName);
  };

  // Check for stored username and user-created rooms on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Retrieve created rooms from localStorage
    try {
      const storedRooms = JSON.parse(localStorage.getItem('userCreatedRooms') || '[]');
      setUserCreatedRooms(storedRooms);
    } catch (error) {
      console.error('Error retrieving user created rooms:', error);
      setUserCreatedRooms([]);
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
                          <div className="room-actions">
                            <button 
                              className="join-button"
                              onClick={() => handleJoinRoom(room)}
                            >
                              Join
                            </button>
                            {isRoomCreator(room) && (
                              <button 
                                className="delete-button"
                                onClick={() => confirmDeleteRoom(room)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <div className="confirm-modal-title">Delete Room</div>
            <p>Are you sure you want to delete the room "{roomToDelete}"? This will remove the room for all users and cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="btn-cancel" onClick={cancelDeleteRoom}>Cancel</button>
              <button className="btn-delete" onClick={handleDeleteRoom}>Delete Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;