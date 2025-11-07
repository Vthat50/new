import React, { useState } from 'react';
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface Field {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
  required: boolean;
  description?: string;
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
}

interface FieldMappingProps {
  sourceFields: Field[];
  targetFields: Field[];
  mappings: FieldMapping[];
  onMappingsChange: (mappings: FieldMapping[]) => void;
  onAutoMatch?: () => Promise<FieldMapping[]>;
}

export default function FieldMapping({
  sourceFields,
  targetFields,
  mappings,
  onMappingsChange,
  onAutoMatch,
}: FieldMappingProps) {
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [autoMatching, setAutoMatching] = useState(false);

  const handleDragStart = (fieldId: string) => {
    setDraggedField(fieldId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetFieldId: string) => {
    if (!draggedField) return;

    const newMapping: FieldMapping = {
      sourceField: draggedField,
      targetField: targetFieldId,
    };

    // Remove any existing mapping for this target field
    const updatedMappings = mappings.filter((m) => m.targetField !== targetFieldId);
    updatedMappings.push(newMapping);

    onMappingsChange(updatedMappings);
    setDraggedField(null);
  };

  const handleRemoveMapping = (targetFieldId: string) => {
    const updatedMappings = mappings.filter((m) => m.targetField !== targetFieldId);
    onMappingsChange(updatedMappings);
  };

  const handleAutoMatch = async () => {
    if (!onAutoMatch) return;

    setAutoMatching(true);
    try {
      const autoMappings = await onAutoMatch();
      onMappingsChange(autoMappings);
    } finally {
      setAutoMatching(false);
    }
  };

  const getMappingForTarget = (targetFieldId: string): FieldMapping | undefined => {
    return mappings.find((m) => m.targetField === targetFieldId);
  };

  const getSourceField = (fieldId: string): Field | undefined => {
    return sourceFields.find((f) => f.id === fieldId);
  };

  const getMappedSourceIds = (): Set<string> => {
    return new Set(mappings.map((m) => m.sourceField));
  };

  const unmappedSourceFields = sourceFields.filter((f) => !getMappedSourceIds().has(f.id));
  const unmappedRequiredTargets = targetFields.filter((f) => f.required && !getMappingForTarget(f.id));

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[4] }}>
        <div>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[1],
            }}
          >
            Field Mapping
          </h3>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600], margin: 0 }}>
            Drag and drop to map source fields to target fields
          </p>
        </div>

        {onAutoMatch && (
          <button
            onClick={handleAutoMatch}
            disabled={autoMatching}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`,
              backgroundColor: colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              cursor: autoMatching ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              opacity: autoMatching ? 0.6 : 1,
            }}
          >
            <Sparkles style={{ width: '16px', height: '16px' }} />
            {autoMatching ? 'Auto-matching...' : 'Auto-match Fields'}
          </button>
        )}
      </div>

      {/* Warnings */}
      {unmappedRequiredTargets.length > 0 && (
        <div
          style={{
            padding: spacing[3],
            backgroundColor: colors.status.warningBg,
            border: `1px solid ${colors.status.warning}`,
            borderRadius: '6px',
            marginBottom: spacing[4],
          }}
        >
          <div
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: colors.status.warning,
            }}
          >
            {unmappedRequiredTargets.length} required field{unmappedRequiredTargets.length !== 1 ? 's' : ''} not mapped
          </div>
        </div>
      )}

      {/* Mapping Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 1fr',
          gap: spacing[4],
          alignItems: 'start',
        }}
      >
        {/* Source Fields */}
        <div>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            Source Fields
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            {sourceFields.map((field) => {
              const isMapped = getMappedSourceIds().has(field.id);
              return (
                <div
                  key={field.id}
                  draggable
                  onDragStart={() => handleDragStart(field.id)}
                  style={{
                    padding: spacing[3],
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: '6px',
                    backgroundColor: isMapped ? colors.neutral[50] : 'white',
                    cursor: 'grab',
                    opacity: isMapped ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                  className="draggable-field"
                >
                  <div
                    style={{
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      marginBottom: spacing[1],
                    }}
                  >
                    {field.name}
                  </div>
                  <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                    {field.type}
                    {field.required && <span style={{ color: colors.status.error }}> *</span>}
                  </div>
                  {field.description && (
                    <div
                      style={{
                        fontSize: typography.fontSize.xs,
                        color: colors.neutral[500],
                        marginTop: spacing[1],
                      }}
                    >
                      {field.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrow Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '40px',
          }}
        >
          <ArrowRight style={{ width: '24px', height: '24px', color: colors.neutral[400] }} />
        </div>

        {/* Target Fields */}
        <div>
          <h4
            style={{
              fontSize: typography.fontSize.md,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[3],
            }}
          >
            Target Fields
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
            {targetFields.map((field) => {
              const mapping = getMappingForTarget(field.id);
              const sourceField = mapping ? getSourceField(mapping.sourceField) : null;

              return (
                <div
                  key={field.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(field.id)}
                  style={{
                    padding: spacing[3],
                    border: `2px dashed ${mapping ? colors.primary[500] : colors.neutral[200]}`,
                    borderRadius: '6px',
                    backgroundColor: mapping ? colors.primary[50] : 'white',
                    minHeight: '80px',
                    transition: 'all 0.2s',
                  }}
                  className="drop-target"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          marginBottom: spacing[1],
                        }}
                      >
                        {field.name}
                        {field.required && <span style={{ color: colors.status.error }}> *</span>}
                      </div>
                      <div style={{ fontSize: typography.fontSize.xs, color: colors.neutral[600] }}>
                        {field.type}
                      </div>
                    </div>

                    {mapping && (
                      <button
                        onClick={() => handleRemoveMapping(field.id)}
                        style={{
                          padding: spacing[1],
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: colors.neutral[400],
                        }}
                        title="Remove mapping"
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                  </div>

                  {mapping && sourceField && (
                    <div
                      style={{
                        marginTop: spacing[2],
                        padding: spacing[2],
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[2],
                      }}
                    >
                      <Check style={{ width: '14px', height: '14px', color: colors.status.success }} />
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.neutral[700] }}>
                        Mapped to: <strong>{sourceField.name}</strong>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: spacing[6],
          padding: spacing[4],
          backgroundColor: colors.neutral[50],
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}>
            {mappings.length}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Total Mappings</div>
        </div>
        <div>
          <div style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold }}>
            {unmappedSourceFields.length}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Unmapped Source</div>
        </div>
        <div>
          <div
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: unmappedRequiredTargets.length > 0 ? colors.status.error : colors.status.success,
            }}
          >
            {unmappedRequiredTargets.length}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.neutral[600] }}>Unmapped Required</div>
        </div>
      </div>

      <style>{`
        .draggable-field:active {
          cursor: grabbing;
        }
        .drop-target:hover {
          border-color: ${colors.primary[400]};
          background-color: ${colors.primary[25]};
        }
      `}</style>
    </div>
  );
}
