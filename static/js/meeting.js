let socket;
let localStream;
let peerConnections = {};
let meetingCode;
let participantName;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

async function initializeMeeting(code, name) {
    meetingCode = code;
    participantName = name;
    
    // Initialize socket connection
    socket = io();
    
    // Get local media
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true
        });
        
        document.getElementById('localVideo').srcObject = localStream;
        
        // Join the meeting room
        socket.emit('join', {
            meeting_code: meetingCode,
            participant_name: participantName
        });
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
    }
    
    setupSocketListeners();
    setupControlButtons();
}

function setupSocketListeners() {
    socket.on('user-joined', async (data) => {
        console.log('User joined:', data.participant_name);
        updateParticipantCount(data.participant_count);
        
        if (data.participant_id !== socket.id) {
            await createPeerConnection(data.participant_id, true);
        }
    });
    
    socket.on('existing-users', (data) => {
        data.participants.forEach(async (participant) => {
            if (participant.id !== socket.id) {
                await createPeerConnection(participant.id, false);
            }
        });
    });
    
    socket.on('signal', async (data) => {
        const { from, signal } = data;
        
        if (!peerConnections[from]) {
            await createPeerConnection(from, false);
        }
        
        const pc = peerConnections[from];
        
        if (signal.type === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            
            socket.emit('signal', {
                to: from,
                from: socket.id,
                signal: answer,
                meeting_code: meetingCode
            });
        } else if (signal.type === 'answer') {
            await pc.setRemoteDescription(new RTCSessionDescription(signal));
        } else if (signal.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(signal));
        }
    });
    
    socket.on('user-left', (data) => {
        console.log('User left:', data.participant_id);
        updateParticipantCount(data.participant_count);
        
        if (peerConnections[data.participant_id]) {
            peerConnections[data.participant_id].close();
            delete peerConnections[data.participant_id];
            
            // Remove video element
            const videoElement = document.getElementById(`video-${data.participant_id}`);
            if (videoElement) {
                videoElement.parentElement.remove();
            }
        }
    });
}

async function createPeerConnection(peerId, isInitiator) {
    const pc = new RTCPeerConnection(configuration);
    peerConnections[peerId] = pc;
    
    // Add local stream tracks
    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
    });
    
    // Handle incoming tracks
    pc.ontrack = (event) => {
        addRemoteVideo(peerId, event.streams[0]);
    };
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', {
                to: peerId,
                from: socket.id,
                signal: event.candidate,
                meeting_code: meetingCode
            });
        }
    };
    
    // Create offer if initiator
    if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        
        socket.emit('signal', {
            to: peerId,
            from: socket.id,
            signal: offer,
            meeting_code: meetingCode
        });
    }
}

function addRemoteVideo(peerId, stream) {
    // Check if video already exists
    if (document.getElementById(`video-${peerId}`)) {
        return;
    }
    
    const videoGrid = document.getElementById('videoGrid');
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    
    const video = document.createElement('video');
    video.id = `video-${peerId}`;
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = stream;
    
    const label = document.createElement('div');
    label.className = 'video-label';
    label.textContent = 'Participant';
    
    videoContainer.appendChild(video);
    videoContainer.appendChild(label);
    videoGrid.appendChild(videoContainer);
}

function setupControlButtons() {
    let videoEnabled = true;
    let audioEnabled = true;
    
    // Toggle Video
    document.getElementById('toggleVideo').addEventListener('click', () => {
        videoEnabled = !videoEnabled;
        localStream.getVideoTracks()[0].enabled = videoEnabled;
        
        const btn = document.getElementById('toggleVideo');
        btn.classList.toggle('active');
        btn.querySelector('.icon').textContent = videoEnabled ? '📹' : '📹❌';
    });
    
    // Toggle Audio
    document.getElementById('toggleAudio').addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        localStream.getAudioTracks()[0].enabled = audioEnabled;
        
        const btn = document.getElementById('toggleAudio');
        btn.classList.toggle('active');
        btn.querySelector('.icon').textContent = audioEnabled ? '🎤' : '🎤❌';
    });
    
    // Share Screen
    document.getElementById('shareScreen').addEventListener('click', async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            
            const screenTrack = screenStream.getVideoTracks()[0];
            const videoTrack = localStream.getVideoTracks()[0];
            
            // Replace video track in all peer connections
            Object.values(peerConnections).forEach(pc => {
                const sender = pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(screenTrack);
                }
            });
            
            // Replace local video
            document.getElementById('localVideo').srcObject = new MediaStream([screenTrack]);
            
            // When screen sharing stops, switch back to camera
            screenTrack.onended = () => {
                Object.values(peerConnections).forEach(pc => {
                    const sender = pc.getSenders().find(s => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                });
                document.getElementById('localVideo').srcObject = localStream;
            };
            
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    });
    
    // Leave Call
    document.getElementById('leaveCall').addEventListener('click', () => {
        if (confirm('Are you sure you want to leave the meeting?')) {
            leaveMeeting();
        }
    });
}

function leaveMeeting() {
    // Stop all tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    Object.values(peerConnections).forEach(pc => pc.close());
    
    // Emit leave event
    socket.emit('leave', {
        meeting_code: meetingCode
    });
    
    // Redirect to home
    window.location.href = '/';
}

function updateParticipantCount(count) {
    document.getElementById('participantCount').textContent = `${count} participant${count !== 1 ? 's' : ''}`;
}

function toggleChat() {
    const chatPanel = document.getElementById('chatPanel');
    chatPanel.classList.toggle('open');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    leaveMeeting();
});
