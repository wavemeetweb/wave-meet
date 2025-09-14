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

document.getElementById('joinMeetingBtn').onclick = () => {
  document.getElementById('meetingActions').classList.remove('hidden');
};

document.getElementById('createMeetingBtn').onclick = () => {
  alert('Create meeting: feature stub');
};
document.getElementById('scheduleMeetingBtn').onclick = () => {
  alert('Schedule meeting: feature stub');
};

// You should connect OAuth2 buttons to your backend for real OAuth2 login
