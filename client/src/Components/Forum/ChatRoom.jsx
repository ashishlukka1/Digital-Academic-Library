import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../Forum/SocketContext';
import AbuseWarningPopup from '../Abuse/AbuseWarningPopup';
import { detectAbusiveContent } from '../../utils/abuseDetection';
import './ChatRoom.css';

const ChatRoom = () => {
  const { roomName } = useParams();
  const { 
    socket, 
    username, 
    closeRoom, 
    abuseDetected: contextAbuseDetected, 
    resetAbuseWarning
    // Remove the non-existent joinRoom and leaveRoom from here
  } = useContext(SocketContext);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [roomCreator, setRoomCreator] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [localAbuseDetected, setLocalAbuseDetected] = useState(false);
  const [showAbuseWarning, setShowAbuseWarning] = useState(false);
  const messageContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    
    // Join the room when component mounts
    socket.emit('join_room', roomName);
    // Remove the call to joinRoom function here
    
    // Listen for incoming messages
    socket.on('receive_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    
    // Listen for room history when joining
    socket.on('room_history', (history) => {
      setMessages(history);
    });

    // Listen for room metadata
    socket.on('room_metadata', (metadata) => {
      setRoomCreator(metadata.creator);
      if (metadata.abuseDetected) {
        setLocalAbuseDetected(true);
        setShowAbuseWarning(true);
      }
      console.log("Room creator:", metadata.creator);
    });
    
    // Listen for room closure
    socket.on('room_closed', (closedRoomName) => {
      if (closedRoomName === roomName) {
        alert(`Room "${roomName}" has been closed by the creator.`);
        navigate('/userprofile');
      }
    });
    
    // Listen for abuse detection
    socket.on('abuse_detected', (affectedRoom) => {
      if (affectedRoom === roomName) {
        setLocalAbuseDetected(true);
        setShowAbuseWarning(true);
      }
    });
    
    // Clean up when component unmounts
    return () => {
      socket.emit('leave_room', roomName);
      // Remove the call to leaveRoom function here
      socket.off('receive_message');
      socket.off('room_history');
      socket.off('room_metadata');
      socket.off('room_closed');
      socket.off('abuse_detected');
    };
  }, [socket, roomName, navigate]); // Remove joinRoom and leaveRoom from dependencies

  // Effect to handle abuse detection from context
  useEffect(() => {
    if (contextAbuseDetected) {
      setLocalAbuseDetected(true);
      setShowAbuseWarning(true);
    }
  }, [contextAbuseDetected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      // Check for abusive content locally before sending
      if (detectAbusiveContent(message)) {
        setLocalAbuseDetected(true);
        setShowAbuseWarning(true);
        return;
      }
      
      const messageData = {
        room: roomName,
        message: message.trim(),
        sender: username
      };
      
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  const handleLeaveRoom = () => {
    navigate('/userprofile');
  };

  const confirmCloseRoom = () => {
    setShowConfirmModal(true);
  };

  const handleCloseRoom = () => {
    closeRoom(roomName);
    setShowConfirmModal(false);
    navigate('/userprofile');
  };

  const cancelCloseRoom = () => {
    setShowConfirmModal(false);
  };

  const closeAbuseWarning = () => {
    setShowAbuseWarning(false);
    resetAbuseWarning();
  };

  // Check if current user is the room creator
  const isCurrentUserCreator = username === roomCreator;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <div className="chat-card card">
            <div className="chat-header bg-primary text-white">
              <div className="room-title">
                Chat Room: {roomName}
                {isCurrentUserCreator && <span className="room-creator-badge">Creator</span>}
              </div>
              <div className="room-actions">
                {isCurrentUserCreator && (
                  <button className="btn btn-danger close-room-btn" onClick={confirmCloseRoom}>
                    Close Room
                  </button>
                )}
                <button className="btn btn-light leave-room-btn" onClick={handleLeaveRoom}>
                  Leave Room
                </button>
              </div>
            </div>
            <div 
              className="message-container" 
              ref={messageContainerRef}
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender === username ? 'sent' : msg.isSystemMessage ? 'system' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-sender">
                        {msg.sender === username ? 'You' : msg.sender}
                        {msg.sender === roomCreator && <span className="creator-tag">Creator</span>}
                      </div>
                      <div className="message-text">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.time).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">💬</div>
                  <div>No messages yet. Start the conversation!</div>
                </div>
              )}
            </div>
            <div className="message-form">
              <form onSubmit={sendMessage}>
                <div className="message-input-group">
                  <input
                    type="text"
                    className="form-control message-input"
                    placeholder={localAbuseDetected ? "Chat has been restricted due to inappropriate content" : "Type a message..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={localAbuseDetected}
                  />
                  <button 
                    className="btn btn-primary send-button" 
                    type="submit"
                    disabled={localAbuseDetected}
                  >
                    Send
                  </button>
                </div>
              </form>
              {localAbuseDetected && (
                <div className="abuse-warning-banner">
                  ⚠️ This chat has been restricted due to inappropriate content.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <div className="confirm-modal-title">Close Room</div>
            <p className='text-dark'>Are you sure you want to close the room "{roomName}"? This will remove the room for all users and cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="btn btn-secondary" onClick={cancelCloseRoom}>Cancel</button>
              <button className="btn btn-danger" onClick={handleCloseRoom}>Close Room</button>
            </div>
          </div>
        </div>
      )}

      {/* Abuse Warning Popup */}
      {showAbuseWarning && (
        <AbuseWarningPopup 
          onClose={closeAbuseWarning}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
};

export default ChatRoom;