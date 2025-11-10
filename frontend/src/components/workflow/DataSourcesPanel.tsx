import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings as SettingsIcon,
  Database,
  Zap,
  Link as LinkIcon,
  Eye,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Code,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  description: string;
  recordCount?: number;
}

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT';
  url: string;
  description: string;
  enabled: boolean;
}

interface Webhook {
  id: string;
  name: string;
  event: string;
  url: string;
  enabled: boolean;
}

interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  description: string;
  recordCount: number;
  lastUpdated: string;
}

export default function DataSourcesPanel() {
  const [selectedView, setSelectedView] = useState<'integrations' | 'apis' | 'webhooks' | 'databases'>('integrations');
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Integration connections
  const integrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'CRM',
      status: 'connected',
      lastSync: '2 minutes ago',
      description: 'Patient data sync and enrichment',
      recordCount: 1247,
    },
    {
      id: 'veeva',
      name: 'Veeva CRM',
      type: 'CRM',
      status: 'connected',
      lastSync: '5 minutes ago',
      description: 'Healthcare professional and patient records',
      recordCount: 892,
    },
    {
      id: 'change_healthcare',
      name: 'Change Healthcare',
      type: 'Insurance Verification',
      status: 'connected',
      lastSync: '1 minute ago',
      description: 'Real-time eligibility and benefits verification',
      recordCount: 15234,
    },
    {
      id: 'availity',
      name: 'Availity',
      type: 'Insurance Verification',
      status: 'connected',
      lastSync: '3 minutes ago',
      description: 'Insurance verification and claims status',
      recordCount: 8456,
    },
    {
      id: 'covermymeds',
      name: 'CoverMyMeds',
      type: 'Prior Authorization',
      status: 'connected',
      lastSync: '10 minutes ago',
      description: 'Electronic prior authorization submission and tracking',
      recordCount: 2341,
    },
    {
      id: 'connectiverx',
      name: 'ConnectiveRX',
      type: 'Copay Card Provider',
      status: 'connected',
      lastSync: '15 minutes ago',
      description: 'Copay card activation and patient assistance programs',
      recordCount: 1876,
    },
    {
      id: 'pap_direct',
      name: 'PAP Direct',
      type: 'Copay Card Provider',
      status: 'disconnected',
      description: 'Patient assistance program enrollment and verification',
    },
  ];

  // API Endpoints
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'eligibility_check',
      name: 'Insurance Eligibility Check',
      method: 'POST',
      url: 'https://api.changehealthcare.com/eligibility/v1/check',
      description: 'Real-time insurance eligibility verification',
      enabled: true,
    },
    {
      id: 'pa_status',
      name: 'Prior Auth Status',
      method: 'GET',
      url: 'https://api.covermymeds.com/v1/requests/{pa_id}/status',
      description: 'Get current status of prior authorization request',
      enabled: true,
    },
    {
      id: 'copay_activate',
      name: 'Copay Card Activation',
      method: 'POST',
      url: 'https://api.connectiverx.com/v2/cards/activate',
      description: 'Activate copay assistance card for patient',
      enabled: true,
    },
    {
      id: 'patient_lookup',
      name: 'Patient Record Lookup',
      method: 'GET',
      url: 'https://api.salesforce.com/services/data/v55.0/query',
      description: 'Query patient records from CRM',
      enabled: true,
    },
  ];

  // Webhooks
  const webhooks: Webhook[] = [
    {
      id: 'pa_status_change',
      name: 'PA Status Change',
      event: 'prior_auth.status_updated',
      url: 'https://your-domain.com/webhooks/pa-status',
      enabled: true,
    },
    {
      id: 'adverse_event',
      name: 'Adverse Event Detected',
      event: 'safety.adverse_event_detected',
      url: 'https://your-domain.com/webhooks/adverse-event',
      enabled: true,
    },
    {
      id: 'call_completed',
      name: 'Call Completed',
      event: 'conversation.completed',
      url: 'https://your-domain.com/webhooks/call-completed',
      enabled: true,
    },
  ];

  // Database connections
  const databases: DatabaseConnection[] = [
    {
      id: 'meddra',
      name: 'MedDRA Terminology Database',
      type: 'Reference Data',
      description: 'Medical Dictionary for Regulatory Activities - adverse event coding',
      recordCount: 76589,
      lastUpdated: 'March 2024 (v27.0)',
    },
    {
      id: 'sdoh',
      name: 'SDOH Database',
      type: 'Social Determinants',
      description: 'Social determinants of health data by ZIP code',
      recordCount: 42156,
      lastUpdated: '2024 Q1',
    },
    {
      id: 'insurance_coverage',
      name: 'Insurance Coverage Database',
      type: 'Coverage Data',
      description: 'Formulary and coverage details by plan',
      recordCount: 15678,
      lastUpdated: 'Updated daily',
    },
  ];

  // MedDRA sample data
  const meddraData = [
    { code: '10019211', term: 'Headache', soc: 'Nervous system disorders', level: 'PT' },
    { code: '10028813', term: 'Nausea', soc: 'Gastrointestinal disorders', level: 'PT' },
    { code: '10013968', term: 'Dizziness', soc: 'Nervous system disorders', level: 'PT' },
    { code: '10016256', term: 'Fatigue', soc: 'General disorders and administration site conditions', level: 'PT' },
    { code: '10047700', term: 'Vomiting', soc: 'Gastrointestinal disorders', level: 'PT' },
    { code: '10013573', term: 'Diarrhoea', soc: 'Gastrointestinal disorders', level: 'PT' },
    { code: '10037844', term: 'Rash', soc: 'Skin and subcutaneous tissue disorders', level: 'PT' },
    { code: '10022998', term: 'Injection site reaction', soc: 'General disorders and administration site conditions', level: 'PT' },
    { code: '10002855', term: 'Anaphylactic reaction', soc: 'Immune system disorders', level: 'PT' },
    { code: '10013663', term: 'Dyspnoea', soc: 'Respiratory, thoracic and mediastinal disorders', level: 'PT' },
  ];

  // SDOH sample data
  const sdohData = [
    { zipCode: '10001', medianIncome: '$85,000', povertyRate: '12%', uninsuredRate: '8%', foodDesert: 'No', transportAccess: 'High' },
    { zipCode: '10002', medianIncome: '$62,000', povertyRate: '18%', uninsuredRate: '14%', foodDesert: 'Yes', transportAccess: 'Medium' },
    { zipCode: '60601', medianIncome: '$95,000', povertyRate: '9%', uninsuredRate: '5%', foodDesert: 'No', transportAccess: 'High' },
    { zipCode: '90001', medianIncome: '$48,000', povertyRate: '24%', uninsuredRate: '22%', foodDesert: 'Yes', transportAccess: 'Low' },
    { zipCode: '02108', medianIncome: '$112,000', povertyRate: '7%', uninsuredRate: '3%', foodDesert: 'No', transportAccess: 'High' },
    { zipCode: '33101', medianIncome: '$71,000', povertyRate: '15%', uninsuredRate: '16%', foodDesert: 'No', transportAccess: 'Medium' },
    { zipCode: '75201', medianIncome: '$88,000', povertyRate: '11%', uninsuredRate: '18%', foodDesert: 'No', transportAccess: 'High' },
    { zipCode: '98101', medianIncome: '$105,000', povertyRate: '8%', uninsuredRate: '4%', foodDesert: 'No', transportAccess: 'High' },
  ];

  // Insurance coverage sample data
  const insuranceCoverageData = [
    { carrier: 'UnitedHealthcare', planName: 'Commercial PPO', medication: 'Humira', tier: 'Tier 3', priorAuthRequired: 'Yes', copay: '$50', coinsurance: '20%' },
    { carrier: 'Anthem BCBS', planName: 'Commercial HMO', medication: 'Humira', tier: 'Tier 4', priorAuthRequired: 'Yes', copay: '$75', coinsurance: '25%' },
    { carrier: 'Aetna', planName: 'Commercial PPO', medication: 'Dupixent', tier: 'Tier 3', priorAuthRequired: 'Yes', copay: '$60', coinsurance: '20%' },
    { carrier: 'Cigna', planName: 'Commercial EPO', medication: 'Ozempic', tier: 'Tier 2', priorAuthRequired: 'No', copay: '$35', coinsurance: '15%' },
    { carrier: 'Medicare Part D', planName: 'Standard', medication: 'Humira', tier: 'Tier 5', priorAuthRequired: 'Yes', copay: '$500', coinsurance: '33%' },
    { carrier: 'Kaiser Permanente', planName: 'HMO', medication: 'Dupixent', tier: 'Tier 3', priorAuthRequired: 'Yes', copay: '$50', coinsurance: '0%' },
    { carrier: 'Medicaid', planName: 'State Plan', medication: 'Ozempic', tier: 'Covered', priorAuthRequired: 'Yes', copay: '$0', coinsurance: '0%' },
  ];

  const filteredMeddra = searchTerm
    ? meddraData.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.includes(searchTerm)
      )
    : meddraData.slice(0, 10);

  const filteredSdoh = searchTerm
    ? sdohData.filter(item => item.zipCode.includes(searchTerm))
    : sdohData;

  const filteredInsurance = searchTerm
    ? insuranceCoverageData.filter(item =>
        item.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medication.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : insuranceCoverageData;

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[6], borderBottom: `1px solid ${colors.neutral[200]}` }}>
        {[
          { id: 'integrations', label: 'Integrations', icon: LinkIcon },
          { id: 'apis', label: 'API Endpoints', icon: Code },
          { id: 'webhooks', label: 'Webhooks', icon: Zap },
          { id: 'databases', label: 'Databases', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              style={{
                padding: `${spacing[3]} ${spacing[4]}`,
                fontSize: typography.fontSize.sm,
                fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
                color: isActive ? colors.primary[600] : colors.neutral[600],
                borderBottom: isActive ? `2px solid ${colors.primary[600]}` : '2px solid transparent',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                marginBottom: '-1px',
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Integrations View */}
      {selectedView === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: spacing[5] }}>
          {integrations.map((integration) => (
            <div
              key={integration.id}
              style={{
                backgroundColor: 'white',
                border: `1px solid ${colors.neutral[200]}`,
                borderRadius: '8px',
                padding: spacing[6],
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header Section */}
              <div style={{ marginBottom: spacing[4] }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[3] }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
                      <h3
                        style={{
                          fontSize: typography.fontSize.lg,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral[900],
                          margin: 0,
                        }}
                      >
                        {integration.name}
                      </h3>
                      {integration.status === 'connected' ? (
                        <CheckCircle style={{ width: '18px', height: '18px', color: colors.status.success, flexShrink: 0 }} />
                      ) : (
                        <XCircle style={{ width: '18px', height: '18px', color: colors.status.error, flexShrink: 0 }} />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: typography.fontWeight.medium,
                      }}
                    >
                      {integration.type}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: `${spacing[1]} ${spacing[3]}`,
                      backgroundColor: integration.status === 'connected' ? colors.status.successBg : colors.status.errorBg,
                      color: integration.status === 'connected' ? colors.status.success : colors.status.error,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      borderRadius: '12px',
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap',
                      marginLeft: spacing[3],
                    }}
                  >
                    {integration.status}
                  </span>
                </div>

                <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0, lineHeight: '1.5' }}>
                  {integration.description}
                </p>
              </div>

              {/* Stats Section */}
              <div style={{ marginBottom: spacing[5] }}>
                {integration.lastSync && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2] }}>
                    <span style={{ fontWeight: typography.fontWeight.medium }}>Last sync:</span> {integration.lastSync}
                  </div>
                )}
                {integration.recordCount && (
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                    <span style={{ fontWeight: typography.fontWeight.medium }}>Records synced:</span> {integration.recordCount.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div style={{ display: 'flex', gap: spacing[3], marginTop: 'auto' }}>
                {integration.status === 'connected' && (
                  <button
                    style={{
                      flex: 1,
                      padding: `${spacing[2]} ${spacing[3]}`,
                      backgroundColor: 'white',
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '6px',
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[700],
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[2],
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    <RefreshCw style={{ width: '14px', height: '14px' }} />
                    Sync Now
                  </button>
                )}
                <button
                  style={{
                    flex: 1,
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: integration.status === 'connected' ? 'white' : colors.primary[500],
                    border: `1px solid ${integration.status === 'connected' ? colors.neutral[300] : colors.primary[500]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    color: integration.status === 'connected' ? colors.neutral[700] : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[2],
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  <SettingsIcon style={{ width: '14px', height: '14px' }} />
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API Endpoints View */}
      {selectedView === 'apis' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Configure API endpoints for external data retrieval
            </p>
            <button
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: colors.primary[500],
                border: 'none',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                color: 'white',
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Endpoint
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {apiEndpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: '8px',
                  padding: spacing[4],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[2] }}>
                      <span
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          backgroundColor: colors.primary[100],
                          color: colors.primary[700],
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          borderRadius: '4px',
                        }}
                      >
                        {endpoint.method}
                      </span>
                      <h4
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral[900],
                        }}
                      >
                        {endpoint.name}
                      </h4>
                    </div>
                    <code
                      style={{
                        display: 'block',
                        padding: spacing[2],
                        backgroundColor: colors.neutral[50],
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: '4px',
                        fontSize: typography.fontSize.xs,
                        fontFamily: 'monospace',
                        color: colors.neutral[700],
                        marginBottom: spacing[2],
                        overflowX: 'auto',
                      }}
                    >
                      {endpoint.url}
                    </code>
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                      {endpoint.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginLeft: spacing[4] }}>
                    <span
                      style={{
                        padding: `${spacing[1]} ${spacing[3]}`,
                        backgroundColor: endpoint.enabled ? colors.status.successBg : colors.neutral[100],
                        color: endpoint.enabled ? colors.status.success : colors.neutral[500],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        borderRadius: '12px',
                      }}
                    >
                      {endpoint.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      style={{
                        padding: spacing[2],
                        backgroundColor: 'white',
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <SettingsIcon style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhooks View */}
      {selectedView === 'webhooks' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              Configure webhooks to receive real-time event notifications
            </p>
            <button
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: colors.primary[500],
                border: 'none',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                color: 'white',
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Webhook
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: '8px',
                  padding: spacing[4],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[2] }}>
                      <Zap style={{ width: '18px', height: '18px', color: colors.primary[500] }} />
                      <h4
                        style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.neutral[900],
                        }}
                      >
                        {webhook.name}
                      </h4>
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: `${spacing[1]} ${spacing[2]}`,
                        backgroundColor: colors.neutral[100],
                        color: colors.neutral[700],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        borderRadius: '4px',
                        marginBottom: spacing[2],
                      }}
                    >
                      Event: {webhook.event}
                    </div>
                    <code
                      style={{
                        display: 'block',
                        padding: spacing[2],
                        backgroundColor: colors.neutral[50],
                        border: `1px solid ${colors.neutral[200]}`,
                        borderRadius: '4px',
                        fontSize: typography.fontSize.xs,
                        fontFamily: 'monospace',
                        color: colors.neutral[700],
                        overflowX: 'auto',
                      }}
                    >
                      POST {webhook.url}
                    </code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginLeft: spacing[4] }}>
                    <span
                      style={{
                        padding: `${spacing[1]} ${spacing[3]}`,
                        backgroundColor: webhook.enabled ? colors.status.successBg : colors.neutral[100],
                        color: webhook.enabled ? colors.status.success : colors.neutral[500],
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        borderRadius: '12px',
                      }}
                    >
                      {webhook.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      style={{
                        padding: spacing[2],
                        backgroundColor: 'white',
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <SettingsIcon style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Databases View */}
      {selectedView === 'databases' && (
        <div>
          {!selectedDatabase ? (
            <>
              <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[6] }}>
                Reference databases available for workflow logic and data enrichment
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: spacing[5] }}>
                {databases.map((db) => (
                  <div
                    key={db.id}
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: '8px',
                      padding: spacing[6],
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Header with Icon */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[4], marginBottom: spacing[4] }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: colors.primary[50],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Database style={{ width: '24px', height: '24px', color: colors.primary[500] }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: typography.fontSize.base,
                            fontWeight: typography.fontWeight.semibold,
                            color: colors.neutral[900],
                            marginBottom: spacing[2],
                            margin: 0,
                          }}
                        >
                          {db.name}
                        </h3>
                        <div
                          style={{
                            fontSize: typography.fontSize.xs,
                            color: colors.neutral[500],
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: typography.fontWeight.medium,
                          }}
                        >
                          {db.type}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[5], margin: 0, marginBottom: spacing[5], lineHeight: '1.5' }}>
                      {db.description}
                    </p>

                    {/* Stats */}
                    <div style={{ marginBottom: spacing[5] }}>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2] }}>
                        <span style={{ fontWeight: typography.fontWeight.medium }}>Total records:</span> {db.recordCount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                        <span style={{ fontWeight: typography.fontWeight.medium }}>Last updated:</span> {db.lastUpdated}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedDatabase(db.id)}
                      style={{
                        width: '100%',
                        padding: `${spacing[2]} ${spacing[4]}`,
                        backgroundColor: 'white',
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        fontSize: typography.fontSize.sm,
                        color: colors.neutral[700],
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: spacing[2],
                        fontWeight: typography.fontWeight.medium,
                        marginTop: 'auto',
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      View Data
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <button
                onClick={() => setSelectedDatabase(null)}
                style={{
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[700],
                  cursor: 'pointer',
                  marginBottom: spacing[4],
                }}
              >
                ← Back to Databases
              </button>

              <div
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[200]}`,
                  borderRadius: '8px',
                  padding: spacing[5],
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
                  <h3
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[900],
                    }}
                  >
                    {databases.find(d => d.id === selectedDatabase)?.name}
                  </h3>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search
                      style={{
                        position: 'absolute',
                        left: spacing[3],
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: colors.neutral[400],
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: `${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[8]}`,
                        fontSize: typography.fontSize.sm,
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* MedDRA Data */}
                {selectedDatabase === 'meddra' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                            Code
                          </th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                            Preferred Term
                          </th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                            System Organ Class
                          </th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.neutral[700] }}>
                            Level
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeddra.map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              borderBottom: `1px solid ${colors.neutral[200]}`,
                              backgroundColor: index % 2 === 0 ? 'white' : colors.neutral[50],
                            }}
                          >
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, color: colors.neutral[600], fontFamily: 'monospace' }}>
                              {row.code}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, color: colors.neutral[900], fontWeight: typography.fontWeight.medium }}>
                              {row.term}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                              {row.soc}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.xs }}>
                              <span
                                style={{
                                  padding: `${spacing[1]} ${spacing[2]}`,
                                  backgroundColor: colors.primary[100],
                                  color: colors.primary[700],
                                  borderRadius: '4px',
                                  fontWeight: typography.fontWeight.medium,
                                }}
                              >
                                {row.level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* SDOH Data */}
                {selectedDatabase === 'sdoh' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>ZIP Code</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Median Income</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Poverty Rate</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Uninsured Rate</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Food Desert</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Transport Access</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSdoh.map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              borderBottom: `1px solid ${colors.neutral[200]}`,
                              backgroundColor: index % 2 === 0 ? 'white' : colors.neutral[50],
                            }}
                          >
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, fontFamily: 'monospace', fontWeight: typography.fontWeight.medium }}>
                              {row.zipCode}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.medianIncome}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.povertyRate}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.uninsuredRate}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>
                              <span
                                style={{
                                  padding: `${spacing[1]} ${spacing[2]}`,
                                  backgroundColor: row.foodDesert === 'Yes' ? colors.status.errorBg : colors.status.successBg,
                                  color: row.foodDesert === 'Yes' ? colors.status.error : colors.status.success,
                                  borderRadius: '4px',
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeight.medium,
                                }}
                              >
                                {row.foodDesert}
                              </span>
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.transportAccess}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Insurance Coverage Data */}
                {selectedDatabase === 'insurance_coverage' && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${colors.neutral[200]}` }}>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Carrier</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Plan</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Medication</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Tier</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Prior Auth</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Copay</th>
                          <th style={{ padding: spacing[3], textAlign: 'left', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Coinsurance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInsurance.map((row, index) => (
                          <tr
                            key={index}
                            style={{
                              borderBottom: `1px solid ${colors.neutral[200]}`,
                              backgroundColor: index % 2 === 0 ? 'white' : colors.neutral[50],
                            }}
                          >
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                              {row.carrier}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.planName}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.medication}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.tier}</td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>
                              <span
                                style={{
                                  padding: `${spacing[1]} ${spacing[2]}`,
                                  backgroundColor: row.priorAuthRequired === 'Yes' ? colors.status.warningBg : colors.status.successBg,
                                  color: row.priorAuthRequired === 'Yes' ? colors.status.warning : colors.status.success,
                                  borderRadius: '4px',
                                  fontSize: typography.fontSize.xs,
                                  fontWeight: typography.fontWeight.medium,
                                }}
                              >
                                {row.priorAuthRequired}
                              </span>
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                              {row.copay}
                            </td>
                            <td style={{ padding: spacing[3], fontSize: typography.fontSize.sm }}>{row.coinsurance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div
                  style={{
                    marginTop: spacing[4],
                    padding: spacing[3],
                    backgroundColor: colors.neutral[50],
                    borderRadius: '6px',
                    fontSize: typography.fontSize.xs,
                    color: colors.neutral[600],
                  }}
                >
                  Showing {selectedDatabase === 'meddra' ? filteredMeddra.length : selectedDatabase === 'sdoh' ? filteredSdoh.length : filteredInsurance.length} of{' '}
                  {databases.find(d => d.id === selectedDatabase)?.recordCount.toLocaleString()} records
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
