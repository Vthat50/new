# ElevenLabs SMS Integration Setup Guide

This guide shows you how to configure ElevenLabs voice agents to send text messages using Server Tools and Twilio.

## Prerequisites

1. **Twilio Account** - Sign up at https://www.twilio.com
2. **ElevenLabs Account** - Voice agent already configured
3. **Backend Server** - Running on a publicly accessible URL (use ngrok for development)

---

## Step 1: Get Twilio Credentials

1. Go to https://console.twilio.com
2. Copy your **Account SID** and **Auth Token**
3. Purchase a phone number or use an existing Twilio number
4. Update `/backend/.env`:

```bash
TWILIO_ACCOUNT_SID=AC...your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number
```

---

## Step 2: Install Dependencies

```bash
cd /Users/varsha/Documents/new/backend
pip install twilio python-dotenv
```

---

## Step 3: Expose Your Backend (Development)

If running locally, you need to expose your backend to the internet for ElevenLabs to reach it.

### Using ngrok:

```bash
# Install ngrok from https://ngrok.com
ngrok http 8000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

---

## Step 4: Configure ElevenLabs Server Tools

1. Go to https://elevenlabs.io/app/conversational-ai
2. Select your voice agent
3. Click **"Server Tools"** or **"Custom Tools"**
4. Add a new tool:

### Tool Configuration for "Send SMS"

**Name:** `send_sms`

**Description:**
```
Sends a text message to the patient's phone number. Use this when the patient requests information via text, wants a reminder, or needs documentation sent to their phone.
```

**Webhook URL:**
```
https://your-ngrok-url.ngrok.io/api/sms/send
```
(Replace with your actual backend URL)

**HTTP Method:** `POST`

**Request Body (JSON Schema):**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "The patient's phone number in E.164 format (e.g., +15551234567)"
    },
    "message": {
      "type": "string",
      "description": "The text message to send to the patient"
    },
    "patient_name": {
      "type": "string",
      "description": "The patient's name for personalization (optional)"
    }
  },
  "required": ["phone_number", "message"]
}
```

---

### Tool Configuration for "Send Copay Card"

**Name:** `send_copay_card`

**Description:**
```
Sends a copay assistance card link to the patient via text message. Use this when the patient needs financial assistance or asks about copay programs.
```

**Webhook URL:**
```
https://your-ngrok-url.ngrok.io/api/sms/send-copay-card
```

**HTTP Method:** `POST`

**Request Body (JSON Schema):**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "The patient's phone number"
    },
    "patient_name": {
      "type": "string",
      "description": "The patient's name"
    },
    "copay_url": {
      "type": "string",
      "description": "URL to the digital copay card (default: https://copay.example.com/card)"
    }
  },
  "required": ["phone_number", "patient_name", "copay_url"]
}
```

---

### Tool Configuration for "Send Prior Auth Update"

**Name:** `send_prior_auth_update`

**Description:**
```
Sends a prior authorization status update to the patient. Use when the patient asks about their prior auth status.
```

**Webhook URL:**
```
https://your-ngrok-url.ngrok.io/api/sms/send-prior-auth-update
```

**HTTP Method:** `POST`

**Request Body (JSON Schema):**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "The patient's phone number"
    },
    "patient_name": {
      "type": "string",
      "description": "The patient's name"
    },
    "status": {
      "type": "string",
      "enum": ["approved", "denied", "pending"],
      "description": "Status of the prior authorization"
    }
  },
  "required": ["phone_number", "patient_name", "status"]
}
```

---

## Step 5: Update Your System Prompt

Add this to your ElevenLabs agent system prompt to enable SMS functionality:

