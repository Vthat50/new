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

  const renderCallHistoryTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-neutral-900" style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            Call History
          </h2>
          <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
            Recent conversation history and recordings
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

      <div className="text-center py-12 text-neutral-500">
        Call history with integrated filters - {activeCalls.length} calls total
      </div>
    </div>
  );

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
            onExport={() => console.log('Export transcript')}
            onShare={() => console.log('Share transcript')}
            onAddNote={() => console.log('Add note')}
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
