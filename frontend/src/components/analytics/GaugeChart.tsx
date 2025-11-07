import React from 'react';
import { colors, spacing, typography } from '../../lib/design-system';

interface GaugeChartProps {
  value: number;
  max?: number;
  min?: number;
  label?: string;
  unit?: string;
  size?: number;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
  };
  showValue?: boolean;
}

export default function GaugeChart({
  value,
  max = 100,
  min = 0,
  label,
  unit = '',
  size = 200,
  thresholds = { low: 33, medium: 66, high: 100 },
  showValue = true,
}: GaugeChartProps) {
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  const getColor = () => {
    const percent = percentage;
    if (percent < thresholds.low) return colors.status.error;
    if (percent < thresholds.medium) return colors.status.warning;
    return colors.status.success;
  };

  const color = getColor();

  // SVG gauge arc path
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  const startAngle = -90;
  const endAngle = 90;

  const polarToCartesian = (angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const backgroundArc = () => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  const valueArc = () => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(angle);
    const largeArcFlag = angle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const needleAngle = angle;
  const needleLength = radius - 10;
  const needleEnd = polarToCartesian(needleAngle);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing[3],
      }}
    >
      <svg width={size} height={size * 0.7} style={{ overflow: 'visible' }}>
        {/* Background Arc */}
        <path
          d={backgroundArc()}
          fill="none"
          stroke={colors.neutral[200]}
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <path
          d={valueArc()}
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Threshold Markers */}
        {[thresholds.low, thresholds.medium].map((threshold, index) => {
          const markerAngle = ((threshold / 100) * 180 - 90);
          const markerPos = polarToCartesian(markerAngle);
          const outerPos = {
            x: centerX + (radius + 10) * Math.cos(((markerAngle - 90) * Math.PI) / 180),
            y: centerY + (radius + 10) * Math.sin(((markerAngle - 90) * Math.PI) / 180),
          };
          return (
            <line
              key={index}
              x1={markerPos.x}
              y1={markerPos.y}
              x2={outerPos.x}
              y2={outerPos.y}
              stroke={colors.neutral[400]}
              strokeWidth="2"
            />
          );
        })}

        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke={colors.neutral[900]}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Center Circle */}
        <circle cx={centerX} cy={centerY} r="8" fill={colors.neutral[900]} />
        <circle cx={centerX} cy={centerY} r="4" fill="white" />

        {/* Min/Max Labels */}
        <text
          x={polarToCartesian(-90).x}
          y={polarToCartesian(-90).y + 20}
          textAnchor="middle"
          fontSize="12"
          fill={colors.neutral[600]}
        >
          {min}
        </text>
        <text
          x={polarToCartesian(90).x}
          y={polarToCartesian(90).y + 20}
          textAnchor="middle"
          fontSize="12"
          fill={colors.neutral[600]}
        >
          {max}
        </text>
      </svg>

      {/* Value Display */}
      {showValue && (
        <div style={{ textAlign: 'center', marginTop: '-40px' }}>
          <div
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            }}
          >
            {normalizedValue.toFixed(1)}
            <span
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.normal,
                color: colors.neutral[600],
                marginLeft: spacing[1],
              }}
            >
              {unit}
            </span>
          </div>
          {label && (
            <div
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
                marginTop: spacing[1],
              }}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Compact gauge variant
export function MiniGauge({ value, max = 100, label, color }: { value: number; max?: number; label?: string; color?: string }) {
  const percentage = (value / max) * 100;
  const angle = (percentage / 100) * 180 - 90;
  const size = 100;
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  const polarToCartesian = (angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const backgroundArc = () => {
    const start = polarToCartesian(-90);
    const end = polarToCartesian(90);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  const valueArc = () => {
    const start = polarToCartesian(-90);
    const end = polarToCartesian(angle);
    const largeArcFlag = angle + 90 <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.7}>
        <path d={backgroundArc()} fill="none" stroke={colors.neutral[200]} strokeWidth="8" strokeLinecap="round" />
        <path d={valueArc()} fill="none" stroke={color || colors.primary[500]} strokeWidth="8" strokeLinecap="round" />
      </svg>
      <div
        style={{
          textAlign: 'center',
          marginTop: '-25px',
        }}
      >
        <div
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
          }}
        >
          {value}%
        </div>
        {label && (
          <div
            style={{
              fontSize: typography.fontSize.xs,
              color: colors.neutral[600],
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
