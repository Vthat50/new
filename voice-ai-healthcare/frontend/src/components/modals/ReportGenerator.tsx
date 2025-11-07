import React, { useState } from 'react';
import { X, FileText, Download, Calendar } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportGenerator({ isOpen, onClose }: ReportGeneratorProps) {
  const [formData, setFormData] = useState({
    reportType: 'executive-summary',
    dateRange: 'last-30-days',
    customStartDate: '',
    customEndDate: '',
    format: 'pdf',
    includeCharts: true,
    includePatientList: false,
    includeCallTranscripts: false,
    schedule: 'one-time',
    scheduleFrequency: 'weekly',
  });

  if (!isOpen) return null;

  const reportTypes = [
    { id: 'executive-summary', label: 'Executive Summary', description: 'High-level KPIs and trends' },
    { id: 'patient-outcomes', label: 'Patient Outcomes', description: 'Adherence and health metrics' },
    { id: 'call-analytics', label: 'Call Analytics', description: 'Conversation performance data' },
    { id: 'friction-analysis', label: 'Friction Analysis', description: 'Barrier identification report' },
    { id: 'roi-report', label: 'ROI Report', description: 'Cost savings and value metrics' },
    { id: 'custom', label: 'Custom Report', description: 'Build your own report' },
  ];

  const handleGenerate = () => {
    alert(`Generating ${formData.format.toUpperCase()} report...\n\nType: ${reportTypes.find(t => t.id === formData.reportType)?.label}\nDate Range: ${formData.dateRange}\nFormat: ${formData.format.toUpperCase()}\nSchedule: ${formData.schedule}`);
    onClose();
  };

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
          maxWidth: '700px',
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
              <FileText style={{ width: '24px', height: '24px', color: colors.primary[600] }} />
            </div>
            <div>
              <h2 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                Generate Report
              </h2>
              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500], marginTop: spacing[1] }}>
                Create custom analytics reports
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
          {/* Report Type */}
          <div style={{ marginBottom: spacing[5] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
              Report Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3] }}>
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, reportType: type.id })}
                  style={{
                    padding: spacing[3],
                    border: `2px solid ${formData.reportType === type.id ? colors.primary[500] : colors.neutral[300]}`,
                    borderRadius: '8px',
                    backgroundColor: formData.reportType === type.id ? colors.primary[50] : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: spacing[5] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
              Date Range
            </label>
            <select
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
            >
              <option value="last-7-days">Last 7 Days</option>
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {formData.dateRange === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing[3], marginBottom: spacing[5] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.customStartDate}
                  onChange={(e) => setFormData({ ...formData, customStartDate: e.target.value })}
                  style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.neutral[300]}`, borderRadius: '6px', fontSize: typography.fontSize.sm }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, marginBottom: spacing[2] }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.customEndDate}
                  onChange={(e) => setFormData({ ...formData, customEndDate: e.target.value })}
                  style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.neutral[300]}`, borderRadius: '6px', fontSize: typography.fontSize.sm }}
                />
              </div>
            </div>
          )}

          {/* Format & Options */}
          <div style={{ marginBottom: spacing[5] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
              Export Format
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[2] }}>
              {['pdf', 'excel', 'csv'].map((format) => (
                <button
                  key={format}
                  onClick={() => setFormData({ ...formData, format })}
                  style={{
                    padding: spacing[3],
                    border: `2px solid ${formData.format === format ? colors.primary[500] : colors.neutral[300]}`,
                    borderRadius: '8px',
                    backgroundColor: formData.format === format ? colors.primary[50] : 'white',
                    cursor: 'pointer',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    textTransform: 'uppercase',
                  }}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div style={{ marginBottom: spacing[5] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
              Include in Report
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {[
                { key: 'includeCharts', label: 'Charts and Visualizations' },
                { key: 'includePatientList', label: 'Patient List Details' },
                { key: 'includeCallTranscripts', label: 'Call Transcripts' },
              ].map((option) => (
                <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: spacing[2], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ ...formData, [option.key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ marginBottom: spacing[2] }}>
            <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
              Schedule
            </label>
            <select
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
            >
              <option value="one-time">Generate Once</option>
              <option value="recurring">Recurring Schedule</option>
            </select>
          </div>

          {formData.schedule === 'recurring' && (
            <div style={{ marginTop: spacing[3] }}>
              <select
                value={formData.scheduleFrequency}
                onChange={(e) => setFormData({ ...formData, scheduleFrequency: e.target.value })}
                style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', fontSize: typography.fontSize.sm }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          )}
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
            onClick={handleGenerate}
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
            <Download style={{ width: '16px', height: '16px' }} />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
