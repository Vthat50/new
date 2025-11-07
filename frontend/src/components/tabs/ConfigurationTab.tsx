import React, { useState } from 'react';
import {
  Mic,
  Link as LinkIcon,
  GitBranch,
  Tag,
  Sliders,
  Check,
  X,
  Play,
  Save,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';
import { Card, CardHeader, CardContent } from '../shared/Card';
import Button from '../shared/Button';

// Import ALL configuration components
import VoiceSettings from '../config/VoiceSettings';
import IntegrationPanel from '../config/IntegrationPanel';
import FieldMapping from '../config/FieldMapping';
import WorkflowBuilder from '../config/WorkflowBuilder';

export default function ConfigurationTab() {
  const [activeSubTab, setActiveSubTab] = useState('voice');

  const subTabs = [
    { id: 'voice', label: 'Voice AI Settings', icon: Mic },
    { id: 'integrations', label: 'Integration Management', icon: LinkIcon },
    { id: 'workflows', label: 'Workflow Builder', icon: GitBranch },
    { id: 'friction', label: 'Friction Topics', icon: Tag },
    { id: 'demo', label: 'Demo Controls', icon: Sliders },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'voice':
        return <VoiceAISettings />;
      case 'integrations':
        return <IntegrationManagement />;
      case 'workflows':
        return <WorkflowBuilder />;
      case 'friction':
        return <FrictionTopicsSetup />;
      case 'demo':
        return <DemoControlsSettings />;
      default:
        return <VoiceAISettings />;
    }
  };

  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.background.page }}>
      {/* Header */}
      <div style={{ marginBottom: spacing[6] }}>
        <h1 style={{ fontSize: typography.fontSize['3xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
          Configuration
        </h1>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
          Manage system settings, integrations, and workflows
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex border-b" style={{ gap: spacing[4], marginBottom: spacing[6], borderColor: colors.neutral[200] }}>
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className="flex items-center transition-colors"
              style={{
                gap: spacing[2],
                padding: `${spacing[3]} ${spacing[2]}`,
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

      {/* Content */}
      {renderContent()}
    </div>
  );
}

// Voice AI Settings Component
function VoiceAISettings() {
  const [selectedVoice, setSelectedVoice] = useState('sarah');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  const voices = [
    { id: 'sarah', name: 'Sarah (Female, Professional)', language: 'en-US' },
    { id: 'michael', name: 'Michael (Male, Friendly)', language: 'en-US' },
    { id: 'emma', name: 'Emma (Female, Empathetic)', language: 'en-US' },
    { id: 'james', name: 'James (Male, Confident)', language: 'en-US' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Voice Selection
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className="text-left rounded-lg border transition-all"
                style={{
                  padding: spacing[4],
                  borderColor: selectedVoice === voice.id ? colors.primary[500] : colors.neutral[200],
                  backgroundColor: selectedVoice === voice.id ? colors.primary[50] : 'white',
                  borderWidth: selectedVoice === voice.id ? '2px' : '1px'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[1] }}>
                      {voice.name}
                    </div>
                    <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                      {voice.language}
                    </div>
                  </div>
                  {selectedVoice === voice.id && (
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: colors.primary[500],
                        color: 'white'
                      }}
                    >
                      <Check style={{ width: '12px', height: '12px' }} />
                    </div>
                  )}
                </div>
                <Button size="sm" variant="secondary" style={{ marginTop: spacing[3] }}>
                  <Play style={{ width: '14px', height: '14px', marginRight: spacing[1] }} />
                  Preview
                </Button>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Voice Parameters
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Speed Control */}
            <div>
              <div className="flex justify-between" style={{ marginBottom: spacing[2] }}>
                <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Speed
                </label>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  {speed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.primary[500] }}
              />
              <div className="flex justify-between" style={{ marginTop: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Slow (0.5x)</span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Fast (2.0x)</span>
              </div>
            </div>

            {/* Pitch Control */}
            <div>
              <div className="flex justify-between" style={{ marginBottom: spacing[2] }}>
                <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Pitch
                </label>
                <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                  {pitch.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: colors.primary[500] }}
              />
              <div className="flex justify-between" style={{ marginTop: spacing[1] }}>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>Low (0.5x)</span>
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>High (2.0x)</span>
              </div>
            </div>
          </div>

          <div className="flex" style={{ gap: spacing[3], marginTop: spacing[6] }}>
            <Button variant="primary">
              <Save style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
              Save Settings
            </Button>
            <Button variant="secondary">Reset to Default</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Pronunciation Dictionary
          </h3>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[4] }}>
            Add custom pronunciations for drug names and medical terms
          </p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Word or phrase"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
              <input
                type="text"
                placeholder="Phonetic pronunciation"
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
              />
            </div>
            <Button variant="secondary" size="sm">
              <Plus style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
              Add Entry
            </Button>
          </div>

          <div className="space-y-2" style={{ marginTop: spacing[4] }}>
            {['Humira → hew-MEER-ah', 'Dupixent → dew-PIX-ent', 'Ozempic → oh-ZEM-pick'].map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border"
                style={{ padding: spacing[3], borderColor: colors.neutral[200] }}
              >
                <span style={{ fontSize: typography.fontSize.sm }}>{entry}</span>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Integration Management Component
function IntegrationManagement() {
  const integrations = [
    {
      name: 'Salesforce',
      type: 'CRM',
      status: 'connected',
      lastSync: '2 minutes ago',
      description: 'Patient data sync and enrichment'
    },
    {
      name: 'ConnectiveRX',
      type: 'Copay',
      status: 'connected',
      lastSync: '5 minutes ago',
      description: 'Copay card and financial assistance'
    },
    {
      name: 'Change Healthcare',
      type: 'Insurance Verification',
      status: 'connected',
      lastSync: '1 hour ago',
      description: 'Real-time eligibility checks'
    },
    {
      name: 'Twilio',
      type: 'Communications',
      status: 'disconnected',
      lastSync: 'Never',
      description: 'SMS and voice communications'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {integrations.map((integration, i) => (
        <Card key={i}>
          <CardContent style={{ padding: spacing[6] }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[2] }}>
                  <h3 style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold }}>
                    {integration.name}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full flex items-center"
                    style={{
                      backgroundColor: integration.status === 'connected' ? colors.status.successBg : colors.status.errorBg,
                      color: integration.status === 'connected' ? colors.status.success : colors.status.error,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      gap: spacing[1]
                    }}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: integration.status === 'connected' ? colors.status.success : colors.status.error
                      }}
                    />
                    {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[1] }}>
                  {integration.description}
                </p>
                <p style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Type: {integration.type} • Last sync: {integration.lastSync}
                </p>
              </div>
              <div className="flex" style={{ gap: spacing[2] }}>
                {integration.status === 'connected' && (
                  <Button variant="secondary" size="sm">
                    <RefreshCw style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
                    Sync Now
                  </Button>
                )}
                <Button
                  variant={integration.status === 'connected' ? 'secondary' : 'primary'}
                  size="sm"
                >
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Workflow Builder Component
function WorkflowBuilder() {
  return (
    <Card>
      <CardContent style={{ padding: spacing[8] }}>
        <div className="text-center">
          <div
            className="mx-auto rounded-full flex items-center justify-center"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: colors.primary[100],
              marginBottom: spacing[4]
            }}
          >
            <GitBranch style={{ width: '40px', height: '40px', color: colors.primary[600] }} />
          </div>
          <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
            Visual Workflow Builder
          </h3>
          <p style={{ fontSize: typography.fontSize.base, color: colors.neutral[600], marginBottom: spacing[6], maxWidth: '600px', margin: '0 auto' }}>
            Drag-and-drop interface for building conversation flows, decision trees, and automation workflows. Coming soon in the next release.
          </p>
          <div className="flex justify-center" style={{ gap: spacing[3] }}>
            <Button variant="primary">
              <Plus style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
              Create New Workflow
            </Button>
            <Button variant="secondary">View Templates</Button>
          </div>

          {/* Placeholder visualization */}
          <div
            className="rounded-lg border-2 border-dashed mt-8"
            style={{
              padding: spacing[8],
              borderColor: colors.neutral[300],
              backgroundColor: colors.neutral[50]
            }}
          >
            <div className="flex items-center justify-center" style={{ gap: spacing[4] }}>
              <div className="rounded-lg border-2" style={{ padding: spacing[4], borderColor: colors.primary[500], backgroundColor: 'white' }}>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold }}>Start Call</div>
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], color: colors.neutral[400] }}>→</div>
              <div className="rounded-lg border-2" style={{ padding: spacing[4], borderColor: colors.neutral[300], backgroundColor: 'white' }}>
                <div style={{ fontSize: typography.fontSize.sm }}>Verify Patient</div>
              </div>
              <div style={{ fontSize: typography.fontSize['2xl'], color: colors.neutral[400] }}>→</div>
              <div className="rounded-lg border-2" style={{ padding: spacing[4], borderColor: colors.neutral[300], backgroundColor: 'white' }}>
                <div style={{ fontSize: typography.fontSize.sm }}>Check Eligibility</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Friction Topics Setup Component
