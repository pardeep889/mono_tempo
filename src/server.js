const express = require('express');
const path = require('path');
const app = express();
const apiRoutes = require('./app'); // Assuming this is your API routes
const http = require('http');
const socketIo = require('socket.io');
// const {io} = require("./socketChatConnection")

const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust according to your needs
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for joinGroup event to add the user to the specific group room
  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  // Handle message sending to a specific group
  socket.on('send-message', (data) => {
    console.log('Message received:', data);
    const { groupId, message } = data;

    // Emit the message to all users in the specific group room
    io.to(groupId).emit('newMessage', message);
  });

   // Assume the client sends the userId when they connect
   socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending direct messages
  socket.on('send-message-to-user', (data) => {
    const { senderId, receiverId, text } = data;
    // Emit the message to the receiver's room
    io.to(receiverId).emit('newMessage', { senderId, text });
    console.log(`Message sent from ${senderId} to ${receiverId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
// Serve API routes
app.use('/api', apiRoutes(io));

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../socketMessagesHTMLSample','index.html'));
});

// Serve static assets (React build files)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log(`Tempospace is running on port ${PORT}`);
});
