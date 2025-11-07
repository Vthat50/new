import React, { useState } from 'react';
import { CreditCard, RefreshCw, Download, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface CopayCardRegenerationProps {
  patientId: string;
  patientName: string;
  currentCard?: {
    cardNumber: string;
    groupNumber: string;
    bin: string;
    pcn: string;
    issueDate: string;
    expirationDate: string;
    maxBenefit: number;
    usedBenefit: number;
  };
  onRegenerate?: (newCard: any) => void;
}

export default function CopayCardRegeneration({
  patientId,
  patientName,
  currentCard,
  onRegenerate,
}: CopayCardRegenerationProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedCard, setRegeneratedCard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleRegenerate = async () => {
    if (!reason) {
      setError('Please select a reason for regeneration');
      return;
    }

    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/copay-cards/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate card');
      }

      // Mock new card data
      const newCard = {
        cardNumber: `5555${Math.floor(Math.random() * 100000000000).toString().padStart(12, '0')}`,
        groupNumber: `GRP${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        bin: '610020',
        pcn: 'CNRX',
        issueDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxBenefit: 5000,
        usedBenefit: 0,
      };

      setRegeneratedCard(newCard);
      if (onRegenerate) {
        onRegenerate(newCard);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate card');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadCard = (card: any) => {
    // In production, this would generate a PDF with card details
    const cardData = `
Copay Assistance Card
Patient: ${patientName}
Card Number: ${card.cardNumber}
Group: ${card.groupNumber}
BIN: ${card.bin}
PCN: ${card.pcn}
Issue Date: ${new Date(card.issueDate).toLocaleDateString()}
Expiration: ${new Date(card.expirationDate).toLocaleDateString()}
Max Benefit: $${card.maxBenefit.toLocaleString()}
    `;

    const blob = new Blob([cardData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `copay-card-${patientName.replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const calculateRemainingBenefit = (card: any) => {
    return card.maxBenefit - card.usedBenefit;
  };

  const isCardExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  const isCardExpiringSoon = (expirationDate: string) => {
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return new Date(expirationDate) < thirtyDaysFromNow && !isCardExpired(expirationDate);
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
          <CreditCard style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Copay Card Management
          </h3>
        </div>
      </div>

      {/* Current Card */}
      {currentCard && !regeneratedCard && (
        <div style={{ marginBottom: spacing[6] }}>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[3] }}>
            Current Card
          </div>

          {/* Card Visual */}
          <div
            style={{
              padding: spacing[6],
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white',
              marginBottom: spacing[4],
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Card Background Pattern */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: typography.fontSize.sm, marginBottom: spacing[4], opacity: 0.9 }}>
                Copay Assistance Card
              </div>

              <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing[6], letterSpacing: '2px' }}>
                {formatCardNumber(currentCard.cardNumber)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    Group
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {currentCard.groupNumber}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    BIN
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {currentCard.bin}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    PCN
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {currentCard.pcn}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    Expires
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {new Date(currentCard.expirationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3], marginBottom: spacing[4] }}>
            {/* Expiration Warning */}
            {isCardExpired(currentCard.expirationDate) && (
              <div
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.status.errorBg,
                  border: `1px solid ${colors.status.error}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <AlertCircle style={{ width: '20px', height: '20px', color: colors.status.error }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.error, fontWeight: typography.fontWeight.medium }}>
                  Card Expired - Regeneration Required
                </span>
              </div>
            )}

            {isCardExpiringSoon(currentCard.expirationDate) && !isCardExpired(currentCard.expirationDate) && (
              <div
                style={{
                  padding: spacing[3],
                  backgroundColor: colors.status.warningBg,
                  border: `1px solid ${colors.status.warning}`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <Calendar style={{ width: '20px', height: '20px', color: colors.status.warning }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[900], fontWeight: typography.fontWeight.medium }}>
                  Card expires soon ({new Date(currentCard.expirationDate).toLocaleDateString()})
                </span>
              </div>
            )}

            {/* Benefit Usage */}
            <div
              style={{
                padding: spacing[3],
                backgroundColor: colors.neutral[50],
                borderRadius: '6px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Benefit Usage
                </span>
                <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  ${currentCard.usedBenefit.toLocaleString()} / ${currentCard.maxBenefit.toLocaleString()}
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  backgroundColor: colors.neutral[200],
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(currentCard.usedBenefit / currentCard.maxBenefit) * 100}%`,
                    backgroundColor: colors.primary[500],
                  }}
                />
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginTop: spacing[1] }}>
                ${calculateRemainingBenefit(currentCard).toLocaleString()} remaining
              </div>
            </div>
          </div>

          {/* Download Current Card */}
          <button
            onClick={() => handleDownloadCard(currentCard)}
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[6],
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Download Current Card
          </button>
        </div>
      )}

      {/* Regeneration Form */}
      {!regeneratedCard && (
        <div>
          <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
            Regenerate Card
          </div>

          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Reason for Regeneration *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option value="">Select reason...</option>
              <option value="expired">Card Expired</option>
              <option value="lost">Card Lost or Stolen</option>
              <option value="damaged">Card Damaged</option>
              <option value="benefit-reset">Annual Benefit Reset</option>
              <option value="patient-request">Patient Request</option>
              <option value="system-error">System Error/Correction</option>
            </select>
            {error && (
              <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            style={{
              padding: `${spacing[3]} ${spacing[6]}`,
              border: 'none',
              backgroundColor: isRegenerating ? colors.neutral[300] : colors.primary[500],
              color: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: isRegenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <RefreshCw
              style={{
                width: '16px',
                height: '16px',
                animation: isRegenerating ? 'spin 1s linear infinite' : 'none',
              }}
            />
            {isRegenerating ? 'Regenerating...' : 'Generate New Card'}
          </button>
        </div>
      )}

      {/* Regenerated Card Success */}
      {regeneratedCard && (
        <div>
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.status.successBg,
              border: `1px solid ${colors.status.success}`,
              borderRadius: '6px',
              marginBottom: spacing[6],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
            }}
          >
            <CheckCircle style={{ width: '24px', height: '24px', color: colors.status.success }} />
            <div>
              <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.semibold, color: colors.status.success, marginBottom: spacing[1] }}>
                New Card Generated Successfully
              </div>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>
                The previous card has been deactivated. Download the new card below.
              </div>
            </div>
          </div>

          {/* New Card Visual */}
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[3] }}>
            New Card
          </div>

          <div
            style={{
              padding: spacing[6],
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              borderRadius: '12px',
              color: 'white',
              marginBottom: spacing[4],
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: typography.fontSize.sm, marginBottom: spacing[4], opacity: 0.9 }}>
                Copay Assistance Card
              </div>

              <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing[6], letterSpacing: '2px' }}>
                {formatCardNumber(regeneratedCard.cardNumber)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    Group
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {regeneratedCard.groupNumber}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    BIN
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {regeneratedCard.bin}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    PCN
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {regeneratedCard.pcn}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: typography.fontSize.xs, opacity: 0.8, marginBottom: spacing[1] }}>
                    Expires
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {new Date(regeneratedCard.expirationDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadCard(regeneratedCard)}
            style={{
              width: '100%',
              padding: spacing[3],
              border: 'none',
              backgroundColor: colors.primary[500],
              color: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[2],
            }}
          >
            <Download style={{ width: '16px', height: '16px' }} />
            Download New Card
          </button>
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
