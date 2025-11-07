import React from 'react';
import { Sparkles } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface AINextActionProps {
  action: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function AINextAction({ action, priority = 'medium' }: AINextActionProps) {
  const priorityColors = {
    high: colors.status.error,
    medium: colors.primary[600],
    low: colors.neutral[500],
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
      <Sparkles
        style={{
          width: '14px',
          height: '14px',
          color: priorityColors[priority],
          animation: 'sparkle 2s ease-in-out infinite',
        }}
      />
      <span
        style={{
          fontSize: typography.fontSize.xs,
          color: colors.neutral[700],
        }}
      >
        {action}
      </span>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
