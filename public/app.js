// Make sure you include Socket.io client script in your index.html:
// <script src="/socket.io/socket.io.js"></script>

class WaveMeet {
  constructor() {
    this.socket = null;
    this.localStream = null;
    this.peers = {}; // Peer connections by socketId
    this.participants = {}; // Current participants {socketId: userName}
    this.userName = null;
    this.roomId = null;

    this.init();
  }

  init() {
    this.socket = io(); // Connect to the Socket.io server

    // Bind UI events
    this.bindUIEvents();

    // Listen to socket events
    this.registerSocketHandlers();
  }

  bindUIEvents() {
    const joinBtn = document.getElementById('join-btn');
    const createBtn = document.getElementById('create-btn');
    const roomInput = document.getElementById('room-id');
    const nameInput = document.getElementById('user-name'); // Add this input in HTML to ask user for their name

    if (joinBtn) {
      joinBtn.addEventListener('click', () => {
        this.userName = (nameInput && nameInput.value.trim()) || `User${Math.floor(Math.random()*1000)}`;
        this.roomId = roomInput ? roomInput.value.trim() : null;
        if (!this.roomId) {
          alert('Please enter a Room ID to join.');
          return;
        }
        this.joinRoom(this.roomId, this.userName);
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', () => {
        this.userName = (nameInput && nameInput.value.trim()) || `User${Math.floor(Math.random()*1000)}`;
        this.roomId = this.generateRoomId();
        alert(`Created room with ID: ${this.roomId}`);
        this.joinRoom(this.roomId, this.userName);
        if (roomInput) roomInput.value = this.roomId;
      });
    }
  }

  registerSocketHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to signaling server with socket ID:', this.socket.id);
    });

    this.socket.on('room-participants', (participants) => {
      // participants is an object {socketId: userName}
      this.participants = participants;
      this.updateParticipantList();
    });

    this.socket.on('user-joined', ({ socketId, userName }) => {
      console.log(`${userName} joined the room.`);
      // Setup peer connection here to new user if you implement WebRTC
    });

    this.socket.on('signal', ({ from, signal }) => {
      // Receive signaling data for WebRTC peer connection
      // TODO: Handle WebRTC signaling (offer/answer/ICE) here
      console.log('Received signal from', from, signal);
    });
  }

  joinRoom(roomId, userName) {
    this.roomId = roomId;
    this.userName = userName;

    // Emit join-room event to server
    this.socket.emit('join-room', { roomId, userName });

    // Show meeting UI
    this.showMeetingUI();

    this.startLocalStream();
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const localVideo = document.getElementById('local-video');
      if (localVideo) {
        localVideo.srcObject = this.localStream;
      }
    } catch (err) {
      alert('Error accessing camera and microphone: ' + err.message);
    }
  }

  updateParticipantList() {
    const container = document.getElementById('participants-list');
    if (!container) return;

    container.innerHTML = '';

    for (const [socketId, userName] of Object.entries(this.participants)) {
      const div = document.createElement('div');
      div.textContent = `${userName} ${socketId === this.socket.id ? '(You)' : ''}`;
      container.appendChild(div);
    }
  }

  showMeetingUI() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('meeting-page').style.display = 'block';

    const roomIdDisplay = document.getElementById('current-room-id');
    if (roomIdDisplay) roomIdDisplay.textContent = this.roomId;
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.waveMeet = new WaveMeet();
});

