/**
 * Vercel Serverless Function for SMS
 * This deploys automatically with your frontend - no separate backend needed!
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Twilio credentials - these will be set as Vercel environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number, message, patient_name } = req.body;

  if (!phone_number || !message) {
    return res.status(400).json({ error: 'phone_number and message are required' });
  }

  try {
    // Import Twilio (this works in serverless functions)
    const twilio = require('twilio');
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Format phone number to E.164
    let formattedNumber = phone_number;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+1${formattedNumber.replace(/\D/g, '')}`;
    }

    // Send SMS
    const twilioMessage = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    return res.status(200).json({
      success: true,
      message: `SMS sent successfully to ${phone_number}`,
      message_sid: twilioMessage.sid,
      status: twilioMessage.status,
    });
  } catch (error: any) {
    console.error('SMS Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS',
    });
  }
}
