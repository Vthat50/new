import React, { useState, useMemo } from 'react';
import { Phone, TrendingUp, Clock, Activity } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ActiveCall {
  id: string;
  patientName: string;
  patientId: string;
  callReason: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  duration: string;
  transcriptSnippet: string;
  startTime: Date;
}

interface LiveActivityHeatMapProps {
  activeCalls: ActiveCall[];
  onJumpToCall: (callId: string) => void;
}

export default function LiveActivityHeatMap({ activeCalls, onJumpToCall }: LiveActivityHeatMapProps) {
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Generate heat map data - 24 hours x 7 days for week view, or 24 hours x 60 minutes for day view
  const heatMapData = useMemo(() => {
    if (viewMode === 'day') {
      // Day view: 24 hours x 12 five-minute intervals per hour
      const data: number[][] = Array(24).fill(0).map(() => Array(12).fill(0));
      const sentimentData: { positive: number; neutral: number; negative: number }[][] =
        Array(24).fill(0).map(() => Array(12).fill(0).map(() => ({ positive: 0, neutral: 0, negative: 0 })));

      // Simulate activity data for today
      const now = new Date();
      for (let hour = 0; hour < 24; hour++) {
        for (let interval = 0; interval < 12; interval++) {
          // Higher activity during business hours (8am - 6pm)
          const isBusinessHours = hour >= 8 && hour < 18;
          const baseActivity = isBusinessHours ? 15 : 3;
          const variance = Math.random() * 10;
          const activity = Math.floor(baseActivity + variance);

          data[hour][interval] = activity;

          // Distribute sentiment
          sentimentData[hour][interval] = {
            positive: Math.floor(activity * (0.5 + Math.random() * 0.3)),
            neutral: Math.floor(activity * (0.2 + Math.random() * 0.2)),
            negative: Math.floor(activity * (0.1 + Math.random() * 0.2)),
          };
        }
      }

      return { data, sentimentData, maxValue: 25 };
    } else {
      // Week view: 7 days x 24 hours
      const data: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
      const sentimentData: { positive: number; neutral: number; negative: number }[][] =
        Array(7).fill(0).map(() => Array(24).fill(0).map(() => ({ positive: 0, neutral: 0, negative: 0 })));

      // Simulate activity data for the past week
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          // Weekdays have more activity than weekends
          const isWeekend = day === 0 || day === 6;
          const isBusinessHours = hour >= 8 && hour < 18;
          const baseActivity = isWeekend ? 5 : (isBusinessHours ? 40 : 10);
          const variance = Math.random() * 20;
          const activity = Math.floor(baseActivity + variance);

          data[day][hour] = activity;

          // Distribute sentiment
          sentimentData[day][hour] = {
            positive: Math.floor(activity * (0.5 + Math.random() * 0.3)),
            neutral: Math.floor(activity * (0.2 + Math.random() * 0.2)),
            negative: Math.floor(activity * (0.1 + Math.random() * 0.2)),
          };
        }
      }

      return { data, sentimentData, maxValue: 60 };
    }
  }, [viewMode]);

  const getHeatColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return colors.neutral[100];
    if (intensity < 0.25) return '#d1f4e0'; // Very light green
    if (intensity < 0.5) return '#7ee3b0';  // Light green
    if (intensity < 0.75) return '#2fc97a'; // Medium green
    return '#0ea55c'; // Dark green
  };

  const stats = useMemo(() => {
    const total = activeCalls.length;
    const positive = activeCalls.filter(c => c.sentiment === 'positive').length;
    const neutral = activeCalls.filter(c => c.sentiment === 'neutral').length;
    const negative = activeCalls.filter(c => c.sentiment === 'negative').length;

    return {
      total,
      positive,
      neutral,
      negative,
      positiveRate: total > 0 ? (positive / total) * 100 : 0,
    };
  }, [activeCalls]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return colors.status.success;
      case 'neutral': return colors.status.warning;
      case 'negative': return colors.status.error;
      default: return colors.primary[500];
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hourLabels = Array(24).fill(0).map((_, i) => `${i.toString().padStart(2, '0')}:00`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing[4] }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[4],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.primary[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Active Calls Right Now
              </div>
              <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {stats.total}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[4],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.status.successBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp style={{ width: '24px', height: '24px', color: colors.status.success }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Positive Sentiment
              </div>
              <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.bold, color: colors.status.success }}>
                {stats.positiveRate.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: spacing[4],
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity style={{ width: '24px', height: '24px', color: colors.neutral[600] }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Peak Activity Period
              </div>
              <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                2:00 PM - 4:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map Card */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.neutral[200]}`,
          padding: spacing[6],
        }}
      >
        {/* Header with view toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[6] }}>
          <div>
            <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[1] }}>
              Call Activity Heat Map
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
              {viewMode === 'day' ? 'Activity patterns over the last 24 hours' : 'Activity patterns over the last 7 days'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing[2], backgroundColor: colors.neutral[100], borderRadius: '8px', padding: spacing[1] }}>
            <button
              onClick={() => setViewMode('day')}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'day' ? 'white' : 'transparent',
                color: viewMode === 'day' ? colors.primary[600] : colors.neutral[600],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'day' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'week' ? 'white' : 'transparent',
                color: viewMode === 'week' ? colors.primary[600] : colors.neutral[600],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: viewMode === 'week' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Last 7 Days
            </button>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div style={{ overflowX: 'auto', paddingBottom: spacing[4] }}>
          <div style={{ minWidth: viewMode === 'day' ? '1200px' : '800px' }}>
            {viewMode === 'week' ? (
              // Week View
              <div>
                {/* Day labels */}
                <div style={{ display: 'flex', marginBottom: spacing[2] }}>
                  <div style={{ width: '60px' }} /> {/* Spacer for hour labels */}
                  {Array(24).fill(0).map((_, hour) => (
                    hour % 3 === 0 && (
                      <div
                        key={hour}
                        style={{
                          flex: 1,
                          fontSize: typography.fontSize.xs,
                          color: colors.neutral[500],
                          textAlign: 'center',
                          minWidth: '30px',
                        }}
                      >
                        {hour}h
                      </div>
                    )
                  ))}
                </div>

                {/* Heat map rows */}
                {heatMapData.data.map((dayData, dayIndex) => (
                  <div key={dayIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: spacing[1] }}>
                    <div
                      style={{
                        width: '60px',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[700],
                      }}
                    >
                      {dayLabels[dayIndex]}
                    </div>
                    <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
                      {dayData.map((value, hourIndex) => (
                        <div
                          key={hourIndex}
                          onClick={() => setSelectedCell({ day: dayIndex, hour: hourIndex })}
                          style={{
                            flex: 1,
                            minWidth: '28px',
                            height: '28px',
                            backgroundColor: getHeatColor(value, heatMapData.maxValue),
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: selectedCell?.day === dayIndex && selectedCell?.hour === hourIndex
                              ? `2px solid ${colors.primary[500]}`
                              : '1px solid rgba(255,255,255,0.5)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.zIndex = '10';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.zIndex = '1';
                          }}
                          title={`${dayLabels[dayIndex]} ${hourIndex}:00 - ${value} calls\n✓ ${heatMapData.sentimentData[dayIndex][hourIndex].positive} positive\n○ ${heatMapData.sentimentData[dayIndex][hourIndex].neutral} neutral\n✗ ${heatMapData.sentimentData[dayIndex][hourIndex].negative} negative`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Day View
              <div>
                {/* 5-minute interval labels */}
                <div style={{ display: 'flex', marginBottom: spacing[2] }}>
                  <div style={{ width: '60px' }} /> {/* Spacer for hour labels */}
                  {Array(24).fill(0).map((_, hour) => (
                    <div
                      key={hour}
                      style={{
                        flex: 1,
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        textAlign: 'center',
                        minWidth: '48px',
                      }}
                    >
                      {hour.toString().padStart(2, '0')}h
                    </div>
                  ))}
                </div>

                {/* Heat map - single row for today, but with 12 intervals per hour */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '60px',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[700],
                    }}
                  >
                    Today
                  </div>
                  <div style={{ display: 'flex', gap: '1px', flex: 1 }}>
                    {heatMapData.data.map((hourData, hourIndex) => (
                      <div key={hourIndex} style={{ display: 'flex', gap: '1px', flex: 1 }}>
                        {hourData.map((value, intervalIndex) => (
                          <div
                            key={`${hourIndex}-${intervalIndex}`}
                            onClick={() => setSelectedCell({ day: hourIndex, hour: intervalIndex })}
                            style={{
                              flex: 1,
                              minWidth: '4px',
                              height: '40px',
                              backgroundColor: getHeatColor(value, heatMapData.maxValue),
                              borderRadius: '2px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              border: selectedCell?.day === hourIndex && selectedCell?.hour === intervalIndex
                                ? `2px solid ${colors.primary[500]}`
                                : 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scaleY(1.2)';
                              e.currentTarget.style.zIndex = '10';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scaleY(1)';
                              e.currentTarget.style.zIndex = '1';
                            }}
                            title={`${hourIndex}:${(intervalIndex * 5).toString().padStart(2, '0')} - ${value} calls\n✓ ${heatMapData.sentimentData[hourIndex][intervalIndex].positive} positive\n○ ${heatMapData.sentimentData[hourIndex][intervalIndex].neutral} neutral\n✗ ${heatMapData.sentimentData[hourIndex][intervalIndex].negative} negative`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], marginTop: spacing[6], justifyContent: 'center' }}>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Less</span>
              <div style={{ display: 'flex', gap: spacing[1] }}>
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: getHeatColor(intensity * heatMapData.maxValue, heatMapData.maxValue),
                      borderRadius: '4px',
                      border: `1px solid ${colors.neutral[200]}`,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Calls List */}
      {activeCalls.length > 0 && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${colors.neutral[200]}`,
            padding: spacing[6],
          }}
        >
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[4] }}>
            Active Conversations ({activeCalls.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: spacing[4] }}>
            {activeCalls.map((call) => (
              <div
                key={call.id}
                style={{
                  padding: spacing[4],
                  borderRadius: '12px',
                  border: `1px solid ${colors.neutral[200]}`,
                  backgroundColor: colors.neutral[50],
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary[300];
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.neutral[200];
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: spacing[3], marginBottom: spacing[3] }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: getSentimentColor(call.sentiment) + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone style={{ width: '18px', height: '18px', color: getSentimentColor(call.sentiment) }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[1] }}>
                      {call.patientName}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {call.patientId} • {call.duration}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: getSentimentColor(call.sentiment),
                      animation: 'pulse-dot 2s infinite',
                      flexShrink: 0,
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[600],
                    padding: spacing[2],
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    marginBottom: spacing[3],
                  }}
                >
                  <strong>Reason:</strong> {call.callReason}
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    fontStyle: 'italic',
                    marginBottom: spacing[3],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  "{call.transcriptSnippet}..."
                </div>

                <button
                  onClick={() => onJumpToCall(call.id)}
                  style={{
                    width: '100%',
                    padding: `${spacing[2]} ${spacing[4]}`,
                    backgroundColor: colors.primary[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[600];
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[500];
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Jump to Call
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
