// Extract user and room from URL
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('user');
const room = urlParams.get('room');

// Set meeting ID in UI
document.getElementById('room-id').textContent = room;

let localStream;
const socket = io();

// Join room via Socket.io
socket.emit('join-room', { roomId: room, name });

// Update participants in UI
socket.on('room-participants', participants => {
  const list = document.getElementById('participants-list');
  list.innerHTML = '';
  Object.values(participants).forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    list.appendChild(li);
  });
});

// Start local audio/video stream
async function startLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('local-video').srcObject = localStream;
  } catch (err) {
    alert('Could not access camera and microphone: ' + err.message);
  }
}

// Mic toggle
document.getElementById('mic-btn').addEventListener('click', () => {
  if (!localStream) return;
  const audioTrack = localStream.getAudioTracks()[0];
  if (!audioTrack) return;

  audioTrack.enabled = !audioTrack.enabled;
  document.getElementById('mic-btn').textContent = audioTrack.enabled ? '🎤 Unmuted' : '🔇 Muted';
});

// Camera toggle
document.getElementById('cam-btn').addEventListener('click', () => {
  if (!localStream) return;
  const videoTrack = localStream.getVideoTracks()[0];
  if (!videoTrack) return;

  videoTrack.enabled = !videoTrack.enabled;
  document.getElementById('cam-btn').textContent = videoTrack.enabled ? '📹 On' : '🚫 Off';
});

// Leave meeting
document.getElementById('leave-btn').addEventListener('click', () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  window.location.href = `dashboard.html?user=${encodeURIComponent(name)}`;
});

// Start camera/mic preview immediately
startLocalStream();
