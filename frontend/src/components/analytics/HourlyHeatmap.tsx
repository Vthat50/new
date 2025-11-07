import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface HeatmapData {
  day: string;
  hour: number;
  value: number;
}

interface HourlyHeatmapProps {
  data: HeatmapData[];
  title?: string;
  valueLabel?: string;
  onExport?: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function HourlyHeatmap({
  data,
  title = 'Call Volume Heatmap',
  valueLabel = 'calls',
  onExport,
}: HourlyHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number } | null>(null);

  // Find max value for color scaling
  const maxValue = Math.max(...data.map((d) => d.value));

  const getValue = (day: string, hour: number): number => {
    const cell = data.find((d) => d.day === day && d.hour === hour);
    return cell?.value || 0;
  };

  const getHeatColor = (value: number): string => {
    if (value === 0) return colors.neutral[50];
    const intensity = value / maxValue;

    if (intensity > 0.75) return colors.primary[700];
    if (intensity > 0.5) return colors.primary[500];
    if (intensity > 0.25) return colors.primary[300];
    return colors.primary[100];
  };

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour === 12) return '12pm';
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            margin: 0,
          }}
        >
          {title}
        </h3>
        {onExport && (
          <button
            onClick={onExport}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Export
          </button>
        )}
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
          {/* Hour Labels */}
          <div style={{ display: 'flex', marginBottom: spacing[2], marginLeft: '100px' }}>
            {HOURS.filter((h) => h % 3 === 0).map((hour) => (
              <div
                key={hour}
                style={{
                  width: `${(100 / 24) * 3}%`,
                  fontSize: typography.fontSize.xs,
                  color: colors.neutral[600],
                  textAlign: 'center',
                }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>

          {/* Days and Cells */}
          {DAYS.map((day) => (
            <div key={day} style={{ display: 'flex', marginBottom: spacing[1], alignItems: 'center' }}>
              {/* Day Label */}
              <div
                style={{
                  width: '100px',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[700],
                  paddingRight: spacing[2],
                }}
              >
                {day}
              </div>

              {/* Hour Cells */}
              <div style={{ flex: 1, display: 'flex', gap: '2px' }}>
                {HOURS.map((hour) => {
                  const value = getValue(day, hour);
                  const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour;

                  return (
                    <div
                      key={hour}
                      onMouseEnter={() => setHoveredCell({ day, hour })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        flex: 1,
                        aspectRatio: '1',
                        backgroundColor: getHeatColor(value),
                        borderRadius: '3px',
                        cursor: 'pointer',
                        border: isHovered ? `2px solid ${colors.primary[900]}` : 'none',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                      title={`${day} ${formatHour(hour)}: ${value} ${valueLabel}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              marginTop: spacing[4],
              marginLeft: '100px',
            }}
          >
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>Low</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                <div
                  key={i}
                  style={{
                    width: '40px',
                    height: '16px',
                    backgroundColor: getHeatColor(maxValue * intensity),
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>High</span>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div
          style={{
            marginTop: spacing[4],
            padding: spacing[3],
            backgroundColor: colors.neutral[50],
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
          }}
        >
          <strong>
            {hoveredCell.day}, {formatHour(hoveredCell.hour)}
          </strong>
          : {getValue(hoveredCell.day, hoveredCell.hour)} {valueLabel}
        </div>
      )}
    </div>
  );
}
