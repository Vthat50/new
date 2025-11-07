import React from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  metric: string;
  change: number;
  rank: number;
}

interface LeaderboardWidgetProps {
  title?: string;
  entries: LeaderboardEntry[];
  maxEntries?: number;
  showChange?: boolean;
}

export default function LeaderboardWidget({
  title = 'Top Performers',
  entries,
  maxEntries = 10,
  showChange = true,
}: LeaderboardWidgetProps) {
  const topEntries = entries.slice(0, maxEntries);

  const getMedalIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy style={{ width: '20px', height: '20px', color: colors.amber[500] }} />;
    if (rank === 2)
      return <Medal style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />;
    if (rank === 3)
      return <Medal style={{ width: '20px', height: '20px', color: '#cd7f32' }} />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return colors.amber[50];
    if (rank === 2) return colors.neutral[50];
    if (rank === 3) return '#fef3e2';
    return 'white';
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
          alignItems: 'center',
          gap: spacing[2],
          marginBottom: spacing[4],
        }}
      >
        <Trophy style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Leaderboard List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {topEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
              backgroundColor: getRankColor(entry.rank),
              border: `1px solid ${entry.rank <= 3 ? colors.neutral[300] : colors.neutral[100]}`,
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            className="leaderboard-item"
          >
            {/* Rank */}
            <div
              style={{
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getMedalIcon(entry.rank) || (
                <span
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[500],
                  }}
                >
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: entry.avatar ? 'transparent' : colors.primary[100],
                backgroundImage: entry.avatar ? `url(${entry.avatar})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.primary[700],
                flexShrink: 0,
              }}
            >
              {!entry.avatar && entry.name.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.name}
              </div>
            </div>

            {/* Score */}
            <div
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                flexShrink: 0,
              }}
            >
              {entry.score}
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.normal,
                  color: colors.neutral[600],
                  marginLeft: spacing[1],
                }}
              >
                {entry.metric}
              </span>
            </div>

            {/* Change */}
            {showChange && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: entry.change >= 0 ? colors.status.success : colors.status.error,
                  minWidth: '60px',
                  justifyContent: 'flex-end',
                  flexShrink: 0,
                }}
              >
                {entry.change >= 0 ? (
                  <TrendingUp style={{ width: '14px', height: '14px' }} />
                ) : (
                  <TrendingDown style={{ width: '14px', height: '14px' }} />
                )}
                {Math.abs(entry.change)}%
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .leaderboard-item:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
