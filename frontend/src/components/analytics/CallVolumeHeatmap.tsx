import React, { useState } from 'react';
import { colors, spacing, typography } from '../../lib/design-system';

interface CallVolumeData {
  day: string;
  inbound: number;
  outbound: number;
}

interface CallVolumeHeatmapProps {
  data: CallVolumeData[];
  title?: string;
}

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CallVolumeHeatmap({
  data,
  title = 'Call Volume Trends (7 Days)',
}: CallVolumeHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; type: string; value: number } | null>(null);

  // Find max value for color scaling
  const maxValue = Math.max(
    ...data.flatMap(d => [d.inbound, d.outbound])
  );

  const getHeatColor = (value: number): string => {
    if (value === 0) return colors.neutral[100];
    const intensity = value / maxValue;

    // GitHub-style color progression
    if (intensity > 0.75) return '#0e4429';
    if (intensity > 0.5) return '#006d32';
    if (intensity > 0.25) return '#26a641';
    return '#39d353';
  };

  return (
    <div>
      <h3
        className="text-neutral-900"
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[6],
        }}
      >
        {title}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
        {/* Inbound Calls Heatmap */}
        <div>
          <div
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[4],
            }}
          >
            Inbound Calls
          </div>
          <div style={{ display: 'flex', gap: spacing[2], alignItems: 'flex-start' }}>
            {data.map((item, idx) => {
              const isHovered = hoveredCell?.day === item.day && hoveredCell?.type === 'inbound';
              return (
                <div key={`inbound-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], flex: 1 }}>
                  <div
                    onMouseEnter={() => setHoveredCell({ day: item.day, type: 'inbound', value: item.inbound })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: getHeatColor(item.inbound),
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isHovered ? `3px solid ${colors.neutral[900]}` : `2px solid ${colors.neutral[200]}`,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                    title={`${item.day}: ${item.inbound} inbound calls`}
                  >
                    <span
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: item.inbound / maxValue > 0.45 ? 'white' : colors.neutral[900],
                      }}
                    >
                      {item.inbound}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[600],
                      textAlign: 'center',
                    }}
                  >
                    {DAYS_SHORT[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outbound Calls Heatmap */}
        <div>
          <div
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing[4],
            }}
          >
            Outbound Calls
          </div>
          <div style={{ display: 'flex', gap: spacing[2], alignItems: 'flex-start' }}>
            {data.map((item, idx) => {
              const isHovered = hoveredCell?.day === item.day && hoveredCell?.type === 'outbound';
              return (
                <div key={`outbound-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], flex: 1 }}>
                  <div
                    onMouseEnter={() => setHoveredCell({ day: item.day, type: 'outbound', value: item.outbound })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: '100%',
                      height: '80px',
                      backgroundColor: getHeatColor(item.outbound),
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isHovered ? `3px solid ${colors.neutral[900]}` : `2px solid ${colors.neutral[200]}`,
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                    title={`${item.day}: ${item.outbound} outbound calls`}
                  >
                    <span
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: item.outbound / maxValue > 0.45 ? 'white' : colors.neutral[900],
                      }}
                    >
                      {item.outbound}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[600],
                      textAlign: 'center',
                    }}
                  >
                    {DAYS_SHORT[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            justifyContent: 'center',
            marginTop: spacing[4],
          }}
        >
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[600] }}>
            Less
          </span>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                style={{
                  width: '40px',
                  height: '24px',
                  backgroundColor: intensity === 0 ? colors.neutral[100] : getHeatColor(maxValue * intensity),
                  borderRadius: '4px',
                  border: `2px solid ${colors.neutral[200]}`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[600] }}>
            More
          </span>
        </div>

        {/* Hover Info */}
        {hoveredCell && (
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[900],
              color: 'white',
              borderRadius: '8px',
              fontSize: typography.fontSize.base,
              display: 'inline-block',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing[1] }}>
              {hoveredCell.value} calls
            </div>
            <div style={{ fontSize: typography.fontSize.sm, opacity: 0.9 }}>
              {hoveredCell.day} • {hoveredCell.type}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
