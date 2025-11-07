import React, { useState, useMemo } from 'react';
import { mockPatients } from '../../data/mockPatients';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import EnhancedPatientDetailModal from './EnhancedPatientDetailModal';

// Import ALL patient components
import FilterSidebar from '../patients/FilterSidebar';
import AINextAction from '../patients/AINextAction';
import SDOHBadges from '../patients/SDOHBadges';
import SavedFilters from '../patients/SavedFilters';
import PatientQuickActions from '../patients/PatientQuickActions';
import AdverseEventForm from '../patients/AdverseEventForm';
import CopayCardRegeneration from '../patients/CopayCardRegeneration';
import CostCalculator from '../patients/CostCalculator';
import FileUpload from '../patients/FileUpload';
import InsuranceVerification from '../patients/InsuranceVerification';
import MedicationImage from '../patients/MedicationImage';
import NPILookup from '../patients/NPILookup';
import PDFViewer from '../patients/PDFViewer';

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
  Filter,
  Users,
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
    state: '',
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState([
    'mrn', 'name', 'insurance', 'sdoh', 'journey', 'adherence', 'lastContact', 'actions'
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

  // Use hardcoded mock data and filter locally
  const patients = useMemo(() => {
    let filtered = [...mockPatients];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.mrn.toLowerCase().includes(searchLower) ||
        p.first_name.toLowerCase().includes(searchLower) ||
        p.last_name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply journey stage filter
    if (filters.journey_stage) {
      filtered = filtered.filter(p => p.journey_stage === filters.journey_stage);
    }

    // Apply risk level filter
    if (filters.risk_level) {
      filtered = filtered.filter(p => {
        if (filters.risk_level === 'high') return p.sdoh_risk_score >= 70;
        if (filters.risk_level === 'medium') return p.sdoh_risk_score >= 40 && p.sdoh_risk_score < 70;
        if (filters.risk_level === 'low') return p.sdoh_risk_score < 40;
        return true;
      });
    }

    // Apply insurance type filter
    if (filters.insurance_type) {
      filtered = filtered.filter(p => p.insurance_type === filters.insurance_type);
    }

    // Apply state filter
    if (filters.state) {
      filtered = filtered.filter(p => p.state === filters.state);
    }

    return filtered;
  }, [search, filters]);

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

  return (
    <UndoRedoProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Filter Sidebar */}
        {showFilterSidebar && (
          <div style={{ width: '300px', borderRight: `1px solid ${colors.neutral[200]}`, overflowY: 'auto' }}>
            <FilterSidebar
              filters={filters}
              onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
              onSave={() => console.log('Filter saved')}
              onReset={() => setFilters({ journey_stage: '', risk_level: '', insurance_type: '', state: '' })}
            />
            <div style={{ padding: spacing[4] }}>
              <SavedFilters
                onFilterSelect={(filterData) => setFilters({ ...filters, ...filterData })}
                currentFilters={filters}
                onSave={(name, filterData) => console.log('Filter saved:', name, filterData)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: spacing[6], backgroundColor: colors.background.page, overflowY: 'auto' }}>
          {/* Header with actions */}
          <div className="flex items-center justify-between" style={{ marginBottom: spacing[6] }}>
            <div>
              <h1 className="text-neutral-900" style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                <Users style={{ width: '32px', height: '32px', display: 'inline', marginRight: spacing[2] }} />
                Patients
              </h1>
              <p className="text-neutral-500" style={{ fontSize: typography.fontSize.sm }}>
                {patients?.length || 0} patients • Manage patient journeys and interactions
              </p>
            </div>
            <div className="flex items-center" style={{ gap: spacing[2] }}>
              <UndoRedoControls showLabels={false} variant="toolbar" />
              <button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                style={{ padding: `${spacing[2]} ${spacing[4]}`, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[700] }}
              >
                <Filter style={{ width: '16px', height: '16px', display: 'inline', marginRight: spacing[2] }} />
                {showFilterSidebar ? 'Hide' : 'Show'} Filters
              </button>
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

          {/* Search Bar with GlobalSearch component */}
          <div style={{ marginBottom: spacing[4] }}>
            <GlobalSearch
              placeholder="Search patients by MRN, name, email..."
              onSearch={(query) => setSearch(query)}
              onSelectResult={(result) => setSelectedPatientId(result.id)}
              searchableFields={['mrn', 'first_name', 'last_name', 'email', 'phone']}
              data={mockPatients}
            />
          </div>

          {/* Column Controls */}
          <div style={{ marginBottom: spacing[4] }}>
            <ColumnControls
              availableColumns={[
                { id: 'mrn', label: 'MRN' },
                { id: 'name', label: 'Name' },
                { id: 'insurance', label: 'Insurance' },
                { id: 'sdoh', label: 'SDOH Risk' },
                { id: 'journey', label: 'Journey Stage' },
                { id: 'adherence', label: 'Adherence' },
                { id: 'lastContact', label: 'Last Contact' },
                { id: 'actions', label: 'Actions' },
              ]}
              visibleColumns={visibleColumns}
              onToggleColumn={(columnId) => {
                setVisibleColumns(prev =>
                  prev.includes(columnId)
                    ? prev.filter(id => id !== columnId)
                    : [...prev, columnId]
                );
              }}
              onReset={() => setVisibleColumns(['mrn', 'name', 'insurance', 'sdoh', 'journey', 'adherence', 'lastContact', 'actions'])}
            />
          </div>

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

          {/* Quick Filters */}
          <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[4], flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilters({ ...filters, journey_stage: 'at_risk' })}
              className="px-3 py-2 rounded-md border transition-colors"
              style={{
                borderColor: filters.journey_stage === 'at_risk' ? colors.status.error : colors.neutral[300],
                backgroundColor: filters.journey_stage === 'at_risk' ? colors.status.errorBg : 'white',
                color: filters.journey_stage === 'at_risk' ? colors.status.error : colors.neutral[700],
                fontSize: typography.fontSize.sm,
              }}
            >
              🚨 At Risk Patients
            </button>
            <button
              onClick={() => setFilters({ ...filters, risk_level: 'high' })}
              className="px-3 py-2 rounded-md border transition-colors"
              style={{
                borderColor: filters.risk_level === 'high' ? colors.status.error : colors.neutral[300],
                backgroundColor: filters.risk_level === 'high' ? colors.status.errorBg : 'white',
                color: filters.risk_level === 'high' ? colors.status.error : colors.neutral[700],
                fontSize: typography.fontSize.sm,
              }}
            >
              ⚠️ High SDOH Risk
            </button>
            <button
              onClick={() => setFilters({ ...filters, journey_stage: 'pa_pending' })}
              className="px-3 py-2 rounded-md border transition-colors"
              style={{
                borderColor: filters.journey_stage === 'pa_pending' ? colors.status.warning : colors.neutral[300],
                backgroundColor: filters.journey_stage === 'pa_pending' ? colors.status.warningBg : 'white',
                color: filters.journey_stage === 'pa_pending' ? colors.status.warning : colors.neutral[700],
                fontSize: typography.fontSize.sm,
              }}
            >
              ⏳ PA Pending
            </button>
            <button
              onClick={() => setFilters({ journey_stage: '', risk_level: '', insurance_type: '', state: '' })}
              className="px-3 py-2 rounded-md border border-neutral-300 hover:bg-neutral-50 transition-colors"
              style={{
                color: colors.neutral[700],
                fontSize: typography.fontSize.sm,
              }}
            >
              Clear All
            </button>
          </div>

          {/* Patients Table */}
          <Card>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: typography.fontSize.sm }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                      <th style={{ padding: spacing[3], textAlign: 'left' }}>
                        <input
                          type="checkbox"
                          checked={selectedPatients.size === patients?.length && patients?.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      {visibleColumns.includes('mrn') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>MRN</th>}
                      {visibleColumns.includes('name') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>Patient</th>}
                      {visibleColumns.includes('insurance') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>Insurance</th>}
                      {visibleColumns.includes('sdoh') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>SDOH Factors</th>}
                      {visibleColumns.includes('journey') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>Journey Stage</th>}
                      {visibleColumns.includes('adherence') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>Adherence</th>}
                      {visibleColumns.includes('lastContact') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>Last Contact</th>}
                      {visibleColumns.includes('actions') && <th style={{ padding: spacing[3], textAlign: 'left', fontWeight: typography.fontWeight.semibold }}>AI Next Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {patients?.map((patient) => {
                      const stageInfo = getJourneyStageInfo(patient.journey_stage);
                      const daysSince = Math.floor((Date.now() - new Date(patient.last_contact_date).getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <tr
                          key={patient.id}
                          onClick={() => setSelectedPatientId(patient.id)}
                          style={{
                            borderBottom: `1px solid ${colors.neutral[200]}`,
                            cursor: 'pointer',
                          }}
                          className="hover:bg-neutral-50"
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
                          {visibleColumns.includes('lastContact') && (
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                              <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                              {daysSince} days ago
                            </td>
                          )}
                          {visibleColumns.includes('actions') && (
                            <td style={{ padding: spacing[3] }}>
                              <AINextAction
                                patientId={patient.id}
                                patientData={{
                                  sdohRisk: patient.sdoh_risk_score,
                                  journeyStage: patient.journey_stage,
                                  adherence: patient.adherence_score,
                                  lastContact: patient.last_contact_date,
                                }}
                                compact={true}
                              />
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
        <EnhancedPatientDetailModal
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
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

      {/* Breadcrumbs */}
      <div style={{ position: 'fixed', top: spacing[4], left: spacing[6], zIndex: 100 }}>
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Patients', path: '/patients' },
          ]}
        />
      </div>

      {/* Recently Viewed */}
      <div style={{ position: 'fixed', bottom: spacing[4], right: spacing[4], zIndex: 100 }}>
        <RecentlyViewed
          items={[]}
          onItemClick={(item) => setSelectedPatientId(item.id)}
        />
      </div>

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
        onClear={() => {}}
      />
    </UndoRedoProvider>
  );
};

export default PatientsTab;
