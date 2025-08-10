const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('user');
const room = urlParams.get('room');

document.getElementById('room-id').textContent = room;

const socket = io();
socket.emit('join-room', { roomId: room, name });

socket.on('room-participants', participants => {
  const list = document.getElementById('participants-list');
  list.innerHTML = '';
  Object.values(participants).forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    list.appendChild(li);
  });
});

(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    document.getElementById('local-video').srcObject = stream;
  } catch (err) {
    alert('Camera access denied');
  }
})();

document.getElementById('leave-btn').addEventListener('click', () => {
  window.location.href = `dashboard.html?user=${encodeURIComponent(name)}`;
});
