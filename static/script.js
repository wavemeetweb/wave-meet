const socket = io();
let room = '';
let localStream;
const peers = {};

function joinRoom() {
  room = document.getElementById('roomInput').value;
  socket.emit('join', { room });

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      const localVideo = document.createElement('video');
      localVideo.srcObject = stream;
      localVideo.autoplay = true;
      localVideo.muted = true;
      document.getElementById('videos').appendChild(localVideo);
    });
}

socket.on('user-joined', async ({ id }) => {
  // Handle peer connection logic here (WebRTC signaling to be added)
});

socket.on('signal', data => {
  // Signaling for WebRTC connection
});
