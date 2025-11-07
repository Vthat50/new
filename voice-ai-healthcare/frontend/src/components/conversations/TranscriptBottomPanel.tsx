import React, { useState } from 'react';
import { FileText, CheckSquare, Calendar } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface TranscriptBottomPanelProps {
  callId: string;
  summary?: string;
  actions?: CallAction[];
  followUps?: FollowUp[];
}

interface CallAction {
  id: string;
  description: string;
  status: 'completed' | 'pending';
  timestamp: number;
}

interface FollowUp {
  id: string;
  type: 'call' | 'email' | 'task' | 'appointment';
  description: string;
  dueDate?: string;
  assignedTo?: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function TranscriptBottomPanel({
  callId,
  summary,
  actions = [],
  followUps = [],
}: TranscriptBottomPanelProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'actions' | 'followup'>('summary');

  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: <FileText style={{ width: '16px', height: '16px' }} />, count: null },
    { id: 'actions' as const, label: 'Actions', icon: <CheckSquare style={{ width: '16px', height: '16px' }} />, count: actions.length },
    { id: 'followup' as const, label: 'Follow-up', icon: <Calendar style={{ width: '16px', height: '16px' }} />, count: followUps.length },
  ];

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return colors.status.error;
      case 'medium':
        return colors.status.warning;
      case 'low':
        return colors.primary[500];
      default:
        return colors.neutral[500];
    }
  };

  const getFollowUpTypeLabel = (type: string) => {
    switch (type) {
      case 'call':
        return 'Call Back';
      case 'email':
        return 'Send Email';
      case 'task':
        return 'Task';
      case 'appointment':
        return 'Appointment';
      default:
        return type;
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      {/* Tabs */}
      <div
        style={{
          borderBottom: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: spacing[4],
              border: 'none',
              backgroundColor: activeTab === tab.id ? colors.primary[50] : 'transparent',
              borderBottom: `2px solid ${activeTab === tab.id ? colors.primary[500] : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
              fontSize: typography.fontSize.sm,
              fontWeight: activeTab === tab.id ? typography.fontWeight.semibold : typography.fontWeight.medium,
              color: activeTab === tab.id ? colors.primary[600] : colors.neutral[600],
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span
                style={{
                  padding: `${spacing[0.5]} ${spacing[2]}`,
                  backgroundColor: activeTab === tab.id ? colors.primary[500] : colors.neutral[200],
                  color: activeTab === tab.id ? 'white' : colors.neutral[700],
                  borderRadius: '12px',
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: spacing[4], minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div>
            {summary ? (
              <div>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[3],
                  }}
                >
                  Call Summary
                </h4>
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    lineHeight: '1.6',
                    color: colors.neutral[700],
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {summary}
                </p>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: spacing[8],
                  color: colors.neutral[500],
                }}
              >
                <FileText style={{ width: '48px', height: '48px', margin: '0 auto', marginBottom: spacing[3], opacity: 0.5 }} />
                <div style={{ fontSize: typography.fontSize.sm }}>
                  Call summary will be generated automatically
                </div>
                <div style={{ fontSize: typography.fontSize.xs, marginTop: spacing[2] }}>
                  Available 2-3 minutes after call ends
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div>
            {actions.length > 0 ? (
              <div>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[3],
                  }}
                >
                  Call Actions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                  {actions.map((action) => (
                    <div
                      key={action.id}
                      style={{
                        padding: spacing[3],
                        backgroundColor: action.status === 'completed' ? colors.status.successBg : colors.neutral[50],
                        border: `1px solid ${action.status === 'completed' ? colors.status.success : colors.neutral[200]}`,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'start',
                        gap: spacing[3],
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={action.status === 'completed'}
                        readOnly
                        style={{
                          width: '18px',
                          height: '18px',
                          marginTop: '2px',
                          cursor: 'default',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral[900],
                            marginBottom: spacing[1],
                            textDecoration: action.status === 'completed' ? 'line-through' : 'none',
                          }}
                        >
                          {action.description}
                        </div>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[600],
                          }}
                        >
                          {new Date(action.timestamp * 1000).toLocaleString()}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: action.status === 'completed' ? colors.status.success : colors.status.warning,
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          textTransform: 'capitalize',
                        }}
                      >
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: spacing[8],
                  color: colors.neutral[500],
                }}
              >
                <CheckSquare style={{ width: '48px', height: '48px', margin: '0 auto', marginBottom: spacing[3], opacity: 0.5 }} />
                <div style={{ fontSize: typography.fontSize.sm }}>No actions recorded</div>
              </div>
            )}
          </div>
        )}

        {/* Follow-up Tab */}
        {activeTab === 'followup' && (
          <div>
            {followUps.length > 0 ? (
              <div>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[3],
                  }}
                >
                  Follow-up Items
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                  {followUps.map((followUp) => (
                    <div
                      key={followUp.id}
                      style={{
                        padding: spacing[4],
                        backgroundColor: 'white',
                        border: `1px solid ${colors.neutral[200]}`,
                        borderLeft: `4px solid ${getPriorityColor(followUp.priority)}`,
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          marginBottom: spacing[2],
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'inline-flex',
                              padding: `${spacing[1]} ${spacing[2]}`,
                              backgroundColor: colors.primary[50],
                              border: `1px solid ${colors.primary[200]}`,
                              borderRadius: '4px',
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.medium,
                              color: colors.primary[700],
                              marginBottom: spacing[2],
                            }}
                          >
                            {getFollowUpTypeLabel(followUp.type)}
                          </div>
                          <div
                            style={{
                              fontSize: typography.fontSize.sm,
                              fontWeight: typography.fontWeight.medium,
                              color: colors.neutral[900],
                              marginBottom: spacing[1],
                            }}
                          >
                            {followUp.description}
                          </div>
                        </div>
                        {followUp.priority && (
                          <span
                            style={{
                              padding: `${spacing[1]} ${spacing[2]}`,
                              backgroundColor: `${getPriorityColor(followUp.priority)}22`,
                              color: getPriorityColor(followUp.priority),
                              borderRadius: '4px',
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.semibold,
                              textTransform: 'uppercase',
                            }}
                          >
                            {followUp.priority}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: spacing[4], fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                        {followUp.dueDate && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                            <Calendar style={{ width: '14px', height: '14px' }} />
                            Due: {new Date(followUp.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {followUp.assignedTo && (
                          <div>
                            Assigned to: {followUp.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: spacing[8],
                  color: colors.neutral[500],
                }}
              >
                <Calendar style={{ width: '48px', height: '48px', margin: '0 auto', marginBottom: spacing[3], opacity: 0.5 }} />
                <div style={{ fontSize: typography.fontSize.sm }}>No follow-up items scheduled</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
