bindEvents() {
    const joinBtn = document.getElementById('join-btn');
    const createBtn = document.getElementById('create-btn');
    const userNameInput = document.getElementById('user-name');

    if (joinBtn) {
      joinBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const userName = userNameInput?.value.trim();
        if (!userName) {
          alert('Please enter your name before joining a meeting.');
          return;
        }

        this.userName = userName;
        this.joinMeeting();
      });
    }

    if (createBtn) {
      createBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const userName = userNameInput?.value.trim();
        if (!userName) {
          alert('Please enter your name before creating a meeting.');
          return;
        }

        this.userName = userName;
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
    console.log(`User "${this.userName}" joining meeting room: ${this.currentRoom}`);

    this.showMeetingUI();
    this.startLocalStream();
    // You can emit userName + room to backend here via socket signaling when implemented
    this.updateParticipantsList();
  }

createMeeting() {
    this.currentRoom = this.generateRoomId();
    console.log(`User "${this.userName}" created new meeting room: ${this.currentRoom}`);

    this.showMeetingUI();
    this.startLocalStream();
    // Emit userName + new roomId to backend via socket here when implemented
    this.updateParticipantsList();
  }
