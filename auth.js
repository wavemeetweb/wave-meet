// Auth Form Toggling
document.getElementById('goto-signup').onclick = function(e) {
  e.preventDefault();
  document.getElementById('login-form').classList.remove('active');
  document.getElementById('signup-form').classList.add('active');
};
document.getElementById('goto-login').onclick = function(e) {
  e.preventDefault();
  document.getElementById('signup-form').classList.remove('active');
  document.getElementById('login-form').classList.add('active');
};
// Basic validation for demo
document.getElementById('signup-form').onsubmit = function(e) {
  e.preventDefault();
  const pwd = document.getElementById('signup-password').value;
  const conf = document.getElementById('signup-confirm').value;
  if (pwd !== conf) {
    alert('Passwords do not match!');
    return;
  }
  alert('Account created! (Demo only)');
};
document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  alert('Logged in! (Demo only)');
};
// Microphone + Video controls
let mediaStream;
let audioTrack, videoTrack;
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
  } catch (err) {
    videoElem.poster = "";
    alert("Could not access camera or microphone.\n\nPlease allow permissions!");
  }
}
micBtn.onclick = () => {
  if (!audioTrack) return;
  audioTrack.enabled = !audioTrack.enabled;
  micBtn.classList.toggle('active', !audioTrack.enabled);
  micIcon.textContent = audioTrack.enabled ? '🎤' : '🔇';
};
camBtn.onclick = () => {
  if (!videoTrack) return;
  videoTrack.enabled = !videoTrack.enabled;
  camBtn.classList.toggle('active', !videoTrack.enabled);
  camIcon.textContent = videoTrack.enabled ? '📹' : '🚫';
};
window.addEventListener('DOMContentLoaded', setupMediaPreview);
