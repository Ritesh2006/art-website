import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_pass = os.getenv("SMTP_PASSWORD")
        self.from_display_name = "Ritesh Rakshit Art"

    def _send_email(self, to_email: str, subject: str, html_content: str, text_content: str):
        if not all([self.smtp_user, self.smtp_pass]):
            print(f"Skipping email to {to_email}: SMTP credentials missing.")
            return

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{self.from_display_name} <{self.smtp_user}>"
        msg["To"] = to_email

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        try:
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
            print(f"Email sent successfully to {to_email}")
        except Exception as e:
            print(f"Failed to send email to {to_email}: {str(e)}")

    def send_order_confirmation(self, to_email: str, order_id: str, name: str, total: float):
        subject = f"Order Confirmed! - #{order_id}"
        html = f"""
        <html>
            <body style="font-family: 'Georgia', serif; color: #1c2833; background-color: #fdfbf7; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #f3ebe1;">
                    <h1 style="color: #c0392b; border-bottom: 1px solid #f5b041; padding-bottom: 10px;">Order Confirmed</h1>
                    <p>Dear {name},</p>
                    <p>Thank you for choosing original art. Your order <strong>#{order_id}</strong> is being processed.</p>
                    <div style="background: #fafafa; padding: 20px; margin: 20px 0; border-left: 4px solid #f5b041;">
                        <p><strong>Total:</strong> ₹{total:,.2f}</p>
                        <p><strong>Status:</strong> Confirmed</p>
                    </div>
                    <p>Ritesh will contact you shortly regarding the shipping details.</p>
                    <br/>
                    <p style="font-style: italic; color: #566573;">Warm regards,<br/>Ritesh Rakshit Studio</p>
                </div>
            </body>
        </html>
        """
        text = f"Hello {name},\n\nYour order #{order_id} has been confirmed for ₹{total:,.2f}. Ritesh will contact you shortly."
        self._send_email(to_email, subject, html, text)

    def send_welcome_email(self, to_email: str, name: str):
        subject = "Welcome to the Studio of Ritesh Rakshit"
        html = f"""
        <html>
            <body style="font-family: 'Georgia', serif; color: #1c2833; background-color: #fdfbf7; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #f3ebe1;">
                    <h1 style="color: #1c2833; border-bottom: 1px solid #f5b041; padding-bottom: 10px;">Welcome, {name}</h1>
                    <p>Thank you for joining our community of collectors and art lovers.</p>
                    <p>You now have access to exclusive previews of new collections and behind-the-scenes insights into Ritesh's creative process.</p>
                    <p>Feel free to explore our current gallery or reach out for a custom commission.</p>
                    <br/>
                    <p style="font-style: italic; color: #566573;">With gratitude,<br/>Ritesh Rakshit</p>
                </div>
            </body>
        </html>
        """
        text = f"Welcome {name},\n\nThank you for joining Ritesh Rakshit Art. We're thrilled to have you."
        self._send_email(to_email, subject, html, text)

    def send_newsletter_confirmation(self, to_email: str):
        subject = "Subscription Confirmed - Ritesh Rakshit Art"
        html = f"""
        <html>
            <body style="font-family: 'Georgia', serif; color: #1c2833; background-color: #fdfbf7; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #f3ebe1;">
                    <h2 style="color: #f5b041;">You're on the list!</h2>
                    <p>Thank you for subscribing to our newsletter. We'll keep you updated with the latest artworks and upcoming exhibitions.</p>
                    <p>Prepare to see art deeply.</p>
                    <br/>
                    <p style="font-style: italic; color: #566573;">Warm regards,<br/>Ritesh Rakshit Art Gallery</p>
                </div>
            </body>
        </html>
        """
        text = "Hello,\n\nThank you for subscribing to Ritesh Rakshit Art's newsletter."
        self._send_email(to_email, subject, html, text)

    def send_status_update(self, to_email: str, order_id: str, name: str, new_status: str):
        subject = f"Order #{order_id} Status Update: {new_status.capitalize()}"
        
        # Customize message based on status
        status_messages = {
            "processing": "We are currently preparing your masterpiece for its journey.",
            "shipped": "Exciting news! Your artwork has been carefully packed and is now on its way to you.",
            "delivered": "Your artwork should have arrived! We hope it brings a new dimension of beauty to your space.",
            "cancelled": "Your order has been cancelled. If you have any questions, please contact the studio."
        }
        
        status_msg = status_messages.get(new_status.lower(), f"Your order status has been updated to: {new_status.capitalize()}.")
        
        html = f"""
        <html>
            <body style="font-family: 'Georgia', serif; color: #1c2833; background-color: #fdfbf7; padding: 40px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #f3ebe1;">
                    <h1 style="color: #c9a84c; border-bottom: 1px solid #f5b041; padding-bottom: 10px;">Order Update</h1>
                    <p>Dear {name},</p>
                    <p>We are writing to inform you of an update regarding your order <strong>#{order_id}</strong>.</p>
                    <div style="background: #fafafa; padding: 25px; margin: 25px 0; border-left: 4px solid #c9a84c;">
                        <p style="font-size: 1.1rem; color: #1c2833;">Current Status: <strong style="color: #c0392b;">{new_status.capitalize()}</strong></p>
                        <p style="color: #566573; line-height: 1.6;">{status_msg}</p>
                    </div>
                    <p>You can track your order live on your <a href="http://localhost:5173/dashboard" style="color: #c9a84c; text-decoration: none; font-weight: 600;">Personal Dashboard</a>.</p>
                    <br/>
                    <p style="font-style: italic; color: #566573;">Warm regards,<br/>Ritesh Rakshit Studio</p>
                </div>
            </body>
        </html>
        """
        text = f"Hello {name},\n\nYour order #{order_id} status has been updated to {new_status.capitalize()}.\n\n{status_msg}\n\nView details: http://localhost:5173/dashboard"
        self._send_email(to_email, subject, html, text)
