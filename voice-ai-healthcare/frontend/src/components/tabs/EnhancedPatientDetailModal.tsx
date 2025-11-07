import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../../services/api';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import {
  X,
  MapPin,
  Shield,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Pill,
  FileText,
  DollarSign,
  Download,
  Play,
  Calendar,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface EnhancedPatientDetailModalProps {
  patientId: string;
  onClose: () => void;
}

export default function EnhancedPatientDetailModal({ patientId, onClose }: EnhancedPatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState('timeline');

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatient(patientId),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!patient) return null;

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'clinical', label: 'Clinical', icon: Pill },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          {/* Patient Info Bar */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center" style={{ gap: spacing[4] }}>
              {/* Avatar */}
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: colors.primary[100],
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.primary[700]
                }}
              >
                {patient.first_name?.[0]}{patient.last_name?.[0]}
              </div>

              {/* Patient Info */}
              <div>
                <h2 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                  {patient.first_name} {patient.last_name}
                </h2>
                <div className="flex items-center" style={{ gap: spacing[3] }}>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    MRN: {patient.mrn}
                  </span>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>•</span>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    DOB: {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                  </span>
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[400] }}>•</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <Button variant="primary" size="sm">
                <Phone style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                Call Patient
              </Button>
              <Button variant="secondary" size="sm">
                <MessageSquare style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                Send SMS
              </Button>
              <Button variant="secondary" size="sm">
                <Mail style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                Email
              </Button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-4">
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b" style={{ paddingLeft: spacing[6], gap: spacing[1], borderColor: colors.neutral[200] }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center transition-colors"
                  style={{
                    gap: spacing[2],
                    padding: `${spacing[3]} ${spacing[4]}`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
                    color: isActive ? colors.primary[600] : colors.neutral[600],
                    borderBottom: isActive ? `2px solid ${colors.primary[600]}` : '2px solid transparent',
                    marginBottom: '-1px'
                  }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ padding: spacing[6] }}>
          {activeTab === 'timeline' && <TimelineTab patient={patient} />}
          {activeTab === 'clinical' && <ClinicalTab patient={patient} />}
          {activeTab === 'financial' && <FinancialTab patient={patient} />}
          {activeTab === 'documents' && <DocumentsTab patient={patient} />}
        </div>
      </div>
    </div>
  );
}

