import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import sys

# Load .env from parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def test_smtp():
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    print("--- SMTP Configuration Test ---")
    print(f"Server: {smtp_server}")
    print(f"Port: {smtp_port}")
    print(f"User: {smtp_user}")
    
    if not smtp_user or not smtp_pass or "your_email" in smtp_user:
        print("\nERROR: You haven't updated your .env file with actual credentials yet!")
        print("Please edit backend/.env and add your Gmail address and App Password.")
        sys.exit(1)

    msg = EmailMessage()
    msg.set_content("Congratulations! Your Ritesh Rakshit Art Gallery email server is working perfectly.")
    msg['Subject'] = "SMTP Connection Test Success"
    msg['From'] = smtp_user
    msg['To'] = smtp_user # Send to yourself

    try:
        print("\nAttempting to connect...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.set_debuglevel(1)
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        print("\nSUCCESS! Test email sent to yourself.")
    except Exception as e:
        print(f"\nFAILED to send email: {e}")
        print("\nTroubleshooting Tips:")
        print("1. Ensure 2-Step Verification is ON in your Google Account.")
        print("2. Ensure you are using a 16-digit 'App Password', not your regular login password.")
        print("3. Check backend/.env for any typos.")

if __name__ == "__main__":
    test_smtp()
