// Wave Meet Application JavaScript

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
        // Landing page events - ensure elements exist before binding
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
