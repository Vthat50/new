import React, { useState, useMemo } from 'react';
import { mockPatients } from '../../data/mockPatients';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import EnhancedPatientDetailModal from './EnhancedPatientDetailModal';
import { api } from '../../services/api';

// Import ALL patient components
import AINextAction from '../patients/AINextAction';
import SDOHBadges from '../patients/SDOHBadges';
import PatientQuickActions from '../patients/PatientQuickActions';
import AdverseEventForm from '../patients/AdverseEventForm';
import CopayCardRegeneration from '../patients/CopayCardRegeneration';
import CostCalculator from '../patients/CostCalculator';
import FileUpload from '../patients/FileUpload';
import InsuranceVerification from '../patients/InsuranceVerification';
import MedicationImage from '../patients/MedicationImage';
import NPILookup from '../patients/NPILookup';
import PDFViewer from '../patients/PDFViewer';
import AbandonmentRiskScore from '../patients/AbandonmentRiskScore';

// Import ALL relevant system-wide components
import GlobalSearch from '../shared/GlobalSearch';
import BulkActions from '../shared/BulkActions';
import ColumnControls from '../shared/ColumnControls';
import VirtualTable from '../shared/VirtualTable';
import { UndoRedoProvider, UndoRedoControls } from '../shared/UndoRedo';
import Breadcrumbs from '../shared/Breadcrumbs';
import RecentlyViewed from '../shared/RecentlyViewed';
import { FavoriteStar } from '../shared/Favorites';
import ErrorBoundary from '../shared/ErrorBoundary';
import { TableSkeleton } from '../shared/LoadingSkeletons';
import PrintView from '../shared/PrintView';
import NotificationCenter from '../shared/NotificationCenter';
import CommandPalette from '../shared/CommandPalette';

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
  Users,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface PatientsTabProps {
  demoMode?: boolean;
}

