// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Serve static files (optional if you want to serve frontend from here)
app.use(express.static('public'));

io.on('connection', socket => {
  // User joins a room
  socket.on('join-room', ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`${userName} joined room ${roomId}`);

    // Notify other users in room a new user connected
    socket.to(roomId).emit('user-connected', { id: socket.id, userName });

    // Relay signaling data to the intended user
    socket.on('signal', ({ signal, to }) => {
      io.to(to).emit('signal', { signal, from: socket.id });
    });

    // User disconnects
    socket.on('disconnect', () => {
      console.log(`${userName} disconnected from room ${roomId}`);
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
