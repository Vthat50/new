/**
 * Vercel Serverless Function - Send Prior Auth Update
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone_number, patient_name, status } = req.body;

  if (!phone_number || !patient_name || !status) {
    return res.status(400).json({ error: 'phone_number, patient_name, and status are required' });
  }

  let emoji = '';
  let messageText = '';

  if (status.toLowerCase() === 'approved') {
    emoji = '✅';
    messageText = 'Your prior authorization has been approved! You can now pick up your medication.';
  } else if (status.toLowerCase() === 'pending') {
    emoji = '⏳';
    messageText = 'Your prior authorization is still pending. We will update you within 48 hours.';
  } else {
    emoji = '❌';
    messageText = 'Your prior authorization was denied. Please call us to discuss alternative options.';
  }

  const message = `Hi ${patient_name},

${emoji} ${messageText}

Questions? Call ${TWILIO_PHONE_NUMBER}

- Your Healthcare Team`;

  try {
    const twilio = require('twilio');
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
      message: `Prior auth update sent to ${patient_name}`,
      message_sid: twilioMessage.sid,
    });
  } catch (error: any) {
    console.error('SMS Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS',
    });
  }
}
