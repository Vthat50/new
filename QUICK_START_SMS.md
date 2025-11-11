# ⚡ Quick Start: SMS in 5 Minutes

No backend needed - everything is in the frontend!

---

## Step 1: Get Twilio (2 min)

1. Go to https://www.twilio.com
2. Sign up (free trial)
3. Copy:
   - Account SID
   - Auth Token
   - Phone Number (+15551234567)

---

## Step 2: Install & Deploy (1 min)

```bash
cd /Users/varsha/Documents/new/frontend

# Install
npm install

# Deploy to Vercel
npx vercel
```

Follow the prompts. You'll get a URL like: `https://your-app.vercel.app`

---

## Step 3: Add Secrets (1 min)

```bash
npx vercel env add TWILIO_ACCOUNT_SID
# Paste your SID

npx vercel env add TWILIO_AUTH_TOKEN
# Paste your token

npx vercel env add TWILIO_PHONE_NUMBER
# Paste your number like +15551234567

# Redeploy to apply secrets
npx vercel --prod
```

---

## Step 4: Configure ElevenLabs (1 min)

1. Go to https://elevenlabs.io → Your Agent → Tools
2. Add tool:
   - **Name:** `send_sms`
   - **URL:** `https://your-app.vercel.app/api/send-sms`
   - **Method:** POST
   - **Schema:**
   ```json
   {
     "type": "object",
     "properties": {
       "phone_number": {"type": "string"},
       "message": {"type": "string"}
     },
     "required": ["phone_number", "message"]
   }
   ```

3. Update system prompt:
   ```
   You can send SMS using send_sms tool. When patient says
   "text me that", confirm their number and use the tool.
   ```

---

## Done! ✅

**Test it:**
- Call your ElevenLabs agent
- Say: *"Can you text me at 555-1234?"*
- You'll receive an SMS!

---

## Your SMS Endpoints

- `https://your-app.vercel.app/api/send-sms`
- `https://your-app.vercel.app/api/send-copay-card`
- `https://your-app.vercel.app/api/send-prior-auth-update`

Use all 3 in ElevenLabs for full functionality!

---

## Troubleshooting

**Not working?**
```bash
# Check logs
npx vercel logs

# Check secrets
npx vercel env ls
```

**Still stuck?** See `SIMPLE_SMS_SETUP.md` for detailed guide.
