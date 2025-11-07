import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ComplianceCheck {
  id: string;
  name: string;
  category: 'hipaa' | 'fda' | 'consent' | 'disclosure' | 'documentation';
  status: 'pass' | 'warning' | 'fail';
  description: string;
  timestamp?: Date;
  details?: string;
}

interface ComplianceScorecardProps {
  checks: ComplianceCheck[];
  overallScore: number;
  callId: string;
}

export default function ComplianceScorecard({ checks, overallScore, callId }: ComplianceScorecardProps) {
  const getCategoryLabel = (category: ComplianceCheck['category']) => {
    const labels = {
      hipaa: 'HIPAA Privacy',
      fda: 'FDA Compliance',
      consent: 'Patient Consent',
      disclosure: 'Required Disclosures',
      documentation: 'Documentation',
    };
    return labels[category];
  };

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    const iconProps = { width: '20px', height: '20px' };
    switch (status) {
      case 'pass':
        return <CheckCircle {...iconProps} style={{ color: colors.status.success }} />;
      case 'warning':
        return <AlertTriangle {...iconProps} style={{ color: colors.status.warning }} />;
      case 'fail':
        return <XCircle {...iconProps} style={{ color: colors.status.error }} />;
    }
  };

  const getStatusColor = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'pass':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'fail':
        return colors.status.error;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.status.success;
    if (score >= 70) return colors.status.warning;
    return colors.status.error;
  };

  const statusCounts = checks.reduce(
    (acc, check) => {
      acc[check.status]++;
      return acc;
    },
    { pass: 0, warning: 0, fail: 0 }
  );

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: `${getScoreColor(overallScore)}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getScoreColor(overallScore),
            }}
          >
            <Shield style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                margin: 0,
              }}
            >
              Compliance Scorecard
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
              Call ID: {callId}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div
          style={{
            padding: spacing[4],
            backgroundColor: `${getScoreColor(overallScore)}10`,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: typography.fontWeight.bold,
              color: getScoreColor(overallScore),
            }}
          >
            {overallScore}%
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginTop: spacing[1] }}>
            Compliance Score
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing[3],
          marginBottom: spacing[4],
        }}
      >
        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.successBg,
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.status.success,
            }}
          >
            {statusCounts.pass}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[700] }}>Passed</div>
        </div>

        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.warningBg,
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.status.warning,
            }}
          >
            {statusCounts.warning}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[700] }}>Warnings</div>
        </div>

        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.errorBg,
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.status.error,
            }}
          >
            {statusCounts.fail}
          </div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[700] }}>Failed</div>
        </div>
      </div>

      {/* Compliance Checks */}
      <div>
        <h4
          style={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[3],
          }}
        >
          Detailed Checks
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {checks.map((check) => (
            <div
              key={check.id}
              style={{
                padding: spacing[3],
                border: `1px solid ${colors.neutral[200]}`,
                borderLeft: `4px solid ${getStatusColor(check.status)}`,
                borderRadius: '6px',
                backgroundColor: check.status !== 'pass' ? `${getStatusColor(check.status)}05` : 'white',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3] }}>
                {/* Status Icon */}
                <div style={{ flexShrink: 0 }}>{getStatusIcon(check.status)}</div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
                    <h5
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        margin: 0,
                      }}
                    >
                      {check.name}
                    </h5>
                    <span
                      style={{
                        fontSize: typography.fontSize.xs,
                        padding: `${spacing[1]} ${spacing[2]}`,
                        backgroundColor: colors.neutral[100],
                        color: colors.neutral[700],
                        borderRadius: '4px',
                      }}
                    >
                      {getCategoryLabel(check.category)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[700],
                      margin: 0,
                      marginBottom: check.details ? spacing[2] : 0,
                    }}
                  >
                    {check.description}
                  </p>

                  {check.details && (
                    <div
                      style={{
                        padding: spacing[2],
                        backgroundColor: colors.neutral[50],
                        borderRadius: '4px',
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[600],
                      }}
                    >
                      {check.details}
                    </div>
                  )}

                  {check.timestamp && (
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
                      Checked at {new Date(check.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {statusCounts.fail > 0 && (
        <div
          style={{
            marginTop: spacing[4],
            padding: spacing[4],
            backgroundColor: colors.status.errorBg,
            border: `1px solid ${colors.status.error}`,
            borderRadius: '8px',
          }}
        >
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              color: colors.status.error,
              marginBottom: spacing[2],
            }}
          >
            Action Required
          </h4>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], margin: 0 }}>
            This call has {statusCounts.fail} failed compliance check{statusCounts.fail !== 1 ? 's' : ''}. Please review
            and address the issues immediately. Consider escalating to compliance team if needed.
          </p>
        </div>
      )}
    </div>
  );
}
