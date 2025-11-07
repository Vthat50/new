import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, Megaphone, MoreHorizontal } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PatientQuickActionsProps {
  patientId: string;
  patientName: string;
  phoneNumber?: string;
  email?: string;
  onAction?: (action: string, data: any) => void;
}

export default function PatientQuickActions({
  patientId,
  patientName,
  phoneNumber,
  email,
  onAction,
}: PatientQuickActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  const handleCall = () => {
    setShowCallModal(true);
    setShowMenu(false);
  };

  const handleSMS = () => {
    setShowSMSModal(true);
    setShowMenu(false);
  };

  const handleEmail = () => {
    setShowEmailModal(true);
    setShowMenu(false);
  };

  const handleCampaign = () => {
    setShowCampaignModal(true);
    setShowMenu(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', gap: spacing[2] }}>
        <button
          onClick={handleCall}
          disabled={!phoneNumber}
          style={{
            padding: spacing[2],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: phoneNumber ? 'pointer' : 'not-allowed',
            opacity: phoneNumber ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
          }}
          title="Call patient"
        >
          <Phone style={{ width: '16px', height: '16px', color: colors.primary[500] }} />
          <span className="action-label">Call</span>
        </button>

        <button
          onClick={handleSMS}
          disabled={!phoneNumber}
          style={{
            padding: spacing[2],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: phoneNumber ? 'pointer' : 'not-allowed',
            opacity: phoneNumber ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
          }}
          title="Send SMS"
        >
          <MessageSquare style={{ width: '16px', height: '16px', color: colors.primary[500] }} />
          <span className="action-label">SMS</span>
        </button>

        <button
          onClick={handleEmail}
          disabled={!email}
          style={{
            padding: spacing[2],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: email ? 'pointer' : 'not-allowed',
            opacity: email ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
          }}
          title="Send email"
        >
          <Mail style={{ width: '16px', height: '16px', color: colors.primary[500] }} />
          <span className="action-label">Email</span>
        </button>

        <button
          onClick={handleCampaign}
          style={{
            padding: spacing[2],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
          }}
          title="Add to campaign"
        >
          <Megaphone style={{ width: '16px', height: '16px', color: colors.primary[500] }} />
          <span className="action-label">Campaign</span>
        </button>

        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            padding: spacing[2],
            border: `1px solid ${colors.neutral[300]}`,
            backgroundColor: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          title="More actions"
        >
          <MoreHorizontal style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
        </button>
      </div>

      {/* More Actions Menu */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: spacing[2],
            backgroundColor: 'white',
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '200px',
          }}
        >
          <div style={{ padding: spacing[2] }}>
            <button
              style={{
                width: '100%',
                padding: spacing[2],
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onClick={() => {
                onAction?.('note', { patientId });
                setShowMenu(false);
              }}
            >
              Add Note
            </button>
            <button
              style={{
                width: '100%',
                padding: spacing[2],
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onClick={() => {
                onAction?.('task', { patientId });
                setShowMenu(false);
              }}
            >
              Create Task
            </button>
            <button
              style={{
                width: '100%',
                padding: spacing[2],
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onClick={() => {
                onAction?.('appointment', { patientId });
                setShowMenu(false);
              }}
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && (
        <QuickActionModal
          title="Initiate Call"
          icon={<Phone style={{ width: '24px', height: '24px', color: colors.primary[500] }} />}
          onClose={() => setShowCallModal(false)}
          onConfirm={(data) => {
            onAction?.('call', { patientId, ...data });
            setShowCallModal(false);
          }}
        >
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={phoneNumber}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Call Purpose
            </label>
            <select
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option>Medication Adherence</option>
              <option>Refill Reminder</option>
              <option>Prior Authorization</option>
              <option>Follow-up</option>
              <option>General Inquiry</option>
            </select>
          </div>
        </QuickActionModal>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <QuickActionModal
          title="Send SMS"
          icon={<MessageSquare style={{ width: '24px', height: '24px', color: colors.primary[500] }} />}
          onClose={() => setShowSMSModal(false)}
          onConfirm={(data) => {
            onAction?.('sms', { patientId, ...data });
            setShowSMSModal(false);
          }}
        >
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue={phoneNumber}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Message Template
            </label>
            <select
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option>Refill Reminder</option>
              <option>Appointment Reminder</option>
              <option>Consent Expiring</option>
              <option>Custom Message</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Message
            </label>
            <textarea
              rows={4}
              defaultValue={`Hi ${patientName}, this is a reminder about your upcoming refill. Please contact us to confirm.`}
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
          </div>
        </QuickActionModal>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <QuickActionModal
          title="Send Email"
          icon={<Mail style={{ width: '24px', height: '24px', color: colors.primary[500] }} />}
          onClose={() => setShowEmailModal(false)}
          onConfirm={(data) => {
            onAction?.('email', { patientId, ...data });
            setShowEmailModal(false);
          }}
        >
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Email Address
            </label>
            <input
              type="email"
              defaultValue={email}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Subject
            </label>
            <input
              type="text"
              defaultValue="Important Information About Your Medication"
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Message
            </label>
            <textarea
              rows={6}
              defaultValue={`Dear ${patientName},\n\nWe hope this message finds you well. We wanted to reach out regarding your medication therapy.\n\nPlease don't hesitate to contact us if you have any questions.\n\nBest regards,\nPatient Support Team`}
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
          </div>
        </QuickActionModal>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <QuickActionModal
          title="Add to Campaign"
          icon={<Megaphone style={{ width: '24px', height: '24px', color: colors.primary[500] }} />}
          onClose={() => setShowCampaignModal(false)}
          onConfirm={(data) => {
            onAction?.('campaign', { patientId, ...data });
            setShowCampaignModal(false);
          }}
        >
          <div style={{ marginBottom: spacing[4] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Select Campaign
            </label>
            <select
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option>Refill Reminders - Active</option>
              <option>Adherence Check-ins - Active</option>
              <option>Insurance Updates - Scheduled</option>
              <option>PA Follow-ups - Active</option>
              <option>Create New Campaign</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[2] }}>
              Priority
            </label>
            <select
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </QuickActionModal>
      )}

      <style>{`
        @media (max-width: 768px) {
          .action-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// Reusable Modal Component
interface QuickActionModalProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: (data: any) => void;
}

function QuickActionModal({ title, icon, children, onClose, onConfirm }: QuickActionModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          maxWidth: '500px',
          width: '100%',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: spacing[6],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: colors.primary[50],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: spacing[6] }}>{children}</div>

        {/* Footer */}
        <div
          style={{
            padding: spacing[6],
            borderTop: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            gap: spacing[3],
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: `${spacing[3]} ${spacing[6]}`,
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({})}
            style={{
              padding: `${spacing[3]} ${spacing[6]}`,
              border: 'none',
              backgroundColor: colors.primary[500],
              color: 'white',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
