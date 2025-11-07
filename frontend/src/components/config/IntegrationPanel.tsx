import React, { useState } from 'react';
import { Settings, Check, X, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'crm' | 'ehr' | 'pharmacy' | 'analytics' | 'communication';
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  lastSync?: Date;
  config?: any;
}

interface IntegrationPanelProps {
  integrations: Integration[];
  onToggle: (id: string, enabled: boolean) => void;
  onConfigure: (id: string) => void;
  onTestConnection: (id: string) => Promise<boolean>;
}

export default function IntegrationPanel({
  integrations,
  onToggle,
  onConfigure,
  onTestConnection,
}: IntegrationPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testingId, setTestingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Integrations' },
    { id: 'crm', label: 'CRM' },
    { id: 'ehr', label: 'EHR' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'communication', label: 'Communication' },
  ];

  const filteredIntegrations =
    selectedCategory === 'all'
      ? integrations
      : integrations.filter((int) => int.category === selectedCategory);

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    try {
      await onTestConnection(id);
    } finally {
      setTestingId(null);
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    const statusConfig = {
      connected: { color: colors.status.success, label: 'Connected', icon: Check },
      disconnected: { color: colors.neutral[400], label: 'Disconnected', icon: X },
      error: { color: colors.status.error, label: 'Error', icon: AlertCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[1],
          padding: `${spacing[1]} ${spacing[2]}`,
          backgroundColor: `${config.color}15`,
          color: config.color,
          borderRadius: '4px',
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        <Icon style={{ width: '12px', height: '12px' }} />
        {config.label}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: '12px',
        padding: spacing[6],
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: spacing[4] }}>
        <h3
          style={{
            fontSize: typography.fontSize.lg,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[2],
          }}
        >
          Integrations
        </h3>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
          Connect external services to enhance functionality
        </p>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: spacing[2],
          marginBottom: spacing[4],
          overflowX: 'auto',
          paddingBottom: spacing[2],
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: selectedCategory === cat.id ? colors.primary[500] : 'white',
              color: selectedCategory === cat.id ? 'white' : colors.neutral[700],
              border: `1px solid ${selectedCategory === cat.id ? colors.primary[500] : colors.neutral[300]}`,
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: spacing[4] }}>
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            style={{
              padding: spacing[4],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              backgroundColor: integration.enabled ? 'white' : colors.neutral[50],
              transition: 'all 0.2s',
            }}
            className="integration-card"
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3], marginBottom: spacing[3] }}>
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: colors.primary[50],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.fontSize['2xl'],
                  flexShrink: 0,
                }}
              >
                {integration.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[1],
                  }}
                >
                  {integration.name}
                </h4>
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                    margin: 0,
                  }}
                >
                  {integration.description}
                </p>
              </div>

              {/* Toggle */}
              <label
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '44px',
                  height: '24px',
                  flexShrink: 0,
                }}
              >
                <input
                  type="checkbox"
                  checked={integration.enabled}
                  onChange={(e) => onToggle(integration.id, e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: integration.enabled ? colors.primary[500] : colors.neutral[300],
                    transition: '0.3s',
                    borderRadius: '24px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: integration.enabled ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%',
                    }}
                  />
                </span>
              </label>
            </div>

            {/* Status & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] }}>
              {getStatusBadge(integration.status)}
              {integration.lastSync && (
                <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[500] }}>
                  Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {integration.enabled && (
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <button
                  onClick={() => onConfigure(integration.id)}
                  style={{
                    flex: 1,
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[1],
                  }}
                >
                  <Settings style={{ width: '14px', height: '14px' }} />
                  Configure
                </button>
                <button
                  onClick={() => handleTestConnection(integration.id)}
                  disabled={testingId === integration.id}
                  style={{
                    flex: 1,
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    cursor: testingId === integration.id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[1],
                    opacity: testingId === integration.id ? 0.6 : 1,
                  }}
                >
                  <RefreshCw
                    style={{
                      width: '14px',
                      height: '14px',
                      animation: testingId === integration.id ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                  Test
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .integration-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