function FrictionTopicsSetup() {
  const [newTopic, setNewTopic] = useState('');
  const [topics, setTopics] = useState([
    { name: 'PA Delays', keywords: 'prior authorization, waiting, approval', severity: 'high', count: 289 },
    { name: 'High Costs', keywords: 'expensive, afford, price, copay', severity: 'critical', count: 234 },
    { name: 'Pharmacy Issues', keywords: 'pharmacy, not in stock, backorder', severity: 'medium', count: 156 },
    { name: 'Insurance Questions', keywords: 'coverage, insurance, plan', severity: 'medium', count: 142 },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Add New Friction Topic
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Topic name"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
            />
            <input
              type="text"
              placeholder="Keywords (comma-separated)"
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
            />
            <select
              className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
              style={{ fontSize: typography.fontSize.sm, borderColor: colors.neutral[300] }}
            >
              <option>Low Severity</option>
              <option>Medium Severity</option>
              <option>High Severity</option>
              <option>Critical Severity</option>
            </select>
          </div>
          <Button variant="primary" size="sm" style={{ marginTop: spacing[4] }}>
            <Plus style={{ width: '14px', height: '14px', marginRight: spacing[2] }} />
            Add Topic
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Current Friction Topics ({topics.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border"
                style={{ padding: spacing[4], borderColor: colors.neutral[200] }}
              >
                <div className="flex-1">
                  <div className="flex items-center" style={{ gap: spacing[3], marginBottom: spacing[2] }}>
                    <h4 style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold }}>
                      {topic.name}
                    </h4>
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          topic.severity === 'critical' ? colors.status.errorBg :
                          topic.severity === 'high' ? '#FEF3C7' :
                          colors.status.warningBg,
                        color:
                          topic.severity === 'critical' ? colors.status.error :
                          topic.severity === 'high' ? '#F59E0B' :
                          colors.status.warning,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        textTransform: 'capitalize'
                      }}
                    >
                      {topic.severity}
                    </span>
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.neutral[500] }}>
                      {topic.count} detections
                    </span>
                  </div>
                  <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>
                    Keywords: {topic.keywords}
                  </div>
                </div>
                <div className="flex" style={{ gap: spacing[2] }}>
                  <Button variant="secondary" size="sm">Edit</Button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo Controls Settings Component
function DemoControlsSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Demo Appearance Settings
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Mask Patient Names
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Replace real names with generic identifiers in demo mode
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Show Floating Control Panel
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Display the demo control panel when demo mode is active
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium }}>
                  Auto-play Scenarios
                </div>
                <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Automatically run through demo scenarios
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold }}>
            Data Generation
          </h3>
        </CardHeader>
        <CardContent>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], marginBottom: spacing[4] }}>
            Generate sample data for demonstration purposes
          </p>
          <div className="flex" style={{ gap: spacing[3] }}>
            <Button variant="primary">
              <Plus style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
              Generate 100 Patients
            </Button>
            <Button variant="secondary">
              <Plus style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
              Generate 30 Days of Calls
            </Button>
            <Button variant="secondary">
              <Trash2 style={{ width: '16px', height: '16px', marginRight: spacing[2] }} />
              Clear All Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
