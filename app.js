const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect('mongodb://127.0.0.1:27017/wavemeet', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const scheduledMeetings = {};
const rooms = {};

// ===== Auth Routes =====
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (await User.findOne({ username }))
      return res.status(409).json({ error: 'Username exists' });
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Signup error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

// ===== Meetings =====
app.post('/schedule-meeting', (req, res) => {
  const { title, datetime } = req.body;
  if (!title || !datetime) return res.status(400).json({ error: 'Missing fields' });
  const id = uuidv4();
  const roomId = Math.random().toString(36).substr(2, 8).toUpperCase();
  scheduledMeetings[id] = { title, datetime, roomId };
  res.json({ success: true, meetingId: id, roomId });
});

app.get('/scheduled-meetings', (req, res) => {
  res.json(Object.entries(scheduledMeetings).map(([id, m]) => ({ id, ...m })));
});

// ===== WebRTC Signaling =====
io.on('connection', socket => {
  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || {};
    rooms[roomId][socket.id] = name;
    socket.to(roomId).emit('user-joined', { socketId: socket.id, name });
    io.to(roomId).emit('room-participants', rooms[roomId]);

    socket.on('signal', data => {
      io.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });

    socket.on('disconnect', () => {
      if (rooms[roomId]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit('room-participants', rooms[roomId]);
      }
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`🚀 Wave Meet running on ${port}`));
