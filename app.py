from flask import Flask, render_template, request, jsonify, session
from flask_socketio import SocketIO, emit, join_room, leave_room
import random
import string
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'wave-meet-secret-key-2025')
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=60, ping_interval=25)

# Store active meetings in memory
meetings = {}
scheduled_meetings = []

def generate_meeting_code():
    """Generate a unique 8-character meeting code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create-meeting', methods=['POST'])
def create_meeting():
    data = request.json
    host_name = data.get('host_name', 'Anonymous')
    
    meeting_code = generate_meeting_code()
    while meeting_code in meetings:
        meeting_code = generate_meeting_code()
    
    meetings[meeting_code] = {
        'host': host_name,
        'participants': [],
        'created_at': datetime.now().isoformat(),
        'max_participants': 200
    }
    
    return jsonify({
        'success': True,
        'meeting_code': meeting_code,
        'host_name': host_name
    })

@app.route('/schedule-meeting', methods=['POST'])
def schedule_meeting():
    data = request.json
    meeting_info = {
        'id': len(scheduled_meetings) + 1,
        'title': data.get('title'),
        'host_name': data.get('host_name'),
        'date': data.get('date'),
        'time': data.get('time'),
        'meeting_code': generate_meeting_code(),
        'created_at': datetime.now().isoformat()
    }
    scheduled_meetings.append(meeting_info)
    
    return jsonify({
        'success': True,
        'meeting': meeting_info
    })

@app.route('/join-meeting', methods=['POST'])
def join_meeting():
    data = request.json
    meeting_code = data.get('meeting_code', '').upper()
    participant_name = data.get('participant_name', 'Anonymous')
    
    if meeting_code not in meetings:
        return jsonify({
            'success': False,
            'error': 'Meeting not found'
        })
    
    meeting = meetings[meeting_code]
    
    if len(meeting['participants']) >= meeting['max_participants']:
        return jsonify({
            'success': False,
            'error': 'Meeting is full (200 participants max)'
        })
    
    return jsonify({
        'success': True,
        'meeting_code': meeting_code,
        'host': meeting['host'],
        'participant_count': len(meeting['participants'])
    })

@app.route('/meeting/<meeting_code>')
def meeting_room(meeting_code):
    meeting_code = meeting_code.upper()
    if meeting_code not in meetings:
        return "Meeting not found", 404
    return render_template('meeting.html', meeting_code=meeting_code)

@socketio.on('join')
def on_join(data):
    meeting_code = data['meeting_code']
    participant_name = data['participant_name']
    
    if meeting_code in meetings:
        meeting = meetings[meeting_code]
        
        if len(meeting['participants']) < meeting['max_participants']:
            participant_id = request.sid
            participant_info = {
                'id': participant_id,
                'name': participant_name,
                'joined_at': datetime.now().isoformat()
            }
            
            meeting['participants'].append(participant_info)
            join_room(meeting_code)
            
            emit('user-joined', {
                'participant_id': participant_id,
                'participant_name': participant_name,
                'participant_count': len(meeting['participants'])
            }, room=meeting_code)
            
            emit('existing-users', {
                'participants': meeting['participants']
            })

@socketio.on('signal')
def on_signal(data):
    meeting_code = data['meeting_code']
    emit('signal', data, room=data['to'], include_self=False)

@socketio.on('leave')
def on_leave(data):
    meeting_code = data['meeting_code']
    participant_id = request.sid
    
    if meeting_code in meetings:
        meeting = meetings[meeting_code]
        meeting['participants'] = [p for p in meeting['participants'] if p['id'] != participant_id]
        
        leave_room(meeting_code)
        
        emit('user-left', {
            'participant_id': participant_id,
            'participant_count': len(meeting['participants'])
        }, room=meeting_code)
        
        # Delete meeting if empty
        if len(meeting['participants']) == 0:
            del meetings[meeting_code]

@socketio.on('disconnect')
def on_disconnect():
    # Remove user from all meetings
    participant_id = request.sid
    for meeting_code, meeting in list(meetings.items()):
        if any(p['id'] == participant_id for p in meeting['participants']):
            meeting['participants'] = [p for p in meeting['participants'] if p['id'] != participant_id]
            emit('user-left', {
                'participant_id': participant_id,
                'participant_count': len(meeting['participants'])
            }, room=meeting_code)
            
            if len(meeting['participants']) == 0:
                del meetings[meeting_code]

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
