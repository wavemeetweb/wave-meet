const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store
const users = {};
const scheduledMeetings = {}; // {id: {title, datetime, roomId}}

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Missing fields' });
  if (users[username])
    return res.status(409).json({ error: 'Username exists' });
  users[username] = password;
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!users[username] || users[username] !== password)
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true });
});

app.post('/schedule-meeting', (req, res) => {
  const { title, datetime } = req.body;
  if (!title || !datetime)
    return res.status(400).json({ error: 'Missing fields' });
  const id = uuidv4();
  const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
  scheduledMeetings[id] = { title, datetime, roomId };
  res.json({ success: true, meetingId: id, roomId });
});

app.get('/scheduled-meetings', (req, res) => {
  res.json(Object.entries(scheduledMeetings).map(([id, m]) => ({
    id, ...m
  })));
});

// Socket.io logic
const rooms = {};
io.on('connection', socket => {
  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || {};
    rooms[roomId][socket.id] = name;
    io.to(roomId).emit('room-participants', rooms[roomId]);
    socket.on('disconnect', () => {
      if (rooms[roomId]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit('room-participants', rooms[roomId]);
      }
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`✅ Wave Meet running on ${port}`));
