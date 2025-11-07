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
  BarChart3,
  TrendingUp,
  Users,
  Timer,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import AudioPlayer from '../shared/AudioPlayer';

type TabType = 'active' | 'history' | 'transcript' | 'analytics';

export default function ConversationsTab() {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Sample active calls data
  const activeCalls = [
    {
      id: 1,
      patientName: 'Sarah Martinez',
      patientId: 'PT-00123',
      duration: '4:32',
      callReason: 'Prior Authorization Update',
      sentiment: 'positive',
      sentimentScore: 0.85,
      currentTopic: 'Insurance verification',
      transcriptPreview: 'I understand your PA was approved. Let me verify your coverage details...',
    },
    {
      id: 2,
      patientName: 'Michael Roberts',
      patientId: 'PT-00456',
      duration: '2:18',
      callReason: 'Refill Request',
      sentiment: 'neutral',
      sentimentScore: 0.55,
      currentTopic: 'Medication refill',
      transcriptPreview: 'Yes, I can help you with that refill. What pharmacy do you use?',
    },
    {
      id: 3,
      patientName: 'Jennifer Kim',
      patientId: 'PT-00789',
      duration: '6:45',
      callReason: 'Financial Assistance',
      sentiment: 'positive',
      sentimentScore: 0.92,
      currentTopic: 'Copay card enrollment',
      transcriptPreview: 'Great news! You qualify for our copay assistance program...',
    },
  ];

  // Sample call history data
  const callHistory = [
    {
      id: 1,
      timestamp: '2024-11-06 10:30 AM',
      direction: 'inbound',
      patientName: 'Sarah Martinez',
      duration: '8:42',
      callReason: 'Medication Questions',
      frictionTopics: ['Insurance Coverage', 'Side Effects'],
      sentiment: 'positive',
      sentimentScore: 0.78,
      outcome: 'Resolved',
      complianceScore: 95,
    },
    {
      id: 2,
      timestamp: '2024-11-06 09:15 AM',
      direction: 'outbound',
      patientName: 'Michael Roberts',
      duration: '5:22',
      callReason: 'Financial Assistance',
      frictionTopics: ['High Cost', 'PA Delays'],
      sentiment: 'neutral',
      sentimentScore: 0.62,
      outcome: 'Follow-up',
      complianceScore: 88,
    },
    {
      id: 3,
      timestamp: '2024-11-06 08:45 AM',
      direction: 'inbound',
      patientName: 'Jennifer Kim',
      duration: '12:15',
      callReason: 'Adverse Event',
      frictionTopics: ['Side Effects', 'Discontinuation Risk'],
      sentiment: 'negative',
      sentimentScore: 0.35,
      outcome: 'Escalated',
      complianceScore: 76,
    },
  ];

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return colors.status.success;
    if (score >= 0.4) return colors.status.warning;
    return colors.status.error;
  };

  const getOutcomeBadge = (outcome: string) => {
    const outcomeStyles = {
      'Resolved': { bg: colors.status.successBg, color: colors.status.success },
      'Follow-up': { bg: colors.status.warningBg, color: colors.status.warning },
      'Escalated': { bg: colors.status.errorBg, color: colors.status.error },
    };
    const style = outcomeStyles[outcome as keyof typeof outcomeStyles] || outcomeStyles['Follow-up'];

    return (
      <span
        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {outcome}
      </span>
    );
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
                    {/* Pulsing live indicator */}
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
                <div className="text-right">
                  <div className="flex items-center justify-end" style={{ gap: spacing[1], marginBottom: spacing[1] }}>
                    <div
                      className="rounded-full"
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: getSentimentColor(call.sentimentScore)
                      }}
                    />
                  </div>
                  <div className="text-xs text-neutral-500">
                    {(call.sentimentScore * 100).toFixed(0)}% positive
                  </div>
                </div>
              </div>

              {/* Current Topic Detection */}
              <div
                className="border-l-4 pl-3 mb-4"
                style={{ borderColor: colors.primary[500], backgroundColor: colors.neutral[50], padding: `${spacing[2]} ${spacing[3]}`, borderRadius: '4px' }}
              >
                <div className="text-xs text-neutral-500 mb-1">Current Topic</div>
                <div className="text-sm font-medium text-neutral-900">{call.currentTopic}</div>
              </div>

              {/* Call Reason */}
              <div className="mb-4">
                <div className="text-xs text-neutral-500 mb-1">Call Reason</div>
                <span
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: colors.primary[50], color: colors.primary[700] }}
                >
                  {call.callReason}
                </span>
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
        <button
          className="border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
          style={{ padding: `${spacing[2]} ${spacing[4]}`, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[700] }}
        >
          <Download style={{ width: '16px', height: '16px', display: 'inline', marginRight: spacing[2] }} />
          Export
        </button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search calls..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ fontSize: typography.fontSize.sm }}
              />
            </div>
            <select className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary" style={{ fontSize: typography.fontSize.sm }}>
              <option value="">All Directions</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary" style={{ fontSize: typography.fontSize.sm }}>
              <option value="">All Call Reasons</option>
              <option value="medication">Medication Questions</option>
              <option value="financial">Financial Assistance</option>
              <option value="adverse">Adverse Event</option>
              <option value="refill">Refill Request</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary" style={{ fontSize: typography.fontSize.sm }}>
              <option value="">All Outcomes</option>
              <option value="resolved">Resolved</option>
              <option value="followup">Follow-up</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Call History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Call Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Friction Topics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Sentiment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Outcome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {callHistory.map((call) => (
                  <tr key={call.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{call.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        {call.direction === 'inbound' ? (
                          <PhoneIncoming style={{ width: '16px', height: '16px', color: colors.status.success }} />
                        ) : (
                          <PhoneOutgoing style={{ width: '16px', height: '16px', color: colors.primary[500] }} />
                        )}
                        <span className="text-sm text-neutral-700 capitalize">{call.direction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-neutral-900">{call.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[1] }}>
                        <Clock style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                        <span className="text-sm text-neutral-600">{call.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: colors.primary[50], color: colors.primary[700] }}
                      >
                        {call.callReason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap" style={{ gap: spacing[1] }}>
                        {call.frictionTopics.map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: colors.status.warningBg, color: colors.status.warning }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <div
                          className="rounded-full"
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: getSentimentColor(call.sentimentScore)
                          }}
                        />
                        <div
                          className="w-16 h-2 rounded-full"
                          style={{ backgroundColor: colors.neutral[200] }}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${call.sentimentScore * 100}%`,
                              backgroundColor: getSentimentColor(call.sentimentScore),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOutcomeBadge(call.outcome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <button
                          className="rounded transition-colors hover:bg-primary-50"
                          style={{
                            padding: spacing[2],
                            color: colors.primary[600],
                          }}
                          title="Play Recording"
                        >
                          <Play style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => setActiveTab('transcript')}
                          className="rounded transition-colors hover:bg-neutral-100"
                          style={{
                            padding: spacing[2],
                            color: colors.neutral[600],
                          }}
                          title="View Transcript"
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          className="rounded transition-colors hover:bg-neutral-100"
                          style={{
                            padding: spacing[2],
                            color: colors.neutral[600],
                          }}
                          title="Download"
                        >
                          <Download style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
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
              <button
                className="border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                style={{ padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm }}
              >
                <Download style={{ width: '14px', height: '14px', display: 'inline', marginRight: spacing[2] }} />
                Download
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Audio Player with Waveform */}
            <div className="mb-6">
              <AudioPlayer title="Call Recording - Sarah Martinez - 2024-11-06 10:30 AM" />
            </div>

            {/* Transcript */}
            <div className="space-y-4">
              <div className="flex" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: colors.primary[100],
                  }}
                >
                  <span className="text-xs font-semibold text-primary-700">AI</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1" style={{ gap: spacing[2] }}>
                    <span className="text-sm font-semibold text-neutral-900">Voice AI Agent</span>
                    <span className="text-xs text-neutral-500">0:02</span>
                  </div>
                  <div
                    className="text-sm text-neutral-700 rounded-lg"
                    style={{ padding: spacing[3], backgroundColor: colors.neutral[50] }}
                  >
                    Hello Sarah, this is the patient support line. I see you're calling about your prior authorization. How can I help you today?
                  </div>
                </div>
              </div>

              <div className="flex" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: colors.neutral[200],
                  }}
                >
                  <span className="text-xs font-semibold text-neutral-700">PT</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1" style={{ gap: spacing[2] }}>
                    <span className="text-sm font-semibold text-neutral-900">Patient</span>
                    <span className="text-xs text-neutral-500">0:08</span>
                    <div
                      className="rounded-full"
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: colors.status.success
                      }}
                    />
                  </div>
                  <div
                    className="text-sm text-neutral-700 rounded-lg"
                    style={{ padding: spacing[3], backgroundColor: colors.neutral[50] }}
                  >
                    Yes, I received a letter saying my PA was approved. I just want to make sure everything is set up correctly with my insurance.
                  </div>
                  {/* Highlighted friction topic */}
                  <div
                    className="mt-2 text-xs flex items-center"
                    style={{ gap: spacing[1], color: colors.status.warning }}
                  >
                    <AlertCircle style={{ width: '12px', height: '12px' }} />
                    <span>Friction detected: Insurance verification</span>
                  </div>
                </div>
              </div>

              <div className="flex" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: colors.primary[100],
                  }}
                >
                  <span className="text-xs font-semibold text-primary-700">AI</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1" style={{ gap: spacing[2] }}>
                    <span className="text-sm font-semibold text-neutral-900">Voice AI Agent</span>
                    <span className="text-xs text-neutral-500">0:22</span>
                  </div>
                  <div
                    className="text-sm text-neutral-700 rounded-lg"
                    style={{ padding: spacing[3], backgroundColor: colors.neutral[50] }}
                  >
                    Absolutely, I can help with that. Let me pull up your information... I can confirm your prior authorization was approved on November 3rd and your insurance has been notified. Your coverage is active and you can pick up your medication from your pharmacy today.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar with Summary and Key Moments */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
              AI Summary
            </h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-700 space-y-3">
              <p>Patient called to verify prior authorization approval status and insurance coverage.</p>
              <p>Confirmed PA approval date and active insurance coverage. Advised patient medication is ready for pickup.</p>
              <div className="pt-3 border-t border-neutral-200">
                <div className="text-xs font-semibold text-neutral-600 mb-2">Action Items</div>
                <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
                  <li>PA approved - documented in system</li>
                  <li>Insurance verified - coverage active</li>
                  <li>Follow-up in 30 days for refill</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-neutral-900" style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
              Key Moments
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div
                className="flex items-start border-l-4 pl-3"
                style={{ borderColor: colors.status.warning, gap: spacing[2] }}
              >
                <AlertCircle style={{ width: '16px', height: '16px', color: colors.status.warning, flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="text-xs font-semibold text-neutral-900">Insurance Mentioned</div>
                  <div className="text-xs text-neutral-600">0:08</div>
                </div>
              </div>
              <div
                className="flex items-start border-l-4 pl-3"
                style={{ borderColor: colors.status.success, gap: spacing[2] }}
              >
                <Activity style={{ width: '16px', height: '16px', color: colors.status.success, flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="text-xs font-semibold text-neutral-900">PA Status Confirmed</div>
                  <div className="text-xs text-neutral-600">0:22</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            { id: 'analytics' as TabType, label: 'Analytics' },
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
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  );

  function renderAnalyticsTab() {
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.primary[100]
                  }}
                >
                  <Phone style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase' }}>
                    Total Calls Today
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold }}>
                    234
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <TrendingUp style={{ width: '16px', height: '16px', color: colors.status.success }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
                  +8% vs yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.successBg
                  }}
                >
                  <Activity style={{ width: '24px', height: '24px', color: colors.status.success }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase' }}>
                    Avg Sentiment
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                    82%
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <TrendingUp style={{ width: '16px', height: '16px', color: colors.status.success }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
                  +3% this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.infoBg
                  }}
                >
                  <Timer style={{ width: '24px', height: '24px', color: colors.status.info }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase' }}>
                    Avg Handle Time
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold }}>
                    4:32
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <TrendingUp style={{ width: '16px', height: '16px', color: colors.status.success }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
                  12% faster
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: spacing[6] }}>
              <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4] }}>
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.warningBg
                  }}
                >
                  <AlertCircle style={{ width: '24px', height: '24px', color: colors.status.warning }} />
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], textTransform: 'uppercase' }}>
                    Escalation Rate
                  </div>
                  <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold }}>
                    4.2%
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2] }}>
                <TrendingUp style={{ width: '16px', height: '16px', color: colors.status.success }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
                  -15% better
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Volume by Hour */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Call Volume by Hour (Today)
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between" style={{ height: '200px', gap: spacing[2] }}>
              {[12, 18, 24, 35, 48, 52, 45, 38, 30, 25, 20, 15].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(value / 52) * 100}%`,
                      backgroundColor: colors.primary[500]
                    }}
                  />
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginTop: spacing[2] }}>
                    {i + 8}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Call Reasons */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Top Call Reasons
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { reason: 'Refill Requests', count: 89, percentage: 38 },
                  { reason: 'PA Status', count: 65, percentage: 28 },
                  { reason: 'Financial Assistance', count: 42, percentage: 18 },
                  { reason: 'Side Effects', count: 25, percentage: 11 },
                  { reason: 'General Questions', count: 13, percentage: 5 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between" style={{ marginBottom: spacing[1] }}>
                      <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                        {item.reason}
                      </span>
                      <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full rounded-full" style={{ height: '8px', backgroundColor: colors.neutral[200] }}>
                      <div
                        className="rounded-full"
                        style={{
                          height: '8px',
                          width: `${item.percentage}%`,
                          backgroundColor: colors.primary[500]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                Sentiment Distribution
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Positive', count: 156, percentage: 67, color: colors.status.success },
                  { label: 'Neutral', count: 58, percentage: 25, color: colors.status.warning },
                  { label: 'Negative', count: 20, percentage: 8, color: colors.status.error },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between" style={{ marginBottom: spacing[1] }}>
                      <div className="flex items-center" style={{ gap: spacing[2] }}>
                        <div
                          className="rounded-full"
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: item.color
                          }}
                        />
                        <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                          {item.label}
                        </span>
                      </div>
                      <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full rounded-full" style={{ height: '8px', backgroundColor: colors.neutral[200] }}>
                      <div
                        className="rounded-full"
                        style={{
                          height: '8px',
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Agent Performance (AI vs Human)
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2] }}>
                  Resolution Rate
                </div>
                <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success, marginBottom: spacing[1] }}>
                  96%
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  AI: 98% | Human: 92%
                </div>
              </div>
              <div className="text-center">
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2] }}>
                  Avg Handle Time
                </div>
                <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success, marginBottom: spacing[1] }}>
                  4:32
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  AI: 3:45 | Human: 6:12
                </div>
              </div>
              <div className="text-center">
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2] }}>
                  Satisfaction Score
                </div>
                <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success, marginBottom: spacing[1] }}>
                  4.8/5
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  AI: 4.9 | Human: 4.6
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
