import React, { useState } from 'react';
import { X, Users, MessageSquare, Clock, Send } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPatientCount?: number;
}

export default function CampaignWizard({ isOpen, onClose, selectedPatientCount = 0 }: CampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    campaignName: '',
    messageTemplate: 'adherence-check',
    customMessage: '',
    startTime: 'immediate',
    customTime: '',
    staggerDuration: '2',
    targetGroup: 'high-risk',
  });

  if (!isOpen) return null;

  const messageTemplates = [
    { id: 'adherence-check', label: 'Adherence Check-in', preview: 'Hi {name}, this is a friendly reminder about your medication. How are you feeling?' },
    { id: 'refill-reminder', label: 'Refill Reminder', preview: 'Hi {name}, your prescription refill is due soon. Would you like us to help process it?' },
    { id: 'appointment', label: 'Appointment Reminder', preview: 'Hi {name}, you have an upcoming appointment. Can we confirm your availability?' },
    { id: 'custom', label: 'Custom Message', preview: 'Write your own message...' },
  ];

  const handleLaunch = () => {
    // Simulate campaign launch
    alert(`Campaign launched!\n\nTargeting: ${selectedPatientCount || 'All'} patients\nTemplate: ${formData.messageTemplate}\nStart: ${formData.startTime}\nDuration: ${formData.staggerDuration} hours`);
    onClose();
    setStep(1);
  };

  const renderStep1 = () => (
    <div>
      <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
        Select Target Group
      </h3>

      <div style={{ marginBottom: spacing[4] }}>
        <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          Patient Selection
        </label>
        <select
          value={formData.targetGroup}
          onChange={(e) => setFormData({ ...formData, targetGroup: e.target.value })}
          style={{
            width: '100%',
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '8px',
            fontSize: typography.fontSize.sm,
          }}
        >
          <option value="selected">Selected Patients ({selectedPatientCount})</option>
          <option value="high-risk">High Risk Patients (156)</option>
          <option value="at-risk">At Risk Journey Stage (89)</option>
          <option value="overdue">Overdue Contact (&gt;7 days) (234)</option>
          <option value="all">All Active Patients (1,247)</option>
        </select>
      </div>

      <div style={{ marginBottom: spacing[4] }}>
        <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          Campaign Name
        </label>
        <input
          type="text"
          value={formData.campaignName}
          onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
          placeholder="e.g., Weekly Adherence Check - Week 42"
          style={{
            width: '100%',
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '8px',
            fontSize: typography.fontSize.sm,
          }}
        />
      </div>

      <div style={{ padding: spacing[4], backgroundColor: colors.primary[50], borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
          <Users style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.primary[900] }}>
            Target Summary
          </span>
        </div>
        <div style={{ fontSize: typography.fontSize.sm, color: colors.primary[700] }}>
          {selectedPatientCount || 156} patients will be contacted
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
        Configure Message
      </h3>

      <div style={{ marginBottom: spacing[4] }}>
        <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          Message Template
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
          {messageTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setFormData({ ...formData, messageTemplate: template.id })}
              style={{
                padding: spacing[3],
                border: `2px solid ${formData.messageTemplate === template.id ? colors.primary[500] : colors.neutral[300]}`,
                borderRadius: '8px',
                backgroundColor: formData.messageTemplate === template.id ? colors.primary[50] : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                {template.label}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                {template.preview}
              </div>
            </button>
          ))}
        </div>
      </div>

      {formData.messageTemplate === 'custom' && (
        <div style={{ marginBottom: spacing[4] }}>
          <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
            Custom Message
          </label>
          <textarea
            value={formData.customMessage}
            onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
            placeholder="Enter your custom message. Use {name} for patient name."
            rows={4}
            style={{
              width: '100%',
              padding: spacing[3],
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '8px',
              fontSize: typography.fontSize.sm,
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      )}

      <div style={{ padding: spacing[3], backgroundColor: colors.neutral[50], borderRadius: '8px' }}>
        <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.neutral[700], marginBottom: spacing[2] }}>
          Preview
        </div>
        <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], fontStyle: 'italic' }}>
          {formData.messageTemplate === 'custom' ? formData.customMessage || 'Your custom message will appear here...' : messageTemplates.find(t => t.id === formData.messageTemplate)?.preview}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[4] }}>
        Schedule & Timing
      </h3>

      <div style={{ marginBottom: spacing[4] }}>
        <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          Start Time
        </label>
        <select
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          style={{
            width: '100%',
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '8px',
            fontSize: typography.fontSize.sm,
          }}
        >
          <option value="immediate">Start Immediately</option>
          <option value="custom">Schedule for Later</option>
        </select>
      </div>

      {formData.startTime === 'custom' && (
        <div style={{ marginBottom: spacing[4] }}>
          <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
            Custom Start Time
          </label>
          <input
            type="datetime-local"
            value={formData.customTime}
            onChange={(e) => setFormData({ ...formData, customTime: e.target.value })}
            style={{
              width: '100%',
              padding: spacing[3],
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '8px',
              fontSize: typography.fontSize.sm,
            }}
          />
        </div>
      )}

      <div style={{ marginBottom: spacing[4] }}>
        <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
          Stagger Duration (hours)
        </label>
        <input
          type="number"
          value={formData.staggerDuration}
          onChange={(e) => setFormData({ ...formData, staggerDuration: e.target.value })}
          min="1"
          max="24"
          style={{
            width: '100%',
            padding: spacing[3],
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '8px',
            fontSize: typography.fontSize.sm,
          }}
        />
        <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginTop: spacing[1] }}>
          Calls will be spread evenly over this duration
        </div>
      </div>

      <div style={{ padding: spacing[4], backgroundColor: colors.primary[50], borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] }}>
          <Clock style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.primary[900] }}>
            Campaign Summary
          </span>
        </div>
        <div style={{ fontSize: typography.fontSize.sm, color: colors.primary[700], lineHeight: '1.6' }}>
          <div>• Target: {selectedPatientCount || 156} patients</div>
          <div>• Template: {messageTemplates.find(t => t.id === formData.messageTemplate)?.label}</div>
          <div>• Start: {formData.startTime === 'immediate' ? 'Immediately' : formData.customTime}</div>
          <div>• Duration: {formData.staggerDuration} hours</div>
          <div>• Estimated completion: {new Date(Date.now() + parseInt(formData.staggerDuration) * 3600000).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: spacing[4],
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Header */}
        <div style={{ padding: spacing[6], borderBottom: `1px solid ${colors.neutral[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
              Launch Outbound Campaign
            </h2>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], marginTop: spacing[1] }}>
              Step {step} of 3
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            <X style={{ width: '24px', height: '24px', color: colors.neutral[400] }} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: `0 ${spacing[6]}`, marginTop: spacing[4] }}>
          <div style={{ display: 'flex', gap: spacing[2] }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: s <= step ? colors.primary[500] : colors.neutral[200],
                  borderRadius: '2px',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: spacing[6] }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div style={{ padding: spacing[6], borderTop: `1px solid ${colors.neutral[200]}`, display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            style={{
              padding: `${spacing[3]} ${spacing[5]}`,
              border: `1px solid ${colors.neutral[300]}`,
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              color: colors.neutral[700],
            }}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleLaunch()}
            style={{
              padding: `${spacing[3]} ${spacing[5]}`,
              border: 'none',
              backgroundColor: colors.primary[500],
              color: 'white',
              borderRadius: '8px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            {step === 3 ? (
              <>
                <Send style={{ width: '16px', height: '16px' }} />
                Launch Campaign
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
