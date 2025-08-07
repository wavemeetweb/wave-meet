class WaveMeet {
    constructor() {
        this.currentRoom = null;
        this.meetingStartTime = null;
        this.meetingTimer = null;
        this.isMuted = false;
        this.isCameraOn = true;
        this.isScreenSharing = false;
        this.chatMessages = [];
        this.participants = [
            { name: 'You', status: 'Host', avatar: 'You', mic: true, camera: true },
            { name: 'Jane Smith', status: 'Participant', avatar: 'JS', mic: true, camera: true },
            { name: 'Mike Johnson', status: 'Participant', avatar: 'MJ', mic: false, camera: true }
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupChat();
        this.updateParticipantsList();
    }

    bindEvents() {
        const joinBtn = document.getElementById('join-btn');
        const createBtn = document.getElementById('create-btn');
        const roomIdInput = document.getElementById('room-id');

        if (joinBtn) {
            joinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Join meeting clicked');
                this.joinMeeting();
            });
        }

        if (createBtn) {
            createBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Create meeting clicked');
                this.createMeeting();
            });
        }
    }

    joinMeeting() {
        const roomIdInput = document.getElementById('room-id');
        if (!roomIdInput || !roomIdInput.value.trim()) {
            alert('Please enter a valid Room ID to join.');
            return;
        }
        this.currentRoom = roomIdInput.value.trim();
        console.log(`Joining meeting room: ${this.currentRoom}`);
        this.showMeetingUI();
        this.startMeetingTimer();
        this.updateParticipantsList();
        // TODO: Initialize local video and audio streams here
    }

    createMeeting() {
        this.currentRoom = this.generateRoomId();
        console.log(`Created new meeting room: ${this.currentRoom}`);
        this.showMeetingUI();
        this.startMeetingTimer();
        this.updateParticipantsList();
        // Optionally, update the URL or interface to reflect the new roomId
    }

    generateRoomId() {
        // Generates random 6-char alphanumeric string
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    startMeetingTimer() {
        this.meetingStartTime = new Date();
        if (this.meetingTimer) clearInterval(this.meetingTimer);

        this.meetingTimer = setInterval(() => {
            const now = new Date();
            const diffMs = now - this.meetingStartTime;
            const minutes = Math.floor(diffMs / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);
            const timerElem = document.getElementById('meeting-timer');

            if (timerElem) {
                timerElem.textContent = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
            }
        }, 1000);
    }

    stopMeetingTimer() {
        if (this.meetingTimer) {
            clearInterval(this.meetingTimer);
            this.meetingTimer = null;
        }
    }

    updateParticipantsList() {
        const participantsContainer = document.getElementById('participants-list');
        if (!participantsContainer) return;

        participantsContainer.innerHTML = ''; // Clear existing

        this.participants.forEach(p => {
            const participantElem = document.createElement('div');
            participantElem.classList.add('participant');

            participantElem.innerHTML = `
                <div class="avatar">${p.avatar}</div>
                <div class="info">
                    <div class="name">${p.name} ${p.status === 'Host' ? '(Host)' : ''}</div>
                    <div class="status-icons">
                      <span title="Mic">${p.mic ? '🎤' : '🔇'}</span>
                      <span title="Camera">${p.camera ? '📹' : '🚫'}</span>
                    </div>
                </div>
            `;
            participantsContainer.appendChild(participantElem);
        });
    }

    setupChat() {
        // Stub for setting up chat UI and event listeners
        const chatInput = document.getElementById('chat-input');
        const chatSendBtn = document.getElementById('chat-send-btn');

        if (!chatInput || !chatSendBtn) return;

        chatSendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (msg === '') return;
            this.chatMessages.push({ sender: 'You', text: msg, timestamp: new Date() });
            chatInput.value = '';
            this.renderChatMessages();
        });
    }

    renderChatMessages() {
        const chatContainer = document.getElementById('chat-container');
        if (!chatContainer) return;

        chatContainer.innerHTML = '';
        this.chatMessages.forEach(message => {
            const msgElem = document.createElement('div');
            msgElem.classList.add('chat-message');
            msgElem.textContent = `[${message.sender}] ${message.text}`;
            chatContainer.appendChild(msgElem);
        });

        // Scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    showMeetingUI() {
        // Hide landing page and show meeting UI container
        const landingPage = document.getElementById('landing-page');
        const meetingPage = document.getElementById('meeting-page');

        if (landingPage) landingPage.style.display = 'none';
        if (meetingPage) meetingPage.style.display = 'block';

        // Show current room id somewhere in UI
        const meetingRoomDisplay = document.getElementById('current-room-id');
        if(meetingRoomDisplay) {
            meetingRoomDisplay.textContent = this.currentRoom;
        }
    }
}

// Initialize WaveMeet once DOM is ready:
document.addEventListener('DOMContentLoaded', () => {
    window.waveMeet = new WaveMeet();
});
