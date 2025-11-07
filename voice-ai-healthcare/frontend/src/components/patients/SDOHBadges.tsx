import React from 'react';
import {
  Home,
  DollarSign,
  GraduationCap,
  Users,
  Car,
  Wifi,
  Heart,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface SDOHBadgesProps {
  sdohFactors: {
    housing?: 'stable' | 'unstable' | 'homeless' | 'unknown';
    financialStrain?: 'low' | 'medium' | 'high' | 'unknown';
    education?: 'high-school-or-less' | 'some-college' | 'college-plus' | 'unknown';
    socialSupport?: 'strong' | 'moderate' | 'limited' | 'none' | 'unknown';
    transportation?: 'reliable' | 'limited' | 'none' | 'unknown';
    foodSecurity?: 'secure' | 'insecure' | 'unknown';
    digitalAccess?: 'full' | 'limited' | 'none' | 'unknown';
    healthLiteracy?: 'high' | 'medium' | 'low' | 'unknown';
  };
  overallRisk?: 'low' | 'medium' | 'high';
  size?: 'small' | 'medium' | 'large';
  showTooltips?: boolean;
}

type SDOHFactor = {
  key: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  risk: 'low' | 'medium' | 'high' | 'unknown';
  description: string;
};

export default function SDOHBadges({
  sdohFactors,
  overallRisk = 'medium',
  size = 'medium',
  showTooltips = true,
}: SDOHBadgesProps) {
  const sizeMap = {
    small: { badge: spacing[1], icon: '12px', font: typography.fontSize.xs },
    medium: { badge: spacing[2], icon: '14px', font: typography.fontSize.sm },
    large: { badge: spacing[3], icon: '16px', font: typography.fontSize.md },
  };

  const dimensions = sizeMap[size];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return {
          bg: colors.status.errorBg,
          border: colors.status.error,
          text: colors.status.error,
        };
      case 'medium':
        return {
          bg: colors.status.warningBg,
          border: colors.status.warning,
          text: colors.neutral[900],
        };
      case 'low':
        return {
          bg: colors.status.successBg,
          border: colors.status.success,
          text: colors.status.success,
        };
      default:
        return {
          bg: colors.neutral[100],
          border: colors.neutral[300],
          text: colors.neutral[600],
        };
    }
  };

  const mapFactorToRisk = (factor: string, value: string): 'low' | 'medium' | 'high' | 'unknown' => {
    const riskMapping: Record<string, Record<string, 'low' | 'medium' | 'high' | 'unknown'>> = {
      housing: { stable: 'low', unstable: 'high', homeless: 'high', unknown: 'unknown' },
      financialStrain: { low: 'low', medium: 'medium', high: 'high', unknown: 'unknown' },
      education: { 'college-plus': 'low', 'some-college': 'medium', 'high-school-or-less': 'medium', unknown: 'unknown' },
      socialSupport: { strong: 'low', moderate: 'medium', limited: 'high', none: 'high', unknown: 'unknown' },
      transportation: { reliable: 'low', limited: 'high', none: 'high', unknown: 'unknown' },
      foodSecurity: { secure: 'low', insecure: 'high', unknown: 'unknown' },
      digitalAccess: { full: 'low', limited: 'medium', none: 'high', unknown: 'unknown' },
      healthLiteracy: { high: 'low', medium: 'medium', low: 'high', unknown: 'unknown' },
    };

    return riskMapping[factor]?.[value] || 'unknown';
  };

  const formatValue = (value: string): string => {
    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const factors: SDOHFactor[] = [];

  if (sdohFactors.housing) {
    factors.push({
      key: 'housing',
      label: 'Housing',
      icon: <Home style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.housing),
      risk: mapFactorToRisk('housing', sdohFactors.housing),
      description: 'Housing stability and living conditions',
    });
  }

  if (sdohFactors.financialStrain) {
    factors.push({
      key: 'financial',
      label: 'Financial',
      icon: <DollarSign style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.financialStrain) + ' Strain',
      risk: mapFactorToRisk('financialStrain', sdohFactors.financialStrain),
      description: 'Financial stability and economic resources',
    });
  }

  if (sdohFactors.education) {
    factors.push({
      key: 'education',
      label: 'Education',
      icon: <GraduationCap style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.education),
      risk: mapFactorToRisk('education', sdohFactors.education),
      description: 'Educational attainment level',
    });
  }

  if (sdohFactors.socialSupport) {
    factors.push({
      key: 'social',
      label: 'Social Support',
      icon: <Users style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.socialSupport),
      risk: mapFactorToRisk('socialSupport', sdohFactors.socialSupport),
      description: 'Social connections and support network',
    });
  }

  if (sdohFactors.transportation) {
    factors.push({
      key: 'transportation',
      label: 'Transportation',
      icon: <Car style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.transportation),
      risk: mapFactorToRisk('transportation', sdohFactors.transportation),
      description: 'Access to reliable transportation',
    });
  }

  if (sdohFactors.foodSecurity) {
    factors.push({
      key: 'food',
      label: 'Food Security',
      icon: <Heart style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.foodSecurity),
      risk: mapFactorToRisk('foodSecurity', sdohFactors.foodSecurity),
      description: 'Access to nutritious food',
    });
  }

  if (sdohFactors.digitalAccess) {
    factors.push({
      key: 'digital',
      label: 'Digital Access',
      icon: <Wifi style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.digitalAccess),
      risk: mapFactorToRisk('digitalAccess', sdohFactors.digitalAccess),
      description: 'Access to internet and technology',
    });
  }

  if (sdohFactors.healthLiteracy) {
    factors.push({
      key: 'health-literacy',
      label: 'Health Literacy',
      icon: <Shield style={{ width: dimensions.icon, height: dimensions.icon }} />,
      value: formatValue(sdohFactors.healthLiteracy),
      risk: mapFactorToRisk('healthLiteracy', sdohFactors.healthLiteracy),
      description: 'Understanding of health information',
    });
  }

  const highRiskCount = factors.filter((f) => f.risk === 'high').length;

  return (
    <div>
      {/* Overall Risk Badge */}
      {overallRisk && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]} ${spacing[3]}`,
            backgroundColor: getRiskColor(overallRisk).bg,
            border: `1px solid ${getRiskColor(overallRisk).border}`,
            borderRadius: '6px',
            marginBottom: spacing[3],
          }}
        >
          <AlertTriangle
            style={{
              width: '16px',
              height: '16px',
              color: getRiskColor(overallRisk).text,
            }}
          />
          <div>
            <span
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: getRiskColor(overallRisk).text,
              }}
            >
              {overallRisk.toUpperCase()} SDOH Risk
            </span>
            {highRiskCount > 0 && (
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.neutral[700],
                  marginLeft: spacing[2],
                }}
              >
                ({highRiskCount} high-risk factor{highRiskCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Individual SDOH Factor Badges */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing[2],
        }}
      >
        {factors.map((factor) => {
          const colorScheme = getRiskColor(factor.risk);

          return (
            <div
              key={factor.key}
              className="sdoh-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${dimensions.badge} ${spacing[3]}`,
                backgroundColor: colorScheme.bg,
                border: `1px solid ${colorScheme.border}`,
                borderRadius: '4px',
                position: 'relative',
                cursor: showTooltips ? 'pointer' : 'default',
              }}
              title={showTooltips ? `${factor.label}: ${factor.value} - ${factor.description}` : undefined}
            >
              <div style={{ color: colorScheme.text }}>{factor.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[600],
                    lineHeight: '1',
                    marginBottom: spacing[0.5],
                  }}
                >
                  {factor.label}
                </div>
                <div
                  style={{
                    fontSize: dimensions.font,
                    fontWeight: typography.fontWeight.medium,
                    color: colorScheme.text,
                    lineHeight: '1',
                  }}
                >
                  {factor.value}
                </div>
              </div>

              {/* Tooltip on hover (enhanced version) */}
              {showTooltips && (
                <div
                  className="tooltip"
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: spacing[2],
                    padding: spacing[3],
                    backgroundColor: colors.neutral[900],
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: typography.fontSize.xs,
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s',
                    zIndex: 100,
                  }}
                >
                  <div style={{ fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                    {factor.label}: {factor.value}
                  </div>
                  <div style={{ color: colors.neutral[300] }}>{factor.description}</div>
                  {/* Arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${colors.neutral[900]}`,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      {factors.length > 0 && (
        <div
          style={{
            marginTop: spacing[4],
            padding: spacing[3],
            backgroundColor: colors.neutral[50],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '6px',
            display: 'flex',
            gap: spacing[2],
          }}
        >
          <Info style={{ width: '16px', height: '16px', color: colors.neutral[500], flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
            <strong>Social Determinants of Health (SDOH)</strong> factors may impact medication adherence and health
            outcomes. Consider these factors when developing care plans.
          </div>
        </div>
      )}

      <style>{`
        .sdoh-badge:hover .tooltip {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
