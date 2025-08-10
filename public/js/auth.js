document.getElementById('login-btn').addEventListener('click', async () => {
  const user = document.getElementById('login-username').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const msg = document.getElementById('auth-message');

  let res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username:user, password:pass })
  });
  let data = await res.json();
  if(res.ok){
    window.location.href = `dashboard.html?user=${encodeURIComponent(user)}`;
  } else {
    msg.textContent = data.error;
  }
});

document.getElementById('signup-btn').addEventListener('click', async () => {
  const user = document.getElementById('signup-username').value.trim();
  const pass = document.getElementById('signup-password').value.trim();
  const msg = document.getElementById('auth-message');

  let res = await fetch('/signup', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ username:user, password:pass })
  });
  let data = await res.json();
  msg.textContent = res.ok ? "Signup successful! Please login." : data.error;
});
