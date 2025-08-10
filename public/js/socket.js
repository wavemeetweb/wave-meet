// socket.js

// Initialize a Socket.io connection (assumes /socket.io/socket.io.js is loaded via script tag)
const socket = io(); // connects to the server from the browser

// Export a function to join a room
export function joinRoom(roomId, name) {
  socket.emit('join-room', { roomId, name });
}

// Export a function to handle participant updates
export function onParticipantsUpdate(callback) {
  socket.on('room-participants', callback);
}

// You can export other socket helpers here, e.g. for signaling messages or chat
export function onSignal(callback) {
  socket.on('signal', callback);
}

export function sendSignal(to, signal) {
  socket.emit('signal', { to, signal });
}

// Export the raw socket in case you want manual control elsewhere
export { socket };

