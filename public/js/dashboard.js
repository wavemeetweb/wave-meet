const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');

document.getElementById('instant-meeting-btn').addEventListener('click', () => {
  const roomId = Math.random().toString(36).substring(2,8).toUpperCase();
  window.location.href = `meeting.html?room=${roomId}&user=${encodeURIComponent(user)}`;
});

document.getElementById('schedule-meeting-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = e.target.elements['title'].value.trim();
  const datetime = e.target.elements['datetime'].value;
  let res = await fetch('/schedule-meeting', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, datetime })
  });
  let data = await res.json();
  if(data.success){
    loadScheduledMeetings();
  }
});

async function loadScheduledMeetings() {
  let res = await fetch('/scheduled-meetings');
  let meetings = await res.json();
  const container = document.getElementById('scheduled-meetings-container');
  container.innerHTML = '';
  meetings.forEach(m => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${m.title}</strong><br>
      ${new Date(m.datetime).toLocaleString()}<br>
      <a href="meeting.html?room=${m.roomId}&user=${encodeURIComponent(user)}">Join</a>
      <hr>`;
    container.appendChild(div);
  });
}

loadScheduledMeetings();

