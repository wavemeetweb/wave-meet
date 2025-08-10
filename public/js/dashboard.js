// Get current logged-in user from query param
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');

// --- Join by Meeting ID ---
document.getElementById('join-meeting-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const roomId = document.getElementById('join-room-id').value.trim();
  if(roomId) {
    window.location.href = `meeting.html?room=${roomId}&user=${encodeURIComponent(user)}`;
  } else {
    alert("Please enter a Meeting ID.");
  }
});

// --- Instant Meeting ---
document.getElementById('instant-meeting-btn').addEventListener('click', () => {
  const roomId = Math.random().toString(36).substring(2,8).toUpperCase();
  window.location.href = `meeting.html?room=${roomId}&user=${encodeURIComponent(user)}`;
});

// --- Schedule Meeting ---
document.getElementById('schedule-meeting-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = e.target.elements['title'].value.trim();
  const datetime = e.target.elements['datetime'].value;
  if(!title || !datetime) {
    alert("Please fill in all fields.");
    return;
  }
  let res = await fetch('/schedule-meeting', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, datetime })
  });
  let data = await res.json();
  if(data.success) {
    loadScheduledMeetings();
    e.target.reset();
  } else {
    alert(data.error || "Error scheduling meeting");
  }
});

// --- Load Scheduled Meetings ---
async function loadScheduledMeetings() {
  let res = await fetch('/scheduled-meetings');
  let meetings = await res.json();
  const container = document.getElementById('scheduled-meetings-container');
  container.innerHTML = '';
  if(meetings.length === 0) {
    container.innerHTML = '<p>No scheduled meetings yet.</p>';
  }
  meetings.forEach(m => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${m.title}</strong><br>
      ${new Date(m.datetime).toLocaleString()}<br>
      <a href="meeting.html?room=${m.roomId}&user=${encodeURIComponent(user)}">Join</a><hr>`;
    container.appendChild(div);
  });
}

// Initial load
loadScheduledMeetings();
