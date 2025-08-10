import { joinRoom, onParticipantsUpdate } from './socket.js';

const params = new URLSearchParams(window.location.search);
const name = params.get('user');
const room = params.get('room');

document.getElementById('room-id').textContent = room;

// Join room
joinRoom(room, name);

// Update participant list dynamically
onParticipantsUpdate(participants => {
  const list = document.getElementById('participants-list');
  list.innerHTML = '';
  Object.values(participants).forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    list.appendChild(li);
  });
});
