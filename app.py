import os
import random
from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = 'c1d98056b273273a7d4c2e7be9d4788e1cba5c9b6f9a8faf8f5a96a17c20de31'

# Flask-Mail configuration with Gmail SMTP
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME='wavemeett@gmail.com',
    MAIL_PASSWORD='happy@123',  # Use App Password if 2FA enabled
    MAIL_DEFAULT_SENDER='wavemeett@gmail.com'
)

mail = Mail(app)

# Generate a random 6-digit code to send
def generate_confirmation_code():
    return f"{random.randint(100000, 999999)}"

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        user_email = request.form.get("email")
        if not user_email:
            flash("Please enter a valid email address.")
            return render_template("auth.html")

        # Generate and store confirmation code in session
        code = generate_confirmation_code()
        session['confirmation_code'] = code
        session['pending_auth'] = True
        session['user_email'] = user_email

        # Send email with confirmation code
        try:
            msg = Message(
                subject="Your Wave Meet Confirmation Code",
                recipients=[user_email],
                body=f"Your Wave Meet confirmation code is: {code}\n\nThis email is sent from wavemeett@gmail.com."
            )
            mail.send(msg)
        except Exception as e:
            print('Email send error:', e)
            flash("Failed to send confirmation email. Please try again later.")
            return render_template("auth.html")

        return redirect(url_for("confirm"))
    return render_template("auth.html")

@app.route("/confirm", methods=["GET", "POST"])
def confirm():
    if not session.get("pending_auth"):
        return redirect(url_for("home"))

    user_email = session.get('user_email', 'your email')

    error = None
    if request.method == "POST":
        entered_code = request.form.get("confirm_code")
        if entered_code == session.get('confirmation_code'):
            session.pop('pending_auth', None)
            session.pop('confirmation_code', None)
            session['authed'] = True
            flash("Confirmed successfully!")
            return redirect(url_for("meeting"))
        else:
            error = "Incorrect code. Please try again."

    return render_template("confirm.html", email=user_email, error=error)

@app.route("/meeting")
@app.route("/meeting/<meeting_id>")
def meeting(meeting_id=None):
    if not session.get('authed'):
        return redirect(url_for("home"))
    # Your existing meeting logic here…
    return render_template("meeting.html", meeting_id=meeting_id, scheduled_meetings=[])

# Your existing /create, /ai routes follow...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