// Timeline Tab Component
function TimelineTab({ patient }: { patient: any }) {
  const timelineEvents = [
    {
      date: '2025-11-05 14:30',
      type: 'call',
      channel: 'Voice',
      title: 'Outbound Call - Refill Reminder',
      summary: 'Discussed upcoming refill. Patient confirmed home delivery preference.',
      sentiment: 0.85,
      outcome: 'Resolved',
      duration: '3:24',
      topics: ['Refill Request', 'Home Delivery']
    },
    {
      date: '2025-11-02 09:15',
      type: 'sms',
      channel: 'SMS',
      title: 'SMS Sent - Appointment Reminder',
      summary: 'Reminder sent for upcoming doctor appointment.',
      sentiment: null,
      outcome: 'Delivered',
      duration: null,
      topics: []
    },
    {
      date: '2025-10-28 16:45',
      type: 'call',
      channel: 'Voice',
      title: 'Inbound Call - PA Status',
      summary: 'Patient inquired about prior authorization status. Provided update that PA was approved.',
      sentiment: 0.72,
      outcome: 'Resolved',
      duration: '5:12',
      topics: ['PA Status', 'Insurance Questions']
    },
    {
      date: '2025-10-20 11:00',
      type: 'email',
      channel: 'Email',
      title: 'Email Sent - Welcome to Program',
      summary: 'Welcome email with program benefits and contact information.',
      sentiment: null,
      outcome: 'Opened',
      duration: null,
      topics: []
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent style={{ padding: spacing[4] }}>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
              Total Interactions
            </div>
            <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold }}>
              24
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: spacing[4] }}>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
              Avg Sentiment
            </div>
            <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
              82%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: spacing[4] }}>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
              Last Contact
            </div>
            <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold }}>
              2d ago
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: spacing[4] }}>
            <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
              Resolution Rate
            </div>
            <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
              96%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-6 top-0 bottom-0"
          style={{
            width: '2px',
            backgroundColor: colors.neutral[200]
          }}
        />

        {/* Events */}
        <div className="space-y-6">
          {timelineEvents.map((event, i) => (
            <div key={i} className="relative pl-16">
              {/* Icon */}
              <div
                className="absolute left-0 rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: event.type === 'call' ? colors.primary[100] : colors.neutral[100]
                }}
              >
                {event.type === 'call' ? (
                  <Phone style={{ width: '20px', height: '20px', color: colors.primary[600] }} />
                ) : event.type === 'sms' ? (
                  <MessageSquare style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
                ) : (
                  <Mail style={{ width: '20px', height: '20px', color: colors.neutral[600] }} />
                )}
              </div>

              {/* Event Card */}
              <Card>
                <CardContent style={{ padding: spacing[4] }}>
                  <div className="flex items-start justify-between" style={{ marginBottom: spacing[2] }}>
                    <div>
                      <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                        {event.title}
                      </h4>
                      <div className="flex items-center" style={{ gap: spacing[3] }}>
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                          {event.date}
                        </span>
                        <Badge variant="secondary">{event.channel}</Badge>
                        {event.duration && (
                          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                            Duration: {event.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center" style={{ gap: spacing[2] }}>
                      {event.sentiment !== null && (
                        <div className="flex items-center" style={{ gap: spacing[1] }}>
                          <div
                            className="rounded-full"
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: event.sentiment >= 0.7 ? colors.status.success : event.sentiment >= 0.4 ? colors.status.warning : colors.status.error
                            }}
                          />
                          <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                            {(event.sentiment * 100).toFixed(0)}% positive
                          </span>
                        </div>
                      )}
                      <Badge variant={event.outcome === 'Resolved' ? 'success' : 'secondary'}>
                        {event.outcome}
                      </Badge>
                    </div>
                  </div>
                  <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700], marginBottom: spacing[2] }}>
                    {event.summary}
                  </p>
                  {event.topics.length > 0 && (
                    <div className="flex items-center flex-wrap" style={{ gap: spacing[2] }}>
                      {event.topics.map((topic, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 rounded"
                          style={{
                            fontSize: typography.fontSize.xs,
                            backgroundColor: colors.neutral[100],
                            color: colors.neutral[700]
                          }}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.type === 'call' && (
                    <Button variant="secondary" size="sm" style={{ marginTop: spacing[3] }}>
                      <Play style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                      Play Recording
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Clinical Tab Component
function ClinicalTab({ patient }: { patient: any }) {
  const medications = [
    { name: 'Humira', dosage: '40mg', frequency: 'Every 2 weeks', prescriber: 'Dr. Sarah Johnson', npi: '1234567890', startDate: '2024-06-15', adherence: 92 },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescriber: 'Dr. Michael Chen', npi: '0987654321', startDate: '2023-03-20', adherence: 88 },
  ];

  const diagnoses = [
    { code: 'M05.79', description: 'Rheumatoid arthritis with rheumatoid factor', date: '2024-06-01' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus', date: '2023-03-15' },
  ];

  return (
    <div className="space-y-6">
      {/* Medications */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Current Medications
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((med, i) => (
              <div
                key={i}
                className="border-l-4 rounded-r-lg"
                style={{
                  padding: spacing[4],
                  borderColor: colors.primary[500],
                  backgroundColor: colors.neutral[50]
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                      {med.name} - {med.dosage}
                    </h4>
                    <div className="space-y-1">
                      <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        Frequency: {med.frequency}
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        Prescriber: {med.prescriber} (NPI: {med.npi})
                      </div>
                      <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                        Start Date: {new Date(med.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                      Adherence
                    </div>
                    <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: med.adherence >= 80 ? colors.status.success : colors.status.warning }}>
                      {med.adherence}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis Codes */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Diagnosis Codes
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diagnoses.map((dx, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border"
                style={{ padding: spacing[4], borderColor: colors.neutral[200] }}
              >
                <div>
                  <div className="flex items-center" style={{ gap: spacing[2], marginBottom: spacing[1] }}>
                    <span
                      className="px-2 py-1 rounded font-mono"
                      style={{
                        fontSize: typography.fontSize.xs,
                        backgroundColor: colors.primary[100],
                        color: colors.primary[700],
                        fontWeight: typography.fontWeight.semibold
                      }}
                    >
                      {dx.code}
                    </span>
                    <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                      {dx.description}
                    </span>
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                    Diagnosed: {new Date(dx.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adherence History Chart */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Adherence History (Last 6 Months)
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between" style={{ height: '200px', gap: spacing[2] }}>
            {[85, 88, 82, 90, 92, 89].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${value}%`,
                    backgroundColor: value >= 80 ? colors.status.success : colors.status.warning
                  }}
                />
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginTop: spacing[2] }}>
                  {value}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between" style={{ marginTop: spacing[2] }}>
            {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, i) => (
              <div key={i} className="flex-1 text-center" style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                {month}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adverse Events */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Adverse Events Log
          </h3>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-lg text-center"
            style={{
              padding: spacing[8],
              backgroundColor: colors.neutral[50],
              border: `1px solid ${colors.neutral[200]}`
            }}
          >
            <CheckCircle style={{ width: '48px', height: '48px', color: colors.status.success, margin: '0 auto', marginBottom: spacing[3] }} />
            <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.neutral[700] }}>
              No adverse events reported
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Financial Tab Component
function FinancialTab({ patient }: { patient: any }) {
  return (
    <div className="space-y-6">
      {/* Insurance Coverage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Insurance Coverage Details
            </h3>
            <Badge variant="success">Verified</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Primary Insurance
              </div>
              <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[3] }}>
                {patient.insurance_type || 'Commercial'}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Plan Name
              </div>
              <div style={{ fontSize: typography.fontSize.sm, marginBottom: spacing[3] }}>
                {patient.insurance_plan_name || 'Blue Cross Blue Shield PPO'}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Member ID
              </div>
              <div style={{ fontSize: typography.fontSize.sm, fontFamily: 'monospace' }}>
                {patient.insurance_plan_id || 'ABC123456789'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Deductible
              </div>
              <div style={{ fontSize: typography.fontSize.base, marginBottom: spacing[1] }}>
                $500 / $1,500
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], marginBottom: spacing[3] }}>
                $1,000 remaining
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                Out-of-Pocket Max
              </div>
              <div style={{ fontSize: typography.fontSize.base, marginBottom: spacing[1] }}>
                $1,200 / $6,000
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                $4,800 remaining
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copay Card Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
              Copay Assistance Card
            </h3>
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="rounded-lg"
            style={{
              padding: spacing[6],
              background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
              color: 'white'
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: spacing[4] }}>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9, marginBottom: spacing[1] }}>
                  Card Number
                </div>
                <div style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, fontFamily: 'monospace' }}>
                  COPA-123-456-789
                </div>
              </div>
              <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9 }}>
                ConnectiveRX
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9, marginBottom: spacing[1] }}>
                  Max Benefit
                </div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                  $5,000/year
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9, marginBottom: spacing[1] }}>
                  Used to Date
                </div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                  $1,240
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9, marginBottom: spacing[1] }}>
                  Remaining
                </div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                  $3,760
                </div>
              </div>
            </div>
            <div style={{ marginTop: spacing[4], paddingTop: spacing[4], borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9 }}>
                Valid through: 12/31/2025
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Foundation Assistance */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Patient Assistance Program
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
                  Humira Patient Assistance Program
                </div>
                <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  Manufacturer: AbbVie
                </div>
              </div>
              <Badge variant="success">Enrolled</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                  Enrollment Date
                </div>
                <div style={{ fontSize: typography.fontSize.sm }}>06/15/2024</div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                  Renewal Date
                </div>
                <div style={{ fontSize: typography.fontSize.sm }}>06/15/2025</div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                  Estimated Savings
                </div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                  $3,200/month
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1] }}>
                  Annual Benefit
                </div>
                <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.status.success }}>
                  $38,400
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Payment History
          </h3>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead className="border-b" style={{ borderColor: colors.neutral[200] }}>
              <tr>
                <th className="text-left py-2" style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], fontWeight: typography.fontWeight.medium }}>
                  Date
                </th>
                <th className="text-left py-2" style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], fontWeight: typography.fontWeight.medium }}>
                  Description
                </th>
                <th className="text-right py-2" style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], fontWeight: typography.fontWeight.medium }}>
                  Amount
                </th>
                <th className="text-right py-2" style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600], fontWeight: typography.fontWeight.medium }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '11/01/2025', desc: 'Humira - Nov 2025', amount: '$5.00', status: 'Paid' },
                { date: '10/01/2025', desc: 'Humira - Oct 2025', amount: '$5.00', status: 'Paid' },
                { date: '09/01/2025', desc: 'Humira - Sep 2025', amount: '$5.00', status: 'Paid' },
              ].map((payment, i) => (
                <tr key={i} className="border-b" style={{ borderColor: colors.neutral[100] }}>
                  <td className="py-3" style={{ fontSize: typography.fontSize.sm }}>
                    {payment.date}
                  </td>
                  <td className="py-3" style={{ fontSize: typography.fontSize.sm }}>
                    {payment.desc}
                  </td>
                  <td className="py-3 text-right" style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                    {payment.amount}
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="success">{payment.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Estimated Out-of-Pocket */}
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Estimated Out-of-Pocket (Annual)
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                List Price (without assistance)
              </span>
              <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, textDecoration: 'line-through', color: colors.neutral[400] }}>
                $76,800
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Copay Assistance Discount
              </span>
              <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.status.success }}>
                - $5,000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Patient Assistance Program
              </span>
              <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.status.success }}>
                - $38,400
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.neutral[200] }}>
              <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                Your Estimated Cost
              </span>
              <span style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.primary[600] }}>
                $60/year
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({ patient }: { patient: any }) {
  const documents = [
    { name: 'Start Form - Humira.pdf', type: 'Start Form', date: '2024-06-15', size: '245 KB' },
    { name: 'Prior Authorization - Approved.pdf', type: 'Prior Auth', date: '2024-06-20', size: '189 KB' },
    { name: 'Consent Form - Signed.pdf', type: 'Consent', date: '2024-06-15', size: '156 KB' },
    { name: 'Call Transcript - 2025-11-05.pdf', type: 'Transcript', date: '2025-11-05', size: '78 KB' },
    { name: 'Insurance Card - Front.pdf', type: 'Insurance', date: '2024-06-15', size: '1.2 MB' },
    { name: 'Insurance Card - Back.pdf', type: 'Insurance', date: '2024-06-15', size: '985 KB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Patient Documents ({documents.length})
          </h3>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
            All documents related to this patient
          </p>
        </div>
        <Button variant="primary">
          <Download style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
          Download All
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {documents.map((doc, i) => (
          <Card key={i}>
            <CardContent style={{ padding: spacing[4] }}>
              <div className="flex items-start" style={{ gap: spacing[3] }}>
                <div
                  className="rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: colors.status.errorBg
                  }}
                >
                  <FileText style={{ width: '24px', height: '24px', color: colors.status.error }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }} className="truncate">
                    {doc.name}
                  </div>
                  <div className="flex items-center" style={{ gap: spacing[2], fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                    <Badge variant="secondary">{doc.type}</Badge>
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center" style={{ gap: spacing[2], marginTop: spacing[3] }}>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                  View
                </Button>
                <Button variant="secondary" size="sm" style={{ flex: 1 }}>
                  <Download style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload New Document */}
      <Card>
        <CardContent style={{ padding: spacing[6] }}>
          <div
            className="border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-neutral-50 transition-colors"
            style={{
              padding: spacing[8],
              borderColor: colors.neutral[300]
            }}
          >
            <FileText style={{ width: '48px', height: '48px', color: colors.neutral[400], margin: '0 auto', marginBottom: spacing[3] }} />
            <div style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, marginBottom: spacing[1] }}>
              Upload New Document
            </div>
            <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
              Click to browse or drag and drop files here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
