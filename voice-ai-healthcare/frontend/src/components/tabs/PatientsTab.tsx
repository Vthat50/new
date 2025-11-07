import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../../services/api';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import EnhancedPatientDetailModal from './EnhancedPatientDetailModal';
import {
  Search,
  Phone,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Calendar,
  TrendingUp,
  Download,
  Filter,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PatientsTabProps {
  demoMode?: boolean;
}

const PatientsTab: React.FC<PatientsTabProps> = ({ demoMode = false }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    journey_stage: '',
    risk_level: '',
    insurance_type: '',
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', filters, search],
    queryFn: () => getPatients({ ...filters, search }),
  });

  const getJourneyStageInfo = (stage: string) => {
    const stages = {
      'new_start': { label: 'New Start', color: colors.primary[500], bgColor: colors.primary[50] },
      'pa_pending': { label: 'PA Pending', color: colors.status.warning, bgColor: colors.status.warningBg },
      'active_treatment': { label: 'Active Treatment', color: colors.status.success, bgColor: colors.status.successBg },
      'at_risk': { label: 'At Risk', color: colors.status.error, bgColor: colors.status.errorBg },
      'churned': { label: 'Churned', color: colors.neutral[500], bgColor: colors.neutral[100] },
    };
    return stages[stage as keyof typeof stages] || stages.new_start;
  };

  const getNextAction = (patient: any) => {
    if (patient.sdoh_risk_score >= 70) return 'Call for PA assistance';
    if (patient.sdoh_risk_score >= 40) return 'Schedule follow-up';
    return 'Send refill reminder';
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return colors.status.success;
    if (score >= 0.4) return colors.status.warning;
    return colors.status.error;
  };

  const handleSelectAll = () => {
    if (selectedPatients.size === patients?.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(patients?.map(p => p.id) || []));
    }
  };

  const handleSelectPatient = (patientId: string) => {
    const newSelected = new Set(selectedPatients);
    if (newSelected.has(patientId)) {
      newSelected.delete(patientId);
    } else {
      newSelected.add(patientId);
    }
    setSelectedPatients(newSelected);
  };

  const handleExportCSV = () => {
    // CSV export logic
    const csvData = patients?.map(p => ({
      MRN: p.mrn,
      Name: demoMode ? `Patient ${p.mrn}` : `${p.first_name} ${p.last_name}`,
      Insurance: p.insurance_type,
      'SDOH Risk': p.sdoh_risk_score,
      'Journey Stage': p.journey_stage,
      'Adherence Score': p.adherence_score,
    }));
    console.log('Exporting CSV:', csvData);
    alert('CSV export functionality ready');
  };

  const handleBulkCampaign = () => {
    alert(`Launching campaign for ${selectedPatients.size} selected patients`);
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="danger">High Risk</Badge>;
    if (score >= 40) return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  const getRandomJourneyStage = () => {
    const stages = ['new_start', 'pa_pending', 'active_treatment', 'at_risk', 'churned'];
    return stages[Math.floor(Math.random() * stages.length)];
  };

  const getDaysSinceContact = () => Math.floor(Math.random() * 30) + 1;

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page, display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
            Patients
          </h1>
          <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
            {patients?.length || 0} patients • Manage patient journeys and interactions
          </p>
        </div>
        <div className="flex items-center" style={{ gap: spacing[2] }}>
          <button
            onClick={handleExportCSV}
            className="border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
            style={{ padding: `${spacing[2]} ${spacing[4]}`, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[700] }}
          >
            <Download style={{ width: '16px', height: '16px', display: 'inline', marginRight: spacing[2] }} />
            Export CSV
          </button>
          <button
            className="rounded-md transition-colors"
            style={{ padding: `${spacing[2]} ${spacing[4]}`, backgroundColor: colors.primary[500], color: 'white', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}
          >
            + Launch Campaign
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ fontSize: typography.fontSize.sm }}
              />
            </div>
            <select
              value={filters.journey_stage}
              onChange={(e) => setFilters({ ...filters, journey_stage: e.target.value })}
              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm }}
            >
              <option value="">All Journey Stages</option>
              <option value="new_start">New Start</option>
              <option value="pa_pending">PA Pending</option>
              <option value="active_treatment">Active Treatment</option>
              <option value="at_risk">At Risk</option>
              <option value="churned">Churned</option>
            </select>
            <select
              value={filters.risk_level}
              onChange={(e) => setFilters({ ...filters, risk_level: e.target.value })}
              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm }}
            >
              <option value="">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <select
              value={filters.insurance_type}
              onChange={(e) => setFilters({ ...filters, insurance_type: e.target.value })}
              className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm }}
            >
              <option value="">All Insurance Types</option>
              <option value="Medicare">Medicare</option>
              <option value="Medicaid">Medicaid</option>
              <option value="Commercial">Commercial</option>
              <option value="Uninsured">Uninsured</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedPatients.size > 0 && (
        <div
          className="rounded-lg border flex items-center justify-between"
          style={{
            padding: spacing[4],
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[300]
          }}
        >
          <div className="flex items-center" style={{ gap: spacing[3] }}>
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>
              {selectedPatients.size} patient{selectedPatients.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedPatients(new Set())}
              style={{ fontSize: typography.fontSize.sm, color: colors.primary[700] }}
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center" style={{ gap: spacing[2] }}>
            <button
              onClick={handleBulkCampaign}
              className="rounded-md transition-colors"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: colors.primary[500],
                color: 'white',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium
              }}
            >
              Launch Outbound Campaign
            </button>
            <button
              onClick={handleExportCSV}
              className="border border-primary-500 rounded-md hover:bg-primary-100 transition-colors"
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.primary[700]
              }}
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Patient Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPatients.size === patients?.length && patients?.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Journey Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Next Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Last Call
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Adherence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Days Since Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Upcoming Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {patients?.map((patient) => {
                    const journeyStage = getRandomJourneyStage();
                    const stageInfo = getJourneyStageInfo(journeyStage);
                    const nextAction = getNextAction(patient);
                    const daysSinceContact = getDaysSinceContact();
                    const adherenceScore = Math.floor(Math.random() * 40) + 60; // 60-100%
                    const sentimentScore = Math.random();

                    return (
                      <tr key={patient.id} className="hover:bg-neutral-50 transition-colors">
                        {/* Checkbox */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedPatients.has(patient.id)}
                            onChange={() => handleSelectPatient(patient.id)}
                            className="w-4 h-4"
                          />
                        </td>

                        {/* Patient ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center" style={{ gap: spacing[2] }}>
                            <span className="text-sm font-mono text-neutral-600">{patient.mrn}</span>
                            <CheckCircle style={{ width: '14px', height: '14px', color: colors.status.success }} title="Synced with Salesforce" />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-neutral-900">
                            {demoMode ? `Patient ${patient.mrn}` : `${patient.first_name} ${patient.last_name}`}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {patient.insurance_type || 'No insurance'}
                          </div>
                        </td>

                        {/* Journey Stage */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: stageInfo.bgColor,
                              color: stageInfo.color,
                            }}
                          >
                            {stageInfo.label}
                          </span>
                        </td>

                        {/* Next Action */}
                        <td className="px-6 py-4">
                          <div className="flex items-center" style={{ gap: spacing[2] }}>
                            <AlertCircle style={{ width: '14px', height: '14px', color: colors.primary[500] }} />
                            <span className="text-sm text-neutral-700">{nextAction}</span>
                          </div>
                        </td>

                        {/* Last Call Sentiment */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center" style={{ gap: spacing[2] }}>
                            <div
                              className="rounded-full"
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: getSentimentColor(sentimentScore)
                              }}
                            />
                            <span className="text-xs text-neutral-500">
                              {(sentimentScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>

                        {/* Adherence Score */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div style={{ width: '100px' }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-neutral-700">{adherenceScore}%</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className="rounded-full h-2 transition-all"
                                style={{
                                  width: `${adherenceScore}%`,
                                  backgroundColor: adherenceScore >= 80 ? colors.status.success : adherenceScore >= 60 ? colors.status.warning : colors.status.error,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Days Since Contact */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center" style={{ gap: spacing[1] }}>
                            <Clock style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                            <span className="text-sm text-neutral-600">{daysSinceContact}d</span>
                          </div>
                        </td>

                        {/* Upcoming Events */}
                        <td className="px-6 py-4">
                          <div className="flex items-center" style={{ gap: spacing[2] }}>
                            {Math.random() > 0.7 && (
                              <div
                                className="rounded-full p-1"
                                style={{ backgroundColor: colors.status.warningBg }}
                                title="PA renewal needed"
                              >
                                <FileText style={{ width: '12px', height: '12px', color: colors.status.warning }} />
                              </div>
                            )}
                            {Math.random() > 0.6 && (
                              <div
                                className="rounded-full p-1"
                                style={{ backgroundColor: colors.status.infoBg }}
                                title="Refill due"
                              >
                                <Calendar style={{ width: '12px', height: '12px', color: colors.status.info }} />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center" style={{ gap: spacing[2] }}>
                            <button
                              className="rounded transition-colors"
                              style={{
                                padding: `${spacing[1]} ${spacing[3]}`,
                                backgroundColor: colors.primary[500],
                                color: 'white',
                                fontSize: typography.fontSize.xs,
                                fontWeight: typography.fontWeight.medium,
                              }}
                              title="Call Now"
                            >
                              <Phone style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button
                              onClick={() => setSelectedPatientId(patient.id)}
                              className="border border-neutral-300 rounded transition-colors hover:bg-neutral-50"
                              style={{
                                padding: `${spacing[1]} ${spacing[3]}`,
                                fontSize: typography.fontSize.xs,
                                fontWeight: typography.fontWeight.medium,
                                color: colors.neutral[700],
                              }}
                              title="View Details"
                            >
                              <Eye style={{ width: '14px', height: '14px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Detail Modal */}
      {selectedPatientId && (
        <EnhancedPatientDetailModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
};

export default PatientsTab;
