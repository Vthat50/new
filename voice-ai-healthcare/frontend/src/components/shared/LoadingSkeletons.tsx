import React from 'react';
import { colors, spacing } from '../../lib/design-system';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', className }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.neutral[200],
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[3], padding: spacing[3] }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${100 / columns}%`} height="24px" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[2], padding: spacing[3] }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={`${100 / columns}%`} height="20px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      style={{
        padding: spacing[4],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        backgroundColor: 'white',
      }}
    >
      <Skeleton width="60%" height="24px" style={{ marginBottom: spacing[3] }} />
      <Skeleton width="100%" height="16px" style={{ marginBottom: spacing[2] }} />
      <Skeleton width="100%" height="16px" style={{ marginBottom: spacing[2] }} />
      <Skeleton width="80%" height="16px" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div>
      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing[4], marginBottom: spacing[6] }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: spacing[4],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              backgroundColor: 'white',
            }}
          >
            <Skeleton width="50%" height="16px" style={{ marginBottom: spacing[3] }} />
            <Skeleton width="40%" height="32px" style={{ marginBottom: spacing[2] }} />
            <Skeleton width="30%" height="14px" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: spacing[4],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              backgroundColor: 'white',
              height: '400px',
            }}
          >
            <Skeleton width="40%" height="20px" style={{ marginBottom: spacing[4] }} />
            <Skeleton width="100%" height="300px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: spacing[3],
            padding: spacing[3],
            borderBottom: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <Skeleton width="48px" height="48px" borderRadius="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height="20px" style={{ marginBottom: spacing[2] }} />
            <Skeleton width="40%" height="16px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div style={{ padding: spacing[4] }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ marginBottom: spacing[4] }}>
          <Skeleton width="30%" height="16px" style={{ marginBottom: spacing[2] }} />
          <Skeleton width="100%" height="40px" />
        </div>
      ))}
      <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'flex-end', marginTop: spacing[6] }}>
        <Skeleton width="100px" height="40px" borderRadius="6px" />
        <Skeleton width="100px" height="40px" borderRadius="6px" />
      </div>
    </div>
  );
}
