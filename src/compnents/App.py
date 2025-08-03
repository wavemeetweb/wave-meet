from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

@app.route('/')
def home():
    return jsonify({"message": "Zoom Clone API"})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    # Add your signup logic here
    return jsonify({"status": "success", "message": "User created"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # Add your login logic here
    return jsonify({"status": "success", "token": "sample_token"})

@app.route('/api/create-meeting', methods=['POST'])
def create_meeting():
    data = request.get_json()
    # Add meeting creation logic here
    meeting_url = f"https://yourdomain.com/meeting/{data.get('topic', 'default')}"
    return jsonify({"meeting_url": meeting_url, "status": "created"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
