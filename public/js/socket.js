// socket.js – frontend Socket.io client helpers

// Make sure you load Socket.io client script first in your HTML:
// <script src="/socket.io/socket.io.js"></script>

// Create connection
const socket = io();

// === Meeting Room Join ===
export function joinRoom(roomId, userName) {
  socket.emit('join-room', { roomId, name: userName });
}

// === Listen for participant list updates ===
export function onParticipantsUpdate(callback) {
  socket.on('room-participants', callback);
}

// === Send a chat message (if you later add chat feature) ===
export function sendChatMessage(roomId, message) {
  socket.emit('chat-message', { roomId, message });
}

// === Listen for incoming chat messages ===
export function onChatMessage(callback) {
  socket.on('chat-message', callback);
}

// === Export raw socket for custom usage ===
export { socket };
