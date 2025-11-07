import React, { useState } from 'react';
import { Tag, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DetectedTopic {
  id: string;
  name: string;
  confidence: number;
  category: 'clinical' | 'administrative' | 'financial' | 'technical' | 'emotional';
  firstMentioned: number; // seconds into call
  mentions: number;
  relatedKeywords: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  requiresAction?: boolean;
}

interface TopicDetectorProps {
  topics: DetectedTopic[];
  callDuration: number;
  isLive?: boolean;
}

export default function TopicDetector({ topics, callDuration, isLive = false }: TopicDetectorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const getCategoryColor = (category: DetectedTopic['category']) => {
    const colors_map = {
      clinical: colors.primary[500],
      administrative: colors.secondary[500],
      financial: colors.accent[500],
      technical: colors.neutral[600],
      emotional: colors.status.warning,
    };
    return colors_map[category];
  };

  const getSentimentColor = (sentiment?: DetectedTopic['sentiment']) => {
    if (!sentiment) return colors.neutral[400];
    const map = {
      positive: colors.status.success,
      neutral: colors.neutral[600],
      negative: colors.status.error,
    };
    return map[sentiment];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedTopics = [...topics].sort((a, b) => b.confidence - a.confidence);
  const topTopics = sortedTopics.slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '12px',
        padding: spacing[6],
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: colors.primary[100],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary[700],
            }}
          >
            <Tag style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                margin: 0,
              }}
            >
              Topic Detection
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
              {isLive ? 'Real-time topic analysis' : `${topics.length} topics detected`}
            </p>
          </div>
        </div>

        {isLive && (
          <div
            style={{
              padding: `${spacing[1]} ${spacing[3]}`,
              backgroundColor: colors.status.successBg,
              border: `1px solid ${colors.status.success}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: colors.status.success,
                animation: 'pulse 2s infinite',
              }}
            />
            <span
              style={{
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                color: colors.status.success,
              }}
            >
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Top Topics Summary */}
      <div style={{ marginBottom: spacing[4] }}>
        <h4
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[3],
            color: colors.neutral[700],
          }}
        >
          Primary Topics
        </h4>

        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          {topTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              style={{
                padding: `${spacing[2]} ${spacing[3]}`,
                backgroundColor: selectedTopic === topic.id ? getCategoryColor(topic.category) : 'white',
                color: selectedTopic === topic.id ? 'white' : getCategoryColor(topic.category),
                border: `1px solid ${getCategoryColor(topic.category)}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                transition: 'all 0.2s',
              }}
            >
              <span>{topic.name}</span>
              <span
                style={{
                  padding: `${spacing[1]} ${spacing[2]}`,
                  backgroundColor: selectedTopic === topic.id ? 'rgba(255,255,255,0.2)' : `${getCategoryColor(topic.category)}15`,
                  borderRadius: '4px',
                  fontSize: typography.fontSize.xs,
                }}
              >
                {Math.round(topic.confidence * 100)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Topic Details */}
      {selectedTopic && (
        <div
          style={{
            padding: spacing[4],
            backgroundColor: colors.neutral[50],
            borderRadius: '8px',
            marginBottom: spacing[4],
          }}
        >
          {(() => {
            const topic = topics.find((t) => t.id === selectedTopic)!;
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
                  <div>
                    <h4
                      style={{
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.semibold,
                        marginBottom: spacing[1],
                      }}
                    >
                      {topic.name}
                    </h4>
                    <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                      Category: {topic.category}
                    </div>
                  </div>

                  {topic.requiresAction && (
                    <div
                      style={{
                        padding: `${spacing[1]} ${spacing[2]}`,
                        backgroundColor: colors.status.warningBg,
                        border: `1px solid ${colors.status.warning}`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[1],
                      }}
                    >
                      <AlertCircle style={{ width: '14px', height: '14px', color: colors.status.warning }} />
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.status.warning, fontWeight: typography.fontWeight.medium }}>
                        Action Required
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[3], marginBottom: spacing[3] }}>
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                      Confidence
                    </div>
                    <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                      {Math.round(topic.confidence * 100)}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                      First Mentioned
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[1],
                      }}
                    >
                      <Clock style={{ width: '14px', height: '14px' }} />
                      {formatTime(topic.firstMentioned)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[1] }}>
                      Mentions
                    </div>
                    <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
                      {topic.mentions}
                    </div>
                  </div>
                </div>

                {topic.relatedKeywords.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                        marginBottom: spacing[2],
                        fontWeight: typography.fontWeight.medium,
                      }}
                    >
                      Related Keywords
                    </div>
                    <div style={{ display: 'flex', gap: spacing[1], flexWrap: 'wrap' }}>
                      {topic.relatedKeywords.map((keyword, i) => (
                        <span
                          key={i}
                          style={{
                            padding: `${spacing[1]} ${spacing[2]}`,
                            backgroundColor: 'white',
                            border: `1px solid ${colors.neutral[200]}`,
                            borderRadius: '4px',
                            fontSize: typography.fontSize.xs,
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* All Topics List */}
      <div>
        <h4
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[3],
            color: colors.neutral[700],
          }}
        >
          All Detected Topics
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {sortedTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
              style={{
                padding: spacing[3],
                border: `1px solid ${colors.neutral[200]}`,
                borderLeft: `4px solid ${getCategoryColor(topic.category)}`,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: selectedTopic === topic.id ? colors.neutral[50] : 'white',
                transition: 'all 0.2s',
              }}
              className="topic-item"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      marginBottom: spacing[1],
                    }}
                  >
                    {topic.name}
                  </div>

                  <div style={{ display: 'flex', gap: spacing[3], fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    <span>
                      <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: spacing[1] }} />
                      {formatTime(topic.firstMentioned)}
                    </span>
                    <span>{topic.mentions} mentions</span>
                    {topic.sentiment && (
                      <span style={{ color: getSentimentColor(topic.sentiment) }}>• {topic.sentiment}</span>
                    )}
                  </div>
                </div>

                {/* Confidence Bar */}
                <div style={{ width: '100px' }}>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: colors.neutral[100],
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${topic.confidence * 100}%`,
                        backgroundColor: getCategoryColor(topic.category),
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[600],
                      textAlign: 'center',
                      marginTop: spacing[1],
                    }}
                  >
                    {Math.round(topic.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .topic-item:hover {
          background-color: ${colors.neutral[50]};
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
