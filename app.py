import os
from flask import Flask, render_template_string

app = Flask(__name__)

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Wave Meet - Signup/Login</title>
<style>
  body {
    background: linear-gradient(135deg, #4f46e5, #7c3aed 65%, #1a1a1a 95%);
    min-height: 100vh;
    margin: 0;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    color: #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    min-height: 100vh;
  }
  .auth-card {
    background: #1a1a1a;
    border-radius: 1.25rem;
    box-shadow: 0 6px 48px 8px rgba(40,36,99,0.22);
    padding: 2rem 3rem 2rem 3rem;
    width: 350px;
    max-width: 95vw;
  }
  .auth-form {
    display: none;
    animation: fadeIn .55s cubic-bezier(.4,0,.2,1);
  }
  .auth-form.active { display: block; }
  .input-group { margin-bottom: 1.2rem; }
  .input-group input {
    background: #2a2a2a;
    color: #e5e5e5;
    border: none;
    outline: none;
    border-radius: 0.7rem;
    font-size: 1rem;
    padding: 0.85rem 1rem;
    width: 100%;
    margin-bottom: 0.1rem;
  }
  .input-group input:focus {
    box-shadow: 0 0 2px 2px #7c3aed85;
  }
  .btn {
    display: block;
    width: 100%;
    border: none;
    border-radius: 0.8rem;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 0.85rem 1.5rem;
    cursor: pointer;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: #fff;
    margin-bottom: 0.6rem;
  }
  .btn:hover { opacity: 0.93; box-shadow: 0 2px 12px 2px #7c3aed55; }
  .switch-text {
    font-size: 0.98rem;
    color: #e5e5e5b0;
    text-align: center;
  }
  .switch-text a {
    color: #7c3aed;
    text-decoration: underline;
    cursor: pointer;
  }
  .switch-text a:hover { color: #fff; }
  @keyframes fadeIn {
    0% {opacity: 0;transform: translateY(25px);}
    100% {opacity: 1;transform: translateY(0);}
  }
  .media-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.4rem;
  }
  #auth-video-preview {
    background: #222;
    width: 120px;
    height: 90px;
    border-radius: 0.7rem;
    object-fit: cover;
    box-shadow: 0 4px 20px 2px #7c3aed28;
    margin-bottom: 0.5rem;
  }
  .toggle-controls { display: flex; gap: 0.7rem; }
  .btn-toggle {
    height: 44px;
    width: 44px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, #444 0%, #4f46e5 100%);
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
    transition: background .2s;
    box-shadow: 0 2px 10px 0 #4f46e588;
  }
  .btn-toggle.active { background: #cf4444; }
  .btn-toggle:focus { outline: 2px solid #7c3aed; }
</style>
</head>
<body>
  <div class="auth-container">
    <div class="auth-card" id="auth-card">
      <div class="media-controls">
        <video id="auth-video-preview" autoplay playsinline muted></video>
        <div class="toggle-controls">
          <button id="toggle-mic" type="button" class="btn-toggle" aria-label="Toggle Microphone">
            <span id="mic-icon">🎤</span>
          </button>
          <button id="toggle-cam" type="button" class="btn-toggle" aria-label="Toggle Camera">
            <span id="cam-icon">📹</span>
          </button>
        </div>
      </div>
      <!-- Login Form -->
      <form id="login-form" class="auth-form active">
        <h2>Login to Wave Meet</h2>
        <div class="input-group">
          <input type="email" id="login-email" placeholder="Email" required />
        </div>
        <div class="input-group">
          <input type="password" id="login-password" placeholder="Password" required />
        </div>
        <button type="submit" class="btn btn--primary">Login</button>
        <p class="switch-text">
          Don't have an account?
          <a href="#" id="goto-signup">Sign up</a>
        </p>
      </form>
      <!-- Signup Form -->
      <form id="signup-form" class="auth-form">
        <h2>Create Your Account</h2>
        <div class="input-group">
          <input type="text" id="signup-username" placeholder="Username" required />
        </div>
        <div class="input-group">
          <input type="email" id="signup-email" placeholder="Email" required />
        </div>
        <div class="input-group">
          <input type="password" id="signup-password" placeholder="Password" required />
        </div>
        <div class="input-group">
          <input type="password" id="signup-confirm" placeholder="Confirm Password" required />
        </div>
        <button type="submit" class="btn btn--primary">Sign Up</button>
        <p class="switch-text">
          Already have an account?
          <a href="#" id="goto-login">Login</a>
        </p>
      </form>
    </div>
  </div>
<script>
  // Auth Form Toggling
  document.getElementById('goto-signup').onclick = function (e) {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
  };
  document.getElementById('goto-login').onclick = function (e) {
    e.preventDefault();
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
  };
  // Basic validation for demo
  document.getElementById('signup-form').onsubmit = function (e) {
    e.preventDefault();
    const pwd = document.getElementById('signup-password').value;
    const conf = document.getElementById('signup-confirm').value;
    if (pwd !== conf) {
      alert('Passwords do not match!');
      return;
    }
    alert('Account created! (Demo only)');
  };
  document.getElementById('login-form').onsubmit = function (e) {
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
      alert("Could not access camera or microphone.\\n\\nPlease allow permissions!");
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
</script>
</body>
</html>
'''

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
