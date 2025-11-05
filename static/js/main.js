// Modal functions
function showScheduleModal() {
    document.getElementById('scheduleModal').style.display = 'block';
}

function showCreateModal() {
    document.getElementById('createModal').style.display = 'block';
}

function showJoinModal() {
    document.getElementById('joinModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Clear forms
    document.querySelectorAll('form').forEach(form => form.reset());
    // Hide result boxes
    document.querySelectorAll('.result-box').forEach(box => box.style.display = 'none');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Schedule Meeting Form
document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('schedule-title').value;
    const hostName = document.getElementById('schedule-host').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    
    try {
        const response = await fetch('/schedule-meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                host_name: hostName,
                date: date,
                time: time
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const resultBox = document.getElementById('scheduleResult');
            resultBox.className = 'result-box success';
            resultBox.innerHTML = `
                <h3>✅ Meeting Scheduled!</h3>
                <p><strong>Title:</strong> ${data.meeting.title}</p>
                <p><strong>Date:</strong> ${data.meeting.date} at ${data.meeting.time}</p>
                <p><strong>Meeting Code:</strong></p>
                <div class="meeting-code-display">${data.meeting.meeting_code}</div>
                <p style="margin-top: 15px;">Share this code with participants to join the meeting.</p>
            `;
            resultBox.style.display = 'block';
            document.getElementById('scheduleForm').reset();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to schedule meeting. Please try again.');
    }
});

// Create Meeting Form
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const hostName = document.getElementById('host-name').value;
    
    try {
        const response = await fetch('/create-meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                host_name: hostName
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const resultBox = document.getElementById('createResult');
            resultBox.className = 'result-box success';
            resultBox.innerHTML = `
                <h3>✅ Meeting Created!</h3>
                <p><strong>Host:</strong> ${data.host_name}</p>
                <p><strong>Meeting Code:</strong></p>
                <div class="meeting-code-display">${data.meeting_code}</div>
                <p style="margin-top: 15px;">Share this code with participants.</p>
                <button class="btn btn-success btn-block" onclick="joinMeeting('${data.meeting_code}', '${hostName}')">
                    Start Meeting
                </button>
            `;
            resultBox.style.display = 'block';
            document.getElementById('createForm').reset();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create meeting. Please try again.');
    }
});

// Join Meeting Form
document.getElementById('joinForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const meetingCode = document.getElementById('meeting-code').value.toUpperCase();
    const participantName = document.getElementById('participant-name').value;
    
    try {
        const response = await fetch('/join-meeting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meeting_code: meetingCode,
                participant_name: participantName
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            sessionStorage.setItem('participantName', participantName);
            window.location.href = `/meeting/${meetingCode}`;
        } else {
            const resultBox = document.getElementById('joinResult');
            resultBox.className = 'result-box error';
            resultBox.innerHTML = `<h3>❌ ${data.error}</h3>`;
            resultBox.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to join meeting. Please try again.');
    }
});

function joinMeeting(meetingCode, participantName) {
    sessionStorage.setItem('participantName', participantName);
    window.location.href = `/meeting/${meetingCode}`;
}
