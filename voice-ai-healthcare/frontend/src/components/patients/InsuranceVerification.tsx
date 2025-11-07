import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface InsuranceVerificationProps {
  patientId: string;
  insuranceInfo: {
    provider: string;
    memberId: string;
    groupNumber: string;
    policyType: string;
  };
  onVerificationComplete?: (result: VerificationResult) => void;
}

interface VerificationResult {
  status: 'verified' | 'failed' | 'pending' | 'warning';
  coverage: {
    isActive: boolean;
    effectiveDate: string;
    terminationDate?: string;
    copay?: number;
    deductible?: number;
    deductibleMet?: number;
    outOfPocketMax?: number;
    outOfPocketMet?: number;
  };
  benefits?: {
    rxCoverage: boolean;
    priorAuthRequired: boolean;
    tierLevel: number;
    limitations?: string[];
  };
  message: string;
  timestamp: string;
}

export default function InsuranceVerification({
  patientId,
  insuranceInfo,
  onVerificationComplete
}: InsuranceVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      // Simulate API call to insurance verification service
      const response = await fetch('/api/insurance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          insuranceInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const data = await response.json();

      // Mock data for demo
      const mockResult: VerificationResult = {
        status: 'verified',
        coverage: {
          isActive: true,
          effectiveDate: '2024-01-01',
          terminationDate: '2024-12-31',
          copay: 25,
          deductible: 1500,
          deductibleMet: 800,
          outOfPocketMax: 6000,
          outOfPocketMet: 1200,
        },
        benefits: {
          rxCoverage: true,
          priorAuthRequired: true,
          tierLevel: 2,
          limitations: ['Requires step therapy', 'Quantity limits apply'],
        },
        message: 'Coverage verified successfully',
        timestamp: new Date().toISOString(),
      };

      setResult(mockResult);
      if (onVerificationComplete) {
        onVerificationComplete(mockResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;

    switch (result.status) {
      case 'verified':
        return <CheckCircle style={{ color: colors.status.success, width: '20px', height: '20px' }} />;
      case 'failed':
        return <XCircle style={{ color: colors.status.error, width: '20px', height: '20px' }} />;
      case 'warning':
        return <AlertTriangle style={{ color: colors.status.warning, width: '20px', height: '20px' }} />;
      default:
        return <Loader style={{ color: colors.primary[500], width: '20px', height: '20px' }} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div
      style={{
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '8px',
        padding: spacing[4],
        backgroundColor: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <Shield style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Insurance Verification
          </h3>
        </div>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          style={{
            padding: `${spacing[2]} ${spacing[4]}`,
            backgroundColor: isVerifying ? colors.neutral[300] : colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: isVerifying ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          {isVerifying && <Loader style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />}
          {isVerifying ? 'Verifying...' : 'Verify Coverage'}
        </button>
      </div>

      {/* Insurance Info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: spacing[3],
          marginBottom: spacing[4],
          padding: spacing[3],
          backgroundColor: colors.neutral[50],
          borderRadius: '6px',
        }}
      >
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
            Provider
          </div>
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
            {insuranceInfo.provider}
          </div>
        </div>
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
            Member ID
          </div>
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
            {insuranceInfo.memberId}
          </div>
        </div>
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
            Group Number
          </div>
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
            {insuranceInfo.groupNumber}
          </div>
        </div>
        <div>
          <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
            Policy Type
          </div>
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
            {insuranceInfo.policyType}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.errorBg,
            border: `1px solid ${colors.status.error}`,
            borderRadius: '6px',
            marginBottom: spacing[4],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <XCircle style={{ width: '16px', height: '16px', color: colors.status.error }} />
          <span style={{ fontSize: typography.fontSize.sm, color: colors.status.error }}>{error}</span>
        </div>
      )}

      {/* Verification Result */}
      {result && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[3],
              padding: spacing[3],
              backgroundColor:
                result.status === 'verified'
                  ? colors.status.successBg
                  : result.status === 'failed'
                  ? colors.status.errorBg
                  : colors.status.warningBg,
              borderRadius: '6px',
            }}
          >
            {getStatusIcon()}
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
              {result.message}
            </span>
          </div>

          {/* Coverage Details */}
          {result.coverage.isActive && (
            <div style={{ marginBottom: spacing[4] }}>
              <h4
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  marginBottom: spacing[3],
                }}
              >
                Coverage Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                    Effective Date
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {new Date(result.coverage.effectiveDate).toLocaleDateString()}
                  </div>
                </div>
                {result.coverage.terminationDate && (
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Termination Date
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {new Date(result.coverage.terminationDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {result.coverage.copay !== undefined && (
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Copay
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {formatCurrency(result.coverage.copay)}
                    </div>
                  </div>
                )}
                {result.coverage.deductible !== undefined && (
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Deductible
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {formatCurrency(result.coverage.deductibleMet || 0)} / {formatCurrency(result.coverage.deductible)}
                    </div>
                  </div>
                )}
                {result.coverage.outOfPocketMax !== undefined && (
                  <div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Out-of-Pocket Max
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {formatCurrency(result.coverage.outOfPocketMet || 0)} / {formatCurrency(result.coverage.outOfPocketMax)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits */}
          {result.benefits && (
            <div>
              <h4
                style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  marginBottom: spacing[3],
                }}
              >
                Prescription Benefits
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                  {result.benefits.rxCoverage ? (
                    <CheckCircle style={{ width: '16px', height: '16px', color: colors.status.success }} />
                  ) : (
                    <XCircle style={{ width: '16px', height: '16px', color: colors.status.error }} />
                  )}
                  <span style={{ fontSize: typography.fontSize.sm }}>Prescription Coverage</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                  {result.benefits.priorAuthRequired ? (
                    <AlertTriangle style={{ width: '16px', height: '16px', color: colors.status.warning }} />
                  ) : (
                    <CheckCircle style={{ width: '16px', height: '16px', color: colors.status.success }} />
                  )}
                  <span style={{ fontSize: typography.fontSize.sm }}>
                    {result.benefits.priorAuthRequired ? 'Prior Authorization Required' : 'No Prior Auth Required'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    Tier Level: <strong>Tier {result.benefits.tierLevel}</strong>
                  </span>
                </div>
                {result.benefits.limitations && result.benefits.limitations.length > 0 && (
                  <div style={{ marginTop: spacing[2] }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginBottom: spacing[1],
                      }}
                    >
                      Limitations
                    </div>
                    <ul style={{ margin: 0, paddingLeft: spacing[4], fontSize: typography.fontSize.sm }}>
                      {result.benefits.limitations.map((limitation, index) => (
                        <li key={index}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div
            style={{
              marginTop: spacing[4],
              paddingTop: spacing[3],
              borderTop: `1px solid ${colors.neutral[200]}`,
              fontSize: typography.fontSize.xs,
              color: colors.neutral[500],
            }}
          >
            Last verified: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
