import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Ear,
  GitBranch,
  Zap,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Play,
  Save,
  Download,
  Upload,
  FileText,
  Database,
  User as UserIcon,
  BarChart,
  Shield,
  Book,
  Palette,
  Settings as SettingsIcon,
  Tag,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Plus,
  Link as LinkIcon,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import DataSourcesPanel from '../workflow/DataSourcesPanel';

interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  type: 'say' | 'listen' | 'branch' | 'api' | 'escalate';
  content?: string;
  conditions?: {
    label: string;
    variable: string;
    nextStep: string;
  }[];
}

interface WorkflowScenario {
  id: string;
  name: string;
  description: string;
  priority: 'standard' | 'high' | 'critical';
  steps: WorkflowStep[];
}

interface FrictionTopic {
  id: string;
  name: string;
  keywords: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectionCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  linkedScenarios: string[]; // scenario IDs
  sparklineData: number[];
  enabled: boolean;
}

export default function WorkflowBuilderTab() {
  const [selectedScenario, setSelectedScenario] = useState<string>('root_greeting');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'scenario' | 'topic' | 'datasources'>('scenario');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    scenarios: true,
    friction_topics: true,
    datasources: false,
    personalization: false,
    evaluation: false,
    advanced: false,
    supporting: false,
    brand: false,
    rules: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Predefined workflow scenarios
  const scenarios: WorkflowScenario[] = [
    {
      id: 'root_greeting',
      name: 'Root Greeting & Intent Classification',
      description: 'Main entry point for all patient calls',
      priority: 'critical',
      steps: [
        {
          id: 'greeting',
          stepNumber: 1,
          title: 'Greeting & Introduction',
          type: 'say',
          content: 'Hello! Thank you for calling [PharmaCo] Patient Support. How can I help you today?',
          conditions: [
            {
              label: 'Customer provides info',
              variable: '@intent_captured',
              nextStep: 'Step 2: Intent Classification',
            },
          ],
        },
        {
          id: 'intent_classification',
          stepNumber: 2,
          title: 'Intent Classification',
          type: 'listen',
          content: 'Listening for patient intent...',
          conditions: [
            {
              label: 'Keywords: afford|cost|pay|insurance',
              variable: '@financial_assistance',
              nextStep: 'Financial Assistance Flow',
            },
            {
              label: 'Keywords: prior auth|PA|claim',
              variable: '@insurance_support',
              nextStep: 'Insurance Support Flow',
            },
            {
              label: 'Keywords: adverse|reaction|side effect',
              variable: '@adverse_event',
              nextStep: 'Adverse Event Flow',
            },
            {
              label: 'No clear intent detected',
              variable: '@unclear',
              nextStep: 'Step 3: Clarification',
            },
          ],
        },
        {
          id: 'clarification',
          stepNumber: 3,
          title: 'Clarification Request',
          type: 'say',
          content: 'I want to make sure I help you with the right thing. Are you calling about medication costs, insurance coverage, or a medical concern?',
          conditions: [
            {
              label: 'Intent clarified',
              variable: '@intent_clarified',
              nextStep: 'Route to appropriate flow',
            },
          ],
        },
      ],
    },
    {
      id: 'financial_assistance',
      name: 'Financial Assistance (40% volume)',
      description: 'Help patients afford their medications',
      priority: 'high',
      steps: [
        {
          id: 'fa_greeting',
          stepNumber: 1,
          title: 'Financial Assistance Greeting',
          type: 'say',
          content: 'I understand you need help with affording your medication. Let me help you explore your options.',
          conditions: [
            {
              label: 'proceed to',
              variable: '@greeting_complete',
              nextStep: 'Step 2: Options Menu',
            },
          ],
        },
        {
          id: 'fa_options',
          stepNumber: 2,
          title: 'Options Menu',
          type: 'branch',
          content: 'What type of assistance are you looking for?',
          conditions: [
            {
              label: 'Insurance coverage check',
              variable: '@check_coverage',
              nextStep: 'Step 3: Insurance Verification',
            },
            {
              label: 'Co-pay assistance programs',
              variable: '@copay_assistance',
              nextStep: 'Step 4: Co-pay Program',
            },
            {
              label: 'Patient assistance programs (PAP)',
              variable: '@pap',
              nextStep: 'Step 5: PAP Enrollment',
            },
            {
              label: 'Medicare/Medicaid options',
              variable: '@government_programs',
              nextStep: 'Step 6: Government Programs',
            },
          ],
        },
        {
          id: 'insurance_verification',
          stepNumber: 3,
          title: 'Insurance Verification',
          type: 'api',
          content: 'Verifying insurance coverage...',
          conditions: [
            {
              label: 'Coverage confirmed',
              variable: '@covered',
              nextStep: 'Step 7: Coverage Confirmation',
            },
            {
              label: 'Not covered',
              variable: '@not_covered',
              nextStep: 'Step 8: Alternative Options',
            },
          ],
        },
      ],
    },
    {
      id: 'insurance_prior_auth',
      name: 'Insurance & Prior Authorization (30% volume)',
      description: 'Handle insurance coverage and PA requests',
      priority: 'high',
      steps: [
        {
          id: 'insurance_greeting',
          stepNumber: 1,
          title: 'Insurance Support Greeting',
          type: 'say',
          content: 'I can help you with insurance coverage and prior authorization. Which of these best describes what you need?',
          conditions: [
            {
              label: 'proceed to',
              variable: '@greeting_complete',
              nextStep: 'Step 2: Insurance Menu',
            },
          ],
        },
        {
          id: 'insurance_menu',
          stepNumber: 2,
          title: 'Insurance Menu',
          type: 'branch',
          content: 'Select your insurance need',
          conditions: [
            {
              label: 'Check coverage',
              variable: '@coverage_check',
              nextStep: 'Step 3: Coverage Check',
            },
            {
              label: 'Submit prior auth',
              variable: '@pa_submit',
              nextStep: 'Step 4: PA Submission',
            },
            {
              label: 'Check PA status',
              variable: '@pa_status',
              nextStep: 'Step 5: PA Status',
            },
            {
              label: 'Appeal denied claim',
              variable: '@appeal',
              nextStep: 'Step 6: Appeal Process',
            },
          ],
        },
        {
          id: 'coverage_check',
          stepNumber: 3,
          title: 'Coverage Check',
          type: 'say',
          content: 'I\'ll check your insurance coverage. First, can you provide your insurance carrier name?',
          conditions: [
            {
              label: 'Carrier provided',
              variable: '@carrier_name',
              nextStep: 'Step 4: Member ID Collection',
            },
          ],
        },
        {
          id: 'collect_member_id',
          stepNumber: 4,
          title: 'Member ID Collection',
          type: 'listen',
          content: 'Please provide your member ID number',
          conditions: [
            {
              label: 'ID collected',
              variable: '@member_id',
              nextStep: 'Step 5: API Coverage Check',
            },
          ],
        },
        {
          id: 'api_coverage_check',
          stepNumber: 5,
          title: 'API Coverage Check',
          type: 'api',
          content: 'Checking coverage with insurance carrier...',
          conditions: [
            {
              label: 'Covered',
              variable: '@covered',
              nextStep: 'Step 6: Coverage Confirmed',
            },
            {
              label: 'Requires PA',
              variable: '@requires_pa',
              nextStep: 'Step 7: PA Required',
            },
            {
              label: 'Not covered',
              variable: '@not_covered',
              nextStep: 'Step 8: Alternative Options',
            },
          ],
        },
      ],
    },
    {
      id: 'adverse_event',
      name: 'Adverse Event Reporting (CRITICAL)',
      description: 'FDA-compliant adverse event reporting and patient safety',
      priority: 'critical',
      steps: [
        {
          id: 'ae_detection',
          stepNumber: 1,
          title: 'Adverse Event Detection',
          type: 'say',
          content: 'I understand you\'re experiencing a medical concern. Your safety is our top priority. Can you describe what you\'re experiencing?',
          conditions: [
            {
              label: 'Customer provides symptoms',
              variable: '@symptoms_described',
              nextStep: 'Step 2: Symptom Collection',
            },
          ],
        },
        {
          id: 'symptom_collection',
          stepNumber: 2,
          title: 'Symptom Collection',
          type: 'listen',
          content: 'Recording patient symptoms (transcript required for compliance)',
          conditions: [
            {
              label: 'Symptoms recorded',
              variable: '@symptoms_recorded',
              nextStep: 'Step 3: Severity Assessment',
            },
          ],
        },
        {
          id: 'severity_assessment',
          stepNumber: 3,
          title: 'Severity Assessment',
          type: 'branch',
          content: 'Analyzing symptom severity...',
          conditions: [
            {
              label: 'SERIOUS: death|life-threatening|hospitalization',
              variable: '@serious_ae',
              nextStep: 'Step 4: Serious AE Protocol',
            },
            {
              label: 'SERIOUS: disability|birth defect',
              variable: '@serious_ae',
              nextStep: 'Step 4: Serious AE Protocol',
            },
            {
              label: 'Standard AE',
              variable: '@standard_ae',
              nextStep: 'Step 5: Standard AE Protocol',
            },
          ],
        },
        {
          id: 'serious_ae_protocol',
          stepNumber: 4,
          title: 'Serious AE Protocol',
          type: 'escalate',
          content: 'This requires immediate attention. I\'m connecting you with our medical team right away. Please stay on the line.',
          conditions: [
            {
              label: 'Escalate to medical team',
              variable: '@urgent_escalation',
              nextStep: 'Step 6: Medical Team Transfer',
            },
            {
              label: 'Notify safety team, medical director, regulatory affairs',
              variable: '@compliance_notification',
              nextStep: 'Step 7: Critical Info Collection',
            },
          ],
        },
        {
          id: 'critical_info_collection',
          stepNumber: 5,
          title: 'Critical Info Collection',
          type: 'listen',
          content: 'Collecting required FDA reporting information: onset date, lot number, dosage, other medications, medical history',
          conditions: [
            {
              label: 'Info collected',
              variable: '@critical_info',
              nextStep: 'Step 8: MedDRA Classification',
            },
          ],
        },
        {
          id: 'meddra_classification',
          stepNumber: 6,
          title: 'MedDRA Classification',
          type: 'api',
          content: 'Classifying adverse event using MedDRA terminology (FDA 21CFR compliance)',
          conditions: [
            {
              label: 'Classification complete',
              variable: '@meddra_terms',
              nextStep: 'Step 9: Case Creation',
            },
          ],
        },
        {
          id: 'ae_case_creation',
          stepNumber: 7,
          title: 'AE Case Creation',
          type: 'api',
          content: 'Creating adverse event case in safety database',
          conditions: [
            {
              label: 'Case created',
              variable: '@case_number',
              nextStep: 'Step 10: Confirmation',
            },
          ],
        },
        {
          id: 'ae_confirmation',
          stepNumber: 8,
          title: 'AE Confirmation',
          type: 'say',
          content: 'I\'ve documented this as case #@case_number. Our medical team will review this within 24 hours. Is there anything else you\'re experiencing?',
          conditions: [
            {
              label: 'Additional symptoms',
              variable: '@additional',
              nextStep: 'Step 2: Symptom Collection',
            },
            {
              label: 'No additional symptoms',
              variable: '@no_additional',
              nextStep: 'Step 11: Follow-up Scheduling',
            },
          ],
        },
      ],
    },
  ];

  // Friction Topics with scenario linking
  const [frictionTopics, setFrictionTopics] = useState<FrictionTopic[]>([
    {
      id: 'high_costs',
      name: 'High Costs',
      keywords: 'expensive, afford, price, copay, cost',
      severity: 'critical',
      detectionCount: 234,
      trend: 'up',
      trendPercentage: 12,
      linkedScenarios: ['financial_assistance', 'insurance_prior_auth'],
      sparklineData: [198, 205, 212, 218, 225, 228, 234],
      enabled: true,
    },
    {
      id: 'pa_delays',
      name: 'PA Delays',
      keywords: 'prior authorization, waiting, approval, delayed',
      severity: 'high',
      detectionCount: 289,
      trend: 'up',
      trendPercentage: 8,
      linkedScenarios: ['insurance_prior_auth'],
      sparklineData: [245, 255, 260, 268, 272, 280, 289],
      enabled: true,
    },
    {
      id: 'pharmacy_issues',
      name: 'Pharmacy Issues',
      keywords: 'pharmacy, not in stock, backorder, unavailable',
      severity: 'medium',
      detectionCount: 156,
      trend: 'stable',
      trendPercentage: 2,
      linkedScenarios: ['financial_assistance'],
      sparklineData: [152, 154, 153, 155, 157, 155, 156],
      enabled: true,
    },
    {
      id: 'insurance_questions',
      name: 'Insurance Questions',
      keywords: 'coverage, insurance, plan, benefits',
      severity: 'medium',
      detectionCount: 142,
      trend: 'down',
      trendPercentage: -5,
      linkedScenarios: ['insurance_prior_auth', 'financial_assistance'],
      sparklineData: [165, 160, 155, 150, 148, 145, 142],
      enabled: true,
    },
  ]);

  const currentScenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const currentTopic = selectedTopic ? frictionTopics.find(t => t.id === selectedTopic) : null;

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'say':
        return MessageSquare;
      case 'listen':
        return Ear;
      case 'branch':
        return GitBranch;
      case 'api':
        return Zap;
      case 'escalate':
        return AlertTriangle;
      default:
        return MessageSquare;
    }
  };

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case 'say':
        return 'Say';
      case 'listen':
        return 'Listen';
      case 'branch':
        return 'Branch';
      case 'api':
        return 'API Call';
      case 'escalate':
        return 'Escalate';
      default:
        return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return colors.status.error;
      case 'high':
        return colors.status.warning;
      default:
        return colors.primary[500];
    }
  };

  const getPriorityBgColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#FEE';
      case 'high':
        return '#FFF4E6';
      default:
        return colors.primary[50];
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.status.error;
      case 'high':
        return '#F59E0B';
      case 'medium':
        return colors.status.warning;
      default:
        return colors.neutral[500];
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return colors.status.errorBg;
      case 'high':
        return '#FEF3C7';
      case 'medium':
        return colors.status.warningBg;
      default:
        return colors.neutral[100];
    }
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    setViewMode('topic');
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setViewMode('scenario');
    setSelectedTopic(null);
  };

  const handleToggleScenarioLink = (topicId: string, scenarioId: string) => {
    setFrictionTopics(topics =>
      topics.map(topic => {
        if (topic.id === topicId) {
          const linkedScenarios = topic.linkedScenarios.includes(scenarioId)
            ? topic.linkedScenarios.filter(id => id !== scenarioId)
            : [...topic.linkedScenarios, scenarioId];
          return { ...topic, linkedScenarios };
        }
        return topic;
      })
    );
  };

  const handleSelectDataSources = () => {
    setViewMode('datasources');
    setSelectedTopic(null);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: colors.background.page }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: '280px',
          backgroundColor: 'white',
          borderRight: `1px solid ${colors.neutral[200]}`,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search */}
        <div style={{ padding: spacing[4], borderBottom: `1px solid ${colors.neutral[200]}` }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: '100%',
              padding: `${spacing[2]} ${spacing[3]}`,
              fontSize: typography.fontSize.sm,
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              outline: 'none',
            }}
          />
        </div>

        {/* Scenarios Section */}
        <div style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
          <button
            onClick={() => toggleSection('scenarios')}
            style={{
              width: '100%',
              padding: spacing[3],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              backgroundColor: colors.neutral[50],
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {expandedSections.scenarios ? (
              <ChevronDown style={{ width: '16px', height: '16px' }} />
            ) : (
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            )}
            <FileText style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
            <span>Scenarios</span>
          </button>
          {expandedSections.scenarios && (
            <div style={{ padding: spacing[2] }}>
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenario(scenario.id)}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing[2],
                    backgroundColor: viewMode === 'scenario' && selectedScenario === scenario.id ? getPriorityBgColor(scenario.priority) : 'transparent',
                    border: 'none',
                    borderLeft: viewMode === 'scenario' && selectedScenario === scenario.id ? `3px solid ${getPriorityColor(scenario.priority)}` : '3px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '4px',
                    marginBottom: spacing[1],
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[900],
                        marginBottom: spacing[1],
                      }}
                    >
                      {scenario.name}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {scenario.description}
                    </div>
                  </div>
                  {scenario.priority === 'critical' && (
                    <Shield style={{ width: '14px', height: '14px', color: colors.status.error, flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Friction Topics Section */}
        <div style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
          <button
            onClick={() => toggleSection('friction_topics')}
            style={{
              width: '100%',
              padding: spacing[3],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              backgroundColor: colors.neutral[50],
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {expandedSections.friction_topics ? (
              <ChevronDown style={{ width: '16px', height: '16px' }} />
            ) : (
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            )}
            <Tag style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
            <span>Friction Topics</span>
            <span
              style={{
                marginLeft: 'auto',
                padding: `2px ${spacing[2]}`,
                backgroundColor: colors.primary[100],
                color: colors.primary[700],
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
                borderRadius: '10px',
              }}
            >
              {frictionTopics.length}
            </span>
          </button>
          {expandedSections.friction_topics && (
            <div style={{ padding: spacing[2] }}>
              {frictionTopics.map((topic) => {
                const TrendIcon = topic.trend === 'up' ? TrendingUp : topic.trend === 'down' ? TrendingDown : null;
                const isSelected = viewMode === 'topic' && selectedTopic === topic.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id)}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing[2],
                      backgroundColor: isSelected ? getSeverityBgColor(topic.severity) : 'transparent',
                      border: 'none',
                      borderLeft: isSelected ? `3px solid ${getSeverityColor(topic.severity)}` : '3px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '4px',
                      marginBottom: spacing[2],
                    }}
                  >
                    {/* Topic Name and Severity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                      <span
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[900],
                          flex: 1,
                        }}
                      >
                        {topic.name}
                      </span>
                      <span
                        style={{
                          padding: `2px ${spacing[2]}`,
                          backgroundColor: getSeverityBgColor(topic.severity),
                          color: getSeverityColor(topic.severity),
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.semibold,
                          borderRadius: '3px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {topic.severity}
                      </span>
                    </div>

                    {/* Detection Count and Trend */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                        {topic.detectionCount} detections
                      </span>
                      {TrendIcon && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                          <TrendIcon
                            style={{
                              width: '12px',
                              height: '12px',
                              color: topic.trend === 'up' ? colors.status.error : colors.status.success,
                            }}
                          />
                          <span
                            style={{
                              fontSize: typography.fontSize.xs,
                              color: topic.trend === 'up' ? colors.status.error : colors.status.success,
                              fontWeight: typography.fontWeight.medium,
                            }}
                          >
                            {topic.trend === 'up' ? '+' : ''}{topic.trendPercentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Linked Scenarios */}
                    {topic.linkedScenarios.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}>
                        <LinkIcon style={{ width: '10px', height: '10px', color: colors.neutral[400] }} />
                        <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                          {topic.linkedScenarios.length} scenario{topic.linkedScenarios.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Add New Topic Button */}
              <button
                style={{
                  width: '100%',
                  padding: spacing[3],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing[2],
                  backgroundColor: 'transparent',
                  border: `1px dashed ${colors.neutral[300]}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  marginTop: spacing[1],
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                Add Topic
              </button>
            </div>
          )}
        </div>

        {/* Data Sources */}
        <div style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
          <button
            onClick={handleSelectDataSources}
            style={{
              width: '100%',
              padding: spacing[3],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              backgroundColor: viewMode === 'datasources' ? colors.primary[50] : 'transparent',
              border: 'none',
              borderLeft: viewMode === 'datasources' ? `3px solid ${colors.primary[500]}` : '3px solid transparent',
              cursor: 'pointer',
              fontSize: typography.fontSize.sm,
              color: viewMode === 'datasources' ? colors.primary[700] : colors.neutral[700],
              fontWeight: viewMode === 'datasources' ? typography.fontWeight.medium : typography.fontWeight.normal,
            }}
          >
            <Database style={{ width: '16px', height: '16px', color: viewMode === 'datasources' ? colors.primary[600] : colors.neutral[600] }} />
            <span>Data Sources</span>
          </button>
        </div>

        {/* Personalization */}
        <SidebarSection
          title="Personalization"
          icon={UserIcon}
          expanded={expandedSections.personalization}
          onToggle={() => toggleSection('personalization')}
        />

        {/* Evaluation */}
        <SidebarSection
          title="Evaluation"
          icon={BarChart}
          expanded={expandedSections.evaluation}
          onToggle={() => toggleSection('evaluation')}
        />

        {/* Advanced */}
        <SidebarSection
          title="Advanced"
          icon={SettingsIcon}
          expanded={expandedSections.advanced}
          onToggle={() => toggleSection('advanced')}
        />

        {/* Supporting docs */}
        <SidebarSection
          title="Supporting docs"
          icon={Book}
          expanded={expandedSections.supporting}
          onToggle={() => toggleSection('supporting')}
        />

        {/* Brand */}
        <SidebarSection
          title="Brand"
          icon={Palette}
          expanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        />

        {/* Rules */}
        <SidebarSection
          title="Rules"
          icon={Shield}
          expanded={expandedSections.rules}
          onToggle={() => toggleSection('rules')}
        />
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            padding: spacing[6],
            backgroundColor: 'white',
            borderBottom: `1px solid ${colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[2] }}>
              <h1
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                }}
              >
                {viewMode === 'scenario' ? currentScenario.name : viewMode === 'topic' ? currentTopic?.name : 'Data Sources'}
              </h1>
              {viewMode === 'scenario' && currentScenario.priority === 'critical' && (
                <span
                  style={{
                    padding: `${spacing[1]} ${spacing[3]}`,
                    backgroundColor: '#FEE',
                    color: colors.status.error,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Critical Compliance
                </span>
              )}
              {viewMode === 'topic' && currentTopic && (
                <span
                  style={{
                    padding: `${spacing[1]} ${spacing[3]}`,
                    backgroundColor: getSeverityBgColor(currentTopic.severity),
                    color: getSeverityColor(currentTopic.severity),
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentTopic.severity} Severity
                </span>
              )}
            </div>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
              {viewMode === 'scenario'
                ? currentScenario.description
                : viewMode === 'topic'
                  ? `Friction topic detected ${currentTopic?.detectionCount} times`
                  : 'Connect external systems and databases to power dynamic workflows'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
            <button
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: 'white',
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                color: colors.neutral[700],
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Upload style={{ width: '16px', height: '16px' }} />
              Import
            </button>
            <button
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: 'white',
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                color: colors.neutral[700],
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              Export
            </button>
            <button
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: 'white',
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                color: colors.neutral[700],
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}
            >
              <Save style={{ width: '16px', height: '16px' }} />
              Save
            </button>
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
              <Play style={{ width: '16px', height: '16px' }} />
              Test Flow
            </button>
          </div>
        </div>

        {/* Workflow Canvas */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing[6],
          }}
        >
          {viewMode === 'scenario' ? (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {currentScenario.steps.map((step, index) => {
              const StepIcon = getStepIcon(step.type);
              return (
                <div key={step.id} style={{ marginBottom: spacing[6] }}>
                  {/* Step Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: colors.neutral[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                      }}
                    >
                      {step.stepNumber}
                    </div>
                    <h3
                      style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                      }}
                    >
                      Step {step.stepNumber}: {step.title}
                    </h3>
                  </div>

                  {/* Step Content */}
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: '8px',
                      padding: spacing[4],
                      marginLeft: spacing[10],
                    }}
                  >
                    {/* Step Type and Content */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[4] }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing[2],
                          padding: `${spacing[1]} ${spacing[3]}`,
                          backgroundColor: colors.neutral[50],
                          borderRadius: '4px',
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                        }}
                      >
                        <StepIcon style={{ width: '14px', height: '14px' }} />
                        {getStepTypeLabel(step.type)}
                      </div>
                      {step.content && (
                        <div
                          style={{
                            flex: 1,
                            fontSize: typography.fontSize.sm,
                            color: colors.neutral[600],
                            fontStyle: 'italic',
                            lineHeight: '1.6',
                          }}
                        >
                          "{step.content}"
                        </div>
                      )}
                    </div>

                    {/* Conditions/Branches */}
                    {step.conditions && step.conditions.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                        {step.conditions.map((condition, condIndex) => (
                          <div
                            key={condIndex}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing[3],
                              padding: spacing[3],
                              backgroundColor: colors.neutral[50],
                              borderRadius: '6px',
                              borderLeft: `3px solid ${colors.primary[500]}`,
                            }}
                          >
                            <ArrowRight style={{ width: '16px', height: '16px', color: colors.neutral[400] }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[700] }}>
                                {condition.label}
                              </div>
                              {condition.variable && (
                                <code
                                  style={{
                                    display: 'inline-block',
                                    marginTop: spacing[1],
                                    padding: `2px ${spacing[2]}`,
                                    backgroundColor: colors.primary[50],
                                    color: colors.primary[700],
                                    fontSize: typography.fontSize.xs,
                                    borderRadius: '3px',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {condition.variable}
                                </code>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                              <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                                proceed to
                              </span>
                              <ArrowRight style={{ width: '14px', height: '14px', color: colors.neutral[400] }} />
                              <span
                                style={{
                                  fontSize: typography.fontSize.sm,
                                  fontWeight: typography.fontWeight.medium,
                                  color: colors.neutral[900],
                                }}
                              >
                                {condition.nextStep}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Connection line to next step */}
                  {index < currentScenario.steps.length - 1 && (
                    <div
                      style={{
                        marginLeft: spacing[10],
                        paddingLeft: spacing[4],
                        height: '32px',
                        borderLeft: `2px solid ${colors.neutral[200]}`,
                      }}
                    />
                  )}
                </div>
              );
            })}

              {/* End of Flow Indicator */}
              <div
                style={{
                  marginLeft: spacing[10],
                  padding: spacing[4],
                  backgroundColor: colors.status.successBg,
                  border: `1px solid ${colors.status.success}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                }}
              >
                <CheckCircle style={{ width: '20px', height: '20px', color: colors.status.success }} />
                <span style={{ fontSize: typography.fontSize.sm, color: colors.status.success, fontWeight: typography.fontWeight.medium }}>
                  End of Flow
                </span>
              </div>
            </div>
          ) : viewMode === 'topic' && currentTopic ? (
            <FrictionTopicDetail
              topic={currentTopic}
              scenarios={scenarios}
              onToggleScenarioLink={handleToggleScenarioLink}
              getSeverityColor={getSeverityColor}
              getSeverityBgColor={getSeverityBgColor}
            />
          ) : viewMode === 'datasources' ? (
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <DataSourcesPanel />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Friction Topic Detail Component
interface FrictionTopicDetailProps {
  topic: FrictionTopic;
  scenarios: WorkflowScenario[];
  onToggleScenarioLink: (topicId: string, scenarioId: string) => void;
  getSeverityColor: (severity: string) => string;
  getSeverityBgColor: (severity: string) => string;
}

function FrictionTopicDetail({ topic, scenarios, onToggleScenarioLink, getSeverityColor, getSeverityBgColor }: FrictionTopicDetailProps) {
  const TrendIcon = topic.trend === 'up' ? TrendingUp : topic.trend === 'down' ? TrendingDown : null;

  // Simple sparkline component
  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 200;
    const height = 40;
    const padding = 4;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((value - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <polyline
          points={points}
          fill="none"
          stroke={getSeverityColor(topic.severity)}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Overview Card */}
      <div
        style={{
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '8px',
          padding: spacing[6],
          marginBottom: spacing[6],
        }}
      >
        <div style={{ display: 'flex', gap: spacing[8] }}>
          {/* Left: Stats */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[4],
              }}
            >
              Detection Analytics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4], marginBottom: spacing[6] }}>
              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Detections
                </div>
                <div style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, color: colors.neutral[900] }}>
                  {topic.detectionCount}
                </div>
              </div>

              <div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[1], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  7-Day Trend
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                  {TrendIcon && (
                    <TrendIcon
                      style={{
                        width: '24px',
                        height: '24px',
                        color: topic.trend === 'up' ? colors.status.error : colors.status.success,
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: typography.fontSize['2xl'],
                      fontWeight: typography.fontWeight.semibold,
                      color: topic.trend === 'up' ? colors.status.error : colors.status.success,
                    }}
                  >
                    {topic.trend === 'up' ? '+' : ''}{topic.trendPercentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div>
              <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500], marginBottom: spacing[2], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Last 7 Days
              </div>
              {renderSparkline(topic.sparklineData)}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
                  {Math.min(...topic.sparklineData)}
                </span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[400] }}>
                  {Math.max(...topic.sparklineData)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Keywords */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing[4],
              }}
            >
              Detection Keywords
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              {topic.keywords.split(', ').map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.neutral[100],
                    color: colors.neutral[700],
                    fontSize: typography.fontSize.sm,
                    borderRadius: '6px',
                    border: `1px solid ${colors.neutral[200]}`,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div style={{ marginTop: spacing[6] }}>
              <button
                style={{
                  padding: `${spacing[2]} ${spacing[4]}`,
                  backgroundColor: 'white',
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[700],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <Edit style={{ width: '14px', height: '14px' }} />
                Edit Keywords
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Linking */}
      <div
        style={{
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '8px',
          padding: spacing[6],
          marginBottom: spacing[6],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[4] }}>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
            }}
          >
            Linked Scenarios
          </h3>
          <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
            {topic.linkedScenarios.length} of {scenarios.length} linked
          </span>
        </div>

        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[6] }}>
          When this friction topic is detected, route the conversation to these scenarios:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {scenarios.map((scenario) => {
            const isLinked = topic.linkedScenarios.includes(scenario.id);
            return (
              <div
                key={scenario.id}
                style={{
                  padding: spacing[4],
                  backgroundColor: isLinked ? colors.primary[50] : colors.neutral[50],
                  border: `1px solid ${isLinked ? colors.primary[200] : colors.neutral[200]}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[4],
                }}
              >
                <input
                  type="checkbox"
                  checked={isLinked}
                  onChange={() => onToggleScenarioLink(topic.id, scenario.id)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: colors.primary[500],
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] }}>
                    <span
                      style={{
                        fontSize: typography.fontSize.base,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[900],
                      }}
                    >
                      {scenario.name}
                    </span>
                    {scenario.priority === 'critical' && (
                      <Shield style={{ width: '14px', height: '14px', color: colors.status.error }} />
                    )}
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    {scenario.description}
                  </div>
                </div>
                {isLinked && (
                  <div
                    style={{
                      padding: `${spacing[1]} ${spacing[3]}`,
                      backgroundColor: colors.primary[100],
                      color: colors.primary[700],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      borderRadius: '12px',
                    }}
                  >
                    <CheckCircle style={{ width: '12px', height: '12px', display: 'inline', marginRight: spacing[1] }} />
                    Linked
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Routing Logic Visualization */}
        {topic.linkedScenarios.length > 0 && (
          <div
            style={{
              marginTop: spacing[6],
              padding: spacing[4],
              backgroundColor: colors.neutral[50],
              borderRadius: '8px',
              border: `1px dashed ${colors.neutral[300]}`,
            }}
          >
            <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.neutral[700], marginBottom: spacing[2] }}>
              Routing Flow:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], flexWrap: 'wrap' }}>
              <span
                style={{
                  padding: `${spacing[2]} ${spacing[3]}`,
                  backgroundColor: getSeverityBgColor(topic.severity),
                  color: getSeverityColor(topic.severity),
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  borderRadius: '6px',
                }}
              >
                {topic.name} Detected
              </span>
              <ArrowRight style={{ width: '16px', height: '16px', color: colors.neutral[400] }} />
              <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                Route to:
              </span>
              {topic.linkedScenarios.map((scenarioId, index) => {
                const scenario = scenarios.find(s => s.id === scenarioId);
                return scenario ? (
                  <span key={scenarioId}>
                    <span
                      style={{
                        padding: `${spacing[2]} ${spacing[3]}`,
                        backgroundColor: 'white',
                        color: colors.primary[700],
                        fontSize: typography.fontSize.sm,
                        borderRadius: '6px',
                        border: `1px solid ${colors.primary[300]}`,
                      }}
                    >
                      {scenario.name}
                    </span>
                    {index < topic.linkedScenarios.length - 1 && (
                      <span style={{ margin: `0 ${spacing[2]}`, color: colors.neutral[400] }}>or</span>
                    )}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          backgroundColor: 'white',
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '8px',
          padding: spacing[6],
        }}
      >
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing[4],
          }}
        >
          Actions
        </h3>
        <div style={{ display: 'flex', gap: spacing[3] }}>
          <button
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              color: colors.neutral[700],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Edit style={{ width: '16px', height: '16px' }} />
            Edit Topic
          </button>
          <button
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              color: colors.neutral[700],
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <BarChart style={{ width: '16px', height: '16px' }} />
            View Full Analytics
          </button>
          <button
            style={{
              padding: `${spacing[2]} ${spacing[4]}`,
              backgroundColor: 'white',
              border: `1px solid ${colors.status.error}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              color: colors.status.error,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginLeft: 'auto',
            }}
          >
            <Trash2 style={{ width: '16px', height: '16px' }} />
            Delete Topic
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable sidebar section component
interface SidebarSectionProps {
  title: string;
  icon: React.ElementType;
  expanded: boolean;
  onToggle: () => void;
}

function SidebarSection({ title, icon: Icon, expanded, onToggle }: SidebarSectionProps) {
  return (
    <div style={{ borderBottom: `1px solid ${colors.neutral[200]}` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: typography.fontSize.sm,
          color: colors.neutral[700],
        }}
      >
        {expanded ? (
          <ChevronDown style={{ width: '16px', height: '16px' }} />
        ) : (
          <ChevronRight style={{ width: '16px', height: '16px' }} />
        )}
        <Icon style={{ width: '16px', height: '16px', color: colors.neutral[600] }} />
        <span>{title}</span>
      </button>
    </div>
  );
}
