from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit, join_room
import eventlet

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return send_from_directory('static', 'client.html')

@app.route('/<path:path>')
def static_file(path):
    return send_from_directory('static', path)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    emit('user-joined', data, to=room)

@socketio.on('signal')
def handle_signal(data):
    room = data['room']
    emit('signal', data, to=room)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
