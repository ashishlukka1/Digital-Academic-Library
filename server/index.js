const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const UserRouter = require('./Apis/userRoutes');
const facultyRouter = require('./Apis/faculty');
const { containsAbusiveContent } = require('./utils/abuseFilter');

// Load environment variables
dotenv.config();

// Import cron job
require('../server/cronJob');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3001;

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/users', UserRouter);
app.use('/faculty', facultyRouter);

// Home route
app.get('/', (req, res) => {
  res.send('Digital Academic Library API is running');
});

// Gemini AI Chat API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateGeminiResponse(message, chatHistory = []) {
  try {
    const systemMessage = `You are a helpful assistant for an online library system. You can help users with:

- Finding and borrowing books, ebooks, and other materials
- Searching the library catalog
- Managing their library account (borrowing history, renewals, holds)
- Information about library services (hours, events, programs)
- Basic troubleshooting for the library website and digital resources
- Recommendations based on reading interests

Provide friendly, helpful responses about the library system. If you don't have specific information about this library, provide general guidance about how library systems typically work.`;

    // Format conversation history
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemMessage }]
      },
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("🔴 Gemini API Error:");
    console.error("🔹 Message:", error.message);
    console.error("🔹 Response Data:", error.response?.data);
    console.error("🔹 Stack:", error.stack);
    throw new Error("Failed to get response from Gemini");
  }
}

app.post("/chat", async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    const responseText = await generateGeminiResponse(prompt, history.slice(-10));
    res.json({ response: responseText });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Socket.io Chat Functionality
// Store active chat rooms and their messages
const chatRooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send available chat rooms to the client
  socket.emit('available_rooms', Object.keys(chatRooms));
  
  // When user creates a new room
  socket.on('create_room', ({ roomName, description, creator }) => {
    if (!chatRooms[roomName]) {
      chatRooms[roomName] = {
        description,
        messages: [],
        users: [],
        creator: creator, // Store the creator's username
        abuseDetected: false
      };
      
      io.emit('available_rooms', Object.keys(chatRooms));
      console.log(`Room created: ${roomName} by ${creator}`);
    }
  });
  
  // When user joins a room
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.currentRoom = roomName;
    
    // Add user to room's user list
    if (chatRooms[roomName]) {
      chatRooms[roomName].users.push(socket.id);
      
      // Send room history to new user
      socket.emit('room_history', chatRooms[roomName].messages);
      
      // Send room metadata to client including the creator info
      socket.emit('room_metadata', {
        creator: chatRooms[roomName].creator,
        description: chatRooms[roomName].description,
        abuseDetected: chatRooms[roomName].abuseDetected
      });
      
      console.log(`User ${socket.id} joined room: ${roomName}`);
    }
  });
  
  // When creator closes a room
  socket.on('close_room', ({ roomName, username }) => {
    if (chatRooms[roomName] && chatRooms[roomName].creator === username) {
      // Notify all users in the room that it's being closed
      io.to(roomName).emit('room_closed', roomName);
      
      // Delete the room
      delete chatRooms[roomName];
      
      // Update the available rooms list for all clients
      io.emit('available_rooms', Object.keys(chatRooms));
      
      console.log(`Room ${roomName} closed by creator ${username}`);
    } else {
      console.log(`Failed close attempt for room ${roomName} by non-creator ${username}`);
      // Optionally send an error back to the client
      socket.emit('close_room_error', { 
        message: 'Only the room creator can close the room',
        roomName
      });
    }
  });
  
  // When user sends a message
  socket.on('send_message', (messageData) => {
    const { room, message, sender } = messageData;
    
    if (chatRooms[room]) {
      // Check for abusive content
      if (containsAbusiveContent(message)) {
        console.log(`Abusive content detected in room ${room} from ${sender}`);
        
        // Mark the room as having abuse
        chatRooms[room].abuseDetected = true;
        
        // Notify all users in the room about abuse detection
        io.to(room).emit('abuse_detected', room);
        
        // Store an admin message in room history
        const adminMessage = {
          content: "This chat has been flagged for inappropriate content. Please keep conversations respectful.",
          sender: "System",
          time: new Date().toISOString(),
          isSystemMessage: true
        };
        
        chatRooms[room].messages.push(adminMessage);
        io.to(room).emit('receive_message', adminMessage);
        
        return; // Don't process the abusive message further
      }
      
      const newMessage = {
        content: message,
        sender: sender,
        time: new Date().toISOString()
      };
      
      // Store message in room history
      chatRooms[room].messages.push(newMessage);
      
      // Send message to everyone in the room
      io.to(room).emit('receive_message', newMessage);
    }
  });
  
  // When user leaves a room
  socket.on('leave_room', (roomName) => {
    socket.leave(roomName);
    
    // Remove user from room's user list
    if (chatRooms[roomName]) {
      chatRooms[roomName].users = chatRooms[roomName].users.filter(id => id !== socket.id);
    }
    
    console.log(`User ${socket.id} left room: ${roomName}`);
  });
  
  // When user disconnects
  socket.on('disconnect', () => {
    // Remove user from all rooms
    for (const room in chatRooms) {
      chatRooms[room].users = chatRooms[room].users.filter(id => id !== socket.id);
    }
    
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB and start servers
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connection established successfully');
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`API server is running on port ${PORT}`);
    });
    
    // Start the Socket.io server
    server.listen(SOCKET_PORT, () => {
      console.log(`Socket.io server running on port ${SOCKET_PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;