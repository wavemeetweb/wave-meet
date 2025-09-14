// Show/hide auth modal and switch tabs
document.getElementById('loginBtn').onclick = function() {
  document.getElementById('authModal').style.display = 'flex';
  switchTab('login');
};
document.getElementById('signupBtn').onclick = function() {
  document.getElementById('authModal').style.display = 'flex';
  switchTab('signup');
};
document.querySelector('.close').onclick = function() {
  document.getElementById('authModal').style.display = 'none';
};

function switchTab(tab) {
  if(tab==='login'){
    document.getElementById('loginFormWrap').classList.remove('hidden');
    document.getElementById('signupFormWrap').classList.add('hidden');
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabSignup').classList.remove('active');
  } else {
    document.getElementById('signupFormWrap').classList.remove('hidden');
    document.getElementById('loginFormWrap').classList.add('hidden');
    document.getElementById('tabSignup').classList.add('active');
    document.getElementById('tabLogin').classList.remove('active');
  }
}
document.getElementById('tabLogin').onclick = () => switchTab('login');
document.getElementById('tabSignup').onclick = () => switchTab('signup');

// OAuth buttons placeholders (needs backend connection)
document.querySelectorAll('.google-btn').forEach(btn => {
  btn.onclick = () => alert('Google OAuth login not implemented yet.');
});
document.querySelectorAll('.facebook-btn').forEach(btn => {
  btn.onclick = () => alert('Facebook OAuth login not implemented yet.');
});

// Meeting join form show/hide
document.getElementById('joinMeetingBtn').onclick = () => {
  document.getElementById('meetingActions').classList.remove('hidden');
};

// Stub actions for schedule meeting
document.getElementById('scheduleMeetingBtn').onclick = () => {
  alert('Schedule meeting feature coming soon.');
};

// Create new meeting with video + mic
document.getElementById('createMeetingBtn').onclick = async () => {
  document.querySelector('.hero').style.display = 'none';
  document.getElementById('meetingActions').classList.add('hidden');

  let container = document.createElement('div');
  container.id = 'videoMeetingContainer';
  container.innerHTML = `
    <h2>Your Meeting Room</h2>
    <video id="localVideo" autoplay muted playsinline></video>
    <div class="controls">
      <button id="toggleVideo">Turn Off Video</button>
      <button id="toggleAudio">Mute Mic</button>
      <button id="endMeeting">End Meeting</button>
    </div>
  `;
  document.querySelector('main').appendChild(container);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;

    let videoEnabled = true;
    document.getElementById('toggleVideo').onclick = () => {
      videoEnabled = !videoEnabled;
      stream.getVideoTracks()[0].enabled = videoEnabled;
      document.getElementById('toggleVideo').textContent = videoEnabled ? 'Turn Off Video' : 'Turn On Video';
    };

    let audioEnabled = true;
    document.getElementById('toggleAudio').onclick = () => {
      audioEnabled = !audioEnabled;
      stream.getAudioTracks()[0].enabled = audioEnabled;
      document.getElementById('toggleAudio').textContent = audioEnabled ? 'Mute Mic' : 'Unmute Mic';
    };

    document.getElementById('endMeeting').onclick = () => {
      stream.getTracks().forEach(track => track.stop());
      container.remove();
      document.querySelector('.hero').style.display = 'block';
    };

  } catch (err) {
    alert('Could not access camera and microphone: ' + err.message);
    container.remove();
    document.querySelector('.hero').style.display = 'block';
  }
};
