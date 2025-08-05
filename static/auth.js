document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const gotoSignup = document.getElementById('goto-signup');
  const gotoLogin = document.getElementById('goto-login');

  if (gotoSignup) gotoSignup.onclick = function(e) {
    e.preventDefault();
    loginForm.style.display = "none";
    signupForm.style.display = "block";
  };
  if (gotoLogin) gotoLogin.onclick = function(e) {
    e.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  };

  const fakeSignup = document.getElementById('fake-signup');
  if (fakeSignup) {
    fakeSignup.onclick = function() {
      const pwd = document.getElementById('signup-password').value;
      const conf = document.getElementById('signup-confirm').value;
      if (pwd !== conf) {
        alert("Passwords do not match!");
        return;
      }
      window.location.href = "/meeting";
    };
  }

  let mediaStream, audioTrack, videoTrack;
  const videoElem = document.getElementById('auth-video-preview');
  const micBtn = document.getElementById('toggle-mic');
  const micIcon = document.getElementById('mic-icon');
  const camBtn = document.getElementById('toggle-cam');
  const camIcon = document.getElementById('cam-icon');

  async function setupMediaPreview() {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoElem.srcObject = mediaStream;
      [videoTrack] = mediaStream.getVideoTracks();
      [audioTrack] = mediaStream.getAudioTracks();
      audioTrack.enabled = true;
      videoTrack.enabled = true;
    } catch {
      videoElem.poster = "";
      camIcon.textContent = '🚫'; micIcon.textContent = '🔇';
    }
  }
  if (micBtn) micBtn.onclick = function() {
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    micBtn.classList.toggle('active', !audioTrack.enabled);
    micIcon.textContent = audioTrack.enabled ? '🎤' : '🔇';
  };
  if (camBtn) camBtn.onclick = function() {
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    camBtn.classList.toggle('active', !videoTrack.enabled);
    camIcon.textContent = videoTrack.enabled ? '📹' : '🚫';
  };
  setupMediaPreview();
});

