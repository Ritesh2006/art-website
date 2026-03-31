import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def test_gmail_connection():
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465")) # Test with SSL
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    print(f"--- Attempting to connect to {smtp_server}:{smtp_port} ---")
    print(f"User: {smtp_user}")
    
    msg = MIMEMultipart()
    msg["Subject"] = "STILL WORKING - Mail System Test"
    msg["From"] = smtp_user
    msg["To"] = smtp_user
    msg.attach(MIMEText("This is a diagnostic test to confirm your SMTP settings are correct.", "plain"))

    try:
        # Try SSL connection
        with smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=10) as server:
            print("Connected to server. Logging in...")
            server.login(smtp_user, smtp_pass)
            print("Login successful! Sending test email...")
            server.send_message(msg)
            print("--- SUCCESS: Email sent successfully! ---")
            return True
    except smtplib.SMTPAuthenticationError:
        print("--- ERROR: Authentication failed. Please check your Gmail 'App Password'. ---")
    except Exception as e:
        print(f"--- ERROR: {str(e)} ---")
    return False

if __name__ == "__main__":
    test_gmail_connection()
