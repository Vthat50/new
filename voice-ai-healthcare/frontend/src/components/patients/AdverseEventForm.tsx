import React, { useState } from 'react';
import { AlertTriangle, FileText, Send, X, CheckCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface AdverseEventFormProps {
  patientId: string;
  patientName: string;
  medication: {
    name: string;
    dosage: string;
    ndc?: string;
  };
  onClose: () => void;
  onSubmit?: (report: AdverseEventReport) => void;
}

interface AdverseEventReport {
  patientId: string;
  reportDate: string;
  eventDate: string;
  eventDescription: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  outcome: 'recovered' | 'recovering' | 'not-recovered' | 'fatal' | 'unknown';
  medication: {
    name: string;
    dosage: string;
    ndc?: string;
    lotNumber?: string;
    expirationDate?: string;
  };
  eventType: string[];
  seriousness: {
    death: boolean;
    lifeThreatening: boolean;
    hospitalization: boolean;
    disability: boolean;
    congenitalAnomaly: boolean;
    other: boolean;
  };
  reporterInfo: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  additionalInfo?: string;
}

export default function AdverseEventForm({
  patientId,
  patientName,
  medication,
  onClose,
  onSubmit,
}: AdverseEventFormProps) {
  const [formData, setFormData] = useState<Partial<AdverseEventReport>>({
    patientId,
    reportDate: new Date().toISOString().split('T')[0],
    eventDate: '',
    eventDescription: '',
    severity: 'moderate',
    outcome: 'unknown',
    medication: {
      name: medication.name,
      dosage: medication.dosage,
      ndc: medication.ndc,
    },
    eventType: [],
    seriousness: {
      death: false,
      lifeThreatening: false,
      hospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      other: false,
    },
    reporterInfo: {
      name: '',
      role: '',
      phone: '',
      email: '',
    },
    additionalInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const eventTypes = [
    'Allergic Reaction',
    'Nausea/Vomiting',
    'Diarrhea',
    'Headache',
    'Dizziness',
    'Rash/Skin Reaction',
    'Difficulty Breathing',
    'Chest Pain',
    'Irregular Heartbeat',
    'Loss of Consciousness',
    'Seizure',
    'Other',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSeriousnessChange = (field: keyof typeof formData.seriousness, value: boolean) => {
    setFormData({
      ...formData,
      seriousness: {
        ...formData.seriousness!,
        [field]: value,
      },
    });
  };

  const handleEventTypeToggle = (eventType: string) => {
    const currentTypes = formData.eventType || [];
    const newTypes = currentTypes.includes(eventType)
      ? currentTypes.filter((t) => t !== eventType)
      : [...currentTypes, eventType];
    setFormData({ ...formData, eventType: newTypes });
  };

  const handleReporterInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      reporterInfo: {
        ...formData.reporterInfo!,
        [field]: value,
      },
    });
  };

  const handleMedicationChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      medication: {
        ...formData.medication!,
        [field]: value,
      },
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }
    if (!formData.eventDescription || formData.eventDescription.trim() === '') {
      newErrors.eventDescription = 'Event description is required';
    }
    if (!formData.eventType || formData.eventType.length === 0) {
      newErrors.eventType = 'Select at least one event type';
    }
    if (!formData.reporterInfo?.name) {
      newErrors.reporterName = 'Reporter name is required';
    }
    if (!formData.reporterInfo?.role) {
      newErrors.reporterRole = 'Reporter role is required';
    }
    if (!formData.reporterInfo?.phone) {
      newErrors.reporterPhone = 'Reporter phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to FDA MedWatch API or internal reporting system
      const response = await fetch('/api/adverse-events/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitSuccess(true);

      if (onSubmit) {
        onSubmit(formData as AdverseEventReport);
      }

      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrors({ submit: 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div
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
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: spacing[8],
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          <CheckCircle style={{ width: '64px', height: '64px', color: colors.status.success, margin: '0 auto' }} />
          <h3
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              marginTop: spacing[4],
              marginBottom: spacing[2],
            }}
          >
            Report Submitted
          </h3>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            Your adverse event report has been submitted successfully. The appropriate authorities will be notified.
          </p>
        </div>
      </div>
    );
  }

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
          maxWidth: '800px',
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: colors.status.errorBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle style={{ width: '24px', height: '24px', color: colors.status.error }} />
            </div>
            <div>
              <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
                Report Adverse Event
              </h3>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Patient: {patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: spacing[2],
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            <X style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: spacing[6] }}>
          {/* Event Information */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              Event Information
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${errors.eventDate ? colors.status.error : colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                />
                {errors.eventDate && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                    {errors.eventDate}
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    marginBottom: spacing[2],
                  }}
                >
                  Severity *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="life-threatening">Life-Threatening</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Event Types *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[2] }}>
                {eventTypes.map((type) => (
                  <label
                    key={type}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      cursor: 'pointer',
                      padding: spacing[2],
                      borderRadius: '4px',
                      backgroundColor: formData.eventType?.includes(type) ? colors.primary[50] : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.eventType?.includes(type) || false}
                      onChange={() => handleEventTypeToggle(type)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: typography.fontSize.sm }}>{type}</span>
                  </label>
                ))}
              </div>
              {errors.eventType && (
                <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                  {errors.eventType}
                </div>
              )}
            </div>

            <div style={{ marginTop: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Event Description *
              </label>
              <textarea
                value={formData.eventDescription}
                onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                placeholder="Describe the adverse event in detail..."
                rows={4}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${errors.eventDescription ? colors.status.error : colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              {errors.eventDescription && (
                <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                  {errors.eventDescription}
                </div>
              )}
            </div>

            <div style={{ marginTop: spacing[4] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Outcome
              </label>
              <select
                value={formData.outcome}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="unknown">Unknown</option>
                <option value="recovered">Recovered/Resolved</option>
                <option value="recovering">Recovering/Resolving</option>
                <option value="not-recovered">Not Recovered</option>
                <option value="fatal">Fatal</option>
              </select>
            </div>
          </div>

          {/* Seriousness Criteria */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              Seriousness Criteria
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {Object.entries({
                death: 'Death',
                lifeThreatening: 'Life-Threatening',
                hospitalization: 'Hospitalization or Prolonged Hospitalization',
                disability: 'Disability or Permanent Damage',
                congenitalAnomaly: 'Congenital Anomaly/Birth Defect',
                other: 'Other Serious Important Medical Event',
              }).map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.seriousness?.[key as keyof typeof formData.seriousness] || false}
                    onChange={(e) => handleSeriousnessChange(key as keyof typeof formData.seriousness, e.target.checked)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Medication Information */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              Medication Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Lot Number
                </label>
                <input
                  type="text"
                  value={formData.medication?.lotNumber || ''}
                  onChange={(e) => handleMedicationChange('lotNumber', e.target.value)}
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
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.medication?.expirationDate || ''}
                  onChange={(e) => handleMedicationChange('expirationDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Reporter Information */}
          <div style={{ marginBottom: spacing[6] }}>
            <h4
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing[4],
              }}
            >
              Reporter Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[4] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.reporterInfo?.name || ''}
                  onChange={(e) => handleReporterInfoChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${errors.reporterName ? colors.status.error : colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                />
                {errors.reporterName && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                    {errors.reporterName}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Role *
                </label>
                <select
                  value={formData.reporterInfo?.role || ''}
                  onChange={(e) => handleReporterInfoChange('role', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${errors.reporterRole ? colors.status.error : colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <option value="">Select role...</option>
                  <option value="physician">Physician</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="nurse">Nurse</option>
                  <option value="case-manager">Case Manager</option>
                  <option value="other">Other Healthcare Professional</option>
                </select>
                {errors.reporterRole && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                    {errors.reporterRole}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.reporterInfo?.phone || ''}
                  onChange={(e) => handleReporterInfoChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${errors.reporterPhone ? colors.status.error : colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                />
                {errors.reporterPhone && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.status.error, marginTop: spacing[1] }}>
                    {errors.reporterPhone}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, marginBottom: spacing[1] }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.reporterInfo?.email || ''}
                  onChange={(e) => handleReporterInfoChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ marginBottom: spacing[6] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Additional Information
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              placeholder="Any other relevant information..."
              rows={3}
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

          {/* Submit Error */}
          {errors.submit && (
            <div
              style={{
                padding: spacing[3],
                backgroundColor: colors.status.errorBg,
                border: `1px solid ${colors.status.error}`,
                borderRadius: '6px',
                marginBottom: spacing[4],
                fontSize: typography.fontSize.sm,
                color: colors.status.error,
              }}
            >
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: `1px solid ${colors.neutral[300]}`,
                backgroundColor: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: `${spacing[3]} ${spacing[6]}`,
                border: 'none',
                backgroundColor: isSubmitting ? colors.neutral[300] : colors.status.error,
                color: 'white',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Send style={{ width: '16px', height: '16px' }} />
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
