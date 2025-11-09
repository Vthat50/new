import React, { useState, useMemo } from 'react';
import { Phone, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
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

interface LiveActivityHeatGraphProps {
  activeCalls: ActiveCall[];
  onJumpToCall: (callId: string) => void;
}

export default function LiveActivityHeatGraph({ activeCalls, onJumpToCall }: LiveActivityHeatGraphProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '4h' | '24h'>('1h');
  const [selectedCall, setSelectedCall] = useState<ActiveCall | null>(null);

  // Generate time series data for the heat graph
  const heatMapData = useMemo(() => {
    const now = new Date();
    const intervals = selectedTimeRange === '1h' ? 12 : selectedTimeRange === '4h' ? 16 : 24;
    const intervalMinutes = selectedTimeRange === '1h' ? 5 : selectedTimeRange === '4h' ? 15 : 60;

    const data = [];

    for (let i = intervals - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMinutes * 60000);

      // Simulate activity data (in real app, this would come from API)
      const callVolume = Math.floor(Math.random() * 15) + 5;
      const positive = Math.floor(Math.random() * callVolume * 0.6);
      const negative = Math.floor(Math.random() * (callVolume - positive) * 0.3);
      const neutral = callVolume - positive - negative;

      data.push({
        time,
        label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        callVolume,
        positive,
        neutral,
        negative,
        intensity: callVolume / 20, // 0-1 scale for heat intensity
      });
    }

    return data;
  }, [selectedTimeRange]);

  const stats = useMemo(() => {
    const total = activeCalls.length;
    const positive = activeCalls.filter(c => c.sentiment === 'positive').length;
    const neutral = activeCalls.filter(c => c.sentiment === 'neutral').length;
    const negative = activeCalls.filter(c => c.sentiment === 'negative').length;

    const avgCallDuration = activeCalls.length > 0
      ? activeCalls.reduce((sum, call) => {
          const [mins, secs] = call.duration.split(':').map(Number);
          return sum + mins * 60 + secs;
        }, 0) / activeCalls.length
      : 0;

    return {
      total,
      positive,
      neutral,
      negative,
      positiveRate: total > 0 ? (positive / total) * 100 : 0,
      avgDuration: `${Math.floor(avgCallDuration / 60)}:${String(Math.floor(avgCallDuration % 60)).padStart(2, '0')}`,
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

  const maxVolume = Math.max(...heatMapData.map(d => d.callVolume), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: colors.primary[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Phone style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                Active Calls
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: colors.status.successBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp style={{ width: '20px', height: '20px', color: colors.status.success }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                Positive Sentiment
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: colors.neutral[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                Avg Duration
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral[900] }}>
                {stats.avgDuration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Heat Graph */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.neutral[200]}`,
          padding: spacing[4],
        }}
      >
        {/* Header with time range selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
          <div>
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
              Live Activity Heat Map
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], marginTop: spacing[1] }}>
              Call volume and sentiment distribution over time
            </p>
          </div>

          <div style={{ display: 'flex', gap: spacing[2] }}>
            {(['1h', '4h', '24h'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                style={{
                  padding: `${spacing[2]} ${spacing[3]}`,
                  borderRadius: '6px',
                  border: `1px solid ${selectedTimeRange === range ? colors.primary[500] : colors.neutral[300]}`,
                  backgroundColor: selectedTimeRange === range ? colors.primary[50] : 'white',
                  color: selectedTimeRange === range ? colors.primary[700] : colors.neutral[600],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {range === '1h' ? 'Last Hour' : range === '4h' ? 'Last 4 Hours' : 'Last 24 Hours'}
              </button>
            ))}
          </div>
        </div>

        {/* Heat Map Chart */}
        <div style={{ position: 'relative', height: '300px' }}>
          {/* Y-axis labels */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 40, width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
            <div>{maxVolume}</div>
            <div>{Math.floor(maxVolume / 2)}</div>
            <div>0</div>
          </div>

          {/* Chart area */}
          <div style={{ marginLeft: '50px', height: '260px', position: 'relative' }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: '1px', backgroundColor: colors.neutral[200] }} />
              ))}
            </div>

            {/* Bars */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
              {heatMapData.map((data, idx) => {
                const barHeight = (data.callVolume / maxVolume) * 100;
                const positiveHeight = (data.positive / data.callVolume) * 100;
                const neutralHeight = (data.neutral / data.callVolume) * 100;
                const negativeHeight = (data.negative / data.callVolume) * 100;

                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${barHeight}%`,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    title={`${data.label}: ${data.callVolume} calls\nPositive: ${data.positive} | Neutral: ${data.neutral} | Negative: ${data.negative}`}
                  >
                    {/* Stacked bar segments */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column-reverse' }}>
                      <div
                        style={{
                          height: `${negativeHeight}%`,
                          backgroundColor: colors.status.error,
                          borderTopLeftRadius: negativeHeight === 100 ? '4px' : '0',
                          borderTopRightRadius: negativeHeight === 100 ? '4px' : '0',
                        }}
                      />
                      <div
                        style={{
                          height: `${neutralHeight}%`,
                          backgroundColor: colors.status.warning,
                          borderTopLeftRadius: (negativeHeight + neutralHeight) >= 99 ? '4px' : '0',
                          borderTopRightRadius: (negativeHeight + neutralHeight) >= 99 ? '4px' : '0',
                        }}
                      />
                      <div
                        style={{
                          height: `${positiveHeight}%`,
                          backgroundColor: colors.status.success,
                          borderTopLeftRadius: '4px',
                          borderTopRightRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div style={{ marginLeft: '50px', marginTop: spacing[2], display: 'flex', justifyContent: 'space-between', fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
            {heatMapData.filter((_, idx) => idx % Math.ceil(heatMapData.length / 6) === 0).map((data, idx) => (
              <div key={idx}>{data.label}</div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: spacing[4], marginTop: spacing[4], justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: colors.status.success }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Positive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: colors.status.warning }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Neutral</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: colors.status.error }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Negative</span>
          </div>
        </div>
      </div>

      {/* Active Calls List */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `1px solid ${colors.neutral[200]}`,
          padding: spacing[4],
        }}
      >
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], marginBottom: spacing[4] }}>
          Active Conversations ({activeCalls.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing[3] }}>
          {activeCalls.map((call) => {
            const isSelected = selectedCall?.id === call.id;

            return (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                style={{
                  padding: spacing[3],
                  borderRadius: '8px',
                  border: `2px solid ${isSelected ? colors.primary[500] : colors.neutral[200]}`,
                  backgroundColor: isSelected ? colors.primary[50] : colors.neutral[50],
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: spacing[2], marginBottom: spacing[2] }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: getSentimentColor(call.sentiment) + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Phone style={{ width: '16px', height: '16px', color: getSentimentColor(call.sentiment) }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                      {call.patientName}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {call.patientId} • {call.duration}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getSentimentColor(call.sentiment),
                      animation: 'pulse-dot 2s infinite',
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[600],
                    padding: spacing[2],
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    marginBottom: spacing[2],
                  }}
                >
                  <strong>Reason:</strong> {call.callReason}
                </div>

                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    fontStyle: 'italic',
                    marginBottom: spacing[2],
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpToCall(call.id);
                  }}
                  style={{
                    width: '100%',
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.primary[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[600];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary[500];
                  }}
                >
                  Jump to Call
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
