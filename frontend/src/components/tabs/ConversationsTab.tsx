import React, { useState } from 'react';
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Download,
  Eye,
  AlertCircle,
  Activity,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import AudioPlayer from '../shared/AudioPlayer';

// Import ALL conversation components
import AnimatedWaveform from '../conversations/AnimatedWaveform';
import SpeakerDetection from '../conversations/SpeakerDetection';
import ComplianceScorecard from '../conversations/ComplianceScorecard';
import TopicDetector from '../conversations/TopicDetector';
import LiveTranscript from '../conversations/LiveTranscript';
import ConversationFilters from '../conversations/ConversationFilters';
import KeyMomentsSidebar from '../conversations/KeyMomentsSidebar';
import TranscriptBottomPanel from '../conversations/TranscriptBottomPanel';
import EndCallModal from '../conversations/EndCallModal';
import TakeOverModal from '../conversations/TakeOverModal';

type TabType = 'active' | 'history' | 'transcript' | 'analytics';

export default function ConversationsTab() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [showEndCallModal, setShowEndCallModal] = useState(false);
  const [showTakeOverModal, setShowTakeOverModal] = useState(false);
  const [selectedHistoryCall, setSelectedHistoryCall] = useState<string | null>(null);

  // Sample active calls data
  const activeCalls = [
    {
      id: '1',
      patientName: 'Sarah Martinez',
      patientId: 'PT-00123',
      duration: '4:32',
      callReason: 'Prior Authorization Update',
      sentiment: 'positive' as const,
      sentimentScore: 0.85,
      currentTopic: 'Insurance verification',
      transcriptPreview: 'I understand your PA was approved. Let me verify your coverage details...',
      speakers: [
        { id: '1', name: 'AI Agent', role: 'agent' as const, confidence: 0.98 },
        { id: '2', name: 'Patient', role: 'patient' as const, confidence: 0.95 },
      ],
    },
    {
      id: '2',
      patientName: 'Michael Roberts',
      patientId: 'PT-00456',
      duration: '2:18',
      callReason: 'Refill Request',
      sentiment: 'neutral' as const,
      sentimentScore: 0.55,
      currentTopic: 'Medication refill',
      transcriptPreview: 'Yes, I can help you with that refill. What pharmacy do you use?',
      speakers: [
        { id: '1', name: 'AI Agent', role: 'agent' as const, confidence: 0.97 },
        { id: '2', name: 'Patient', role: 'patient' as const, confidence: 0.93 },
      ],
    },
  ];

  // Call history data
  const callHistory = [
    {
      id: 'call-001',
      patientName: 'Sarah Martinez',
      patientId: 'PT-00123',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Prior Authorization', 'Insurance Coverage'],
      duration: '8:42',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 95,
      riskLevel: 'low' as const,
      date: new Date('2024-11-06T10:30:00'),
      audioUrl: '/sample-audio.mp3',
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
          text: 'Perfect! Let me pull up your information. I can confirm your prior authorization was approved on November 4th. Your coverage includes full medication costs with a $25 copay.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-002',
      patientName: 'Michael Roberts',
      patientId: 'PT-00456',
      callDriver: 'Human Agent' as const,
      direction: 'Outbound' as const,
      topics: ['Refill Request', 'Pharmacy'],
      duration: '5:23',
      startingSentiment: 'negative' as const,
      endingSentiment: 'neutral' as const,
      outcome: 'Follow-up Required' as const,
      complianceScore: 88,
      riskLevel: 'medium' as const,
      date: new Date('2024-11-06T09:15:00'),
      audioUrl: '/sample-audio.mp3',
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hi Michael, this is calling from the patient support team. I\'m following up on your refill request.',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'Oh, yes. I\'ve been trying to get this refill for days. My pharmacy says they haven\'t received the authorization.',
          sentiment: 'negative' as const,
        },
      ],
    },
    {
      id: 'call-003',
      patientName: 'Jennifer Lee',
      patientId: 'PT-00789',
      callDriver: 'AI' as const,
      direction: 'Inbound' as const,
      topics: ['Side Effects', 'Dosage Questions'],
      duration: '12:15',
      startingSentiment: 'negative' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Escalated to Provider' as const,
      complianceScore: 92,
      riskLevel: 'high' as const,
      date: new Date('2024-11-05T14:20:00'),
      audioUrl: '/sample-audio.mp3',
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Jennifer, how can I help you today?',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 5,
          speaker: 'patient' as const,
          text: 'I\'ve been experiencing severe nausea since I started this medication. I\'m worried.',
          sentiment: 'negative' as const,
        },
      ],
    },
    {
      id: 'call-004',
      patientName: 'David Chen',
      patientId: 'PT-00234',
      callDriver: 'AI' as const,
      direction: 'Outbound' as const,
      topics: ['Appointment Reminder', 'Lab Results'],
      duration: '3:45',
      startingSentiment: 'neutral' as const,
      endingSentiment: 'positive' as const,
      outcome: 'Resolved' as const,
      complianceScore: 98,
      riskLevel: 'low' as const,
      date: new Date('2024-11-05T11:00:00'),
      audioUrl: '/sample-audio.mp3',
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hi David, this is a courtesy call to remind you about your appointment tomorrow at 2 PM.',
          sentiment: 'positive' as const,
        },
        {
          id: '2',
          timestamp: 8,
          speaker: 'patient' as const,
          text: 'Thank you! Yes, I have it on my calendar.',
          sentiment: 'positive' as const,
        },
      ],
    },
    {
      id: 'call-005',
      patientName: 'Emma Wilson',
      patientId: 'PT-00567',
      callDriver: 'Human Agent' as const,
      direction: 'Inbound' as const,
      topics: ['Billing Questions', 'Copay Assistance'],
      duration: '15:30',
      startingSentiment: 'negative' as const,
      endingSentiment: 'negative' as const,
      outcome: 'Unresolved' as const,
      complianceScore: 75,
      riskLevel: 'high' as const,
      date: new Date('2024-11-04T16:45:00'),
      audioUrl: '/sample-audio.mp3',
      transcript: [
        {
          id: '1',
          timestamp: 2,
          speaker: 'agent' as const,
          text: 'Hello Emma, I understand you have questions about your recent bill.',
          sentiment: 'neutral' as const,
        },
        {
          id: '2',
          timestamp: 6,
          speaker: 'patient' as const,
          text: 'Yes, I was told my copay would be $25 but I was charged $150. This is unacceptable.',
          sentiment: 'negative' as const,
        },
      ],
    },
  ];

  const topicsDetected = [
    {
      id: '1',
      name: 'Insurance Coverage',
      confidence: 0.92,
      category: 'financial' as const,
      firstMentioned: 15,
      mentions: 5,
      relatedKeywords: ['coverage', 'PA', 'approval'],
      sentiment: 'positive' as const,
    },
    {
      id: '2',
      name: 'Side Effects',
      confidence: 0.78,
      category: 'clinical' as const,
      firstMentioned: 45,
      mentions: 3,
      relatedKeywords: ['nausea', 'headache'],
      sentiment: 'negative' as const,
      requiresAction: true,
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

  const liveTranscript = {
    segments: [
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
        text: 'Perfect! Let me pull up your information. I can confirm your prior authorization was approved on November 4th. Your coverage includes full medication costs with a $25 copay.',
        sentiment: 'positive' as const,
      },
      {
        id: '4',
        timestamp: 28,
        speaker: 'patient' as const,
        text: 'That\'s great! When can I start picking up my medication?',
        sentiment: 'positive' as const,
      },
      {
        id: '5',
        timestamp: 35,
        speaker: 'agent' as const,
        text: 'You can pick it up as early as tomorrow. I\'ve sent the authorization to your pharmacy - CVS on Main Street. They should have it ready by noon tomorrow.',
        sentiment: 'positive' as const,
      },
    ],
    isLive: true,
  };

  const renderActiveCallsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Active Calls
          </h2>
          <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
            {activeCalls.length} conversations in progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activeCalls.map((call) => (
          <Card key={call.id} className="hover:shadow-lg transition-all">
            <CardContent style={{ padding: spacing[6] }}>
              {/* Header with waveform animation */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start" style={{ gap: spacing[3], flex: 1 }}>
                  <div className="relative">
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: colors.primary[50],
                      }}
                    >
                      <Phone style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
                    </div>
                    <div
                      className="absolute -top-1 -right-1 rounded-full animate-pulse"
                      style={{
                        width: '14px',
                        height: '14px',
                        backgroundColor: colors.status.success,
                        border: `2px solid white`,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-neutral-900" style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                      {call.patientName}
                    </div>
                    <div className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                      {call.patientId} • {call.duration}
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Waveform */}
              <div style={{ marginBottom: spacing[4] }}>
                <AnimatedWaveform
                  audioUrl="/sample-audio.mp3"
                  isPlaying={true}
                  height={60}
                />
              </div>

              {/* Speaker Detection */}
              <div style={{ marginBottom: spacing[4] }}>
                <SpeakerDetection
                  speakers={call.speakers}
                  currentSpeaker={call.speakers[0]}
                />
              </div>

              {/* Topic Detector */}
              <div style={{ marginBottom: spacing[4] }}>
                <TopicDetector
                  topics={topicsDetected}
                  onTopicClick={(topic) => console.log('Topic clicked:', topic)}
                />
              </div>

              {/* Live Transcript Preview */}
              <div className="mb-4">
                <div className="text-xs text-neutral-500 mb-2">Live Transcript</div>
                <div
                  className="text-sm text-neutral-700 italic"
                  style={{ padding: spacing[3], backgroundColor: colors.neutral[50], borderRadius: '4px' }}
                >
                  "{call.transcriptPreview}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <button
                  onClick={() => setSelectedCallId(call.id)}
                  className="flex-1 rounded transition-colors"
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.primary[500],
                    color: 'white',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  Listen In
                </button>
                <button
                  onClick={() => {
                    setSelectedCallId(call.id);
                    setShowTakeOverModal(true);
                  }}
                  className="flex-1 border border-neutral-300 rounded transition-colors hover:bg-neutral-50"
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[700],
                  }}
                >
                  Take Over
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

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

  const renderCallHistoryTab = () => {
    // If a call is selected, show conversation details
    if (selectedHistoryCall) {
      const call = callHistory.find(c => c.id === selectedHistoryCall);
      if (!call) return null;

      return (
        <div>
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

                    <div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                        Call Driver
                      </div>
                      <Badge variant={call.callDriver === 'AI' ? 'primary' : 'secondary'}>
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
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
              Call History
            </h2>
            <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
              {callHistory.length} conversations recorded
            </p>
          </div>
        </div>

        {/* Conversation Filters Component */}
        <div style={{ marginBottom: spacing[6] }}>
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
  };

  const renderTranscriptTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Transcript Panel */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                  Call Transcript
                </h2>
                <p className="text-neutral-500" style={{ fontSize: typography.fontSize.xs }}>
                  Sarah Martinez • Nov 6, 2024 10:30 AM • 8:42
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Live Transcript Component */}
            <LiveTranscript
              segments={liveTranscript.segments}
              isLive={liveTranscript.isLive}
              onSegmentClick={(segment) => console.log('Segment clicked:', segment)}
            />

            {/* Compliance Scorecard */}
            <div style={{ marginTop: spacing[6] }}>
              <ComplianceScorecard
                checks={complianceChecks}
                overallScore={95}
                callId="1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transcript Bottom Panel */}
        <div style={{ marginTop: spacing[4] }}>
          <TranscriptBottomPanel
            callId="demo-call-1"
            summary="Patient called regarding their medication refill. Confirmed insurance coverage and pharmacy details. Discussed potential side effects and adherence support."
            actions={[
              { id: '1', description: 'Verify insurance coverage', status: 'completed' as const, timestamp: Date.now() / 1000 - 3600 },
              { id: '2', description: 'Send refill authorization to pharmacy', status: 'completed' as const, timestamp: Date.now() / 1000 - 1800 },
              { id: '3', description: 'Schedule follow-up call', status: 'pending' as const, timestamp: Date.now() / 1000 },
            ]}
            followUps={[
              { id: '1', type: 'call' as const, description: 'Follow-up on medication adherence', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), assignedTo: 'Care Team', priority: 'medium' as const },
              { id: '2', type: 'email' as const, description: 'Send medication guide and resources', dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), assignedTo: 'Support Team', priority: 'low' as const },
            ]}
          />
        </div>
      </div>

      {/* Key Moments Sidebar */}
      <div className="lg:col-span-1">
        <KeyMomentsSidebar
          moments={keyMoments}
          onMomentClick={(moment) => console.log('Moment clicked:', moment)}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header */}
      <div>
        <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Conversations
        </h1>
        <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
          Monitor live calls, review history, and analyze transcripts
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex" style={{ gap: spacing[2] }}>
          {[
            { id: 'active' as TabType, label: 'Active Calls', badge: activeCalls.length },
            { id: 'history' as TabType, label: 'Call History' },
            { id: 'transcript' as TabType, label: 'Transcript Viewer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="transition-colors"
              style={{
                padding: `${spacing[3]} ${spacing[4]}`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: activeTab === tab.id ? colors.primary[600] : colors.neutral[600],
                borderBottom: activeTab === tab.id ? `2px solid ${colors.primary[600]}` : '2px solid transparent',
              }}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className="ml-2 rounded-full"
                  style={{
                    padding: `2px ${spacing[2]}`,
                    fontSize: typography.fontSize.xs,
                    backgroundColor: activeTab === tab.id ? colors.primary[100] : colors.neutral[100],
                    color: activeTab === tab.id ? colors.primary[700] : colors.neutral[600],
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && renderActiveCallsTab()}
      {activeTab === 'history' && renderCallHistoryTab()}
      {activeTab === 'transcript' && renderTranscriptTab()}

      {/* ALL Missing Conversation Modals */}
      {showEndCallModal && (
        <EndCallModal
          callId={selectedCallId || '1'}
          onEnd={(summary) => {
            console.log('Call ended:', summary);
            setShowEndCallModal(false);
          }}
          onClose={() => setShowEndCallModal(false)}
        />
      )}

      {showTakeOverModal && (
        <TakeOverModal
          callId={selectedCallId || '1'}
          onTakeOver={() => {
            console.log('Call taken over');
            setShowTakeOverModal(false);
          }}
          onClose={() => setShowTakeOverModal(false)}
        />
      )}
    </div>
  );
}
