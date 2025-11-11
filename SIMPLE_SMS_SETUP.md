# Simple SMS Setup (No Backend Required!)

This guide shows you how to enable SMS functionality for your ElevenLabs voice agent using **Vercel Serverless Functions** - no separate backend server needed! Everything deploys with your frontend.

---

## 🎯 What You Get

When someone calls your ElevenLabs agent and says:
- **"Can you text me my copay card?"** → They receive an SMS with the copay link
- **"Send me a text about my prior authorization"** → They get a PA status update
- **"Text me that information"** → Any message can be sent via SMS

---

## ⚡ Quick Setup (5 Steps)

### Step 1: Get Twilio Credentials

1. Sign up at https://www.twilio.com (free trial available)
2. Go to **Console Dashboard**
3. Copy these 3 values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
   - **Phone Number** (format: +15551234567)

### Step 2: Install Dependencies

```bash
cd /Users/varsha/Documents/new/frontend
npm install twilio @vercel/node
```

### Step 3: Deploy to Vercel

1. Install Vercel CLI (if you haven't):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your frontend:
   ```bash
   vercel
   ```

4. Follow the prompts - it will deploy everything including the SMS functions!

### Step 4: Add Twilio Secrets to Vercel

After deployment, add your Twilio credentials as environment variables:

```bash
vercel env add TWILIO_ACCOUNT_SID
# Paste your Account SID when prompted

vercel env add TWILIO_AUTH_TOKEN
# Paste your Auth Token when prompted

vercel env add TWILIO_PHONE_NUMBER
# Paste your Twilio number like +15551234567
```

Or add them in the Vercel dashboard:
1. Go to your project on https://vercel.com
2. Click **Settings** → **Environment Variables**
3. Add all three variables

### Step 5: Configure ElevenLabs

Your Vercel deployment gives you URLs like:
```
https://your-app.vercel.app/api/send-sms
https://your-app.vercel.app/api/send-copay-card
https://your-app.vercel.app/api/send-prior-auth-update
```

Add these to ElevenLabs:

1. Go to https://elevenlabs.io/app/conversational-ai
2. Select your agent
3. Click **"Server Tools"** or **"Tools"**
4. Add a new tool for each endpoint

---

## 📋 ElevenLabs Tool Configuration

### Tool 1: Send SMS

**Name:** `send_sms`

**Description:**
```
Sends a text message to the patient's phone number. Use when the patient requests information via text.
```

**URL:**
```
https://your-app.vercel.app/api/send-sms
```

**Method:** `POST`

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "Patient phone number (e.g., +15551234567 or 5551234567)"
    },
    "message": {
      "type": "string",
      "description": "The text message to send"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name (optional)"
    }
  },
  "required": ["phone_number", "message"]
}
```

---

### Tool 2: Send Copay Card

**Name:** `send_copay_card`

**Description:**
```
Sends copay assistance card link via SMS. Use when patient needs financial assistance.
```

**URL:**
```
https://your-app.vercel.app/api/send-copay-card
```

**Method:** `POST`

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "Patient phone number"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name"
    },
    "copay_url": {
      "type": "string",
      "description": "Copay card URL (optional, defaults to https://copay.lillycares.com/card)"
    }
  },
  "required": ["phone_number", "patient_name"]
}
```

---

### Tool 3: Send Prior Auth Update

**Name:** `send_prior_auth_update`

**Description:**
```
Sends prior authorization status update via SMS.
```

**URL:**
```
https://your-app.vercel.app/api/send-prior-auth-update
```

**Method:** `POST`

**Request Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "Patient phone number"
    },
    "patient_name": {
      "type": "string",
      "description": "Patient name"
    },
    "status": {
      "type": "string",
      "enum": ["approved", "denied", "pending"],
      "description": "Prior authorization status"
    }
  },
  "required": ["phone_number", "patient_name", "status"]
}
```

---

## 🤖 Update Your System Prompt

Add this to your ElevenLabs agent's system prompt:

```
SMS CAPABILITIES:
You can send text messages to patients using these tools:
- send_sms: Send any text message
- send_copay_card: Send copay assistance card
- send_prior_auth_update: Send PA status updates

WHEN TO USE SMS:
- Patient says "Can you text me that?"
- Patient requests copay card via text
- Patient asks for PA status to be texted
- Patient needs written information

HOW TO USE:
1. Patient requests text message
2. Confirm phone number: "I'll send that to [number], correct?"
3. Use appropriate tool
4. Confirm: "Done! Check your phone in a few seconds."

EXAMPLE:
Patient: "Can you text me my copay card?"
Agent: "Of course! I'll send your copay card to [phone number]. Is that correct?"
Patient: "Yes"
Agent: [Uses send_copay_card tool]
Agent: "Perfect! You should receive the text in a few seconds with your copay card link."

PHONE NUMBER FORMAT:
- Extract from call metadata or ask patient
- Format: +1 followed by 10 digits (e.g., +15551234567)
- Or just 10 digits (5551234567) - the system will add +1
```

---

## 🧪 Testing

### Test from command line:

```bash
# Test SMS
curl -X POST https://your-app.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+15551234567", "message": "Test message!"}'

# Test Copay Card
curl -X POST https://your-app.vercel.app/api/send-copay-card \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+15551234567", "patient_name": "John Doe"}'
```

### Test with ElevenLabs:

1. Call your ElevenLabs agent
2. Say: "Can you text me at 555-123-4567?"
3. Agent should send SMS and confirm

---

## 📂 Files Created

```
frontend/
├── api/
│   ├── send-sms.ts                    # Generic SMS endpoint
│   ├── send-copay-card.ts             # Copay card endpoint
│   └── send-prior-auth-update.ts      # Prior auth endpoint
├── vercel.json                         # Vercel configuration
└── package.json                        # Updated with dependencies
```

---

## 🔒 Security Notes

- ✅ Twilio credentials are stored as Vercel environment variables (secure)
- ✅ Not exposed in frontend code
- ✅ Serverless functions run server-side only
- ✅ HIPAA-compliant when configured properly

---

## 💰 Costs

- **Vercel:** Free tier includes serverless functions
- **Twilio:**
  - Free trial: $15 credit
  - SMS: ~$0.0075 per message
  - Phone number: ~$1/month

---

## 🐛 Troubleshooting

### SMS not sending?

1. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

2. **Verify environment variables:**
   ```bash
   vercel env ls
   ```

3. **Check Twilio balance** - Free trial might be expired

4. **Phone number format** - Must be E.164 (+15551234567)

### ElevenLabs not calling function?

1. Check webhook URL is correct
2. Verify JSON schema matches
3. Update system prompt with SMS instructions
4. Test endpoint manually with curl first

---

## 🚀 You're Done!

Your ElevenLabs voice agent can now send text messages with **zero backend infrastructure** - it's all deployed with your frontend on Vercel!

**Try it:** Call your agent and say *"Can you text me my copay card?"*

---

## Next Steps

- Add more SMS templates (appointment reminders, etc.)
- Track SMS sends in your database
- Add patient consent/opt-out handling
- Monitor costs in Twilio dashboard
