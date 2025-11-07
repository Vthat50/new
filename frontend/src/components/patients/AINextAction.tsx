import React from 'react';
import { Sparkles } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface AINextActionProps {
  patientId: string;
  patientData: {
    sdohRisk: number;
    journeyStage: string;
    adherence: number;
    lastContact: string;
  };
  compact?: boolean;
}

export default function AINextAction({ patientId, patientData, compact = false }: AINextActionProps) {
  // AI-driven action recommendation based on patient data
  const getRecommendedAction = () => {
    const { sdohRisk, journeyStage, adherence, lastContact } = patientData;
    const daysSinceContact = Math.floor((Date.now() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24));

    // High priority: High SDOH risk + low adherence
    if (sdohRisk >= 70 && adherence < 60) {
      return { action: 'Schedule care coordinator call', priority: 'high' as const };
    }

    // High priority: No contact in 14+ days and low adherence
    if (daysSinceContact >= 14 && adherence < 70) {
      return { action: 'Urgent follow-up needed', priority: 'high' as const };
    }

    // Medium priority: PA Pending stage
    if (journeyStage === 'pa_pending') {
      return { action: 'Check prior authorization status', priority: 'medium' as const };
    }

    // Medium priority: Medium SDOH risk
    if (sdohRisk >= 40 && sdohRisk < 70) {
      return { action: 'Review SDOH barriers', priority: 'medium' as const };
    }

    // Medium priority: Adherence dropping
    if (adherence >= 60 && adherence < 80) {
      return { action: 'Send adherence reminder', priority: 'medium' as const };
    }

    // Low priority: Regular check-in
    if (daysSinceContact >= 7) {
      return { action: 'Routine wellness check', priority: 'low' as const };
    }

    // Default: All good
    return { action: 'Continue monitoring', priority: 'low' as const };
  };

  const { action, priority } = getRecommendedAction();
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
