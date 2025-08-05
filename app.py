import os
from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

# In-memory scheduled meetings demo list
scheduled_meetings = [
    {'title': 'Friday Team Sync', 'id': 'abc123'},
    {'title': 'Client Demo', 'id': 'xyz789'},
]

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        # Placeholder: accept all login attempts and redirect to meeting page
        return redirect(url_for("meeting"))
    return render_template("auth.html")

@app.route("/create")
def create():
    import random, string
    meeting_id = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
    scheduled_meetings.append({'title': f'New Meeting ({meeting_id})', 'id': meeting_id})
    return redirect(url_for("meeting", meeting_id=meeting_id))

@app.route("/meeting")
@app.route("/meeting/<meeting_id>")
def meeting(meeting_id=None):
    return render_template("meeting.html", meeting_id=meeting_id, scheduled_meetings=scheduled_meetings)

@app.route("/ai")
def ai():
    return '''
    <html>
    <head>
      <title>AI Assistant</title>
      <style>
        body { background: #181732; color: white; font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
        a { color: #7c3aed; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Welcome to AI Assistant</h1>
      <p>Click below to chat with the AI assistant:</p>
      <p><a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">Go to ChatGPT</a></p>
      <p><a href="/meeting">Back to Meeting</a></p>
    </body>
    </html>
    '''

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
