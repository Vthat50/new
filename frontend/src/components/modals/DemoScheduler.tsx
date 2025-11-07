import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, Building } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface DemoSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoScheduler({ isOpen, onClose }: DemoSchedulerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    date: '',
    time: '',
    timezone: 'America/New_York',
    demoType: 'full',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSchedule = () => {
    alert(`Demo scheduled!\n\nContact: ${formData.name}\nEmail: ${formData.email}\nDate: ${formData.date} at ${formData.time}\nType: ${formData.demoType === 'full' ? 'Full Platform Demo' : 'Quick Overview'}`);
    onClose();
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: colors.primary[50], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
            </div>
            <div>
              <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                Schedule a Demo
              </h2>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], marginTop: spacing[1] }}>
                Book a personalized walkthrough
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: spacing[2], border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '6px' }}
          >
            <X style={{ width: '24px', height: '24px', color: colors.neutral[400] }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: spacing[6] }}>
          {/* Contact Information */}
          <div style={{ marginBottom: spacing[5] }}>
            <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
              Contact Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3], marginBottom: spacing[3] }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <User style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  required
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <Building style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Pharmaceuticals"
                  required
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <Mail style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@acme.com"
                  required
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <Phone style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                />
              </div>
            </div>
          </div>

          {/* Demo Type */}
          <div style={{ marginBottom: spacing[5] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
              Demo Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
              {[
                { id: 'quick', label: 'Quick Overview', duration: '15 min', description: 'High-level platform tour' },
                { id: 'full', label: 'Full Demo', duration: '30 min', description: 'In-depth walkthrough' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, demoType: type.id })}
                  style={{
                    padding: spacing[3],
                    border: `2px solid ${formData.demoType === type.id ? colors.primary[500] : colors.neutral[300]}`,
                    borderRadius: '8px',
                    backgroundColor: formData.demoType === type.id ? colors.primary[50] : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    {type.duration} • {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ marginBottom: spacing[5] }}>
            <h3 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
              Select Date & Time
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3], marginBottom: spacing[3] }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <Calendar style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  <Clock style={{ width: '14px', height: '14px', color: colors.neutral[500] }} />
                  Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any specific features or questions you'd like to cover?"
              rows={3}
              style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: spacing[6], borderTop: `1px solid ${colors.neutral[200]}`, display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
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
            Cancel
          </button>

          <button
            onClick={handleSchedule}
            disabled={!formData.name || !formData.email || !formData.company || !formData.date || !formData.time}
            style={{
              padding: `${spacing[3]} ${spacing[5]}`,
              border: 'none',
              backgroundColor: (!formData.name || !formData.email || !formData.company || !formData.date || !formData.time) ? colors.neutral[300] : colors.primary[500],
              color: 'white',
              borderRadius: '8px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: (!formData.name || !formData.email || !formData.company || !formData.date || !formData.time) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Calendar style={{ width: '16px', height: '16px' }} />
            Schedule Demo
          </button>
        </div>
      </div>
    </div>
  );
}
