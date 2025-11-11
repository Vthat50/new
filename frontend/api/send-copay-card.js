/**
 * Vercel Serverless Function - Send Copay Card
 */

import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number, patient_name, copay_url } = req.body;

  if (!phone_number || !patient_name) {
    return res.status(400).json({ error: 'phone_number and patient_name are required' });
  }

  const defaultCopayUrl = copay_url || 'https://copay.lillycares.com/card';

  const message = `Hi ${patient_name},

Here's your copay assistance card: ${defaultCopayUrl}

Show this to your pharmacy to receive your discount. Questions? Reply to this message.

- Your Healthcare Team`;

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    let formattedNumber = phone_number;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+1${formattedNumber.replace(/\D/g, '')}`;
    }

    const twilioMessage = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    return res.status(200).json({
      success: true,
      message: `Copay card sent to ${patient_name}`,
      message_sid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('SMS Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS',
    });
  }
}
