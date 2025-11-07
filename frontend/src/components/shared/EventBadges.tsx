import React from 'react';
import { Clock, RefreshCw, Pill, AlertCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface EventBadge {
  type: 'consent-expiring' | 'pa-renewal' | 'refill-due' | 'high-risk';
  daysUntil?: number;
}

interface EventBadgesProps {
  events: EventBadge[];
  size?: 'small' | 'medium';
}

export default function EventBadges({ events, size = 'small' }: EventBadgesProps) {
  const badgeConfig = {
    'consent-expiring': {
      icon: Clock,
      color: colors.status.warning,
      bgColor: colors.status.warningBg,
      label: 'Consent Expiring',
    },
    'pa-renewal': {
      icon: RefreshCw,
      color: colors.primary[600],
      bgColor: colors.primary[50],
      label: 'PA Renewal',
    },
    'refill-due': {
      icon: Pill,
      color: colors.status.success,
      bgColor: colors.status.successBg,
      label: 'Refill Due',
    },
    'high-risk': {
      icon: AlertCircle,
      color: colors.status.error,
      bgColor: colors.status.errorBg,
      label: 'High Risk',
    },
  };

  const sizeConfig = {
    small: { iconSize: 12, padding: spacing[1], fontSize: typography.fontSize.xs },
    medium: { iconSize: 16, padding: spacing[2], fontSize: typography.fontSize.sm },
  };

  const { iconSize, padding, fontSize } = sizeConfig[size];

  if (events.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: spacing[1], flexWrap: 'wrap' }}>
      {events.map((event, idx) => {
        const config = badgeConfig[event.type];
        const Icon = config.icon;

        return (
          <div
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: `${padding} ${padding * 2}`,
              backgroundColor: config.bgColor,
              color: config.color,
              borderRadius: '12px',
              fontSize,
              fontWeight: typography.fontWeight.medium,
              whiteSpace: 'nowrap',
            }}
            title={`${config.label}${event.daysUntil ? ` in ${event.daysUntil} days` : ''}`}
          >
            <Icon style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
            {size === 'medium' && (
              <span>
                {config.label}
                {event.daysUntil && ` (${event.daysUntil}d)`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
