import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, User, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface TakeOverModalProps {
  callId: string;
  patientName: string;
  callDuration: number;
  currentTopic?: string;
  onConfirm: (notes: string) => void;
  onCancel: () => void;
}

export default function TakeOverModal({
  callId,
  patientName,
  callDuration,
  currentTopic,
  onConfirm,
  onCancel,
}: TakeOverModalProps) {
  const [notes, setNotes] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    await onConfirm(notes);
    setIsConfirming(false);
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing[6],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'start',
            gap: spacing[4],
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: colors.status.warningBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle style={{ width: '28px', height: '28px', color: colors.status.warning }} />
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[2],
              }}
            >
              Take Over Call?
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              You are about to take control of this live call from the AI agent. The patient will be notified of the transition.
            </p>
          </div>

          <button
            onClick={onCancel}
            style={{
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            <X style={{ width: '20px', height: '20px', color: colors.neutral[400] }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing[6] }}>
          {/* Call Information */}
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: '8px',
              marginBottom: spacing[6],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: colors.primary[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[1],
                  }}
                >
                  {patientName}
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Call ID: {callId}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing[1],
                  }}
                >
                  Call Duration
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900],
                  }}
                >
                  {formatDuration(callDuration)}
                </div>
              </div>
              {currentTopic && (
                <div>
                  <div
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: colors.neutral[500],
                      marginBottom: spacing[1],
                    }}
                  >
                    Current Topic
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.neutral[900],
                    }}
                  >
                    {currentTopic}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What Happens Next */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4
              style={{
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[3],
              }}
            >
              What happens next?
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {[
                'The AI agent will announce the transition to the patient',
                'You will be connected to the live call',
                'All conversation history will remain available',
                'The call will continue to be recorded and transcribed',
              ].map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: spacing[3] }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary[100],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.primary[600],
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], paddingTop: '2px' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transition Notes */}
          <div style={{ marginBottom: spacing[6] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Transition Notes <span style={{ color: colors.neutral[500] }}>(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context or notes about why you're taking over this call..."
              rows={4}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
              These notes will be added to the call log for future reference
            </div>
          </div>

          {/* Warning */}
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.status.warningBg,
              border: `1px solid ${colors.status.warning}`,
              borderRadius: '6px',
              marginBottom: spacing[6],
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: spacing[2],
                alignItems: 'start',
              }}
            >
              <AlertTriangle style={{ width: '20px', height: '20px', color: colors.status.warning, flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing[1],
                  }}
                >
                  Important Reminder
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>
                  Make sure you have your headset ready and you're in a quiet environment before taking over the call.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              disabled={isConfirming}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: `1px solid ${colors.neutral[300]}`,
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isConfirming ? 'not-allowed' : 'pointer',
                opacity: isConfirming ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: 'none',
                backgroundColor: isConfirming ? colors.neutral[400] : colors.primary[500],
                color: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isConfirming ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <PhoneCall style={{ width: '16px', height: '16px' }} />
              {isConfirming ? 'Connecting...' : 'Take Over Call'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
