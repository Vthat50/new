import React from 'react';
import { Star, AlertCircle, CheckCircle, MessageSquare, TrendingDown, TrendingUp, Play } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface KeyMoment {
  id: string;
  type: 'important' | 'question' | 'resolution' | 'escalation' | 'sentiment-change' | 'keyword';
  timestamp: number;
  description: string;
  speaker?: 'patient' | 'agent';
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
}

interface KeyMomentsSidebarProps {
  moments: KeyMoment[];
  onSeek?: (timestamp: number) => void;
  showTimestamps?: boolean;
}

export default function KeyMomentsSidebar({
  moments,
  onSeek,
  showTimestamps = true,
}: KeyMomentsSidebarProps) {
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMomentIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <Star style={{ width: '16px', height: '16px', color: colors.status.warning }} />;
      case 'question':
        return <MessageSquare style={{ width: '16px', height: '16px', color: colors.primary[500] }} />;
      case 'resolution':
        return <CheckCircle style={{ width: '16px', height: '16px', color: colors.status.success }} />;
      case 'escalation':
        return <AlertCircle style={{ width: '16px', height: '16px', color: colors.status.error }} />;
      case 'sentiment-change':
        return <TrendingUp style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />;
      default:
        return <Star style={{ width: '16px', height: '16px', color: colors.neutral[400] }} />;
    }
  };

  const getMomentColor = (type: string) => {
    switch (type) {
      case 'important':
        return { bg: colors.status.warningBg, border: colors.status.warning };
      case 'question':
        return { bg: colors.primary[50], border: colors.primary[200] };
      case 'resolution':
        return { bg: colors.status.successBg, border: colors.status.success };
      case 'escalation':
        return { bg: colors.status.errorBg, border: colors.status.error };
      case 'sentiment-change':
        return { bg: colors.neutral[50], border: colors.neutral[300] };
      default:
        return { bg: colors.neutral[50], border: colors.neutral[200] };
    }
  };

  const getMomentLabel = (type: string): string => {
    switch (type) {
      case 'important':
        return 'Important';
      case 'question':
        return 'Question';
      case 'resolution':
        return 'Resolved';
      case 'escalation':
        return 'Escalation';
      case 'sentiment-change':
        return 'Sentiment Change';
      case 'keyword':
        return 'Keyword Detected';
      default:
        return type;
    }
  };

  // Sort moments by timestamp
  const sortedMoments = [...moments].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
          <Star style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <h3 style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold }}>
            Key Moments
          </h3>
        </div>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
          {sortedMoments.length} moment{sortedMoments.length !== 1 ? 's' : ''} detected
        </p>
      </div>

      {/* Moments List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: spacing[4] }}>
        {sortedMoments.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: spacing[8],
              color: colors.neutral[500],
              fontSize: typography.fontSize.sm,
            }}
          >
            No key moments detected yet
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          {sortedMoments.length > 0 && (
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: '24px',
                bottom: '24px',
                width: '2px',
                backgroundColor: colors.neutral[200],
              }}
            />
          )}

          {/* Moments */}
          {sortedMoments.map((moment, index) => {
            const colorScheme = getMomentColor(moment.type);

            return (
              <div
                key={moment.id}
                onClick={() => onSeek && onSeek(moment.timestamp)}
                style={{
                  marginBottom: spacing[4],
                  position: 'relative',
                  paddingLeft: spacing[8],
                  cursor: onSeek ? 'pointer' : 'default',
                  transition: 'transform 0.2s',
                }}
                className="key-moment"
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '8px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: `3px solid ${colorScheme.border}`,
                    zIndex: 1,
                  }}
                />

                {/* Moment Card */}
                <div
                  style={{
                    padding: spacing[3],
                    backgroundColor: colorScheme.bg,
                    border: `1px solid ${colorScheme.border}`,
                    borderRadius: '6px',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing[2],
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      {getMomentIcon(moment.type)}
                      <span
                        style={{
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {getMomentLabel(moment.type)}
                      </span>
                    </div>

                    {showTimestamps && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing[1],
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {onSeek && <Play style={{ width: '12px', height: '12px' }} />}
                        {formatTimestamp(moment.timestamp)}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[900],
                      lineHeight: '1.5',
                      marginBottom: moment.keywords ? spacing[2] : 0,
                    }}
                  >
                    {moment.description}
                  </p>

                  {/* Keywords */}
                  {moment.keywords && moment.keywords.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[1] }}>
                      {moment.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          style={{
                            padding: `${spacing[0.5]} ${spacing[2]}`,
                            backgroundColor: 'white',
                            border: `1px solid ${colorScheme.border}`,
                            borderRadius: '12px',
                            fontSize: typography.fontSize.xs,
                            fontWeight: typography.fontWeight.medium,
                            color: colors.neutral[700],
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Speaker */}
                  {moment.speaker && (
                    <div
                      style={{
                        marginTop: spacing[2],
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                      }}
                    >
                      {moment.speaker === 'patient' ? 'Patient' : 'Agent'}
                    </div>
                  )}

                  {/* Sentiment indicator */}
                  {moment.sentiment && (
                    <div
                      style={{
                        marginTop: spacing[2],
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[1],
                      }}
                    >
                      {moment.sentiment === 'positive' && (
                        <TrendingUp style={{ width: '14px', height: '14px', color: colors.status.success }} />
                      )}
                      {moment.sentiment === 'negative' && (
                        <TrendingDown style={{ width: '14px', height: '14px', color: colors.status.error }} />
                      )}
                      <span
                        style={{
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[600],
                          textTransform: 'capitalize',
                        }}
                      >
                        {moment.sentiment} sentiment
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      {sortedMoments.length > 0 && (
        <div
          style={{
            padding: spacing[4],
            borderTop: `1px solid ${colors.neutral[200]}`,
            backgroundColor: colors.neutral[50],
          }}
        >
          <div style={{ display: 'flex', gap: spacing[3], fontSize: typography.fontSize.xs }}>
            {['important', 'question', 'resolution', 'escalation'].map((type) => {
              const count = sortedMoments.filter((m) => m.type === type).length;
              if (count === 0) return null;

              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                  {getMomentIcon(type)}
                  <span style={{ color: colors.neutral[600] }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .key-moment:hover {
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}
