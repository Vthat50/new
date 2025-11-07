import React, { useState } from 'react';
import { Shield, TrendingUp, AlertCircle, DollarSign, Clock, FileText } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

export default function InsuranceAnalyticsTab() {
  const [timeframe, setTimeframe] = useState('30');

  const insuranceMetrics = {
    verificationRate: 94.2,
    verificationTrend: '+2.1%',
    avgVerificationTime: 2.3, // minutes
    pendingVerifications: 47,
    denialRate: 8.5,
    denialTrend: '-1.2%',
    priorAuthPending: 134,
    priorAuthApproved: 89.3, // percentage
  };

  const topInsurers = [
    { name: 'UnitedHealthcare', volume: 1247, approvalRate: 92.4, avgTime: 2.1 },
    { name: 'Blue Cross Blue Shield', volume: 1089, approvalRate: 94.1, avgTime: 1.9 },
    { name: 'Aetna', volume: 876, approvalRate: 88.7, avgTime: 2.8 },
    { name: 'Cigna', volume: 654, approvalRate: 90.2, avgTime: 2.3 },
    { name: 'Humana', volume: 543, approvalRate: 91.5, avgTime: 2.0 },
  ];

  const denialReasons = [
    { reason: 'Missing Information', count: 156, percentage: 34.2 },
    { reason: 'Not Covered', count: 98, percentage: 21.5 },
    { reason: 'Prior Auth Required', count: 87, percentage: 19.1 },
    { reason: 'Duplicate Claim', count: 65, percentage: 14.3 },
    { reason: 'Other', count: 50, percentage: 11.0 },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[6],
        }}
      >
        <div>
          <h2
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[1],
            }}
          >
            Insurance Analytics
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Track insurance verification, approvals, and denials
          </p>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{
            padding: `${spacing[2]} ${spacing[4]}`,
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            backgroundColor: 'white',
          }}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: spacing[4],
          marginBottom: spacing[6],
        }}
      >
        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            <Shield style={{ width: '20px', height: '20px', color: colors.status.success }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Verification Rate
            </span>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing[2],
            }}
          >
            {insuranceMetrics.verificationRate}%
          </div>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.status.success,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            <TrendingUp style={{ width: '14px', height: '14px' }} />
            {insuranceMetrics.verificationTrend}
          </div>
        </div>

        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            <Clock style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Avg Verification Time
            </span>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing[2],
            }}
          >
            {insuranceMetrics.avgVerificationTime}m
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            {insuranceMetrics.pendingVerifications} pending
          </div>
        </div>

        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: colors.status.error }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Denial Rate
            </span>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing[2],
            }}
          >
            {insuranceMetrics.denialRate}%
          </div>
          <div
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.status.success,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            {insuranceMetrics.denialTrend}
          </div>
        </div>

        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
            <FileText style={{ width: '20px', height: '20px', color: colors.status.warning }} />
            <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Prior Auth
            </span>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: typography.fontWeight.bold,
              marginBottom: spacing[2],
            }}
          >
            {insuranceMetrics.priorAuthApproved}%
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            {insuranceMetrics.priorAuthPending} pending
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4], marginBottom: spacing[6] }}>
        {/* Top Insurers */}
        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[4],
            }}
          >
            Top Insurance Providers
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {topInsurers.map((insurer, index) => (
              <div key={insurer.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: spacing[2],
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        marginBottom: spacing[0.5],
                      }}
                    >
                      #{index + 1} {insurer.name}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      {insurer.volume} patients • {insurer.avgTime}m avg time
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.md,
                        fontWeight: typography.fontWeight.semibold,
                        color: insurer.approvalRate >= 90 ? colors.status.success : colors.status.warning,
                      }}
                    >
                      {insurer.approvalRate}%
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                      Approval
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: '6px',
                    backgroundColor: colors.neutral[200],
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${insurer.approvalRate}%`,
                      backgroundColor: insurer.approvalRate >= 90 ? colors.status.success : colors.status.warning,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Denial Reasons */}
        <div
          style={{
            padding: spacing[4],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[4],
            }}
          >
            Top Denial Reasons
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {denialReasons.map((denial) => (
              <div key={denial.reason}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: spacing[2],
                  }}
                >
                  <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {denial.reason}
                  </span>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    {denial.count} ({denial.percentage}%)
                  </span>
                </div>

                <div
                  style={{
                    height: '6px',
                    backgroundColor: colors.neutral[200],
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${denial.percentage}%`,
                      backgroundColor: colors.status.error,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          padding: spacing[4],
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '8px',
        }}
      >
        <h3
          style={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[4],
          }}
        >
          Recent Verifications
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'left',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                }}
              >
                Patient
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'left',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                }}
              >
                Insurer
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'left',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'left',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[700],
                }}
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { patient: 'John Smith', insurer: 'UnitedHealthcare', status: 'verified', time: '2m 15s' },
              { patient: 'Sarah Johnson', insurer: 'BCBS', status: 'pending', time: '-' },
              { patient: 'Michael Chen', insurer: 'Aetna', status: 'verified', time: '1m 45s' },
              { patient: 'Emily Davis', insurer: 'Cigna', status: 'denied', time: '3m 20s' },
              { patient: 'David Wilson', insurer: 'Humana', status: 'verified', time: '2m 05s' },
            ].map((item, index) => (
              <tr key={index} style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
                <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{item.patient}</td>
                <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{item.insurer}</td>
                <td style={{ padding: spacing[3] }}>
                  <span
                    style={{
                      padding: `${spacing[1]} ${spacing[2]}`,
                      backgroundColor:
                        item.status === 'verified'
                          ? colors.status.successBg
                          : item.status === 'pending'
                          ? colors.status.warningBg
                          : colors.status.errorBg,
                      color:
                        item.status === 'verified'
                          ? colors.status.success
                          : item.status === 'pending'
                          ? colors.neutral[900]
                          : colors.status.error,
                      borderRadius: '4px',
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.medium,
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  {item.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
