import React, { useState, useMemo } from 'react';
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

// Generate realistic hourly call volume data for the last 30 days
const generateHourlyData = () => {
  const data: { date: Date; hour: number; calls: number }[] = [];
  const today = new Date();

  // Generate data for last 30 days
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    // For each hour of the day
    for (let hour = 0; hour < 24; hour++) {
      let calls = 0;

      // Weekend pattern (lower volume)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      if (isWeekend) {
        // Weekend: sporadic calls, mostly during afternoon
        if (hour >= 10 && hour <= 16) {
          calls = Math.floor(Math.random() * 8) + 2;
        } else if (hour >= 9 && hour <= 18) {
          calls = Math.floor(Math.random() * 4);
        } else {
          calls = Math.floor(Math.random() * 2);
        }
      } else {
        // Weekday pattern
        if (hour >= 8 && hour <= 10) {
          // Morning rush
          calls = Math.floor(Math.random() * 20) + 15;
        } else if (hour >= 11 && hour <= 14) {
          // Midday peak
          calls = Math.floor(Math.random() * 25) + 20;
        } else if (hour >= 15 && hour <= 17) {
          // Afternoon steady
          calls = Math.floor(Math.random() * 18) + 12;
        } else if (hour >= 18 && hour <= 20) {
          // Evening taper
          calls = Math.floor(Math.random() * 12) + 5;
        } else if (hour >= 7 || hour <= 21) {
          // Early/late hours
          calls = Math.floor(Math.random() * 6);
        } else {
          // Night hours (very low)
          calls = Math.floor(Math.random() * 3);
        }
      }

      data.push({ date: new Date(date), hour, calls });
    }
  }

  return data;
};

export default function CallVolumeHeatmap({
  data,
  title = 'Call Volume Heatmap - Last 30 Days',
}: CallVolumeHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; hour: number; calls: number } | null>(null);

  // Memoize the data generation so it only runs once
  const hourlyData = useMemo(() => generateHourlyData(), []);

  // Find max value for color scaling
  const maxCalls = Math.max(...hourlyData.map(d => d.calls));

  // GitHub-style green color scale
  const getHeatColor = (calls: number): string => {
    if (calls === 0) return '#ebedf0';
    const intensity = calls / maxCalls;

    if (intensity > 0.75) return '#0e4429';
    if (intensity > 0.5) return '#006d32';
    if (intensity > 0.25) return '#26a641';
    return '#39d353';
  };

  // Group data by date
  const dataByDate = hourlyData.reduce((acc, item) => {
    const dateKey = item.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, typeof hourlyData>);

  // Get unique dates (last 30 days)
  const dates = Object.keys(dataByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Hours to display (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    if (hour < 12) return `${hour}a`;
    return `${hour - 12}p`;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Get day of week
  const getDayOfWeek = (dateStr: string) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div style={{ position: 'relative' }}>
      <h3
        className="text-neutral-900"
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[4],
        }}
      >
        {title}
      </h3>

      <div style={{ overflowX: 'auto', paddingBottom: spacing[4] }}>
        <div>
          {/* Grid container */}
          <div style={{ display: 'flex', gap: spacing[1] }}>
            {/* Hour labels (Y-axis) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '50px' }}>
              {hours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[600],
                    paddingRight: spacing[2],
                    minWidth: '26px',
                    justifyContent: 'flex-end',
                  }}
                >
                  {hour % 3 === 0 ? formatHour(hour) : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div style={{ flex: 1 }}>
              {/* Date labels (X-axis) */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: spacing[2] }}>
                {dates.map((dateStr, idx) => {
                  const showLabel = idx % 5 === 0 || idx === dates.length - 1;
                  return (
                    <div
                      key={dateStr}
                      style={{
                        width: '14px',
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'left bottom',
                        whiteSpace: 'nowrap',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                      {showLabel ? formatDate(dateStr) : ''}
                    </div>
                  );
                })}
              </div>

              {/* Day of week indicators */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: spacing[1] }}>
                {dates.map((dateStr) => {
                  const dayOfWeek = getDayOfWeek(dateStr);
                  const isMonday = dayOfWeek === 'Mon';
                  return (
                    <div
                      key={`day-${dateStr}`}
                      style={{
                        width: '14px',
                        fontSize: '9px',
                        color: colors.neutral[500],
                        textAlign: 'center',
                        fontWeight: isMonday ? typography.fontWeight.bold : typography.fontWeight.normal,
                      }}
                    >
                      {isMonday ? 'M' : dayOfWeek === 'Wed' ? 'W' : dayOfWeek === 'Fri' ? 'F' : ''}
                    </div>
                  );
                })}
              </div>

              {/* Heatmap cells */}
              <div>
                {hours.map((hour) => (
                  <div key={hour} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {dates.map((dateStr) => {
                      const cellData = dataByDate[dateStr]?.find(d => d.hour === hour);
                      const calls = cellData?.calls || 0;
                      const date = new Date(dateStr);
                      const isHovered = hoveredCell?.date.toDateString() === dateStr && hoveredCell?.hour === hour;

                      return (
                        <div
                          key={`${dateStr}-${hour}`}
                          onMouseEnter={() => setHoveredCell({ date, hour, calls })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: getHeatColor(calls),
                            borderRadius: '2px',
                            cursor: 'pointer',
                            border: '1px solid rgba(0,0,0,0.05)',
                            transition: 'all 0.15s',
                            boxShadow: isHovered ? `0 0 0 2px ${colors.neutral[900]}` : 'none',
                            zIndex: isHovered ? 10 : 1,
                            position: 'relative',
                            opacity: isHovered ? 1 : 0.95,
                          }}
                          title={`${calls} calls`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Legend and Tooltip Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          marginTop: spacing[4],
          minHeight: '40px',
        }}
      >
        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            Less
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
              <div
                key={i}
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: intensity === 0 ? '#ebedf0' : getHeatColor(maxCalls * intensity),
                  borderRadius: '2px',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            More
          </span>
        </div>

        {/* Hover tooltip - Same line */}
        {hoveredCell && (
          <div
            style={{
              padding: `${spacing[1]} ${spacing[2]}`,
              backgroundColor: colors.neutral[900],
              color: 'white',
              borderRadius: '4px',
              fontSize: typography.fontSize.xs,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontWeight: typography.fontWeight.bold }}>
              {hoveredCell.calls} call{hoveredCell.calls !== 1 ? 's' : ''}
            </span>
            {' • '}
            <span style={{ opacity: 0.9 }}>
              {hoveredCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {formatHour(hoveredCell.hour)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