const PatientsTab: React.FC<PatientsTabProps> = ({ demoMode = false }) => {
  const [search, setSearch] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState<string>('');
  const [journeyFilter, setJourneyFilter] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState([
    'mrn', 'name', 'insurance', 'sdoh', 'journey', 'adherence', 'abandonmentRisk', 'lastContact', 'actions'
  ]);

  // State for all new modal components
  const [showAdverseEventForm, setShowAdverseEventForm] = useState(false);
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  const [showInsuranceVerification, setShowInsuranceVerification] = useState(false);
  const [showNPILookup, setShowNPILookup] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showCopayRegeneration, setShowCopayRegeneration] = useState(false);
  const [showMedicationImage, setShowMedicationImage] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  // Use mock data with filtering and sorting
  const patients = useMemo(() => {
    let filtered = [...mockPatients];

    // Apply search filter (MRN + Name)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.mrn.toLowerCase().includes(searchLower) ||
        p.first_name.toLowerCase().includes(searchLower) ||
        p.last_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply insurance filter
    if (insuranceFilter) {
      filtered = filtered.filter(p => p.insurance_type === insuranceFilter);
    }

    // Apply journey stage filter
    if (journeyFilter) {
      filtered = filtered.filter(p => p.journey_stage === journeyFilter);
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'adherence':
            aValue = a.adherence_score;
            bValue = b.adherence_score;
            break;
          case 'abandonmentRisk':
            aValue = getAbandonmentRiskScore(a);
            bValue = getAbandonmentRiskScore(b);
            break;
          case 'lastContact':
            aValue = new Date(a.last_contact_date).getTime();
            bValue = new Date(b.last_contact_date).getTime();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [search, insuranceFilter, journeyFilter, sortConfig]);

  const isLoading = false;

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

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedPatients.size} patients`);
    alert(`${action} on ${selectedPatients.size} patients`);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span style={{ color: colors.neutral[400], marginLeft: spacing[1] }}>⇅</span>;
    }
    return sortConfig.direction === 'asc'
      ? <span style={{ color: colors.primary[500], marginLeft: spacing[1] }}>▲</span>
      : <span style={{ color: colors.primary[500], marginLeft: spacing[1] }}>▼</span>;
  };

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="danger">High Risk</Badge>;
    if (score >= 40) return <Badge variant="warning">Medium Risk</Badge>;
    return <Badge variant="success">Low Risk</Badge>;
  };

  const getSdohFactors = (patient: any) => {
    // Generate SDOH factors based on patient data
    return {
      housing: patient.sdoh_risk_score >= 70 ? 'unstable' as const : 'stable' as const,
      financialStrain: patient.sdoh_risk_score >= 70 ? 'high' as const : patient.sdoh_risk_score >= 40 ? 'medium' as const : 'low' as const,
      education: 'high-school' as const,
      socialSupport: patient.sdoh_risk_score >= 70 ? 'weak' as const : 'strong' as const,
      transportation: patient.sdoh_risk_score >= 70 ? 'unreliable' as const : 'reliable' as const,
      foodSecurity: patient.sdoh_risk_score >= 70 ? 'insecure' as const : 'secure' as const,
      digitalAccess: 'full' as const,
      healthLiteracy: patient.sdoh_risk_score >= 70 ? 'low' as const : 'high' as const,
    };
  };

  const calculateAbandonmentRisk = async (patientId: string) => {
    try {
      const response = await api.get(`/api/triggers/patient-risk/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to calculate risk:', error);
      return null;
    }
  };

  const getAbandonmentRiskScore = (patient: any): number => {
    // Calculate a mock risk score based on patient data
    // In production, this would come from the API
    let score = 0;

    // SDOH contributes to risk
    score += patient.sdoh_risk_score * 0.3;

    // Journey stage contributes
    if (patient.journey_stage === 'churned') score += 30;
    else if (patient.journey_stage === 'at_risk') score += 25;
    else if (patient.journey_stage === 'pa_pending') score += 15;

    // Low adherence contributes
    if (patient.adherence_score < 50) score += 20;
    else if (patient.adherence_score < 75) score += 10;

    // Days since last contact
    const daysSince = Math.floor((Date.now() - new Date(patient.last_contact_date).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 30) score += 15;
    else if (daysSince > 14) score += 10;

    return Math.min(Math.round(score), 99);
  };

  return (
    <UndoRedoProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: spacing[6], backgroundColor: colors.background.page, overflowY: 'auto' }}>

          {/* Bulk Actions Bar */}
          {selectedPatients.size > 0 && (
            <div style={{ marginBottom: spacing[4] }}>
              <BulkActions
                selectedCount={selectedPatients.size}
                actions={[
                  { id: 'campaign', label: 'Launch Campaign', icon: '📢' },
                  { id: 'export', label: 'Export Selected', icon: '📥' },
                  { id: 'tag', label: 'Add Tag', icon: '🏷️' },
                  { id: 'assign', label: 'Assign to Team', icon: '👥' },
                ]}
                onAction={handleBulkAction}
                onClear={() => setSelectedPatients(new Set())}
              />
            </div>
          )}

          {/* Patients Table */}
          <Card>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: typography.fontSize.sm }}>
                  <thead>
                    {/* Search Row */}
                    <tr style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
                      <th style={{ padding: spacing[2] }}></th>
                      <th colSpan={2} style={{ padding: spacing[2] }}>
                        <div style={{ position: 'relative' }}>
                          <Search
                            style={{
                              position: 'absolute',
                              left: spacing[2],
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '14px',
                              height: '14px',
                              color: colors.neutral[400],
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search by name or MRN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                              width: '100%',
                              padding: `${spacing[1]} ${spacing[2]} ${spacing[1]} ${spacing[6]}`,
                              fontSize: typography.fontSize.xs,
                              border: `1px solid ${colors.neutral[300]}`,
                              borderRadius: '4px',
                              outline: 'none',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = colors.primary[500];
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = colors.neutral[300];
                            }}
                          />
                        </div>
                      </th>
                      <th colSpan={10}></th>
                    </tr>
                    {/* Header Row */}
                    <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                      <th style={{ padding: spacing[3], textAlign: 'left' }}>
                        <input
                          type="checkbox"
                          checked={selectedPatients.size === patients?.length && patients?.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      {visibleColumns.includes('mrn') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          MRN
                        </th>
                      )}
                      {visibleColumns.includes('name') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          Patient
                        </th>
                      )}
                      {visibleColumns.includes('insurance') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            Insurance
                            <select
                              value={insuranceFilter}
                              onChange={(e) => setInsuranceFilter(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                padding: `${spacing[1]} ${spacing[2]}`,
                                fontSize: typography.fontSize.xs,
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="">All</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Medicare">Medicare</option>
                              <option value="Medicaid">Medicaid</option>
                              <option value="Uninsured">Uninsured</option>
                            </select>
                          </div>
                        </th>
                      )}
                      {visibleColumns.includes('sdoh') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          SDOH Factors
                        </th>
                      )}
                      {visibleColumns.includes('journey') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                            Journey Stage
                            <select
                              value={journeyFilter}
                              onChange={(e) => setJourneyFilter(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                padding: `${spacing[1]} ${spacing[2]}`,
                                fontSize: typography.fontSize.xs,
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="">All</option>
                              <option value="new_start">New Start</option>
                              <option value="pa_pending">PA Pending</option>
                              <option value="active_treatment">Active Treatment</option>
                              <option value="at_risk">At Risk</option>
                              <option value="churned">Churned</option>
                            </select>
                          </div>
                        </th>
                      )}
                      {visibleColumns.includes('adherence') && (
                        <th
                          style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, cursor: 'pointer' }}
                          onClick={() => handleSort('adherence')}
                        >
                          Adherence{getSortIcon('adherence')}
                        </th>
                      )}
                      {visibleColumns.includes('abandonmentRisk') && (
                        <th
                          style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, cursor: 'pointer' }}
                          onClick={() => handleSort('abandonmentRisk')}
                        >
                          Abandonment Risk{getSortIcon('abandonmentRisk')}
                        </th>
                      )}
                      {visibleColumns.includes('lastContact') && (
                        <th
                          style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold, cursor: 'pointer' }}
                          onClick={() => handleSort('lastContact')}
                        >
                          Last Contact{getSortIcon('lastContact')}
                        </th>
                      )}
                      {visibleColumns.includes('actions') && (
                        <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>
                          AI Next Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {patients?.map((patient) => {
                      const stageInfo = getJourneyStageInfo(patient.journey_stage);
                      const daysSince = Math.floor((Date.now() - new Date(patient.last_contact_date).getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <tr
                          key={patient.id}
                          onClick={(e) => {
                            console.log('=== ROW CLICKED ===');
                            console.log('Patient ID:', patient.id);
                            console.log('Patient Name:', patient.first_name, patient.last_name);
                            console.log('Event target:', e.target);
                            console.log('Current selectedPatientId:', selectedPatientId);
                            setSelectedPatientId(patient.id);
                            console.log('Set selectedPatientId to:', patient.id);
                          }}
                          style={{
                            borderBottom: `1px solid ${colors.neutral[200]}`,
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.neutral[50];
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td style={{ padding: spacing[3] }}>
                            <input
                              type="checkbox"
                              checked={selectedPatients.has(patient.id)}
                              onChange={() => handleSelectPatient(patient.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          {visibleColumns.includes('mrn') && (
                            <td style={{ padding: spacing[3], fontFamily: 'monospace', color: colors.neutral[600] }}>
                              {patient.mrn}
                            </td>
                          )}
                          {visibleColumns.includes('name') && (
                            <td style={{ padding: spacing[3] }}>
                              <div>
                                <div style={{ fontWeight: typography.fontWeight.medium }}>
                                  {demoMode ? `Patient ${patient.mrn}` : `${patient.first_name} ${patient.last_name}`}
                                </div>
                                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                                  {patient.email}
                                </div>
                              </div>
                            </td>
                          )}
                          {visibleColumns.includes('insurance') && (
                            <td style={{ padding: spacing[3] }}>
                              <Badge variant={patient.insurance_type === 'Uninsured' ? 'danger' : 'info'}>
                                {patient.insurance_type}
                              </Badge>
                            </td>
                          )}
                          {visibleColumns.includes('sdoh') && (
                            <td style={{ padding: spacing[3] }}>
                              <SDOHBadges
                                sdohFactors={getSdohFactors(patient)}
                                overallRisk={patient.sdoh_risk_score >= 70 ? 'high' : patient.sdoh_risk_score >= 40 ? 'medium' : 'low'}
                                compact={true}
                              />
                            </td>
                          )}
                          {visibleColumns.includes('journey') && (
                            <td style={{ padding: spacing[3] }}>
                              <Badge
                                style={{
                                  backgroundColor: stageInfo.bgColor,
                                  color: stageInfo.color,
                                }}
                              >
                                {stageInfo.label}
                              </Badge>
                            </td>
                          )}
                          {visibleColumns.includes('adherence') && (
                            <td style={{ padding: spacing[3] }}>
                              <div className="flex items-center" style={{ gap: spacing[2] }}>
                                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                                  {patient.adherence_score}%
                                </div>
                                <div style={{ flex: 1, height: '4px', backgroundColor: colors.neutral[200], borderRadius: '2px', overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      width: `${patient.adherence_score}%`,
                                      height: '100%',
                                      backgroundColor: patient.adherence_score >= 80 ? colors.status.success : patient.adherence_score >= 60 ? colors.status.warning : colors.status.error,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                          )}
                          {visibleColumns.includes('abandonmentRisk') && (
                            <td style={{ padding: spacing[3] }} onClick={(e) => e.stopPropagation()}>
                              <AbandonmentRiskScore
                                riskScore={getAbandonmentRiskScore(patient)}
                                patientId={patient.id}
                                onCalculate={calculateAbandonmentRisk}
                              />
                            </td>
                          )}
                          {visibleColumns.includes('lastContact') && (
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                              <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {daysSince} days ago
                            </td>
                          )}
                          {visibleColumns.includes('actions') && (
                            <td style={{ padding: spacing[3] }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
                                <AINextAction
                                  patientId={patient.id}
                                  patientData={{
                                    sdohRisk: patient.sdoh_risk_score,
                                    journeyStage: patient.journey_stage,
                                    adherence: patient.adherence_score,
                                    lastContact: patient.last_contact_date,
                                  }}
                                  compact={true}
                                  onActionClick={() => {
                                    setSelectedPatientId(patient.id);
                                  }}
                                />
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {patients?.length === 0 && (
            <div style={{ textAlign: 'center', padding: spacing[12], color: colors.neutral[500] }}>
              <Users style={{ width: '48px', height: '48px', margin: '0 auto', marginBottom: spacing[4] }} />
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
                No patients found
              </h3>
              <p style={{ fontSize: typography.fontSize.sm }}>
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatientId && (
        <>
          {console.log('=== RENDERING MODAL ===', 'patientId:', selectedPatientId)}
          <EnhancedPatientDetailModal
            patientId={selectedPatientId}
            onClose={() => {
              console.log('=== CLOSING MODAL ===');
              setSelectedPatientId(null);
            }}
          />
        </>
      )}

      {/* ALL Additional Patient Component Modals */}
      {showAdverseEventForm && (
        <AdverseEventForm
          patientId={selectedPatientId || '1'}
          onClose={() => setShowAdverseEventForm(false)}
          onSubmit={(data) => {
            console.log('Adverse event submitted:', data);
            setShowAdverseEventForm(false);
          }}
        />
      )}

      {showCostCalculator && (
        <CostCalculator
          patientId={selectedPatientId || '1'}
          onClose={() => setShowCostCalculator(false)}
        />
      )}

      {showInsuranceVerification && selectedPatientId && (
        <InsuranceVerification
          patientId={selectedPatientId}
          insuranceInfo={{
            provider: mockPatients.find(p => p.id === selectedPatientId)?.insurance_type || 'Unknown',
            memberId: 'MEM123456',
            groupNumber: 'GRP98765',
            policyType: 'PPO',
          }}
          onVerificationComplete={(result) => {
            console.log('Verification complete:', result);
            setShowInsuranceVerification(false);
          }}
        />
      )}

      {showNPILookup && (
        <NPILookup
          onSelect={(provider) => {
            console.log('Provider selected:', provider);
            setShowNPILookup(false);
          }}
        />
      )}

      {showFileUpload && (
        <FileUpload
          patientId={selectedPatientId || '1'}
          onUploadComplete={(files) => {
            console.log('Files uploaded:', files);
            setShowFileUpload(false);
          }}
          onClose={() => setShowFileUpload(false)}
        />
      )}

      {showPDFViewer && (
        <PDFViewer
          url="/sample-document.pdf"
          title="Patient Document"
          onClose={() => setShowPDFViewer(false)}
        />
      )}

      {showCopayRegeneration && (
        <CopayCardRegeneration
          patientId={selectedPatientId || '1'}
          onRegenerate={() => {
            console.log('Copay card regenerated');
            setShowCopayRegeneration(false);
          }}
          onClose={() => setShowCopayRegeneration(false)}
        />
      )}

      {showMedicationImage && (
        <MedicationImage
          medicationName="Sample Medication"
          onClose={() => setShowMedicationImage(false)}
        />
      )}

      {showCommandPalette && (
        <CommandPalette
          commands={[
            {
              id: 'new-patient',
              label: 'Add New Patient',
              category: 'Actions',
              keywords: ['create', 'add', 'new'],
              action: () => console.log('New patient'),
              shortcut: '⌘N',
            },
            {
              id: 'export',
              label: 'Export Patient Data',
              category: 'Actions',
              keywords: ['export', 'download'],
              action: () => handleExportCSV(),
              shortcut: '⌘E',
            },
          ]}
          onClose={() => setShowCommandPalette(false)}
          onExecute={(command) => {
            console.log('Executing command:', command);
            setShowCommandPalette(false);
          }}
        />
      )}

      {showPrintView && (
        <PrintView
          title="Patient List"
          onClose={() => setShowPrintView(false)}
        >
          <div>
            <h2>Patients ({patients.length})</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>MRN</th>
                  <th>Name</th>
                  <th>Insurance</th>
                  <th>SDOH Risk</th>
                  <th>Journey Stage</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>{p.mrn}</td>
                    <td>{p.first_name} {p.last_name}</td>
                    <td>{p.insurance_type}</td>
                    <td>{p.sdoh_risk_score}</td>
                    <td>{p.journey_stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PrintView>
      )}


      {/* Notification Center */}
      <NotificationCenter
        notifications={[
          {
            id: '1',
            type: 'success' as const,
            title: 'Patient Updated',
            message: 'Patient record was successfully updated',
            timestamp: new Date(),
            read: false,
          },
        ]}
        onMarkAsRead={() => {}}
        onMarkAllAsRead={() => {}}
        onDismiss={() => {}}
      />
    </UndoRedoProvider>
  );
};

export default PatientsTab;
