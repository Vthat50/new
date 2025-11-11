# 📱 SMS Integration - Ready to Deploy!

Your project is **ready to deploy** with SMS functionality for Maya!

---

## ✅ What's Already Set Up

Your project now has everything needed for Maya to send real text messages:

### Files Added:
```
frontend/
├── api/
│   ├── send-sms.ts                    ✅ Generic SMS endpoint
│   ├── send-copay-card.ts             ✅ Copay card SMS
│   └── send-prior-auth-update.ts      ✅ Prior auth SMS
├── vercel.json                         ✅ Vercel config
├── package.json                        ✅ Updated with twilio & @vercel/node
├── .env                                ✅ Added Twilio placeholders
├── SMS_SETUP_GUIDE.md                  ✅ Detailed setup guide
├── QUICK_SMS_SETUP.md                  ✅ Quick reference
└── README_SMS.md                       ✅ This file
```

---

## 🚀 Next Steps (Choose Your Speed)

### Fast Track (15 min):
Follow **`QUICK_SMS_SETUP.md`** for step-by-step checklist

### Detailed Guide (30 min):
Follow **`SMS_SETUP_GUIDE.md`** for comprehensive instructions

---

## 📋 Quick Overview

### 1. Get Twilio (5 min)
→ https://www.twilio.com
- Sign up (free trial = $15 credit)
- Get: Account SID, Auth Token, Phone Number

### 2. Deploy (2 min)
```bash
cd /Users/varsha/Documents/new/frontend
vercel
```

### 3. Add Secrets (2 min)
```bash
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
vercel --prod
```

### 4. Configure ElevenLabs (5 min)
- Add `send_sms` tool pointing to your Vercel URL
- Update Maya's system prompt with SMS section

### 5. Test! (1 min)
Call Maya → Say "text me at [your number]" → Get SMS! 🎉

---

## 🔗 Your SMS Endpoints

After deploying to Vercel, you'll have these endpoints:

```
https://your-app.vercel.app/api/send-sms
https://your-app.vercel.app/api/send-copay-card
https://your-app.vercel.app/api/send-prior-auth-update
```

Use these URLs in ElevenLabs Server Tools configuration.

---

## 🎯 How It Works

**When a patient calls Maya:**

1. Patient: *"Can you text me my copay card at 555-123-4567?"*

2. Maya confirms the number

3. Maya calls your Vercel endpoint:
   ```
   POST https://your-app.vercel.app/api/send-copay-card
   ```

4. Your serverless function sends SMS via Twilio

5. Patient receives text on their phone! 📱

**No backend server required** - everything runs on Vercel!

---

## 💰 Costs

- **Vercel:** FREE (generous free tier)
- **Twilio:**
  - Free trial: $15 credit (enough for ~2000 messages!)
  - After trial: $0.0075/SMS (~150 texts for $1)
  - Phone number: ~$1/month

---

## 🧪 Testing

### Test the API directly:
```bash
curl -X POST https://your-vercel-url.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "5551234567",
    "message": "Testing from Maya!"
  }'
```

### Test with Maya:
1. Call your ElevenLabs number
2. Say: "Hi Maya, text me at 555-123-4567"
3. Receive SMS!

---

## 🐛 Troubleshooting

**SMS not sending?**
```bash
# Check logs
vercel logs --follow

# Check environment variables
vercel env ls

# Verify Twilio balance
# Go to https://console.twilio.com
```

**ElevenLabs not using tool?**
- Check URL in tool configuration matches your Vercel deployment
- Verify system prompt includes SMS instructions
- Test with explicit phrase: "send me a text message"

---

## 📚 Documentation

- **Quick Setup:** `QUICK_SMS_SETUP.md`
- **Detailed Guide:** `SMS_SETUP_GUIDE.md`
- **Twilio Docs:** https://www.twilio.com/docs/sms
- **Vercel Docs:** https://vercel.com/docs
- **ElevenLabs Docs:** https://elevenlabs.io/docs

---

## 🎉 You're Ready!

Everything is set up in your current project. Just:
1. Get Twilio credentials
2. Deploy to Vercel
3. Configure ElevenLabs
4. Start sending texts!

**See `QUICK_SMS_SETUP.md` to get started!**
