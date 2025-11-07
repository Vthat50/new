import React, { useState } from 'react';
import { PhoneOff, AlertCircle, CheckCircle, X } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface EndCallModalProps {
  callId: string;
  patientName: string;
  callDuration: number;
  onConfirm: (reason: string, notes: string, scheduledFollowUp: boolean) => void;
  onCancel: () => void;
}

export default function EndCallModal({
  callId,
  patientName,
  callDuration,
  onConfirm,
  onCancel,
}: EndCallModalProps) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduledFollowUp, setScheduledFollowUp] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    if (!reason) {
      return;
    }

    setIsEnding(true);
    await onConfirm(reason, notes, scheduledFollowUp);
    setIsEnding(false);
  };

  const endReasons = [
    { value: 'completed', label: 'Call Completed Successfully' },
    { value: 'patient-request', label: 'Patient Requested to End' },
    { value: 'issue-resolved', label: 'Issue/Question Resolved' },
    { value: 'transfer-needed', label: 'Transfer to Another Department' },
    { value: 'callback-scheduled', label: 'Callback Scheduled' },
    { value: 'no-response', label: 'No Response from Patient' },
    { value: 'technical-issue', label: 'Technical Issue' },
    { value: 'other', label: 'Other' },
  ];

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
              backgroundColor: colors.status.errorBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PhoneOff style={{ width: '28px', height: '28px', color: colors.status.error }} />
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[2],
              }}
            >
              End Call?
            </h3>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Are you sure you want to end this call with {patientName}?
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
          {/* Call Summary */}
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: '8px',
              marginBottom: spacing[6],
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing[1],
                  }}
                >
                  Patient
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900],
                  }}
                >
                  {patientName}
                </div>
              </div>
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
              <div>
                <div
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[500],
                    marginBottom: spacing[1],
                  }}
                >
                  Call ID
                </div>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[900],
                  }}
                >
                  {callId}
                </div>
              </div>
            </div>
          </div>

          {/* End Reason */}
          <div style={{ marginBottom: spacing[6] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Reason for Ending Call *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${!reason ? colors.status.error : colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option value="">Select a reason...</option>
              {endReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {!reason && (
              <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                Please select a reason
              </div>
            )}
          </div>

          {/* Call Notes */}
          <div style={{ marginBottom: spacing[6] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Call Summary/Notes <span style={{ color: colors.neutral[500] }}>(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any important notes from this call..."
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
              These notes will be added to the patient's call history
            </div>
          </div>

          {/* Follow-up */}
          <div style={{ marginBottom: spacing[6] }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                cursor: 'pointer',
                padding: spacing[3],
                backgroundColor: scheduledFollowUp ? colors.primary[50] : colors.neutral[50],
                border: `1px solid ${scheduledFollowUp ? colors.primary[200] : colors.neutral[200]}`,
                borderRadius: '6px',
              }}
            >
              <input
                type="checkbox"
                checked={scheduledFollowUp}
                onChange={(e) => setScheduledFollowUp(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[1],
                  }}
                >
                  Schedule Follow-up Call
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                  Create a task to follow up with this patient
                </div>
              </div>
              {scheduledFollowUp && (
                <CheckCircle style={{ width: '20px', height: '20px', color: colors.primary[500] }} />
              )}
            </label>
          </div>

          {/* What Happens Next */}
          <div
            style={{
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '6px',
              marginBottom: spacing[6],
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[3],
              }}
            >
              What happens after ending the call:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {[
                'The call will be immediately disconnected',
                'Call recording will be saved and processed',
                'Transcript will be available in 2-3 minutes',
                'All notes and data will be added to patient record',
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: spacing[2], alignItems: 'start' }}>
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary[500],
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div
            style={{
              padding: spacing[3],
              backgroundColor: colors.status.errorBg,
              border: `1px solid ${colors.status.error}`,
              borderRadius: '6px',
              marginBottom: spacing[6],
              display: 'flex',
              gap: spacing[2],
              alignItems: 'start',
            }}
          >
            <AlertCircle style={{ width: '20px', height: '20px', color: colors.status.error, flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[900] }}>
              <strong>This action cannot be undone.</strong> Make sure all necessary information has been collected before ending the call.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              disabled={isEnding}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: `1px solid ${colors.neutral[300]}`,
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isEnding ? 'not-allowed' : 'pointer',
                opacity: isEnding ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isEnding || !reason}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: 'none',
                backgroundColor: isEnding || !reason ? colors.neutral[400] : colors.status.error,
                color: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isEnding || !reason ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <PhoneOff style={{ width: '16px', height: '16px' }} />
              {isEnding ? 'Ending Call...' : 'End Call'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
