import React from 'react';
import { PhoneOutgoing, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface QuickActionsPanelProps {
  demoMode: boolean;
  onInitiateCampaign: () => void;
  onViewHighPriority: () => void;
  onGenerateReport: () => void;
  onScheduleDemo: () => void;
}

export default function QuickActionsPanel({
  demoMode,
  onInitiateCampaign,
  onViewHighPriority,
  onGenerateReport,
  onScheduleDemo,
}: QuickActionsPanelProps) {
  const actions = [
    {
      id: 'campaign',
      label: 'Initiate Outbound Campaign',
      icon: PhoneOutgoing,
      color: colors.primary[500],
      bgColor: colors.primary[50],
      onClick: onInitiateCampaign,
      visible: true,
    },
    {
      id: 'high-priority',
      label: 'View High-Priority Patients',
      icon: AlertTriangle,
      color: colors.status.warning,
      bgColor: colors.status.warningBg,
      onClick: onViewHighPriority,
      visible: true,
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: FileText,
      color: colors.status.info,
      bgColor: colors.status.infoBg,
      onClick: onGenerateReport,
      visible: true,
    },
    {
      id: 'schedule',
      label: 'Schedule Demo',
      icon: Calendar,
      color: colors.primary[600],
      bgColor: colors.primary[50],
      onClick: onScheduleDemo,
      visible: demoMode,
    },
  ];

  const visibleActions = actions.filter(action => action.visible);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: `1px solid ${colors.neutral[200]}`,
        padding: spacing[6],
      }}
    >
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          marginBottom: spacing[4],
        }}
      >
        Quick Actions
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: visibleActions.length === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: spacing[3],
        }}
      >
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing[4],
                backgroundColor: action.bgColor,
                border: `2px solid transparent`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                minHeight: '120px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <Icon style={{ width: '24px', height: '24px', color: action.color }} />
              </div>

              <span
                style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[900],
                  lineHeight: '1.4',
                }}
              >
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
