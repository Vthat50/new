import React, { useRef, useEffect, useState } from 'react';
import { User, Bot, Search, Download, Copy, Check } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface TranscriptSegment {
  id: string;
  speaker: 'patient' | 'agent';
  text: string;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  keywords?: string[];
  isPartial?: boolean;
}

interface LiveTranscriptProps {
  segments: TranscriptSegment[];
  isLive?: boolean;
  autoScroll?: boolean;
  highlightKeywords?: boolean;
  searchQuery?: string;
  onSegmentClick?: (segment: TranscriptSegment) => void;
}

export default function LiveTranscript({
  segments,
  isLive = false,
  autoScroll = true,
  highlightKeywords = true,
  searchQuery = '',
  onSegmentClick,
}: LiveTranscriptProps) {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const lastSegmentIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom when new segments arrive
  useEffect(() => {
    if (!autoScroll || !isLive || userHasScrolled) return;

    const container = transcriptContainerRef.current;
    if (!container) return;

    // Check if a new segment was added
    const latestSegment = segments[segments.length - 1];
    if (latestSegment && latestSegment.id !== lastSegmentIdRef.current) {
      lastSegmentIdRef.current = latestSegment.id;

      // Smooth scroll to bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [segments, autoScroll, isLive, userHasScrolled]);

  // Detect user scroll
  const handleScroll = () => {
    const container = transcriptContainerRef.current;
    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    setUserHasScrolled(!isAtBottom);
  };

  const scrollToBottom = () => {
    const container = transcriptContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
    setUserHasScrolled(false);
  };

  const handleCopyTranscript = () => {
    const text = segments
      .map((seg) => {
        const time = formatTimestamp(seg.timestamp);
        const speaker = seg.speaker === 'patient' ? 'Patient' : 'Agent';
        return `[${time}] ${speaker}: ${seg.text}`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTranscript = () => {
    const text = segments
      .map((seg) => {
        const time = formatTimestamp(seg.timestamp);
        const speaker = seg.speaker === 'patient' ? 'Patient' : 'Agent';
        return `[${time}] ${speaker}: ${seg.text}`;
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return colors.status.success;
      case 'negative':
        return colors.status.error;
      default:
        return colors.neutral[300];
    }
  };

  const highlightText = (text: string, keywords: string[] = [], query: string = '') => {
    let highlighted = text;

    // Highlight search query
    if (query) {
      const regex = new RegExp(`(${query})`, 'gi');
      highlighted = highlighted.replace(
        regex,
        '<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 2px;">$1</mark>'
      );
    }

    // Highlight keywords
    if (highlightKeywords && keywords.length > 0) {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
        highlighted = highlighted.replace(
          regex,
          '<strong style="color: #3b82f6; font-weight: 600;">$1</strong>'
        );
      });
    }

    return highlighted;
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <h3 style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold }}>
            Live Transcript
          </h3>
          {isLive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
                padding: `${spacing[1]} ${spacing[2]}`,
                backgroundColor: colors.status.errorBg,
                border: `1px solid ${colors.status.error}`,
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.status.error,
                  animation: 'pulse 2s infinite',
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.status.error,
                }}
              >
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: spacing[2] }}>
          <button
            onClick={handleCopyTranscript}
            style={{
              padding: spacing[2],
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
            title="Copy transcript"
          >
            {copied ? (
              <Check style={{ width: '16px', height: '16px', color: colors.status.success }} />
            ) : (
              <Copy style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
            )}
          </button>
          <button
            onClick={handleDownloadTranscript}
            style={{
              padding: spacing[2],
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title="Download transcript"
          >
            <Download style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
          </button>
        </div>
      </div>

      {/* Transcript Content */}
      <div
        ref={transcriptContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: spacing[4],
        }}
      >
        {segments.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: spacing[8],
              color: colors.neutral[500],
              fontSize: typography.fontSize.sm,
            }}
          >
            {isLive ? 'Waiting for conversation to start...' : 'No transcript available'}
          </div>
        )}

        {segments.map((segment, index) => {
          const isPatient = segment.speaker === 'patient';

          return (
            <div
              key={segment.id}
              onClick={() => onSegmentClick?.(segment)}
              style={{
                marginBottom: spacing[4],
                display: 'flex',
                gap: spacing[3],
                cursor: onSegmentClick ? 'pointer' : 'default',
                opacity: segment.isPartial ? 0.6 : 1,
                transition: 'opacity 0.3s',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isPatient ? colors.primary[100] : colors.neutral[200],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isPatient ? (
                  <User style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                ) : (
                  <Bot style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    marginBottom: spacing[2],
                  }}
                >
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: isPatient ? colors.primary[600] : colors.neutral[900],
                    }}
                  >
                    {isPatient ? 'Patient' : 'AI Agent'}
                  </span>
                  <span
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[500],
                    }}
                  >
                    {formatTimestamp(segment.timestamp)}
                  </span>
                  {segment.sentiment && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getSentimentColor(segment.sentiment),
                      }}
                      title={`${segment.sentiment} sentiment`}
                    />
                  )}
                  {segment.isPartial && (
                    <span
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[400],
                        fontStyle: 'italic',
                      }}
                    >
                      (typing...)
                    </span>
                  )}
                </div>

                {/* Text */}
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    lineHeight: '1.6',
                    color: colors.neutral[900],
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightText(segment.text, segment.keywords, searchQuery),
                  }}
                />
              </div>

              {/* Sentiment bar */}
              {segment.sentiment && (
                <div
                  style={{
                    width: '3px',
                    borderRadius: '2px',
                    backgroundColor: getSentimentColor(segment.sentiment),
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Loading indicator for live */}
        {isLive && segments.length > 0 && (
          <div style={{ textAlign: 'center', padding: spacing[2] }}>
            <div
              style={{
                display: 'inline-flex',
                gap: spacing[1],
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[500],
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.32s',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[500],
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.16s',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[500],
                  animation: 'bounce 1.4s infinite ease-in-out both',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {userHasScrolled && isLive && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: spacing[4],
            left: '50%',
            transform: 'translateX(-50%)',
            padding: `${spacing[2]} ${spacing[4]}`,
            backgroundColor: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span>New messages</span>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'white',
              animation: 'pulse 2s infinite',
            }}
          />
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
