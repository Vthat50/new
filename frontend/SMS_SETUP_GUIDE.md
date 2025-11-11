# SMS Setup Guide for Maya (ElevenLabs)

This guide will enable Maya to send actual text messages when patients say "text it to my phone number."

---

## ✅ What's Already Done

Your project already has:
- ✅ SMS serverless functions in `/api` folder
- ✅ Vercel configuration in `vercel.json`
- ✅ Twilio dependency in `package.json`

You just need to:
1. Get Twilio credentials
2. Deploy to Vercel
3. Configure ElevenLabs
4. Update Maya's system prompt

---

## Step 1: Get Twilio Credentials (5 minutes)

1. **Sign up at Twilio:**
   - Go to https://www.twilio.com
   - Click "Sign up" (free trial available)
   - Verify your email and phone

2. **Get your credentials:**
   - After logging in, go to https://console.twilio.com
   - You'll see on the dashboard:
     - **Account SID** (starts with "AC...")
     - **Auth Token** (click eye icon to reveal)
   - Copy both of these

3. **Get a phone number:**
   - In Twilio Console, click "Get a Trial Number" or "Buy a Number"
   - Copy the number (format: +15551234567)

---

## Step 2: Deploy to Vercel (2 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your project:**
   ```bash
   cd /Users/varsha/Documents/new/frontend
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **medicure-connect** (or whatever you want)
   - In which directory is your code? **.**
   - Want to override settings? **N**

5. **You'll get a URL like:**
   ```
   https://medicure-connect.vercel.app
   ```
   **Save this URL!**

---

## Step 3: Add Twilio Credentials to Vercel (2 minutes)

**Option A: Using Vercel CLI (recommended)**

```bash
# Add Account SID
vercel env add TWILIO_ACCOUNT_SID
# When prompted, paste your Account SID
# Select Production, Preview, and Development

# Add Auth Token
vercel env add TWILIO_AUTH_TOKEN
# When prompted, paste your Auth Token
# Select Production, Preview, and Development

# Add Phone Number
vercel env add TWILIO_PHONE_NUMBER
# Paste your number like +15551234567
# Select Production, Preview, and Development
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add three variables:
   - `TWILIO_ACCOUNT_SID` = your Account SID
   - `TWILIO_AUTH_TOKEN` = your Auth Token
   - `TWILIO_PHONE_NUMBER` = your phone number (+15551234567)
5. Check all environments (Production, Preview, Development)

**After adding variables, redeploy:**
```bash
vercel --prod
```

---

## Step 4: Configure ElevenLabs Server Tools (10 minutes)

Now you need to tell ElevenLabs about your SMS endpoints.

### 4.1: Access ElevenLabs

1. Go to https://elevenlabs.io/app/conversational-ai
2. Find your **Maya** agent (agent_6501k9nxtr86emsv7jm770kkdcyr)
3. Click on it to edit

### 4.2: Add Server Tool #1 - Send SMS

1. Click **"Server Tools"** or **"Tools"** tab
2. Click **"Add Tool"** or **"Create Custom Tool"**
3. Configure:

**Name:**
```
send_sms
```

**Description:**
```
Sends a text message to the patient's phone number. Use this when a patient says "text me that" or "send me a text message" or provides their phone number to receive information via SMS. Always confirm the phone number before sending.
```

**URL:**
```
https://your-vercel-url.vercel.app/api/send-sms
```
*(Replace with your actual Vercel URL)*

**HTTP Method:**
```
POST
```

**Request Body Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone_number": {
      "type": "string",
      "description": "The patient's phone number in format +15551234567 or 5551234567"
    },
    "message": {
      "type": "string",
      "description": "The text message content to send to the patient"
    },
    "patient_name": {
      "type": "string",
      "description": "The patient's name (optional, for personalization)"
    }
  },
  "required": ["phone_number", "message"]
}
```

4. Click **Save**

### 4.3: Add Server Tool #2 - Send Copay Card

1. Click **"Add Tool"** again
2. Configure:

**Name:**
```
send_copay_card
```

**Description:**
```
Sends the patient's copay assistance card link via text message. Use this when a patient needs their copay card texted to them for pharmacy use.
```

**URL:**
```
https://your-vercel-url.vercel.app/api/send-copay-card
```

**HTTP Method:**
```
POST
```

**Request Body Schema:**
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
      "description": "Patient's full name"
    },
    "copay_url": {
      "type": "string",
      "description": "URL to copay card (optional, defaults to https://copay.lillycares.com/card)"
    }
  },
  "required": ["phone_number", "patient_name"]
}
```

3. Click **Save**

### 4.4: Add Server Tool #3 - Send Prior Auth Update

1. Click **"Add Tool"** again
2. Configure:

**Name:**
```
send_prior_auth_update
```

**Description:**
```
Sends a prior authorization status update via text message. Use when patient wants their PA status texted to them.
```

**URL:**
```
https://your-vercel-url.vercel.app/api/send-prior-auth-update
```

**HTTP Method:**
```
POST
```

**Request Body Schema:**
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
      "description": "Patient's name"
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

3. Click **Save**

---

## Step 5: Update Maya's System Prompt

Add this section to Maya's existing system prompt in ElevenLabs:

