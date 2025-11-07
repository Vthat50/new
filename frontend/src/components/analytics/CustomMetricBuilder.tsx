import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface MetricCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: string | number;
}

interface CustomMetric {
  id?: string;
  name: string;
  description: string;
  aggregation: 'count' | 'sum' | 'average' | 'min' | 'max' | 'percentage';
  baseMetric: string;
  conditions: MetricCondition[];
  visualization: 'number' | 'chart' | 'gauge' | 'trend';
}

interface CustomMetricBuilderProps {
  onSave: (metric: CustomMetric) => void;
  existingMetric?: CustomMetric;
}

const AVAILABLE_FIELDS = [
  { id: 'call_duration', label: 'Call Duration', type: 'number' },
  { id: 'sentiment', label: 'Sentiment', type: 'string' },
  { id: 'outcome', label: 'Call Outcome', type: 'string' },
  { id: 'agent_id', label: 'Agent', type: 'string' },
  { id: 'topic', label: 'Call Topic', type: 'string' },
  { id: 'compliance_score', label: 'Compliance Score', type: 'number' },
  { id: 'converted', label: 'Converted', type: 'boolean' },
  { id: 'escalated', label: 'Escalated', type: 'boolean' },
];

const OPERATORS = [
  { id: 'equals', label: 'Equals' },
  { id: 'not_equals', label: 'Not Equals' },
  { id: 'greater_than', label: 'Greater Than' },
  { id: 'less_than', label: 'Less Than' },
  { id: 'contains', label: 'Contains' },
  { id: 'not_contains', label: 'Does Not Contain' },
];

export default function CustomMetricBuilder({ onSave, existingMetric }: CustomMetricBuilderProps) {
  const [metric, setMetric] = useState<CustomMetric>(
    existingMetric || {
      name: '',
      description: '',
      aggregation: 'count',
      baseMetric: 'calls',
      conditions: [],
      visualization: 'number',
    }
  );

  const handleAddCondition = () => {
    setMetric({
      ...metric,
      conditions: [...metric.conditions, { field: 'call_duration', operator: 'equals', value: '' }],
    });
  };

  const handleRemoveCondition = (index: number) => {
    setMetric({
      ...metric,
      conditions: metric.conditions.filter((_, i) => i !== index),
    });
  };

  const handleConditionChange = (index: number, field: keyof MetricCondition, value: any) => {
    const updatedConditions = [...metric.conditions];
    updatedConditions[index] = { ...updatedConditions[index], [field]: value };
    setMetric({ ...metric, conditions: updatedConditions });
  };

  const handleSave = () => {
    if (metric.name && metric.conditions.length > 0) {
      onSave(metric);
    }
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
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing[4],
        }}
      >
        {existingMetric ? 'Edit Custom Metric' : 'Create Custom Metric'}
      </h3>

      {/* Basic Info */}
      <div style={{ marginBottom: spacing[6] }}>
        <h4
          style={{
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[3],
          }}
        >
          Basic Information
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Metric Name *
            </label>
            <input
              type="text"
              value={metric.name}
              onChange={(e) => setMetric({ ...metric, name: e.target.value })}
              placeholder="e.g., High-Value Conversions"
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Aggregation Type
            </label>
            <select
              value={metric.aggregation}
              onChange={(e) => setMetric({ ...metric, aggregation: e.target.value as any })}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option value="count">Count</option>
              <option value="sum">Sum</option>
              <option value="average">Average</option>
              <option value="min">Minimum</option>
              <option value="max">Maximum</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

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
              value={metric.description}
              onChange={(e) => setMetric({ ...metric, description: e.target.value })}
              placeholder="Brief description of what this metric measures..."
              rows={2}
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

          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                marginBottom: spacing[2],
              }}
            >
              Visualization Type
            </label>
            <select
              value={metric.visualization}
              onChange={(e) => setMetric({ ...metric, visualization: e.target.value as any })}
              style={{
                width: '100%',
                padding: spacing[3],
                border: `1px solid ${colors.neutral[300]}`,
                borderRadius: '6px',
                fontSize: typography.fontSize.sm,
              }}
            >
              <option value="number">Number Display</option>
              <option value="chart">Line/Bar Chart</option>
              <option value="gauge">Gauge</option>
              <option value="trend">Trend Indicator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div style={{ marginBottom: spacing[6] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              margin: 0,
            }}
          >
            Conditions
          </h4>
          <button
            onClick={handleAddCondition}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Condition
          </button>
        </div>

        {metric.conditions.length === 0 ? (
          <div
            style={{
              padding: spacing[6],
              backgroundColor: colors.neutral[50],
              borderRadius: '8px',
              textAlign: 'center',
              color: colors.neutral[600],
            }}
          >
            No conditions added yet. Click "Add Condition" to define your metric criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {metric.conditions.map((condition, index) => (
              <div
                key={index}
                style={{
                  padding: spacing[4],
                  backgroundColor: colors.neutral[50],
                  borderRadius: '8px',
                  border: `1px solid ${colors.neutral[200]}`,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: spacing[3], alignItems: 'end' }}>
                  {/* Field */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        marginBottom: spacing[1],
                      }}
                    >
                      Field
                    </label>
                    <select
                      value={condition.field}
                      onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                      style={{
                        width: '100%',
                        padding: spacing[2],
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        fontSize: typography.fontSize.sm,
                        backgroundColor: 'white',
                      }}
                    >
                      {AVAILABLE_FIELDS.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operator */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        marginBottom: spacing[1],
                      }}
                    >
                      Operator
                    </label>
                    <select
                      value={condition.operator}
                      onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                      style={{
                        width: '100%',
                        padding: spacing[2],
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        fontSize: typography.fontSize.sm,
                        backgroundColor: 'white',
                      }}
                    >
                      {OPERATORS.map((op) => (
                        <option key={op.id} value={op.id}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.medium,
                        marginBottom: spacing[1],
                      }}
                    >
                      Value
                    </label>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                      placeholder="Enter value..."
                      style={{
                        width: '100%',
                        padding: spacing[2],
                        border: `1px solid ${colors.neutral[300]}`,
                        borderRadius: '6px',
                        fontSize: typography.fontSize.sm,
                      }}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCondition(index)}
                    style={{
                      padding: spacing[2],
                      backgroundColor: 'white',
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: colors.status.error,
                    }}
                    title="Remove condition"
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>

                {index < metric.conditions.length - 1 && (
                  <div
                    style={{
                      marginTop: spacing[2],
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[600],
                    }}
                  >
                    AND
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={!metric.name || metric.conditions.length === 0}
          style={{
            padding: `${spacing[3]} ${spacing[6]}`,
            backgroundColor: metric.name && metric.conditions.length > 0 ? colors.primary[500] : colors.neutral[300],
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            cursor: metric.name && metric.conditions.length > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          {existingMetric ? 'Update Metric' : 'Create Metric'}
        </button>
      </div>
    </div>
  );
}
