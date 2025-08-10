const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('user');
const room = urlParams.get('room');

document.getElementById('room-id').textContent = room;

const socket = io();
const peers = {};
let localStream;

// --- Get video grid ---
const videoGrid = document.getElementById('video-grid');

// --- Start local stream ---
async function startLocalStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    addVideoStream(localStream, name, true);
  } catch (err) {
    alert('Camera/Mic access denied');
  }
}
startLocalStream();

// --- Join room ---
socket.emit('join-room', { roomId: room, name });

// --- Handle participants list update ---
socket.on('room-participants', participants => {
  const listElem = document.getElementById('participants-list');
  listElem.innerHTML = '';
  Object.values(participants).forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    listElem.appendChild(li);
  });
});

// --- Handle new user joining ---
socket.on('user-joined', ({ socketId, name: remoteName }) => {
  const pc = createPeerConnection(socketId, remoteName);
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  peers[socketId] = pc;
  pc.createOffer().then(offer => {
    pc.setLocalDescription(offer);
    socket.emit('signal', { to: socketId, signal: { sdp: offer } });
  });
});

// --- Handle signaling ---
socket.on('signal', async ({ from, signal }) => {
  let pc = peers[from];
  if (!pc) {
    pc = createPeerConnection(from);
    peers[from] = pc;
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  }

  if (signal.sdp) {
    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    if (signal.sdp.type === 'offer') {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('signal', { to: from, signal: { sdp: answer } });
    }
  }
  if (signal.candidate) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    } catch (err) {
      console.error(err);
    }
  }
});

// --- Create Peer ---
function createPeerConnection(socketId, remoteName) {
  const pc = new RTCPeerConnection();
  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.emit('signal', { to: socketId, signal: { candidate: e.candidate } });
    }
  };
  pc.ontrack = e => {
    addVideoStream(e.streams[0], remoteName || 'Guest');
  };
  return pc;
}

// --- Add video stream element ---
function addVideoStream(stream, label, muted = false) {
  // Avoid duplicates for own stream
  if (muted && document.querySelector(`video[data-label="${label}"]`)) return;
  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  video.muted = muted;
  video.setAttribute('data-label', label);
  video.style.width = '200px';
  video.style.background = 'black';
  videoGrid.appendChild(video);
}

// --- Mic toggle ---
document.getElementById('mic-btn').addEventListener('click', () => {
  if (!localStream) return;
  const audioTrack = localStream.getAudioTracks()[0];
  if (!audioTrack) return;
  audioTrack.enabled = !audioTrack.enabled;
  document.getElementById('mic-btn').textContent = audioTrack.enabled ? '🎤 Unmuted' : '🔇 Muted';
});

// --- Camera toggle ---
document.getElementById('cam-btn').addEventListener('click', () => {
  if (!localStream) return;
  const videoTrack = localStream.getVideoTracks()[0];
  if (!videoTrack) return;
  videoTrack.enabled = !videoTrack.enabled;
  document.getElementById('cam-btn').textContent = videoTrack.enabled ? '📹 On' : '🚫 Off';
});

// --- Leave ---
document.getElementById('leave-btn').addEventListener('click', () => {
  Object.values(peers).forEach(pc => pc.close());
  if (localStream) localStream.getTracks().forEach(track => track.stop());
  window.location.href = `dashboard.html?user=${encodeURIComponent(name)}`;
});
