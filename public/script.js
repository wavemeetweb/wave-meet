// ------- Firebase Authentication -------
const firebaseConfig = {
  apiKey: "AIzaSyBsMMxOpiriP1UfQ45yvs-aR6SgQblO7Nc",
  authDomain: "wave-meett.firebaseapp.com",
  projectId: "wave-meett",
  storageBucket: "<wave-meett>.firebasestorage.app",
  messagingSenderId: "866825007815",
  appId: "1:866825007815:web:7074f02f551a232889c4e2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

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
// Tab logic
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

// Email signup
document.getElementById('signupForm').onsubmit = async (e) => {
  e.preventDefault();
  const name = e.target[0].value;
  const birthdate = e.target[1].value;
  const email = e.target[2].value;
  const password = e.target[3].value;
  try {
    let user = await auth.createUserWithEmailAndPassword(email, password);
    await user.user.updateProfile({displayName: name});
    alert('Signup successful');
    document.getElementById('authModal').style.display = 'none';
  } catch(err) {
    alert(err.message);
  }
};
// Email login
document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert('Login successful');
    document.getElementById('authModal').style.display = 'none';
  } catch(err) {
    alert(err.message);
  }
};
// Google/Facebook OAuth
document.querySelectorAll('.google-btn').forEach(btn => {
  btn.onclick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      alert('Google sign-in successful');
      document.getElementById('authModal').style.display = 'none';
    } catch(err) { alert('Google login error '+err.message);}
  };
});
document.querySelectorAll('.facebook-btn').forEach(btn => {
  btn.onclick = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      await auth.signInWithPopup(provider);
      alert('Facebook sign-in successful');
      document.getElementById('authModal').style.display = 'none';
    } catch(err) { alert('Facebook login error '+err.message);}
  };
});

// Meeting join form show/hide
document.getElementById('joinMeetingBtn').onclick = () => {
  document.getElementById('meetingActions').classList.remove('hidden');
};

// Schedule stub
document.getElementById('scheduleMeetingBtn').onclick = () => {
  alert('Schedule meeting feature coming soon.');
};

// Create New Meeting With Video and Code
document.getElementById('createMeetingBtn').onclick = () => {
  const userName = prompt('Enter your name to start the meeting:');
  if (!userName || userName.trim() === '') {
    alert('Name is required to start the meeting.');
    return;
  }
  // Generate a random 6-digit meeting code
  const meetingCode = Math.floor(100000 + Math.random() * 900000).toString();

  document.querySelector('.hero').style.display = 'none';
  document.getElementById('meetingActions').classList.add('hidden');
  let container = document.createElement('div');
  container.id = 'videoMeetingContainer';
  container.innerHTML = `
    <h2>Your Meeting Room</h2>
    <p><strong>Meeting Code:</strong> <span id="meetingCode">${meetingCode}</span></p>
    <div class="video-wrapper">
      <video id="localVideo" autoplay muted playsinline></video>
      <div class="userNameTag">${userName}</div>
    </div>
    <div class="controls">
      <button id="toggleVideo">Turn Off Video</button>
      <button id="toggleAudio">Mute Mic</button>
      <button id="endMeeting">End Meeting</button>
    </div>
  `;
  document.querySelector('main').appendChild(container);

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
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
    }).catch(err => {
      alert('Could not access camera and microphone: ' + err.message);
      container.remove();
      document.querySelector('.hero').style.display = 'block';
    });
};

// Join Meeting By Code (local preview version)
document.getElementById('joinForm').onsubmit = async (e) => {
  e.preventDefault();
  const code = document.getElementById('joinMeetingCode').value.trim();
  const name = document.getElementById('joinName').value.trim();
  if (!code || !name) return alert('Meeting code and name required');
  document.querySelector('.hero').style.display = 'none';
  document.getElementById('meetingActions').classList.add('hidden');
  let container = document.createElement('div');
  container.id = 'videoMeetingContainer';
  container.innerHTML = `
    <h2>Meeting Room</h2>
    <p><strong>Meeting Code:</strong> <span id="meetingCode">${code}</span></p>
    <div class="video-wrapper">
      <video id="localVideo" autoplay muted playsinline></video>
      <div class="userNameTag">${name}</div>
    </div>
    <div class="controls">
      <button id="toggleVideo">Turn Off Video</button>
      <button id="toggleAudio">Mute Mic</button>
      <button id="endMeeting">End Meeting</button>
    </div>
  `;
  document.querySelector('main').appendChild(container);
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
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
    }).catch(err => {
      alert('Could not access camera and microphone: ' + err.message);
      container.remove();
      document.querySelector('.hero').style.display = 'block';
    });
};
