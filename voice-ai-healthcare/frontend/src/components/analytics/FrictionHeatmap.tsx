import React, { useState } from 'react';
import { TrendingUp, Info, Download } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface FrictionPoint {
  topic: string;
  timeSlot: string;
  count: number;
  avgDuration: number;
  sentiment: number;
}

interface FrictionHeatmapProps {
  data: FrictionPoint[];
  topics?: string[];
  timeSlots?: string[];
  onCellClick?: (topic: string, timeSlot: string) => void;
}

export default function FrictionHeatmap({
  data,
  topics = ['Prior Auth', 'Insurance', 'Side Effects', 'Refills', 'Dosage', 'Cost'],
  timeSlots = ['8-10am', '10-12pm', '12-2pm', '2-4pm', '4-6pm', '6-8pm'],
  onCellClick,
}: FrictionHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<{ topic: string; timeSlot: string } | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ topic: string; timeSlot: string; x: number; y: number } | null>(null);

  // Find max count for normalization
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getDataPoint = (topic: string, timeSlot: string): FrictionPoint | undefined => {
    return data.find((d) => d.topic === topic && d.timeSlot === timeSlot);
  };

  const getHeatColor = (count: number): string => {
    if (count === 0) return colors.neutral[100];

    const intensity = count / maxCount;

    if (intensity > 0.75) return '#dc2626'; // Red
    if (intensity > 0.5) return '#f97316'; // Orange
    if (intensity > 0.25) return '#fbbf24'; // Yellow
    return '#86efac'; // Green
  };

  const handleCellClick = (topic: string, timeSlot: string) => {
    setSelectedCell({ topic, timeSlot });
    if (onCellClick) {
      onCellClick(topic, timeSlot);
    }
  };

  const handleCellMouseEnter = (topic: string, timeSlot: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setShowTooltip({
      topic,
      timeSlot,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellMouseLeave = () => {
    setShowTooltip(null);
  };

  const handleDownload = () => {
    const csv = [
      ['Topic', 'Time Slot', 'Count', 'Avg Duration (s)', 'Sentiment'].join(','),
      ...data.map((d) =>
        [d.topic, d.timeSlot, d.count, d.avgDuration, d.sentiment.toFixed(2)].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'friction-heatmap.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Friction Topic Heatmap
            </h3>
          </div>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Call volume by topic and time of day
          </p>
        </div>

        <button
          onClick={handleDownload}
          style={{
            padding: `${spacing[2]} ${spacing[3]}`,
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          Export
        </button>
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: spacing[1],
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: spacing[2],
                  textAlign: 'left',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                }}
              >
                Topic
              </th>
              {timeSlots.map((slot) => (
                <th
                  key={slot}
                  style={{
                    padding: spacing[2],
                    textAlign: 'center',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[700],
                  }}
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic}>
                <td
                  style={{
                    padding: spacing[2],
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900],
                  }}
                >
                  {topic}
                </td>
                {timeSlots.map((timeSlot) => {
                  const dataPoint = getDataPoint(topic, timeSlot);
                  const count = dataPoint?.count || 0;
                  const isSelected =
                    selectedCell?.topic === topic && selectedCell?.timeSlot === timeSlot;

                  return (
                    <td
                      key={`${topic}-${timeSlot}`}
                      onClick={() => handleCellClick(topic, timeSlot)}
                      onMouseEnter={(e) => handleCellMouseEnter(topic, timeSlot, e)}
                      onMouseLeave={handleCellMouseLeave}
                      style={{
                        padding: spacing[3],
                        textAlign: 'center',
                        backgroundColor: getHeatColor(count),
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: count > maxCount * 0.5 ? 'white' : colors.neutral[900],
                        border: isSelected ? `2px solid ${colors.primary[500]}` : '2px solid transparent',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                      className="heatmap-cell"
                    >
                      {count > 0 ? count : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: spacing[4],
          padding: spacing[3],
          backgroundColor: colors.neutral[50],
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            marginBottom: spacing[2],
          }}
        >
          <Info style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
          <span style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>
            Heat Intensity
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>Low</span>
          <div style={{ display: 'flex', flex: 1 }}>
            {['#86efac', '#fbbf24', '#f97316', '#dc2626'].map((color) => (
              <div
                key={color}
                style={{
                  flex: 1,
                  height: '20px',
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>High</span>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${showTooltip.x}px`,
            top: `${showTooltip.y - 120}px`,
            transform: 'translateX(-50%)',
            padding: spacing[3],
            backgroundColor: colors.neutral[900],
            color: 'white',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            zIndex: 10000,
            pointerEvents: 'none',
            minWidth: '200px',
          }}
        >
          {(() => {
            const dataPoint = getDataPoint(showTooltip.topic, showTooltip.timeSlot);

            if (!dataPoint || dataPoint.count === 0) {
              return (
                <div>
                  <div style={{ fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                    {showTooltip.topic}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[300] }}>
                    {showTooltip.timeSlot}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400], marginTop: spacing[2] }}>
                    No calls recorded
                  </div>
                </div>
              );
            }

            return (
              <div>
                <div style={{ fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                  {showTooltip.topic}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[300], marginBottom: spacing[2] }}>
                  {showTooltip.timeSlot}
                </div>
                <div style={{ fontSize: typography.fontSize.xs, display: 'flex', flexDirection: 'column', gap: spacing[1] }}>
                  <div>Calls: {dataPoint.count}</div>
                  <div>Avg Duration: {Math.floor(dataPoint.avgDuration / 60)}m {dataPoint.avgDuration % 60}s</div>
                  <div>
                    Sentiment:{' '}
                    <span
                      style={{
                        color:
                          dataPoint.sentiment > 0.6
                            ? '#86efac'
                            : dataPoint.sentiment > 0.3
                            ? '#fbbf24'
                            : '#f87171',
                      }}
                    >
                      {(dataPoint.sentiment * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `6px solid ${colors.neutral[900]}`,
            }}
          />
        </div>
      )}

      <style>{`
        .heatmap-cell:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
