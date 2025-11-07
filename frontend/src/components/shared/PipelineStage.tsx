import React from 'react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PipelineStageProps {
  stage: 'Awareness' | 'Start' | 'Treatment' | 'Established' | 'At Risk' | 'Churned';
  size?: 'small' | 'medium' | 'large';
}

export default function PipelineStage({ stage, size = 'small' }: PipelineStageProps) {
  const stageConfig = {
    'Awareness': { color: colors.neutral[400], label: 'Awareness', order: 1 },
    'Start': { color: colors.primary[500], label: 'Start', order: 2 },
    'Treatment': { color: colors.status.info, label: 'Treatment', order: 3 },
    'Established': { color: colors.status.success, label: 'Established', order: 4 },
    'At Risk': { color: colors.status.warning, label: 'At Risk', order: 5 },
    'Churned': { color: colors.status.error, label: 'Churned', order: 6 },
  };

  const config = stageConfig[stage];
  const stages = ['Awareness', 'Start', 'Treatment', 'Established', 'At Risk', 'Churned'];
  const currentIndex = stages.indexOf(stage);

  const sizeConfig = {
    small: { height: 20, dotSize: 8, lineWidth: 2, fontSize: typography.fontSize.xs },
    medium: { height: 30, dotSize: 12, lineWidth: 3, fontSize: typography.fontSize.sm },
    large: { height: 40, dotSize: 16, lineWidth: 4, fontSize: typography.fontSize.base },
  };

  const { height, dotSize, lineWidth, fontSize } = sizeConfig[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
      {/* Pipeline Visualization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
        {stages.map((s, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrentStage = idx === currentIndex;

          return (
            <React.Fragment key={s}>
              {/* Dot */}
              <div
                style={{
                  width: `${isCurrentStage ? dotSize * 1.2 : dotSize}px`,
                  height: `${isCurrentStage ? dotSize * 1.2 : dotSize}px`,
                  borderRadius: '50%',
                  backgroundColor: isActive ? stageConfig[s as keyof typeof stageConfig].color : colors.neutral[200],
                  transition: 'all 0.3s',
                  border: isCurrentStage ? `2px solid ${config.color}` : 'none',
                  boxShadow: isCurrentStage ? `0 0 0 4px ${config.color}20` : 'none',
                }}
              />

              {/* Connecting Line */}
              {idx < stages.length - 1 && (
                <div
                  style={{
                    width: '16px',
                    height: `${lineWidth}px`,
                    backgroundColor: isActive ? stageConfig[s as keyof typeof stageConfig].color : colors.neutral[200],
                    transition: 'all 0.3s',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize,
          fontWeight: typography.fontWeight.medium,
          color: config.color,
          whiteSpace: 'nowrap',
        }}
      >
        {config.label}
      </span>
    </div>
  );
}
