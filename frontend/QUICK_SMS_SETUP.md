# ⚡ Quick SMS Setup (15 Minutes)

Get Maya sending real text messages in 6 steps!

---

## 📋 Step-by-Step Checklist

### ☐ Step 1: Get Twilio Credentials (5 min)

1. Go to https://www.twilio.com → Sign up (free trial)
2. Go to https://console.twilio.com
3. Copy these 3 values:
   ```
   Account SID: AC...
   Auth Token: (click eye to reveal)
   Phone Number: Get/buy a number (+15551234567)
   ```

---

### ☐ Step 2: Deploy to Vercel (2 min)

```bash
cd /Users/varsha/Documents/new/frontend
npm install -g vercel
vercel login
vercel
```

**Save your Vercel URL:** `https://your-app.vercel.app`

---

### ☐ Step 3: Add Twilio to Vercel (2 min)

```bash
vercel env add TWILIO_ACCOUNT_SID
# Paste your Account SID, select all environments

vercel env add TWILIO_AUTH_TOKEN
# Paste your Auth Token, select all environments

vercel env add TWILIO_PHONE_NUMBER
# Paste your number like +15551234567, select all environments

# Redeploy
vercel --prod
```

---

### ☐ Step 4: Configure ElevenLabs Tools (5 min)

1. Go to https://elevenlabs.io/app/conversational-ai
2. Open your Maya agent
3. Click **"Tools"** → **"Add Tool"**

**Add Tool: send_sms**
- Name: `send_sms`
- URL: `https://YOUR-VERCEL-URL.vercel.app/api/send-sms`
- Method: `POST`
- Schema:
```json
{
  "type": "object",
  "properties": {
    "phone_number": {"type": "string", "description": "Phone number like +15551234567"},
    "message": {"type": "string", "description": "Message to send"}
  },
  "required": ["phone_number", "message"]
}
```

**Add Tool: send_copay_card** (optional but recommended)
- Name: `send_copay_card`
- URL: `https://YOUR-VERCEL-URL.vercel.app/api/send-copay-card`
- Method: `POST`
- Schema:
```json
{
  "type": "object",
  "properties": {
    "phone_number": {"type": "string"},
    "patient_name": {"type": "string"},
    "copay_url": {"type": "string"}
  },
  "required": ["phone_number", "patient_name"]
}
```

---

### ☐ Step 5: Update System Prompt (1 min)

Add this to Maya's system prompt in ElevenLabs:

```
## SMS CAPABILITIES

You can send text messages using the send_sms tool.

When a patient says "text me that" or "send me a text":
1. Ask for their phone number
2. Confirm the number by repeating it back
3. Use send_sms tool with their number and the message
4. Confirm: "Sent! You should receive it in a few seconds."

Example:
Patient: "Can you text me the pharmacy address?"
Maya: "Sure! What's your phone number?"
Patient: "555-123-4567"
Maya: "Great, I'll send it to 555-123-4567. Is that correct?"
Patient: "Yes"
Maya: [Uses send_sms tool]
Maya: "Done! You should have the text now."
```

---

### ☐ Step 6: Test It! (1 min)

**Option A: Test API directly**
```bash
curl -X POST https://YOUR-VERCEL-URL.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "YOUR_NUMBER", "message": "Test!"}'
```

**Option B: Call Maya**
1. Call your ElevenLabs number
2. Say: "Can you text me at [your number]?"
3. Wait for text! 📱

---

## ✅ Done!

Maya can now send real SMS messages!

**Need help?** See `SMS_SETUP_GUIDE.md` for detailed instructions.

---

## Quick Troubleshooting

**Not working?**

1. Check Vercel logs: `vercel logs`
2. Check env vars: `vercel env ls`
3. Verify Twilio has credit: https://console.twilio.com
4. Make sure URLs in ElevenLabs match your Vercel URL
5. Check system prompt includes SMS section

**Still stuck?** Check full guide in `SMS_SETUP_GUIDE.md`
