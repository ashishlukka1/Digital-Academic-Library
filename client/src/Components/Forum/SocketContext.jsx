import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Connect to the Socket.io server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Listen for the updated list of available rooms
    newSocket.on('available_rooms', (rooms) => {
      setAvailableRooms(rooms);
    });

    // Clean up socket connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (roomName, description) => {
    if (socket) {
      socket.emit('create_room', { roomName, description, creator: username });
    }
  };

  const closeRoom = (roomName) => {
    if (socket) {
      socket.emit('close_room', { roomName, username });
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      availableRooms, 
      username, 
      setUsername,
      createRoom,
      closeRoom
    }}>
      {children}
    </SocketContext.Provider>
  );
};