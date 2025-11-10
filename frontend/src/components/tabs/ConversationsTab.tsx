import React, { useState } from 'react';
import {
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import AudioPlayer from '../shared/AudioPlayer';

// Import conversation components for history view
import ComplianceScorecard from '../conversations/ComplianceScorecard';
import LiveTranscript from '../conversations/LiveTranscript';
import ConversationFilters from '../conversations/ConversationFilters';
import KeyMomentsSidebar from '../conversations/KeyMomentsSidebar';
import TranscriptBottomPanel from '../conversations/TranscriptBottomPanel';

export default function ConversationsTab() {
  const [selectedHistoryCall, setSelectedHistoryCall] = useState<string | null>(null);

  // Call history data - Enhanced with Configuration 2.0 integration
  const callHistory = [
    {
      id: 'call-001',
      patientName: 'Maria Gonzalez',
      patientId: 'PT-10234',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Copay Assistance', 'Financial Support', 'High Medication Costs'],
      duration: '11:45',
      startingSentiment: 'negative' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 98,
      riskLevel: 'high' as const,
      date: new Date('2024-11-08T14:30:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'financial_assistance',
      detectedFrictionTopics: ['high_costs'],
      keyPhrases: ['cannot afford', '$800 per month', 'way too expensive'],
      summary: 'Patient struggling with $800/month copay. Successfully enrolled in manufacturer copay card program, reducing cost to $25/month.',
      actions: ['Enrolled in copay card program', 'Sent digital card via email', 'Updated pharmacy records'],
      followUps: ['Follow-up call in 2 weeks to confirm card activation'],
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Maria, thank you for calling. This is the patient support program. How can I assist you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'Hi, I just picked up my prescription and they want $800! I cannot afford that. This is way too expensive. My insurance barely covers anything.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 18,
          speaker: 'agent' as const,
          text: 'I completely understand your concern, Maria. High medication costs can be very stressful. Let me check what financial assistance options are available for you. Can I confirm you have commercial insurance?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 28,
          speaker: 'patient' as const,
          text: 'Yes, I have Blue Cross through my employer. But the copay is still $800 every month.',
          sentiment: 'negative' as const,
        },
        {
          id: '5',
          timestamp: 36,
          speaker: 'agent' as const,
          text: 'Great news! You qualify for our manufacturer copay card program. This can reduce your out-of-pocket cost to as low as $25 per month. Would you like me to enroll you right now?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 45,
          speaker: 'patient' as const,
          text: 'Oh my god, really? Yes, please! That would be amazing. I was so worried I\'d have to stop the medication.',
          sentiment: 'positive' as const,
        },
        {
          id: '7',
          timestamp: 52,
          speaker: 'agent' as const,
          text: 'I understand, and I\'m glad we can help. Let me get you enrolled. I\'ll need to verify some information. Can you confirm your date of birth?',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 98,
          speaker: 'agent' as const,
          text: 'Perfect! You\'re all enrolled. I\'ve sent your digital copay card to your email address ending in @gmail.com. You can use this immediately at the pharmacy. Your new copay should be $25.',
          sentiment: 'positive' as const,
        },
        {
          id: '9',
          timestamp: 108,
          speaker: 'patient' as const,
          text: 'Thank you so much! This is such a relief. I really appreciate your help.',
          sentiment: 'positive' as const,
        },
        {
          id: '10',
          timestamp: 115,
          speaker: 'agent' as const,
          text: 'You\'re very welcome, Maria. I\'ll also follow up with you in two weeks to make sure everything went smoothly at the pharmacy. Is there anything else I can help you with today?',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-002',
      patientName: 'Sarah Martinez',
      patientId: 'PT-00123',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Prior Authorization', 'Insurance Coverage'],
      duration: '6:20',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 95,
      riskLevel: 'low' as const,
      date: new Date('2024-11-08T10:15:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'insurance_prior_auth',
      detectedFrictionTopics: ['insurance_confusion'],
      keyPhrases: ['prior authorization', 'approved', 'insurance coverage'],
      summary: 'Patient called to verify PA approval status. AI confirmed approval and explained coverage details.',
      actions: ['Verified PA approval in system', 'Explained coverage terms', 'Confirmed pharmacy has authorization'],
      followUps: [],
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Sarah, this is the patient support line. I see you\'re calling about your prior authorization. How can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'Yes, I received a letter saying my PA was approved. I just want to make sure everything is set up correctly with my insurance.',
          sentiment: 'neutral' as const,
        },
        {
          id: '3',
          timestamp: 15,
          speaker: 'agent' as const,
          text: 'Perfect! Let me pull up your information. I can confirm your prior authorization was approved on November 4th. Your coverage includes the full medication cost with a $25 copay through your Blue Cross Blue Shield plan.',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 28,
          speaker: 'patient' as const,
          text: 'That\'s great! So I can just pick it up at my pharmacy now?',
          sentiment: 'positive' as const,
        },
        {
          id: '5',
          timestamp: 32,
          speaker: 'agent' as const,
          text: 'Yes, exactly. Your pharmacy - CVS on Main Street - already has the authorization in their system. You can pick it up anytime. Is there anything else I can help clarify?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 40,
          speaker: 'patient' as const,
          text: 'No, that\'s perfect. Thank you so much for confirming!',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-003',
      patientName: 'Jennifer Lee',
      patientId: 'PT-00789',
      callDriver: 'AI → Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Severe Adverse Event', 'Anaphylaxis', 'Emergency Escalation'],
      duration: '9:32',
      startingSentiment: 'negative' as const,
      endingSentiment: 'neutral' as const,
      outcome: 'Escalated to Provider' as const,
      complianceScore: 100,
      riskLevel: 'high' as const,
      date: new Date('2024-11-07T16:42:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'adverse_events',
      detectedFrictionTopics: ['side_effects'],
      keyPhrases: ['severe reaction', 'swelling', 'difficulty breathing', 'allergic'],
      summary: 'Patient reported severe allergic reaction with facial swelling and breathing difficulty. AI immediately detected safety signal and escalated to medical professional. Patient instructed to seek emergency care.',
      actions: ['Detected critical adverse event', 'Escalated to physician within 30 seconds', 'Documented AE in pharmacovigilance system', 'Advised patient to go to ER'],
      followUps: ['Medical team to call patient within 24 hours', 'AE report filed with FDA'],
      escalationReason: 'Severe adverse event detected - potential anaphylaxis',
      aiHandlingDuration: '0:28',
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Jennifer, this is the patient support line. How can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 6,
          speaker: 'patient' as const,
          text: 'I started the medication two hours ago and my face is swelling. I\'m having trouble breathing. I think I\'m having an allergic reaction.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 12,
          speaker: 'agent' as const,
          text: 'Jennifer, this sounds serious. I\'m connecting you immediately to our medical team. While I transfer you, please confirm - are you able to breathe right now?',
          sentiment: 'neutral' as const,
        },
        {
          id: '4',
          timestamp: 18,
          speaker: 'patient' as const,
          text: 'Yes, but it\'s getting harder. My throat feels tight.',
          sentiment: 'negative' as const,
        },
        {
          id: '5',
          timestamp: 22,
          speaker: 'agent' as const,
          text: 'Transferring you now to Dr. Patterson. Stay on the line.',
          sentiment: 'neutral' as const,
        },
        {
          id: '6',
          timestamp: 28,
          speaker: 'agent' as const,
          text: 'Jennifer, this is Dr. Patterson. I need you to hang up and call 911 immediately or have someone take you to the nearest emergency room. Do not drive yourself. This is a medical emergency. Do you have someone with you?',
          sentiment: 'neutral' as const,
        },
        {
          id: '7',
          timestamp: 40,
          speaker: 'patient' as const,
          text: 'Yes, my husband is here. We\'ll go to the ER now.',
          sentiment: 'neutral' as const,
        },
        {
          id: '8',
          timestamp: 45,
          speaker: 'agent' as const,
          text: 'Good. Stop taking the medication immediately. Bring the medication bottle with you to the ER. I\'m documenting this reaction now and our team will follow up with you tomorrow. Please go to the ER right away.',
          sentiment: 'neutral' as const,
        },
      ],
    },
    {
      id: 'call-004',
      patientName: 'Robert Thompson',
      patientId: 'PT-05612',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Mild Side Effects', 'Nausea', 'Medication Timing'],
      duration: '7:18',
      startingSentiment: 'negative' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 92,
      riskLevel: 'medium' as const,
      date: new Date('2024-11-07T11:20:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'adverse_events',
      detectedFrictionTopics: ['side_effects'],
      keyPhrases: ['nausea', 'upset stomach', 'side effects'],
      summary: 'Patient experiencing mild nausea. AI provided guidance on taking medication with food and monitoring symptoms.',
      actions: ['Documented mild adverse event', 'Provided administration guidance', 'Scheduled follow-up check-in'],
      followUps: ['AI to call back in 3 days to check symptom resolution'],
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Robert, thank you for calling patient support. How can I assist you?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 7,
          speaker: 'patient' as const,
          text: 'Hi, I\'ve been taking this medication for a week now and I keep getting nausea about an hour after I take it. It\'s not terrible, but it\'s uncomfortable.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 18,
          speaker: 'agent' as const,
          text: 'I understand that\'s frustrating. Nausea is a known side effect for some patients. Can you tell me when you\'re taking your medication - is it with food or on an empty stomach?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 28,
          speaker: 'patient' as const,
          text: 'I take it first thing in the morning before breakfast. Should I be taking it differently?',
          sentiment: 'neutral' as const,
        },
        {
          id: '5',
          timestamp: 35,
          speaker: 'agent' as const,
          text: 'Yes, that might help! Try taking your medication with food - a light breakfast or snack. This can significantly reduce nausea for many patients. The medication works the same way, but having food in your stomach often helps.',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 48,
          speaker: 'patient' as const,
          text: 'Oh, okay! I can definitely do that. Should I be worried about this?',
          sentiment: 'neutral' as const,
        },
        {
          id: '7',
          timestamp: 54,
          speaker: 'agent' as const,
          text: 'Mild nausea is manageable, but I want to make sure it improves. Try taking it with food for the next few days. I\'ll schedule a follow-up call in 3 days to check how you\'re doing. If the nausea gets worse or you develop vomiting, please call us back immediately.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 68,
          speaker: 'patient' as const,
          text: 'That sounds good. Thank you for the help!',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-005',
      patientName: 'Patricia Anderson',
      patientId: 'PT-08934',
      callDriver: 'Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Insurance Denial', 'Appeal Process', 'Prior Authorization'],
      duration: '14:25',
      startingSentiment: 'negative' as const,
      endingSentiment: 'neutral' as const,
      outcome: 'Follow-up Required' as const,
      complianceScore: 88,
      riskLevel: 'high' as const,
      date: new Date('2024-11-06T15:30:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'insurance_prior_auth',
      detectedFrictionTopics: ['insurance_confusion', 'high_costs'],
      keyPhrases: ['denied', 'appeal', 'insurance rejected'],
      summary: 'Patient\'s insurance denied coverage. Human agent is helping with appeal process and exploring alternative coverage options.',
      actions: ['Submitted appeal letter', 'Gathered medical documentation', 'Applied for manufacturer PAP as backup'],
      followUps: ['Wait for insurance appeal response (14-30 days)', 'Agent to check appeal status weekly'],
      transcript: [
        {
          id: '1',
          timestamp: 3,
          speaker: 'agent' as const,
          text: 'Hello Patricia, this is Marcus from patient support. I see you called about an insurance issue?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 9,
          speaker: 'patient' as const,
          text: 'Yes, my insurance company denied my claim. They said the medication isn\'t medically necessary. My doctor prescribed it! This is so frustrating.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 20,
          speaker: 'agent' as const,
          text: 'I can imagine how frustrating that is. Insurance denials are unfortunately common, but we can definitely appeal this. Have you received the written denial letter yet?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 30,
          speaker: 'patient' as const,
          text: 'Yes, I got it yesterday. It says I can appeal within 30 days, but I don\'t even know where to start.',
          sentiment: 'negative' as const,
        },
        {
          id: '5',
          timestamp: 40,
          speaker: 'agent' as const,
          text: 'That\'s what I\'m here for. I\'ll walk you through the entire appeal process. First, I need to contact your doctor\'s office to get a letter of medical necessity. Then we\'ll submit a formal appeal with all the clinical documentation. This usually takes 14 to 30 days for the insurance company to review.',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 62,
          speaker: 'patient' as const,
          text: 'Okay... but what do I do in the meantime? I need this medication now.',
          sentiment: 'negative' as const,
        },
        {
          id: '7',
          timestamp: 68,
          speaker: 'agent' as const,
          text: 'Great question. While we wait for the appeal, I\'m also submitting an application for our manufacturer patient assistance program. If approved, you could get the medication at no cost while we fight the insurance denial. It\'s a safety net.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 82,
          speaker: 'patient' as const,
          text: 'Oh, that would be amazing. How long does that take?',
          sentiment: 'neutral' as const,
        },
        {
          id: '9',
          timestamp: 87,
          speaker: 'agent' as const,
          text: 'Usually 5-7 business days. I\'ll expedite it and mark it as urgent. I\'ll also call you weekly to update you on both the appeal and the assistance program. You won\'t have to chase anyone down.',
          sentiment: 'positive' as const,
        },
        {
          id: '10',
          timestamp: 98,
          speaker: 'patient' as const,
          text: 'Thank you. That makes me feel a little better. I was so worried I\'d have to go without.',
          sentiment: 'neutral' as const,
        },
      ],
    },
    {
      id: 'call-006',
      patientName: 'Marcus Williams',
      patientId: 'PT-07221',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Pharmacy Access', 'Specialty Pharmacy', 'Medication Availability'],
      duration: '8:55',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 96,
      riskLevel: 'medium' as const,
      date: new Date('2024-11-07T09:45:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'financial_assistance',
      detectedFrictionTopics: ['access_issues'],
      keyPhrases: ['pharmacy doesn\'t have', 'out of stock', 'can\'t find'],
      summary: 'Patient\'s local pharmacy doesn\'t stock specialty medication. AI located specialty pharmacy and arranged free home delivery.',
      actions: ['Located specialty pharmacy network', 'Set up patient account', 'Arranged free home delivery', 'Transferred prescription'],
      followUps: ['Delivery scheduled for Nov 10th'],
      transcript: [
        {
          id: '1',
          timestamp: 3,
          speaker: 'agent' as const,
          text: 'Hello Marcus, this is patient support. How can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'My regular pharmacy says they don\'t carry this medication. They told me it\'s a specialty drug and I need to go somewhere else, but they didn\'t tell me where.',
          sentiment: 'neutral' as const,
        },
        {
          id: '3',
          timestamp: 20,
          speaker: 'agent' as const,
          text: 'I can definitely help with that. This medication is distributed through specialty pharmacies. Let me find one in your area. What\'s your ZIP code?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 28,
          speaker: 'patient' as const,
          text: '30342. Will they have it in stock?',
          sentiment: 'neutral' as const,
        },
        {
          id: '5',
          timestamp: 33,
          speaker: 'agent' as const,
          text: 'Yes! I found three specialty pharmacies in network. Actually, I recommend our preferred specialty pharmacy - Accredo. They deliver directly to your home for free, usually within 2-3 days. Would you like me to set that up?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 48,
          speaker: 'patient' as const,
          text: 'Home delivery? That would actually be perfect. How does that work?',
          sentiment: 'positive' as const,
        },
        {
          id: '7',
          timestamp: 54,
          speaker: 'agent' as const,
          text: 'I\'ll transfer your prescription from your current pharmacy to Accredo and set up your account. They\'ll call you to schedule the first delivery, and then it\'s automatic refills after that - they\'ll check in with you each month. All deliveries are free with cold pack packaging to keep it fresh.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 72,
          speaker: 'patient' as const,
          text: 'That sounds great. So I don\'t have to call them?',
          sentiment: 'positive' as const,
        },
        {
          id: '9',
          timestamp: 76,
          speaker: 'agent' as const,
          text: 'Nope, I\'m handling everything. You should get a call from Accredo within 24 hours to schedule your first delivery. Your next dose should arrive by Monday.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-007',
      patientName: 'Dorothy Henderson',
      patientId: 'PT-09156',
      callDriver: 'Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Medicare Coverage', 'Part D Benefits', 'Senior Support'],
      duration: '10:12',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 94,
      riskLevel: 'low' as const,
      date: new Date('2024-11-06T14:20:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'insurance_prior_auth',
      detectedFrictionTopics: ['insurance_confusion'],
      keyPhrases: ['Medicare', 'don\'t understand', 'Part D', 'confused'],
      summary: 'Elderly patient confused about Medicare Part D coverage. Human agent patiently explained benefits and copay structure.',
      actions: ['Explained Medicare Part D coverage', 'Clarified copay amounts', 'Verified pharmacy in network', 'Sent written summary via mail'],
      followUps: [],
      transcript: [
        {
          id: '1',
          timestamp: 4,
          speaker: 'agent' as const,
          text: 'Hello Mrs. Henderson, this is Susan from patient support. How are you doing today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 10,
          speaker: 'patient' as const,
          text: 'Hi Susan. I\'m okay, but I\'m confused about this Medicare business. My doctor prescribed this medication, but I don\'t understand how much it will cost with my Part D.',
          sentiment: 'neutral' as const,
        },
        {
          id: '3',
          timestamp: 22,
          speaker: 'agent' as const,
          text: 'I completely understand - Medicare can be confusing. Let me help explain it. Do you know which Part D plan you have?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 30,
          speaker: 'patient' as const,
          text: 'I think it\'s... let me find my card... it says Humana.',
          sentiment: 'neutral' as const,
        },
        {
          id: '5',
          timestamp: 38,
          speaker: 'agent' as const,
          text: 'Perfect! I can look that up for you. With your Humana Medicare Part D plan, this medication is covered on Tier 3. That means your copay will be $47 per month. Does that fit within your budget?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 52,
          speaker: 'patient' as const,
          text: '$47? That\'s not too bad. Is that every month?',
          sentiment: 'positive' as const,
        },
        {
          id: '7',
          timestamp: 58,
          speaker: 'agent' as const,
          text: 'Yes, it\'s a 30-day supply for $47. Now, one thing to be aware of - once you hit what\'s called the "donut hole" later in the year, that cost might change temporarily. But I can help you with extra assistance programs if needed when that time comes.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 76,
          speaker: 'patient' as const,
          text: 'Oh my, this is complicated. Can you send me something in writing so I can read it again later?',
          sentiment: 'neutral' as const,
        },
        {
          id: '9',
          timestamp: 84,
          speaker: 'agent' as const,
          text: 'Absolutely! I\'ll mail you a summary letter that explains everything we discussed today. You should receive it in 3-5 business days. It will have my direct number on it too, so you can call me if you have any questions.',
          sentiment: 'positive' as const,
        },
        {
          id: '10',
          timestamp: 98,
          speaker: 'patient' as const,
          text: 'You\'re very kind, Susan. Thank you for being so patient with me.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-008',
      patientName: 'Lisa Chen',
      patientId: 'PT-11089',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['High Copay', 'Commercial Insurance', 'Copay Card + PAP'],
      duration: '13:18',
      startingSentiment: 'negative' as const,
      endingSentiment: 'neutral' as const,
      outcome: 'Follow-up Required' as const,
      complianceScore: 90,
      riskLevel: 'high' as const,
      date: new Date('2024-11-06T11:05:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'financial_assistance',
      detectedFrictionTopics: ['high_costs', 'insurance_confusion'],
      keyPhrases: ['$500 copay', 'can\'t afford', 'even with insurance'],
      summary: 'Patient with commercial insurance facing $500 copay. AI enrolled in copay card and submitted PAP application for additional assistance.',
      actions: ['Enrolled in copay card (reduces to $300)', 'Submitted PAP application', 'Documented financial hardship'],
      followUps: ['PAP decision in 7-10 days', 'If approved, copay drops to $0'],
      transcript: [
        {
          id: '1',
          timestamp: 3,
          speaker: 'agent' as const,
          text: 'Hello Lisa, thank you for calling patient support. What can I help you with?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 9,
          speaker: 'patient' as const,
          text: 'I have insurance through my work, but my copay is still $500 a month. I can\'t afford that. Even with insurance, it\'s too much.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 20,
          speaker: 'agent' as const,
          text: 'I hear you - $500 is a significant amount. Let me see what assistance we can provide. You mentioned you have commercial insurance through your employer, correct?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 30,
          speaker: 'patient' as const,
          text: 'Yes, Aetna. But their coverage for this is terrible.',
          sentiment: 'negative' as const,
        },
        {
          id: '5',
          timestamp: 36,
          speaker: 'agent' as const,
          text: 'Okay. First, I can enroll you in our copay card program right now. That will reduce your $500 copay down to about $300. But I want to do more than that - what\'s your annual household income, if you don\'t mind me asking?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 52,
          speaker: 'patient' as const,
          text: 'It\'s around $65,000 for our family of four.',
          sentiment: 'neutral' as const,
        },
        {
          id: '7',
          timestamp: 58,
          speaker: 'agent' as const,
          text: 'Perfect. You qualify for our patient assistance program. If approved, you could get this medication at no cost - $0 copay. I\'m submitting your application right now along with the copay card enrollment.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 72,
          speaker: 'patient' as const,
          text: 'Wait, zero? Are you serious? How long does that take to find out?',
          sentiment: 'positive' as const,
        },
        {
          id: '9',
          timestamp: 78,
          speaker: 'agent' as const,
          text: 'The PAP application usually takes 7-10 business days to process. In the meantime, use the copay card to get your medication for $300 instead of $500. If the PAP is approved, your next refill will be free.',
          sentiment: 'positive' as const,
        },
        {
          id: '10',
          timestamp: 94,
          speaker: 'patient' as const,
          text: 'Okay. So I still have to pay $300 this month, but maybe nothing next month?',
          sentiment: 'neutral' as const,
        },
        {
          id: '11',
          timestamp: 100,
          speaker: 'agent' as const,
          text: 'Exactly. I know it\'s not perfect right now, but we\'re working to get you to $0. I\'ll call you as soon as I hear back about the PAP approval.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-009',
      patientName: 'David Thompson',
      patientId: 'PT-00234',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Routine Refill', 'Prescription Renewal'],
      duration: '3:12',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 99,
      riskLevel: 'low' as const,
      date: new Date('2024-11-05T13:40:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'root_greeting',
      detectedFrictionTopics: [],
      keyPhrases: [],
      summary: 'Simple routine refill request. AI processed efficiently with no issues.',
      actions: ['Verified insurance active', 'Processed refill', 'Confirmed pharmacy'],
      followUps: [],
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello David, this is patient support. How can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 6,
          speaker: 'patient' as const,
          text: 'Hi, I just need to refill my prescription. I\'m running low.',
          sentiment: 'neutral' as const,
        },
        {
          id: '3',
          timestamp: 12,
          speaker: 'agent' as const,
          text: 'No problem! Let me check your account. I see your last fill was 28 days ago, so you\'re due for a refill. I\'ll send this to your pharmacy - Walgreens on Oak Street, correct?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 24,
          speaker: 'patient' as const,
          text: 'Yes, that\'s right.',
          sentiment: 'positive' as const,
        },
        {
          id: '5',
          timestamp: 27,
          speaker: 'agent' as const,
          text: 'Perfect! Your refill is processed. It should be ready for pickup in about 2 hours. Your copay will be $25 as usual. Anything else I can help with?',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 38,
          speaker: 'patient' as const,
          text: 'Nope, that\'s it. Thanks!',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-010',
      patientName: 'Kevin Rodriguez',
      patientId: 'PT-12445',
      callDriver: 'AI → Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Complex Case', 'PA Renewal', 'Copay Help', 'Pharmacy Change'],
      duration: '18:44',
      startingSentiment: 'negative' as const,
      endingSentiment: 'neutral' as const,
      outcome: 'Follow-up Required' as const,
      complianceScore: 85,
      riskLevel: 'high' as const,
      date: new Date('2024-11-05T10:15:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'financial_assistance',
      detectedFrictionTopics: ['high_costs', 'insurance_confusion', 'access_issues'],
      keyPhrases: ['PA expired', 'too expensive', 'pharmacy closed', 'overwhelmed'],
      summary: 'Complex multi-issue case: PA renewal needed + financial hardship + pharmacy closure. AI started intake, escalated to human for case management.',
      actions: ['Initiated PA renewal with doctor', 'Applied for emergency PAP', 'Transferred to specialty pharmacy', 'Assigned case manager'],
      followUps: ['Case manager to call daily until resolved', 'Emergency medication supply shipped'],
      escalationReason: 'Multiple urgent issues requiring human coordination',
      aiHandlingDuration: '3:15',
      transcript: [
        {
          id: '1',
          timestamp: 3,
          speaker: 'agent' as const,
          text: 'Hello Kevin, this is patient support. How can I assist you?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'I don\'t even know where to start. My pharmacy called and said my prior auth expired, and also they\'re closing down so I need to find a new pharmacy. And I just lost my job so I don\'t know how I\'m going to pay for this. I\'m completely overwhelmed.',
          sentiment: 'negative' as const,
        },
        {
          id: '3',
          timestamp: 26,
          speaker: 'agent' as const,
          text: 'Kevin, I can hear this is really stressful. Let me help you tackle this step by step. I\'m going to connect you with one of our case managers who can coordinate all of this for you. But first - do you have enough medication to last the next few days?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 42,
          speaker: 'patient' as const,
          text: 'I have about 5 days left.',
          sentiment: 'neutral' as const,
        },
        {
          id: '5',
          timestamp: 46,
          speaker: 'agent' as const,
          text: 'Okay, that gives us time. I\'m transferring you to Rachel - she\'s a specialist who handles complex cases like this. She\'ll stay with you until everything is resolved. One moment.',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 195,
          speaker: 'agent' as const,
          text: 'Kevin, this is Rachel. I\'ve reviewed your situation. Here\'s what I\'m doing right now: First, I\'m contacting your doctor to get your PA renewed - that\'s urgent. Second, I\'m submitting an emergency patient assistance application since you lost your job. And third, I\'m transferring your prescription to our specialty pharmacy that delivers. You won\'t have to find a new local pharmacy.',
          sentiment: 'positive' as const,
        },
        {
          id: '7',
          timestamp: 225,
          speaker: 'patient' as const,
          text: 'Okay... that sounds good. How long will all this take?',
          sentiment: 'neutral' as const,
        },
        {
          id: '8',
          timestamp: 230,
          speaker: 'agent' as const,
          text: 'I\'m going to call you every day with updates. I\'m also shipping you a 14-day emergency supply today so you don\'t run out while we work on the PA. That should arrive tomorrow via overnight shipping at no cost to you.',
          sentiment: 'positive' as const,
        },
        {
          id: '9',
          timestamp: 248,
          speaker: 'patient' as const,
          text: 'Really? You can do that? That takes so much pressure off.',
          sentiment: 'positive' as const,
        },
        {
          id: '10',
          timestamp: 254,
          speaker: 'agent' as const,
          text: 'Yes. You\'re not going to go through this alone. I\'m your case manager now, and I\'ll handle all the coordination. You just focus on yourself, and I\'ll call you tomorrow at 10 AM with an update. Does that work?',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-011',
      patientName: 'Emily Watson',
      patientId: 'PT-06733',
      callDriver: 'AI' as const,
      direction: 'Outbound' as const,
      topics: ['AE Follow-up', 'Symptom Check', 'Safety Monitoring'],
      duration: '5:45',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 97,
      riskLevel: 'low' as const,
      date: new Date('2024-11-05T09:30:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'adverse_events',
      detectedFrictionTopics: [],
      keyPhrases: [],
      summary: 'Proactive outbound follow-up call after patient reported headaches last week. Symptoms resolved.',
      actions: ['Verified symptom resolution', 'Updated AE case file', 'Encouraged continued adherence'],
      followUps: [],
      transcript: [
        {
          id: '1',
          timestamp: 4,
          speaker: 'agent' as const,
          text: 'Hello Emily, this is the patient support program calling. I\'m following up on the headaches you reported last week. Do you have a few minutes to talk?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 14,
          speaker: 'patient' as const,
          text: 'Oh yes, hi! The headaches actually went away after a few days.',
          sentiment: 'positive' as const,
        },
        {
          id: '3',
          timestamp: 21,
          speaker: 'agent' as const,
          text: 'That\'s great to hear! Are you still taking the medication as prescribed?',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 26,
          speaker: 'patient' as const,
          text: 'Yes, every day. No more issues.',
          sentiment: 'positive' as const,
        },
        {
          id: '5',
          timestamp: 30,
          speaker: 'agent' as const,
          text: 'Perfect. I\'m updating your file to show the headaches resolved. If you experience any new symptoms or if the headaches return, please don\'t hesitate to call us back. Otherwise, keep doing what you\'re doing!',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 44,
          speaker: 'patient' as const,
          text: 'Thank you for checking in. I appreciate it.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-012',
      patientName: 'Carlos Martinez',
      patientId: 'PT-08821',
      callDriver: 'AI → Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Language Barrier', 'Spanish Interpreter', 'Refill Request'],
      duration: '6:50',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 93,
      riskLevel: 'medium' as const,
      date: new Date('2024-11-04T15:10:00'),
      audioUrl: '/sample-audio.mp3',
      scenarioId: 'root_greeting',
      detectedFrictionTopics: ['access_issues'],
      keyPhrases: ['no speak English', 'español', 'no entiendo'],
      summary: 'Patient struggled with English. AI detected language barrier and immediately transferred to bilingual agent.',
      actions: ['Detected language barrier', 'Transferred to Spanish-speaking agent', 'Processed refill', 'Added language preference to profile'],
      followUps: [],
      escalationReason: 'Language barrier - Spanish required',
      aiHandlingDuration: '0:45',
      transcript: [
        {
          id: '1',
          timestamp: 3,
          speaker: 'agent' as const,
          text: 'Hello, this is patient support. How can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'Ah... no speak English very good. Español?',
          sentiment: 'neutral' as const,
        },
        {
          id: '3',
          timestamp: 14,
          speaker: 'agent' as const,
          text: 'Sí, un momento por favor. Connecting you to a Spanish-speaking agent now.',
          sentiment: 'positive' as const,
        },
        {
          id: '4',
          timestamp: 45,
          speaker: 'agent' as const,
          text: 'Hola Carlos, soy María. ¿Cómo puedo ayudarte hoy?',
          sentiment: 'positive' as const,
        },
        {
          id: '5',
          timestamp: 52,
          speaker: 'patient' as const,
          text: 'Ah, gracias! Necesito más medicina. Mi farmacia dice que necesito llamar.',
          sentiment: 'positive' as const,
        },
        {
          id: '6',
          timestamp: 62,
          speaker: 'agent' as const,
          text: 'Perfecto, puedo ayudarte con eso. Veo que tu última receta fue hace 30 días. Voy a enviar tu resurtido a Walgreens ahora mismo.',
          sentiment: 'positive' as const,
        },
        {
          id: '7',
          timestamp: 95,
          speaker: 'patient' as const,
          text: 'Muchas gracias. Muy amable.',
          sentiment: 'positive' as const,
        },
        {
          id: '8',
          timestamp: 100,
          speaker: 'agent' as const,
          text: 'De nada, Carlos. He marcado tu cuenta para que siempre hables con alguien en español cuando llames. ¿Algo más?',
          sentiment: 'positive' as const,
        },
      ],
    },
  ];

  const complianceChecks = [
    {
      id: '1',
      name: 'HIPAA Privacy Check',
      category: 'hipaa' as const,
      status: 'pass' as const,
      description: 'No PHI disclosed without authorization',
      timestamp: new Date(),
    },
    {
      id: '2',
      name: 'Required Disclosures',
      category: 'disclosure' as const,
      status: 'pass' as const,
      description: 'All required disclosures provided',
    },
  ];

  const keyMoments = [
    {
      id: '1',
      timestamp: 15,
      type: 'topic' as const,
      label: 'Insurance Mentioned',
      description: 'Patient asked about insurance coverage',
      severity: 'medium' as const,
    },
    {
      id: '2',
      timestamp: 45,
      type: 'sentiment' as const,
      label: 'Sentiment Change',
      description: 'Patient sentiment improved',
      severity: 'low' as const,
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return colors.status.success;
      case 'negative': return colors.status.error;
      case 'neutral': return colors.status.warning;
      default: return colors.neutral[500];
    }
  };

  const getSentimentBgColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return colors.status.successBg;
      case 'negative': return colors.status.errorBg;
      case 'neutral': return colors.status.warningBg;
      default: return colors.neutral[100];
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return colors.status.success;
      case 'medium': return colors.status.warning;
      case 'high': return colors.status.error;
      default: return colors.neutral[500];
    }
  };

  const getRiskLevelBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return colors.status.successBg;
      case 'medium': return colors.status.warningBg;
      case 'high': return colors.status.errorBg;
      default: return colors.neutral[100];
    }
  };

  // If a call is selected, show conversation details
  if (selectedHistoryCall) {
    const call = callHistory.find(c => c.id === selectedHistoryCall);
    if (!call) return null;

    return (
      <div style={{ padding: spacing[6], backgroundColor: colors.background.page }}>
        {/* Back button */}
        <button
          onClick={() => setSelectedHistoryCall(null)}
          className="flex items-center mb-6 hover:underline"
          style={{ color: colors.primary[600], fontSize: typography.fontSize.sm }}
        >
          ← Back to Call History
        </button>

        {/* Conversation Details View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Transcript and Audio */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                      Call Recording & Transcript
                    </h2>
                    <p className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                      {call.patientName} • {call.date.toLocaleDateString()} {call.date.toLocaleTimeString()} • {call.duration}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Audio Player */}
                <div style={{ marginBottom: spacing[6] }}>
                  <AudioPlayer
                    audioUrl={call.audioUrl}
                    autoPlay={false}
                  />
                </div>

                {/* Live Transcript Component */}
                <LiveTranscript
                  segments={call.transcript}
                  isLive={false}
                  onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
                />

                {/* Compliance Scorecard */}
                <div style={{ marginTop: spacing[6] }}>
                  <ComplianceScorecard
                    checks={complianceChecks}
                    overallScore={call.complianceScore}
                    callId={call.id}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transcript Bottom Panel */}
            <div style={{ marginTop: spacing[4] }}>
              <TranscriptBottomPanel
                callId={call.id}
                summary={call.summary}
                actions={call.actions}
                followUps={call.followUps}
              />
            </div>
          </div>

          {/* Sidebar - Call Details and Key Moments */}
          <div className="lg:col-span-1">
            {/* Call Details Card */}
            <Card style={{ marginBottom: spacing[4] }}>
              <CardHeader>
                <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                  Call Details
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Patient
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {call.patientName}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {call.patientId}
                    </div>
                  </div>

                  {/* Linked Scenario from Configuration 2.0 */}
                  {call.scenarioId && (
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                        Linked Scenario
                      </div>
                      <div
                        className="px-2 py-1 rounded inline-flex items-center"
                        style={{
                          fontSize: typography.fontSize.xs,
                          backgroundColor: colors.primary[50],
                          color: colors.primary[700],
                          border: `1px solid ${colors.primary[200]}`,
                          fontWeight: typography.fontWeight.medium,
                        }}
                      >
                        {call.scenarioId === 'financial_assistance' && '💰 Financial Assistance'}
                        {call.scenarioId === 'insurance_prior_auth' && '📋 Insurance/PA'}
                        {call.scenarioId === 'adverse_events' && '⚠️ Adverse Events'}
                        {call.scenarioId === 'root_greeting' && '👋 General Support'}
                      </div>
                    </div>
                  )}

                  {/* Detected Friction Topics */}
                  {call.detectedFrictionTopics && call.detectedFrictionTopics.length > 0 && (
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                        Friction Topics Detected
                      </div>
                      <div className="flex flex-wrap" style={{ gap: spacing[1] }}>
                        {call.detectedFrictionTopics.map((topicId, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded"
                            style={{
                              fontSize: typography.fontSize.xs,
                              backgroundColor:
                                topicId === 'high_costs' ? colors.status.errorBg :
                                topicId === 'insurance_confusion' ? colors.status.warningBg :
                                topicId === 'side_effects' ? colors.status.errorBg :
                                topicId === 'access_issues' ? colors.neutral[100] :
                                colors.neutral[100],
                              color:
                                topicId === 'high_costs' ? colors.status.error :
                                topicId === 'insurance_confusion' ? colors.status.warning :
                                topicId === 'side_effects' ? colors.status.error :
                                topicId === 'access_issues' ? colors.neutral[700] :
                                colors.neutral[700],
                              fontWeight: typography.fontWeight.medium,
                            }}
                          >
                            {topicId === 'high_costs' && '💸 High Costs'}
                            {topicId === 'insurance_confusion' && '🤔 Insurance Confusion'}
                            {topicId === 'side_effects' && '⚕️ Side Effects'}
                            {topicId === 'access_issues' && '🚫 Access Issues'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Phrases Triggered */}
                  {call.keyPhrases && call.keyPhrases.length > 0 && (
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                        Key Phrases
                      </div>
                      <div
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontStyle: 'italic',
                          color: colors.neutral[600],
                          padding: spacing[2],
                          backgroundColor: colors.neutral[50],
                          borderRadius: '4px',
                          borderLeft: `3px solid ${colors.primary[500]}`,
                        }}
                      >
                        "{call.keyPhrases.join('", "')}"
                      </div>
                    </div>
                  )}

                  {/* Escalation Info */}
                  {call.escalationReason && (
                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                        Escalation Details
                      </div>
                      <div
                        style={{
                          padding: spacing[2],
                          backgroundColor: colors.status.warningBg,
                          borderRadius: '4px',
                          border: `1px solid ${colors.status.warning}`,
                        }}
                      >
                        <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.status.warning, marginBottom: spacing[1] }}>
                          Reason: {call.escalationReason}
                        </div>
                        {call.aiHandlingDuration && (
                          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                            AI handled for {call.aiHandlingDuration} before escalation
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Call Driver
                    </div>
                    <Badge variant={call.callDriver.includes('AI') ? 'primary' : 'secondary'}>
                      {call.callDriver}
                    </Badge>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Direction
                    </div>
                    <div className="flex items-center" style={{ gap: spacing[2] }}>
                      {call.direction === 'Inbound' ? (
                        <PhoneIncoming style={{ width: '14px', height: '14px', color: colors.primary[600] }} />
                      ) : (
                        <PhoneOutgoing style={{ width: '14px', height: '14px', color: colors.primary[600] }} />
                      )}
                      <span style={{ fontSize: typography.fontSize.sm }}>{call.direction}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Topics
                    </div>
                    <div className="flex flex-wrap" style={{ gap: spacing[1] }}>
                      {call.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded"
                          style={{
                            fontSize: typography.fontSize.xs,
                            backgroundColor: colors.neutral[100],
                            color: colors.neutral[700]
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Sentiment Journey
                    </div>
                    <div className="flex items-center" style={{ gap: spacing[2] }}>
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          fontSize: typography.fontSize.xs,
                          backgroundColor: getSentimentBgColor(call.startingSentiment),
                          color: getSentimentColor(call.startingSentiment)
                        }}
                      >
                        {call.startingSentiment}
                      </span>
                      <span style={{ color: colors.neutral[400] }}>→</span>
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          fontSize: typography.fontSize.xs,
                          backgroundColor: getSentimentBgColor(call.endingSentiment),
                          color: getSentimentColor(call.endingSentiment)
                        }}
                      >
                        {call.endingSentiment}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Outcome
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm }}>{call.outcome}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Compliance Score
                    </div>
                    <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.primary[600] }}>
                      {call.complianceScore}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Risk Level
                    </div>
                    <span
                      className="px-2 py-1 rounded capitalize"
                      style={{
                        fontSize: typography.fontSize.xs,
                        backgroundColor: getRiskLevelBgColor(call.riskLevel),
                        color: getRiskLevelColor(call.riskLevel),
                        fontWeight: typography.fontWeight.semibold
                      }}
                    >
                      {call.riskLevel}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Moments Sidebar */}
            <KeyMomentsSidebar
              moments={keyMoments}
              onMomentClick={(moment) => console.log('Moment clicked:', moment)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show call history table
  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header */}
      <div>
        <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Call History & Transcripts
        </h1>
        <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
          {callHistory.length} conversations recorded
        </p>
      </div>

      {/* Conversation Filters Component */}
      <div>
        <ConversationFilters
          onFilterChange={(filters) => console.log('Filters changed:', filters)}
          onReset={() => console.log('Filters reset')}
        />
      </div>

      {/* Call History Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: typography.fontSize.sm }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Patient
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Call Driver
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Direction
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Topics
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Duration
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Start →  End
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Outcome
                </th>
                <th style={{ padding: spacing[3], textAlign: 'center', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Compliance
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Risk
                </th>
                <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {callHistory.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => setSelectedHistoryCall(call.id)}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  style={{ borderBottom: `1px solid ${colors.neutral[100]}` }}
                >
                  <td style={{ padding: spacing[3] }}>
                    <div style={{ fontWeight: typography.fontWeight.medium }}>{call.patientName}</div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>{call.patientId}</div>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <Badge variant={call.callDriver === 'AI' ? 'primary' : 'secondary'}>
                      {call.callDriver}
                    </Badge>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <div className="flex items-center" style={{ gap: spacing[2] }}>
                      {call.direction === 'Inbound' ? (
                        <PhoneIncoming style={{ width: '14px', height: '14px', color: colors.primary[600] }} />
                      ) : (
                        <PhoneOutgoing style={{ width: '14px', height: '14px', color: colors.primary[600] }} />
                      )}
                      <span>{call.direction}</span>
                    </div>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <div className="flex flex-wrap" style={{ gap: spacing[1], maxWidth: '200px' }}>
                      {call.topics.slice(0, 2).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded"
                          style={{
                            fontSize: typography.fontSize.xs,
                            backgroundColor: colors.neutral[100],
                            color: colors.neutral[600]
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                      {call.topics.length > 2 && (
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                          +{call.topics.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <div className="flex items-center" style={{ gap: spacing[1] }}>
                      <Clock style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                      {call.duration}
                    </div>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <div className="flex items-center" style={{ gap: spacing[2] }}>
                      <span
                        className="px-2 py-1 rounded capitalize"
                        style={{
                          fontSize: typography.fontSize.xs,
                          backgroundColor: getSentimentBgColor(call.startingSentiment),
                          color: getSentimentColor(call.startingSentiment)
                        }}
                      >
                        {call.startingSentiment.charAt(0)}
                      </span>
                      <span style={{ color: colors.neutral[400] }}>→</span>
                      <span
                        className="px-2 py-1 rounded capitalize"
                        style={{
                          fontSize: typography.fontSize.xs,
                          backgroundColor: getSentimentBgColor(call.endingSentiment),
                          color: getSentimentColor(call.endingSentiment)
                        }}
                      >
                        {call.endingSentiment.charAt(0)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    {call.outcome}
                  </td>
                  <td style={{ padding: spacing[3], textAlign: 'center' }}>
                    <span style={{ fontWeight: typography.fontWeight.semibold, color: call.complianceScore >= 90 ? colors.status.success : call.complianceScore >= 80 ? colors.status.warning : colors.status.error }}>
                      {call.complianceScore}%
                    </span>
                  </td>
                  <td style={{ padding: spacing[3] }}>
                    <span
                      className="px-2 py-1 rounded capitalize"
                      style={{
                        fontSize: typography.fontSize.xs,
                        backgroundColor: getRiskLevelBgColor(call.riskLevel),
                        color: getRiskLevelColor(call.riskLevel),
                        fontWeight: typography.fontWeight.semibold
                      }}
                    >
                      {call.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: spacing[3], whiteSpace: 'nowrap' }}>
                    <div>{call.date.toLocaleDateString()}</div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {call.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
