"""
SMS Service using Twilio
Sends text messages to patients
"""
import os
from typing import Optional
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

class SMSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_PHONE_NUMBER")

        if not all([self.account_sid, self.auth_token, self.from_number]):
            raise ValueError("Twilio credentials not properly configured in .env file")

        self.client = Client(self.account_sid, self.auth_token)

    def send_sms(
        self,
        to_number: str,
        message: str,
        media_url: Optional[str] = None
    ) -> dict:
        """
        Send an SMS message via Twilio

        Args:
            to_number: Recipient phone number (E.164 format, e.g., +15551234567)
            message: Text message to send
            media_url: Optional URL for MMS media (image, PDF, etc.)

        Returns:
            dict with status and message SID
        """
        try:
            # Format phone number to E.164 if not already
            if not to_number.startswith('+'):
                # Assume US number if no country code
                to_number = f'+1{to_number.replace("-", "").replace(" ", "")}'

            # Prepare message parameters
            message_params = {
                'body': message,
                'from_': self.from_number,
                'to': to_number
            }

            # Add media URL if provided
            if media_url:
                message_params['media_url'] = [media_url]

            # Send message
            twilio_message = self.client.messages.create(**message_params)

            return {
                'success': True,
                'message_sid': twilio_message.sid,
                'status': twilio_message.status,
                'to': to_number,
                'from': self.from_number
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'to': to_number
            }

    def send_copay_card(self, to_number: str, patient_name: str, copay_url: str) -> dict:
        """
        Send a copay assistance card link to patient
        """
        message = f"""Hi {patient_name},

Here's your copay assistance card: {copay_url}

Show this to your pharmacy to receive your discount. Questions? Reply to this message.

- Your Healthcare Team"""

        return self.send_sms(to_number, message)

    def send_prescription_reminder(self, to_number: str, patient_name: str, medication: str) -> dict:
        """
        Send prescription refill reminder
        """
        message = f"""Hi {patient_name},

This is a reminder to refill your {medication} prescription.

Reply YES to authorize refill or call us at {self.from_number}.

- Your Healthcare Team"""

        return self.send_sms(to_number, message)

    def send_appointment_confirmation(
        self,
        to_number: str,
        patient_name: str,
        appointment_date: str,
        appointment_time: str
    ) -> dict:
        """
        Send appointment confirmation
        """
        message = f"""Hi {patient_name},

Your appointment is confirmed:
📅 {appointment_date}
⏰ {appointment_time}

Reply CONFIRM or call {self.from_number} to make changes.

- Your Healthcare Team"""

        return self.send_sms(to_number, message)

    def send_prior_auth_update(self, to_number: str, patient_name: str, status: str) -> dict:
        """
        Send prior authorization status update
        """
        if status.lower() == 'approved':
            emoji = '✅'
            message_text = 'Your prior authorization has been approved! You can now pick up your medication.'
        elif status.lower() == 'pending':
            emoji = '⏳'
            message_text = 'Your prior authorization is still pending. We will update you within 48 hours.'
        else:
            emoji = '❌'
            message_text = 'Your prior authorization was denied. Please call us to discuss alternative options.'

        message = f"""Hi {patient_name},

{emoji} {message_text}

Questions? Call {self.from_number}

- Your Healthcare Team"""

        return self.send_sms(to_number, message)


# Singleton instance
sms_service = SMSService()