```
IMPORTANT SMS CAPABILITIES:
- You CAN send text messages to patients using the send_sms tool
- When a patient asks to receive information via text, use send_sms
- Always confirm the phone number before sending
- Extract the caller's phone number from the conversation context

WHEN TO USE SMS:
1. Patient says "Can you text me that information?"
2. Patient requests copay card: use send_copay_card tool
3. Patient asks for prior auth updates: use send_prior_auth_update tool
4. Patient needs appointment confirmation
5. Patient wants prescription reminders

EXAMPLE CONVERSATIONS:

Patient: "Can you text me the copay card?"
Agent: "Of course! I'll send your copay assistance card to your phone right now."
→ Calls send_copay_card with patient's phone number

Patient: "Send me a reminder about my appointment"
Agent: "I'll text you the appointment details right away."
→ Calls send_sms with appointment information

PHONE NUMBER HANDLING:
- The caller's phone number is available in the call metadata
- Always format as E.164: +1 followed by 10 digits
- Confirm number: "I'll send that to [phone number], is that correct?"
```

---

## Step 6: Test the Integration

### Test SMS Endpoint Directly:

```bash
curl -X POST http://localhost:8000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+15551234567",
    "message": "Test message from your healthcare team!"
  }'
```

### Test Copay Card:

```bash
curl -X POST http://localhost:8000/api/sms/send-copay-card \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+15551234567",
    "patient_name": "John Doe",
    "copay_url": "https://copay.example.com/card/123"
  }'
```

---

## Step 7: Accessing Caller Phone Number in ElevenLabs

The caller's phone number is automatically available in ElevenLabs conversation metadata. Configure your system prompt to extract it:

```
CALLER INFORMATION:
- Use the phone number from call metadata as the default recipient
- Format: caller_phone_number (available in conversation context)
- Always confirm before sending: "I'll send that to [phone number]"
```

In your webhook, you can also receive the caller's number from ElevenLabs if you configure the tool to pass it.

---

## Production Deployment

### For Production (not ngrok):

1. Deploy backend to a cloud provider (AWS, GCP, Heroku, etc.)
2. Get a permanent domain/URL
3. Update ElevenLabs webhook URLs to point to production
4. Set up proper environment variables in production

### Example Production URLs:
```
https://api.yourdomain.com/api/sms/send
https://api.yourdomain.com/api/sms/send-copay-card
https://api.yourdomain.com/api/sms/send-prior-auth-update
```

---

## Available SMS Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/sms/send` | Send generic SMS |
| `POST /api/sms/send-copay-card` | Send copay card link |
| `POST /api/sms/send-prescription-reminder` | Send Rx reminder |
| `POST /api/sms/send-prior-auth-update` | Send PA status |
| `POST /api/sms/send-appointment-confirmation` | Send appointment details |

---

## Troubleshooting

### SMS Not Sending

1. **Check Twilio Credentials:** Verify `.env` file has correct credentials
2. **Check Phone Number Format:** Must be E.164 format (+15551234567)
3. **Check Twilio Balance:** Ensure account has credits
4. **Check Webhook URL:** Must be publicly accessible (ngrok or production)
5. **Check Logs:** Look at backend logs for error messages

### ElevenLabs Not Calling Webhook

1. **Verify URL is accessible:** Test with curl or Postman
2. **Check Server Tool configuration:** Ensure JSON schema matches
3. **Check System Prompt:** Agent needs instructions to use the tool
4. **Check CORS:** Backend must allow requests from ElevenLabs

---

## Cost Estimates

- **Twilio SMS:** ~$0.0075 per SMS (US)
- **Twilio MMS:** ~$0.02 per MMS (images/PDFs)
- **ElevenLabs:** Based on your plan

---

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Implement rate limiting on SMS endpoints**
4. **Validate phone numbers before sending**
5. **Log all SMS sends for audit purposes**
6. **Add authentication to webhook endpoints in production**

---

## Next Steps

1. ✅ Configure Twilio credentials
2. ✅ Install dependencies
3. ✅ Expose backend with ngrok
4. ✅ Add Server Tools in ElevenLabs
5. ✅ Update system prompt
6. ✅ Test with a real call

**You're all set!** Your ElevenLabs voice agent can now send text messages! 🎉
