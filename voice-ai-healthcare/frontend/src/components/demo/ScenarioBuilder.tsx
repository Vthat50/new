import React, { useState } from 'react';
import { Play, Plus, Trash2, Copy, Edit2 } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface CallScenario {
  id: string;
  name: string;
  description: string;
  patient: {
    name: string;
    age: number;
    condition: string;
  };
  callType: 'refill' | 'copay' | 'appointment' | 'question' | 'adherence';
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  expectedOutcome: 'resolved' | 'escalated' | 'follow-up';
  transcript?: string[];
}

interface ScenarioBuilderProps {
  scenarios: CallScenario[];
  onScenarioAdd: (scenario: Omit<CallScenario, 'id'>) => void;
  onScenarioEdit: (id: string, scenario: Partial<CallScenario>) => void;
  onScenarioDelete: (id: string) => void;
  onScenarioPlay: (id: string) => void;
}

export default function ScenarioBuilder({
  scenarios,
  onScenarioAdd,
  onScenarioEdit,
  onScenarioDelete,
  onScenarioPlay,
}: ScenarioBuilderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CallScenario>>({
    name: '',
    description: '',
    callType: 'refill',
    sentiment: 'neutral',
    complexity: 'moderate',
    expectedOutcome: 'resolved',
    patient: {
      name: '',
      age: 45,
      condition: '',
    },
  });

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      callType: 'refill',
      sentiment: 'neutral',
      complexity: 'moderate',
      expectedOutcome: 'resolved',
      patient: {
        name: '',
        age: 45,
        condition: '',
      },
    });
  };

  const handleEdit = (scenario: CallScenario) => {
    setIsCreating(true);
    setEditingId(scenario.id);
    setFormData(scenario);
  };

  const handleSave = () => {
    if (editingId) {
      onScenarioEdit(editingId, formData);
    } else {
      onScenarioAdd(formData as Omit<CallScenario, 'id'>);
    }
    setIsCreating(false);
    setEditingId(null);
  };

  const handleDuplicate = (scenario: CallScenario) => {
    const { id, ...rest } = scenario;
    onScenarioAdd({ ...rest, name: `${rest.name} (Copy)` });
  };

  const getSentimentColor = (sentiment: CallScenario['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return colors.status.success;
      case 'negative':
        return colors.status.error;
      default:
        return colors.status.warning;
    }
  };

  const getComplexityBadge = (complexity: CallScenario['complexity']) => {
    const config = {
      simple: { label: 'Simple', color: colors.status.success },
      moderate: { label: 'Moderate', color: colors.status.warning },
      complex: { label: 'Complex', color: colors.status.error },
    };
    return config[complexity];
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <div>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[1],
            }}
          >
            Call Scenarios
          </h3>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
            Build and test realistic call scenarios
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          style={{
            padding: `${spacing[2]} ${spacing[4]}`,
            backgroundColor: colors.primary[500],
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          New Scenario
        </button>
      </div>

      {/* Scenario Form */}
      {isCreating && (
        <div
          style={{
            padding: spacing[6],
            backgroundColor: colors.neutral[50],
            borderRadius: '8px',
            marginBottom: spacing[4],
          }}
        >
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[4],
            }}
          >
            {editingId ? 'Edit Scenario' : 'Create New Scenario'}
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
            {/* Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Scenario Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Frustrated patient requesting refill"
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>

            {/* Patient Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.patient?.name}
                onChange={(e) =>
                  setFormData({ ...formData, patient: { ...formData.patient!, name: e.target.value } })
                }
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Brief description of the scenario..."
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Call Type */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Call Type
              </label>
              <select
                value={formData.callType}
                onChange={(e) => setFormData({ ...formData, callType: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="refill">Prescription Refill</option>
                <option value="copay">Copay Assistance</option>
                <option value="appointment">Appointment Scheduling</option>
                <option value="question">General Question</option>
                <option value="adherence">Medication Adherence</option>
              </select>
            </div>

            {/* Sentiment */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Patient Sentiment
              </label>
              <select
                value={formData.sentiment}
                onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            {/* Complexity */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Complexity
              </label>
              <select
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="simple">Simple</option>
                <option value="moderate">Moderate</option>
                <option value="complex">Complex</option>
              </select>
            </div>

            {/* Expected Outcome */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  marginBottom: spacing[2],
                }}
              >
                Expected Outcome
              </label>
              <select
                value={formData.expectedOutcome}
                onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: spacing[3],
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: '6px',
                  fontSize: typography.fontSize.sm,
                }}
              >
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="follow-up">Follow-up Required</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: spacing[2], marginTop: spacing[4], justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsCreating(false)}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: 'white',
                color: colors.neutral[700],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.patient?.name}
              style={{
                padding: `${spacing[2]} ${spacing[4]}`,
                backgroundColor: formData.name && formData.patient?.name ? colors.primary[500] : colors.neutral[300],
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: formData.name && formData.patient?.name ? 'pointer' : 'not-allowed',
              }}
            >
              {editingId ? 'Update Scenario' : 'Create Scenario'}
            </button>
          </div>
        </div>
      )}

      {/* Scenarios List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            style={{
              padding: spacing[4],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            className="scenario-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Info */}
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: typography.fontSize.md,
                    fontWeight: typography.fontWeight.semibold,
                    marginBottom: spacing[2],
                  }}
                >
                  {scenario.name}
                </h4>
                <p
                  style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                    marginBottom: spacing[3],
                  }}
                >
                  {scenario.description}
                </p>

                {/* Metadata */}
                <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    <strong>Patient:</strong> {scenario.patient.name}, {scenario.patient.age}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    <strong>Type:</strong> {scenario.callType}
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSize.xs,
                      color: getSentimentColor(scenario.sentiment),
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    <strong>Sentiment:</strong> {scenario.sentiment}
                  </div>
                  <div
                    style={{
                      fontSize: typography.fontSize.xs,
                      padding: `${spacing[1]} ${spacing[2]}`,
                      backgroundColor: `${getComplexityBadge(scenario.complexity).color}15`,
                      color: getComplexityBadge(scenario.complexity).color,
                      borderRadius: '4px',
                      fontWeight: typography.fontWeight.medium,
                    }}
                  >
                    {getComplexityBadge(scenario.complexity).label}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <button
                  onClick={() => onScenarioPlay(scenario.id)}
                  style={{
                    padding: `${spacing[2]} ${spacing[3]}`,
                    backgroundColor: colors.primary[500],
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: typography.fontSize.sm,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                  }}
                >
                  <Play style={{ width: '14px', height: '14px' }} />
                  Run
                </button>
                <button
                  onClick={() => handleEdit(scenario)}
                  style={{
                    padding: spacing[2],
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: colors.neutral[600],
                  }}
                  title="Edit"
                >
                  <Edit2 style={{ width: '14px', height: '14px' }} />
                </button>
                <button
                  onClick={() => handleDuplicate(scenario)}
                  style={{
                    padding: spacing[2],
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: colors.neutral[600],
                  }}
                  title="Duplicate"
                >
                  <Copy style={{ width: '14px', height: '14px' }} />
                </button>
                <button
                  onClick={() => onScenarioDelete(scenario.id)}
                  style={{
                    padding: spacing[2],
                    backgroundColor: 'white',
                    border: `1px solid ${colors.neutral[300]}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: colors.status.error,
                  }}
                  title="Delete"
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scenario-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