```

## SMS Text Message Capabilities

You can now send actual text messages to patients using these tools:

### Available SMS Tools:
1. **send_sms** - Send any text message
2. **send_copay_card** - Send copay assistance card link
3. **send_prior_auth_update** - Send prior auth status updates

### When to Use SMS:

**Patient trigger phrases:**
- "Can you text me that?"
- "Send me a text with that information"
- "Text it to my phone"
- "Send me a message at [phone number]"
- "Can I get that in a text?"
- "Text my copay card to me"

### SMS Workflow:

1. **Patient requests text:**
   Patient: "Can you text me my copay card?"

2. **Confirm phone number:**
   You: "Of course! I can send your copay card via text. What's the best phone number to send it to?"

   OR if they provide number:
   You: "Perfect! I'll send that to [repeat number]. Is that correct?"

3. **Use appropriate tool:**
   - For copay cards → use `send_copay_card` tool
   - For PA updates → use `send_prior_auth_update` tool
   - For general info → use `send_sms` tool

4. **Confirm sent:**
   You: "Done! I've just sent [information] to your phone at [number]. You should receive it within a few seconds. Is there anything else I can help you with?"

### Phone Number Handling:

**Accepted formats:**
- +15551234567 (preferred E.164 format)
- 5551234567 (10 digits - system adds +1)
- 555-123-4567 (system removes dashes)

**Always:**
- Repeat the number back to confirm
- Format it naturally when speaking: "five five five, one two three, four five six seven"
- Wait for confirmation before sending

### Example Conversations:

**Example 1 - Copay Card:**
Patient: "Can you text me my copay card?"
Maya: "Absolutely! I can send your copay assistance card to your phone right now. What's the best number to send it to?"
Patient: "555-123-4567"
Maya: "Perfect! So that's five five five, one two three, four five six seven. Is that correct?"
Patient: "Yes"
Maya: [Uses send_copay_card tool with phone_number: "5551234567", patient_name: obtained from conversation]
Maya: "Done! I've just sent your copay card to your phone. You should see the text in just a few seconds with a link to your digital card. You can show this at the pharmacy to get your discount. Anything else I can help with?"

**Example 2 - Prior Auth Status:**
Patient: "Can you text me when you hear about my prior authorization?"
Maya: "Of course! I'll send you a text message as soon as we get a decision on your prior authorization. What's the best phone number to reach you at?"
Patient: "It's 555-987-6543"
Maya: "Great, I have five five five, nine eight seven, six five four three. Is that right?"
Patient: "Yes"
Maya: [Uses send_prior_auth_update tool when status is known]
Maya: "Perfect! I've added your number to your case. As soon as we hear back from your insurance, I'll send you a text update right away. You should get it within 3 to 5 business days."

**Example 3 - General Information:**
Patient: "Can you text me the pharmacy address?"
Maya: "Sure thing! What number should I send it to?"
Patient: "Send it to 555-246-8135"
Maya: "Okay, five five five, two four six, eight one three five. Correct?"
Patient: "Yep"
Maya: [Uses send_sms tool with message about pharmacy address]
Maya: "Sent! You should have the pharmacy address on your phone now. They're open Monday through Friday, 9 AM to 6 PM. Anything else?"

### Important Rules:

1. **Always confirm the phone number** before sending
2. **Never send PHI (Protected Health Information)** via text without explicit consent
3. **Keep messages brief and clear** - SMS has character limits
4. **Include a callback option** in texts when appropriate
5. **Don't send sensitive medical details** - only general info and links
6. **If unsure whether to text something** - ask the patient: "Would you like me to send that via text, or would you prefer I email it instead?"

### What to Text vs. Not Text:

**✅ OKAY to text:**
- Copay card links
- Pharmacy addresses/phone numbers
- Appointment confirmations
- Refill reminders
- General program information
- Prior auth status updates ("approved," "pending," "denied")

**❌ DON'T text:**
- Detailed medical information
- Specific diagnosis details
- Full insurance policy numbers
- Social security numbers
- Detailed adverse event information
- Anything patient hasn't explicitly consented to receive

```

---

## Step 6: Test Everything

### Test 1: Direct API Test

```bash
curl -X POST https://your-vercel-url.vercel.app/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "YOUR_PHONE_NUMBER",
    "message": "Test from Maya! This is working!"
  }'
```

You should receive a text!

### Test 2: Call Maya

1. Call your ElevenLabs number
2. Say: "Hi Maya, can you text me at [your number]?"
3. Maya should confirm and send the text
4. You should receive it!

---

## Troubleshooting

### SMS Not Sending?

**Check Vercel logs:**
```bash
vercel logs --follow
```

**Check environment variables:**
```bash
vercel env ls
```

**Verify Twilio credentials:**
- Log into https://console.twilio.com
- Check Account SID and Auth Token match
- Check phone number is correct
- Check you have Twilio credit (free trial starts with $15)

### ElevenLabs Not Using the Tool?

1. **Check system prompt** - Make sure SMS section is added
2. **Check tool configuration** - Verify URLs are correct
3. **Test with explicit trigger** - Say exactly "send me a text message"
4. **Check ElevenLabs logs** - Look for errors in tool calls

### Phone Number Format Issues?

The API accepts multiple formats:
- ✅ `+15551234567`
- ✅ `5551234567`
- ✅ `555-123-4567`

It automatically formats to E.164 (+1...)

---

## Cost Information

- **Vercel:** Free tier includes serverless functions
- **Twilio:**
  - Free trial: $15 credit
  - SMS: ~$0.0075 per message (less than 1 cent!)
  - Phone number: ~$1/month

---

## You're Done! 🎉

Maya can now send real text messages when patients ask!

**Try it:** Call Maya and say:
*"Hi Maya, can you text me my copay card at 555-123-4567?"*

You should receive an actual SMS! 📱
