import React, { useState } from 'react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  title?: string;
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

const defaultColors = [
  colors.primary[500],
  colors.secondary[500],
  colors.accent[500],
  colors.status.success,
  colors.status.warning,
  colors.status.error,
  colors.neutral[500],
];

export default function DonutChart({
  data,
  title,
  size = 300,
  innerRadius = 0.6,
  showLegend = true,
  showPercentages = true,
  centerText,
  centerSubtext,
}: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const innerR = radius * innerRadius;

  // Calculate segments
  let currentAngle = -90;
  const segments = data.map((segment, index) => {
    const percentage = (segment.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...segment,
      percentage,
      startAngle,
      endAngle,
      color: segment.color || defaultColors[index % defaultColors.length],
    };
  });

  const polarToCartesian = (angleInDegrees: number, r: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const getSegmentPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
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
      {/* Title */}
      {title && (
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[4],
          }}
        >
          {title}
        </h3>
      )}

      <div
        style={{
          display: 'flex',
          gap: spacing[6],
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Chart */}
        <div style={{ position: 'relative' }}>
          <svg width={size} height={size}>
            {segments.map((segment, index) => (
              <path
                key={index}
                d={getSegmentPath(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                opacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.4}
                style={{
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <title>
                  {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
                </title>
              </path>
            ))}

            {/* Center Text */}
            {centerText && (
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                fontSize={typography.fontSize['2xl']}
                fontWeight={typography.fontWeight.bold}
                fill={colors.neutral[900]}
              >
                {centerText}
              </text>
            )}
            {centerSubtext && (
              <text
                x={centerX}
                y={centerY + 20}
                textAnchor="middle"
                fontSize={typography.fontSize.sm}
                fill={colors.neutral[600]}
              >
                {centerSubtext}
              </text>
            )}
          </svg>
        </div>

        {/* Legend */}
        {showLegend && (
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {segments.map((segment, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    padding: spacing[2],
                    borderRadius: '6px',
                    backgroundColor: hoveredIndex === index ? colors.neutral[50] : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  {/* Color Indicator */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: segment.color,
                      flexShrink: 0,
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      flex: 1,
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[700],
                    }}
                  >
                    {segment.label}
                  </div>

                  {/* Value */}
                  <div
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                    }}
                  >
                    {segment.value}
                  </div>

                  {/* Percentage */}
                  {showPercentages && (
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                        minWidth: '45px',
                        textAlign: 'right',
                      }}
                    >
                      ({segment.percentage.toFixed(1)}%)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mini donut variant for KPI cards
export function MiniDonutChart({
  data,
  size = 80,
  innerRadius = 0.7,
}: {
  data: DonutSegment[];
  size?: number;
  innerRadius?: number;
}) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 5;
  const innerR = radius * innerRadius;

  let currentAngle = -90;
  const segments = data.map((segment, index) => {
    const percentage = (segment.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    return {
      ...segment,
      percentage,
      startAngle,
      endAngle,
      color: segment.color || defaultColors[index % defaultColors.length],
    };
  });

  const polarToCartesian = (angleInDegrees: number, r: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const getSegmentPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const innerStart = polarToCartesian(endAngle, innerR);
    const innerEnd = polarToCartesian(startAngle, innerR);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
  };

  return (
    <svg width={size} height={size}>
      {segments.map((segment, index) => (
        <path key={index} d={getSegmentPath(segment.startAngle, segment.endAngle)} fill={segment.color} />
      ))}
    </svg>
  );
}
